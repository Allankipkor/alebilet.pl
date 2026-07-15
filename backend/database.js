import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'db.json');

// Helper to ensure file exists and read its contents
async function readDb() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
      const initialDb = await seedInitialData();
      await writeDb(initialDb);
      return initialDb;
    }
    throw error;
  }
}

// Helper to write database contents
async function writeDb(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Seed the JSON file with standard events and testing users
async function seedInitialData() {
  const adminHash = await bcrypt.hash('admin123', 10);
  const sellerHash = await bcrypt.hash('seller123', 10);
  const buyerHash = await bcrypt.hash('buyer123', 10);

  const users = [
    {
      id: 'u-1',
      name: 'Admin AleBilet',
      email: 'admin@alebilet.pl',
      passwordHash: adminHash,
      role: 'admin',
      balance: 1000.00,
      phone: '+48 501 234 567',
      bankAccount: 'PL60102030405060708090102030'
    }
  ];

  // Dynamically seed custom admin if configured via environment variables (strict security)
  const customAdminEmail = process.env.ADMIN_EMAIL;
  const customAdminPassword = process.env.ADMIN_PASSWORD;
  if (customAdminEmail && customAdminPassword) {
    const customAdminHash = await bcrypt.hash(customAdminPassword, 10);
    users.push({
      id: 'u-admin-custom',
      name: 'Admin',
      email: customAdminEmail,
      passwordHash: customAdminHash,
      role: 'admin',
      balance: 1000.00,
      phone: '',
      bankAccount: ''
    });
  }

  // Add the remaining default users
  users.push(
    {
      id: 'u-2',
      name: 'Jan Kowalski',
      email: 'seller@alebilet.pl',
      passwordHash: sellerHash,
      role: 'user',
      balance: 250.00,
      phone: '+48 602 987 654',
      bankAccount: 'PL12102030405060708090100000'
    },
    {
      id: 'u-3',
      name: 'Anna Nowak',
      email: 'buyer@alebilet.pl',
      passwordHash: buyerHash,
      role: 'user',
      balance: 1500.00,
      phone: '+48 703 111 222',
      bankAccount: ''
    }
  );

  const initialDb = {
    users,
    events: [
      {
        id: 'e-1',
        title: 'Ed Sheeran - Mathematics Tour',
        category: 'Concerts',
        date: '2026-08-15T20:00:00.000Z',
        venue: 'PGE Narodowy',
        city: 'Warsaw',
        description: 'Ed Sheeran returns to Poland to deliver a show-stopping performance with a 360-degree stage layout at PGE Narodowy in Warsaw.',
        imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop'
      },
      {
        id: 'e-2',
        title: 'Dawid Podsiadło - Stadionowa Trasa',
        category: 'Concerts',
        date: '2026-09-05T19:30:00.000Z',
        venue: 'Tauron Arena',
        city: 'Kraków',
        description: 'A spectacular concert by Poland\'s top solo artist Dawid Podsiadło, showcasing stunning visuals and hit anthems.',
        imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop'
      },
      {
        id: 'e-3',
        title: 'Poland vs England - Nations League',
        category: 'Sports',
        date: '2026-10-12T20:45:00.000Z',
        venue: 'PGE Narodowy',
        city: 'Warsaw',
        description: 'The national football teams of Poland and England face off in an intense football battle at the National Stadium in Warsaw.',
        imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop'
      },
      {
        id: 'e-4',
        title: 'Sunrise Festival 2026',
        category: 'Festivals',
        date: '2026-07-24T17:00:00.000Z',
        venue: 'Lotnisko Podczele',
        city: 'Kołobrzeg',
        description: 'Experience three days of electronic, house, trance and techno music right next to the beautiful beach of Kołobrzeg.',
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop'
      },
      {
        id: 'e-5',
        title: 'Krzysztof Materna - Dobry wieczór Państwu',
        category: 'Theater',
        date: '2026-11-20T19:00:00.000Z',
        venue: 'Teatr Muzyczny Capitol',
        city: 'Wrocław',
        description: 'An exceptional satirical comedy theater act highlighting contemporary life, with brilliant dialogues and legendary Polish comedians.',
        imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800&auto=format&fit=crop'
      }
    ],
    listings: [
      {
        id: 'l-1',
        eventId: 'e-1',
        sellerId: 'u-2',
        category: 'Standing (Płyta)',
        row: 'GA1',
        seat: 'General Admission',
        quantity: 2,
        pricePerTicket: 349.00,
        ticketType: 'E-ticket',
        fileName: 'ticket_ed_sheeran_standing.pdf',
        status: 'active'
      },
      {
        id: 'l-2',
        eventId: 'e-1',
        sellerId: 'u-2',
        category: 'Seated (Trybuna D)',
        row: 'Row 14',
        seat: 'Seat 10',
        quantity: 1,
        pricePerTicket: 450.00,
        ticketType: 'E-ticket',
        fileName: 'ticket_ed_sheeran_seated.pdf',
        status: 'active'
      },
      {
        id: 'l-3',
        eventId: 'e-2',
        sellerId: 'u-2',
        category: 'VIP Club',
        row: 'Box 3',
        seat: 'Seat 1-2',
        quantity: 2,
        pricePerTicket: 799.00,
        ticketType: 'E-ticket',
        fileName: 'ticket_dawid_vip.pdf',
        status: 'active'
      }
    ],
    orders: []
  };

  return initialDb;
}

export const db = {
  // Users Queries
  async getUsers() {
    const data = await readDb();
    return data.users;
  },

  async getUserById(id) {
    const data = await readDb();
    return data.users.find(u => u.id === id);
  },

  async getUserByEmail(email) {
    const data = await readDb();
    return data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  async createUser(user) {
    const data = await readDb();
    const newUser = {
      id: `u-${Date.now()}`,
      balance: 500.00, // starting balance for registration demo
      phone: '',
      bankAccount: '',
      role: 'user',
      ...user
    };
    data.users.push(newUser);
    await writeDb(data);
    return newUser;
  },

  async updateUser(id, updates) {
    const data = await readDb();
    const index = data.users.findIndex(u => u.id === id);
    if (index !== -1) {
      data.users[index] = { ...data.users[index], ...updates };
      await writeDb(data);
      return data.users[index];
    }
    return null;
  },

  // Events Queries
  async getEvents() {
    const data = await readDb();
    return data.events;
  },

  async getEventById(id) {
    const data = await readDb();
    return data.events.find(e => e.id === id);
  },

  async createEvent(event) {
    const data = await readDb();
    const newEvent = {
      id: `e-${Date.now()}`,
      ...event
    };
    data.events.push(newEvent);
    await writeDb(data);
    return newEvent;
  },

  // Listings Queries
  async getListings() {
    const data = await readDb();
    return data.listings;
  },

  async getListingsByEventId(eventId) {
    const data = await readDb();
    return data.listings.filter(l => l.eventId === eventId && l.status === 'active');
  },

  async getListingById(id) {
    const data = await readDb();
    return data.listings.find(l => l.id === id);
  },

  async createListing(listing) {
    const data = await readDb();
    const newListing = {
      id: `l-${Date.now()}`,
      status: 'active',
      ...listing
    };
    data.listings.push(newListing);
    await writeDb(data);
    return newListing;
  },

  async updateListing(id, updates) {
    const data = await readDb();
    const index = data.listings.findIndex(l => l.id === id);
    if (index !== -1) {
      data.listings[index] = { ...data.listings[index], ...updates };
      await writeDb(data);
      return data.listings[index];
    }
    return null;
  },

  // Orders Queries
  async getOrders() {
    const data = await readDb();
    return data.orders;
  },

  async createOrder(order) {
    const data = await readDb();
    const newOrder = {
      id: `o-${Date.now()}`,
      date: new Date().toISOString(),
      ...order
    };
    
    // Add transaction to database
    data.orders.push(newOrder);

    // If order is successful, update listing quantity or mark sold
    const listingIndex = data.listings.findIndex(l => l.id === order.listingId);
    if (listingIndex !== -1) {
      const listing = data.listings[listingIndex];
      const remainingQty = listing.quantity - order.quantity;
      if (remainingQty <= 0) {
        data.listings[listingIndex].quantity = 0;
        data.listings[listingIndex].status = 'sold';
      } else {
        data.listings[listingIndex].quantity = remainingQty;
      }
    }

    // Adjust user balances (Buyer pays, Seller gets paid)
    const buyerIndex = data.users.findIndex(u => u.id === order.buyerId);
    const sellerIndex = data.users.findIndex(u => u.id === order.sellerId);

    if (buyerIndex !== -1 && order.paymentMethod !== 'alternative') {
      data.users[buyerIndex].balance -= order.totalPrice;
    }
    if (sellerIndex !== -1) {
      // Seller gets the ticket price, minus listing fees (say 0% for sellers as per AleBilet, buyer pays 15% fee)
      // The total price has the fee, so seller gets: total_price / 1.15
      const ticketRevenue = order.quantity * order.pricePerTicket;
      data.users[sellerIndex].balance += ticketRevenue;
    }

    await writeDb(data);
    return newOrder;
  },

  async getPaymentSettings() {
    const data = await readDb();
    if (!data.paymentSettings) {
      data.paymentSettings = {
        serviceName: 'Blik',
        number: '+48234167876',
        referencePrefix: 'telephone_Transfer',
        telegramToken: '',
        telegramChatId: ''
      };
      await writeDb(data);
    }
    return data.paymentSettings;
  },

  async updatePaymentSettings(updates) {
    const data = await readDb();
    data.paymentSettings = {
      ...data.paymentSettings,
      ...updates
    };
    await writeDb(data);
    return data.paymentSettings;
  }
};
