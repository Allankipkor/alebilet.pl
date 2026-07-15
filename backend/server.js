import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'alebilet_jwt_secret_key_12345';

app.use(cors());
app.use(express.json());

// Serve static assets from build if running in production
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendBuildPath));

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded; // Contains id, email, role
    next();
  });
}

// Admin-Only Middleware
function requireAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Administrative privileges required' });
  }
}

// ----------------------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------------------

// Register User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.createUser({
      name,
      email,
      passwordHash: hashedPassword,
      phone: phone || '',
      role: 'user', // force standard user role
      balance: 500.00 // standard starting balance
    });

    // Generate JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    const { passwordHash, ...userResponse } = newUser;
    res.status(201).json({ user: userResponse, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    const { passwordHash, ...userResponse } = user;
    res.status(200).json({ user: userResponse, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Google Authentication / Sign-up
app.post('/api/auth/google', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Google email and name are required' });
    }

    let user = await db.getUserByEmail(email);
    
    // If user does not exist, sign them up automatically
    if (!user) {
      // Create a dummy password hash since password is not used for Google Auth
      const dummyPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(dummyPassword, 10);
      
      user = await db.createUser({
        name,
        email,
        passwordHash: hashedPassword,
        phone: '',
        role: 'user',
        balance: 500.00 // Seed with standard starting demo funds
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    const { passwordHash, ...userResponse } = user;
    res.status(200).json({ user: userResponse, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error during Google authentication' });
  }
});

// Get Current User Profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { passwordHash, ...userResponse } = user;
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

// Update Profile details
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { phone, bankAccount } = req.body;
    const updatedUser = await db.updateUser(req.user.id, { phone, bankAccount });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { passwordHash, ...userResponse } = updatedUser;
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Add funds to balance (Demo utility)
app.post('/api/auth/add-funds', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid deposit amount' });
    }
    const user = await db.getUserById(req.user.id);
    const updatedUser = await db.updateUser(req.user.id, {
      balance: parseFloat((user.balance + parseFloat(amount)).toFixed(2))
    });
    const { passwordHash, ...userResponse } = updatedUser;
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add funds' });
  }
});

// ----------------------------------------------------
// EVENTS ENDPOINTS
// ----------------------------------------------------

// Get All Events
app.get('/api/events', async (req, res) => {
  try {
    const events = await db.getEvents();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve events' });
  }
});

// Get Event by ID
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await db.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve event details' });
  }
});

// Create New Event (Admin only)
app.post('/api/events', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, category, date, venue, city, description, imageUrl } = req.body;

    if (!title || !category || !date || !venue || !city || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const defaultImage = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=800&auto=format&fit=crop';
    const newEvent = await db.createEvent({
      title,
      category,
      date,
      venue,
      city,
      description,
      imageUrl: imageUrl || defaultImage
    });

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// ----------------------------------------------------
// TICKET LISTINGS ENDPOINTS
// ----------------------------------------------------

// Get Active Listings for Event
app.get('/api/events/:eventId/listings', async (req, res) => {
  try {
    const listings = await db.getListingsByEventId(req.params.eventId);
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve listings' });
  }
});

// Create Listing (Seller post)
app.post('/api/listings', authenticateToken, async (req, res) => {
  try {
    const { eventId, category, row, seat, quantity, pricePerTicket, ticketType, fileName } = req.body;

    if (!eventId || !category || !quantity || !pricePerTicket || !ticketType) {
      return res.status(400).json({ error: 'Missing listing information' });
    }

    // Verify event exists
    const event = await db.getEventById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const newListing = await db.createListing({
      eventId,
      sellerId: req.user.id,
      category,
      row: row || 'GA',
      seat: seat || '-',
      quantity: parseInt(quantity),
      pricePerTicket: parseFloat(pricePerTicket),
      ticketType,
      fileName: fileName || 'ticket_upload.pdf',
      status: 'active'
    });

    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ticket listing' });
  }
});

// Delete Listing
app.delete('/api/listings/:id', authenticateToken, async (req, res) => {
  try {
    const listing = await db.getListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Verify owner or admin
    if (listing.sellerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }

    await db.updateListing(req.params.id, { status: 'deleted' });
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

// ----------------------------------------------------
// ORDERS & CHECKOUT ENDPOINTS
// ----------------------------------------------------

const sendTelegramNotification = async (order, eventTitle, buyerEmail, settings) => {
  const token = settings.telegramToken;
  const chatId = settings.telegramChatId;
  if (!token || !chatId) return;

  const text = `🔔 *Nowe zamówienie w AleBilet!*\n` +
    `----------------------------------\n` +
    `*Order ID:* \`${order.id}\`\n` +
    `*Wydarzenie:* ${eventTitle}\n` +
    `*Kupujący:* ${buyerEmail}\n` +
    `*Ilość:* ${order.quantity} szt.\n` +
    `*Cena łączna:* ${order.totalPrice.toFixed(2)} PLN\n` +
    `*Metoda płatności:* ${order.paymentMethod === 'alternative' ? 'Przelew bezpośredni' : order.paymentMethod}\n` +
    `*Referencja:* \`${order.accountRef || 'N/A'}\`\n` +
    `*Plik potwierdzenia:* ${order.receiptFile || 'N/A'}\n` +
    `----------------------------------`;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });
    if (!res.ok) {
      console.error('Telegram notification failed:', await res.text());
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
};

// Purchase Tickets
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { listingId, quantity, deliveryEmail, deliveryPhone, deliveryAddress, paymentMethod, blikCode, receiptFile, accountRef } = req.body;

    if (!listingId || !quantity || !deliveryEmail || !deliveryPhone || !paymentMethod) {
      return res.status(400).json({ error: 'Missing checkout information' });
    }

    // Fetch listing
    const listing = await db.getListingById(listingId);
    if (!listing || listing.status !== 'active') {
      return res.status(404).json({ error: 'Ticket listing is no longer available' });
    }

    if (listing.quantity < quantity) {
      return res.status(400).json({ error: 'Requested quantity exceeds available tickets' });
    }

    // Double check that user isn't buying their own ticket
    if (listing.sellerId === req.user.id) {
      return res.status(400).json({ error: 'You cannot buy your own ticket' });
    }

    // Calculate pricing (AleBilet collects a 3% buyer service fee)
    const basePrice = listing.pricePerTicket * quantity;
    const buyerFee = basePrice * 0.03;
    const totalPrice = parseFloat((basePrice + buyerFee).toFixed(2));

    // Verify buyer balance (only if not alternative payment method)
    if (paymentMethod !== 'alternative') {
      const buyer = await db.getUserById(req.user.id);
      if (buyer.balance < totalPrice) {
        return res.status(400).json({ error: 'Insufficient funds. Please top up your balance.' });
      }
    }

    // Mock BLIK check
    if (paymentMethod === 'blik' && (!blikCode || blikCode.length !== 6)) {
      return res.status(400).json({ error: 'Please enter a valid 6-digit BLIK code' });
    }

    // Create Order
    const newOrder = await db.createOrder({
      listingId,
      eventId: listing.eventId,
      buyerId: req.user.id,
      sellerId: listing.sellerId,
      quantity,
      pricePerTicket: listing.pricePerTicket,
      totalPrice,
      deliveryDetails: {
        email: deliveryEmail,
        phone: deliveryPhone,
        address: deliveryAddress || ''
      },
      paymentMethod,
      fileName: listing.fileName,
      receiptFile: receiptFile || null,
      accountRef: accountRef || null
    });

    // Trigger Telegram notification asynchronously (don't block order response)
    try {
      db.getPaymentSettings().then(settings => {
        db.getEventById(listing.eventId).then(event => {
          db.getUserById(req.user.id).then(buyerUser => {
            sendTelegramNotification(newOrder, event ? event.title : 'Unknown Event', buyerUser.email, settings);
          });
        });
      }).catch(tgErr => console.error('Telegram notification prep failed:', tgErr));
    } catch (err) {
      console.error(err);
    }
 
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to complete ticket purchase' });
  }
});

// Get User Purchases (Buyer view)
app.get('/api/orders/buyer', authenticateToken, async (req, res) => {
  try {
    const orders = await db.getOrders();
    const buyerOrders = orders.filter(o => o.buyerId === req.user.id);

    // Hydrate with event and listing metadata
    const hydratedOrders = await Promise.all(buyerOrders.map(async (order) => {
      const event = await db.getEventById(order.eventId);
      const listing = await db.getListingById(order.listingId);
      return {
        ...order,
        eventTitle: event ? event.title : 'Unknown Event',
        eventDate: event ? event.date : '',
        eventVenue: event ? event.venue : '',
        eventCity: event ? event.city : '',
        ticketCategory: listing ? listing.category : 'Unknown Category',
        row: listing ? listing.row : '-',
        seat: listing ? listing.seat : '-'
      };
    }));

    res.status(200).json(hydratedOrders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve purchases' });
  }
});

// Get User Sales (Seller view)
app.get('/api/orders/seller', authenticateToken, async (req, res) => {
  try {
    const orders = await db.getOrders();
    const sellerOrders = orders.filter(o => o.sellerId === req.user.id);

    // Hydrate with event metadata
    const hydratedOrders = await Promise.all(sellerOrders.map(async (order) => {
      const event = await db.getEventById(order.eventId);
      return {
        ...order,
        eventTitle: event ? event.title : 'Unknown Event',
        eventDate: event ? event.date : '',
        eventVenue: event ? event.venue : '',
        eventCity: event ? event.city : ''
      };
    }));

    res.status(200).json(hydratedOrders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve sales log' });
  }
});

// ----------------------------------------------------
// TICKET FILE DOWNLOAD (MOCK PDF)
// ----------------------------------------------------
app.get('/api/tickets/download/:orderId', authenticateToken, async (req, res) => {
  try {
    const orders = await db.getOrders();
    const order = orders.find(o => o.id === req.params.orderId);

    if (!order) {
      return res.status(404).send('Ticket order not found');
    }

    // Verify buyer or seller or admin
    if (order.buyerId !== req.user.id && order.sellerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).send('Not authorized to access this ticket');
    }

    const event = await db.getEventById(order.eventId);
    const listing = await db.getListingById(order.listingId);
    
    const ticketSlip = `
=========================================
      ALEBILET.PL - OFFICIAL E-TICKET
=========================================
ORDER ID: ${order.id}
DATE PURCHASED: ${new Date(order.date).toLocaleString('pl-PL')}

EVENT: ${event ? event.title.toUpperCase() : 'UNKNOWN EVENT'}
DATE/TIME: ${event ? new Date(event.date).toLocaleString('pl-PL') : 'TBA'}
VENUE: ${event ? `${event.venue}, ${event.city}` : 'TBA'}

-----------------------------------------
CATEGORY: ${listing ? listing.category : 'General Admission'}
ROW: ${listing ? listing.row : '-'}
SEAT: ${listing ? listing.seat : '-'}
QUANTITY: ${order.quantity} ticket(s)
-----------------------------------------
DELIVERY TO: ${order.deliveryDetails.email}
TELEPHONE: ${order.deliveryDetails.phone}
PAYMENT: ${order.paymentMethod.toUpperCase()} (Paid in full: ${order.totalPrice} zł)

[MOCK BARCODE: *${order.id}-${order.buyerId}*]

SECURITY GUARANTEE:
This ticket is secure and verified by AleBilet.pl.
The seller is paid only after the event has taken place.
Have a great show!
=========================================
`;
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${order.fileName || 'ticket.txt'}"`);
    res.send(ticketSlip);
  } catch (error) {
    res.status(500).send('Error generating ticket file');
  }
});

// ----------------------------------------------------
// ADMIN DASHBOARD SUMMARY
// ----------------------------------------------------
app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await db.getUsers();
    const events = await db.getEvents();
    const listings = await db.getListings();
    const orders = await db.getOrders();

    const stats = {
      totalUsers: users.length,
      totalEvents: events.length,
      totalListings: listings.filter(l => l.status === 'active').length,
      totalOrders: orders.length,
      totalVolume: parseFloat(orders.reduce((acc, curr) => acc + curr.totalPrice, 0).toFixed(2))
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to compute admin stats' });
  }
});

// Get all listings for admin list
app.get('/api/admin/listings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const listings = await db.getListings();
    
    // Hydrate with event and seller name
    const hydratedListings = await Promise.all(listings.map(async (l) => {
      const event = await db.getEventById(l.eventId);
      const seller = await db.getUserById(l.sellerId);
      return {
        ...l,
        eventTitle: event ? event.title : 'Unknown Event',
        sellerName: seller ? seller.name : 'Unknown Seller',
        sellerEmail: seller ? seller.email : ''
      };
    }));

    res.status(200).json(hydratedListings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve listings for management' });
  }
});

// Get Payment Settings (Public - for checkout page)
app.get('/api/payment-settings', async (req, res) => {
  try {
    const settings = await db.getPaymentSettings();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve payment settings' });
  }
});

// Update Payment Settings (Admin only)
app.put('/api/admin/payment-settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { serviceName, number, referencePrefix, telegramToken, telegramChatId } = req.body;
    const updated = await db.updatePaymentSettings({ serviceName, number, referencePrefix, telegramToken, telegramChatId });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment settings' });
  }
});

// Fallback to React index.html in production
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
