# Deployment Guide for AleBilet Replica

This guide provides step-by-step instructions on how to build and deploy the AleBilet replica.

---

## 1. Application Architecture Overview

The project is structured as a Node.js full-stack monorepo:
* **Frontend**: React + Vite single page application (SPA).
* **Backend**: Express API server.
* **Production Serving**: In production, the Express backend serves the statically built React assets (`frontend/dist`) using:
  ```javascript
  const frontendBuildPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendBuildPath));
  ```
  All client-side routing fallback endpoints are handled, which means you only need to host **one Node.js application** that runs on a single port.
* **Database**: Simple file-based database (`backend/db.json`). *See the Database Persistence section below before choosing a hosting provider.*

---

## 2. Database Persistence Warning ⚠️

Because this replica uses a local JSON file (`backend/db.json`) as a database:
1. **Ephemeral Filesystems (Render Free Tier, Vercel, Heroku)**: Every time the application restarts, is redeployed, or spins down due to inactivity, the filesystem is reset. **All new signups, ticket listings, deposits, and orders will be deleted.**
2. **Read-only Filesystems (Serverless Platforms)**: Some serverless environments (like AWS Lambda or Vercel Serverless Functions) do not allow writing files, which will cause API endpoints writing data to crash.

### How to solve this:
* **Option A: VPS Hosting (Recommended for simple setups)**: Deploy on a virtual server (like a DigitalOcean Droplet, AWS EC2, or Hetzner). The filesystem is permanent, so `db.json` acts as a simple, persistent database.
* **Option B: PaaS with Persistent Volumes**: If using Render or Railway, deploy as a paid Web Service and mount a persistent disk volume to the `backend` directory (so that `db.json` is stored on a persistent network disk).
* **Option C: Migrate to a Cloud Database (Production Grade)**: Modify `backend/database.js` to connect to MongoDB Atlas, Supabase, Neon PostgreSQL, or another cloud database.

---

## 3. Testing the Production Build Locally

Before deploying to the cloud, you should verify the production build works on your machine:

1. **Clean installation and build**:
   ```bash
   # Install root and workspace dependencies
   npm run install-all

   # Build the React frontend into static assets
   npm run build-frontend
   ```

2. **Start the production server**:
   ```bash
   npm start
   ```

3. **Verify**:
   Open `http://localhost:5000` in your web browser. The application should load, and actions like registering/logging in should work correctly.

---

## 4. Option 1: Deploying to Render.com (PaaS)

Render is one of the easiest ways to host full-stack Node.js applications.

### Method A: One-Click Deploy using Blueprints (Recommended)
This repository includes a `render.yaml` Blueprint file that automates the whole configuration, database mounting, and environment setup:

1. Push your repository to GitHub or GitLab.
2. Sign up or log in to [Render](https://render.com).
3. Go to **Blueprints** in the Render dashboard and click **New Blueprint Instance**.
4. Select your connected repository.
5. Render will automatically detect the configuration from `render.yaml`:
   * It provisions a **Web Service** on Node.js.
   * It creates a **Persistent Disk** mounted at `/var/data`.
   * It configures environment variables (`NODE_ENV`, `DB_PATH`, and automatically generates a secure random `JWT_SECRET`).
6. Click **Approve** to build and deploy.

### Method B: Manual Web Service Setup
If you prefer not to use Blueprints or want to use Render's **Free Tier** (which does not support persistent disks):

1. Click **New** -> **Web Service** on Render.
2. Connect your repository.
3. Configure the service:
   * **Name**: `alebilet-replica`
   * **Environment**: `Node`
   * **Build Command**: `npm run install-all && npm run build-frontend`
   * **Start Command**: `npm start`
4. Add environment variables under **Environment**:
   * `NODE_ENV`: `production`
   * `JWT_SECRET`: `your-own-secure-random-string`
   * *If using a persistent disk:* `DB_PATH` = `/var/data/db.json`
5. *(Optional)* If using a paid instance (Starter plan or higher) and want persistent data: scroll down to **Disks**, click **Add Disk**:
   * **Name**: `alebilet-db-data`
   * **Mount Path**: `/var/data`
   * **Size**: `1 GB`
6. Click **Create Web Service**.

> **Note on Free Tier:** If you are on Render's **Free Tier**, the data in `db.json` will reset whenever the container sleeps (after 15 minutes of inactivity) or when a new build is pushed. To persist data on Render, upgrade to a **Starter** instance (which supports persistent disks). Do not mount the disk to `/app/backend` directly, as this will shadow the backend code and crash the app; instead mount it to `/var/data` and set `DB_PATH` to `/var/data/db.json` as shown above.

---

## 5. Option 2: Deploying to a VPS (Ubuntu + PM2 + Nginx)

This is the cheapest way to deploy with **persistent data**, as the local disk on a virtual private server (VPS) is persistent.

### Step 1: Install Node.js & PM2 on the VPS
Connect to your VPS via SSH and install Node.js and PM2 (a production process manager):
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install pm2 -g
```

### Step 2: Clone & Build the Application
```bash
# Clone the repository
git clone <your-repo-url> alebilet
cd alebilet

# Install dependencies and build frontend
npm run install-all
npm run build-frontend
```

### Step 3: Run the Server using PM2
Start the backend server using PM2 to keep it running in the background and restart it on crash/reboot:
```bash
# Start the application
PORT=5000 NODE_ENV=production pm2 start backend/server.js --name "alebilet"

# Save the PM2 process list to start automatically on system reboot
pm2 save
pm2 startup
```

### Step 4: Set up Nginx as a Reverse Proxy
To point your custom domain (or port 80) to the backend running on port 5000:
```bash
sudo apt install nginx -y
```
Create a new configuration block for Nginx:
```bash
sudo nano /etc/nginx/sites-available/alebilet
```
Paste the following configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Enable the site and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/alebilet /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```
To enable HTTPS, install **Certbot**:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 6. Option 3: Deploying with Docker 🐳

If you want to package the app into a container to run on AWS ECS, Fly.io, Google Cloud Run, or any Docker-compatible hosting:

### Build & Run locally:
```bash
# Build the Docker image
docker build -t alebilet-replica .

# Run the container
docker run -p 5000:5000 -v $(pwd)/backend:/app/backend alebilet-replica
```
*(Notice the volume mount `-v $(pwd)/backend:/app/backend`. This ensures the `db.json` updates are persistent on your host machine!)*
