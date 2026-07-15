import React, { useState, useEffect } from 'react';
import { 
  Search, PlusCircle, User, LogOut, Ticket, Lock, ShieldCheck, 
  DollarSign, Calendar, MapPin, Upload, X, ChevronRight, 
  Download, AlertTriangle, Users, ShoppingBag, TrendingUp, CheckCircle,
  Eye, EyeOff, Link2
} from 'lucide-react';

const SECRET_KEY = 'alebilet_jwt_secret_key_12345';

// --------------------------------------------------------------------------
// MULTILINGUAL DICTIONARY (POLISH & ENGLISH)
// --------------------------------------------------------------------------
const translations = {
  pl: {
    heroTitle: "Kupuj i sprzedawaj bilety bezpiecznie",
    heroSubtitle: "Gwarancja autentyczności biletów i bezpiecznej płatności. Sprzedawca otrzymuje zapłatę dopiero po wydarzeniu.",
    searchPlaceholder: "Szukaj artysty, wydarzenia lub miasta...",
    searchButton: "Szukaj",
    sellButton: "Sprzedaj bilet",
    signIn: "Zaloguj się",
    register: "Zarejestruj się",
    googleSignIn: "Kontynuuj z Google",
    signOut: "Wyloguj się",
    myDashboard: "Mój AleBilet",
    adminDashboard: "Panel Admina",
    securityGuarantee: "🛡️ Gwarancja AleBilet: 100% bezpieczeństwa zakupów i weryfikacja autentyczności biletów.",
    upcomingEvents: "Nadchodzące Wydarzenia",
    howItWorks: "Jak to działa?",
    buyerGuarantee: "Dla Kupujących",
    buyerGuaranteeDesc: "Otrzymujesz ważne bilety na czas lub zwrot pieniędzy. Płatność przekazujemy sprzedawcy dopiero po wydarzeniu.",
    sellerGuarantee: "Dla Sprzedających",
    sellerGuaranteeDesc: "Wystawiaj bilety za darmo. Prześlij plik PDF i otrzymaj zapłatę automatycznie na swoje konto bankowe.",
    categories: {
      All: "Wszystkie",
      Concerts: "🎤 Koncerty",
      Sports: "⚽ Sport",
      Festivals: "🎪 Festiwale",
      Theater: "🎭 Teatr"
    },
    eventDetails: "Szczegóły wydarzenia",
    activeOffers: "Dostępne oferty biletów",
    noOffers: "Brak aktywnych ofert dla tego wydarzenia. Bądź pierwszy i wystaw bilet!",
    ticketCategory: "Kategoria",
    row: "Rząd",
    seat: "Miejsce",
    quantity: "Ilość",
    price: "Cena za bilet",
    buyNow: "Kup teraz",
    authTitle: "Witaj w AleBilet",
    email: "Adres e-mail",
    password: "Hasło",
    name: "Imię i nazwisko",
    phone: "Numer telefonu",
    registerAsAdmin: "Zarejestruj jako administrator",
    alreadyHaveAccount: "Masz już konto? Zaloguj się",
    dontHaveAccount: "Nie masz konta? Zarejestruj się",
    balance: "Saldo konta",
    topUp: "Zasil konto",
    settings: "Ustawienia konta",
    ticketsBought: "Kupione bilety",
    ticketsSold: "Sprzedane bilety",
    myOffers: "Moje oferty",
    bankAccount: "Konto bankowe do wypłat",
    saveSettings: "Zapisz ustawienia",
    addFundsTitle: "Zasilenie salda demo",
    amountPLN: "Kwota (PLN)",
    checkoutTitle: "Podsumowanie zamówienia",
    serviceFee: "Opłata serwisowa (3%)",
    totalPrice: "Razem do zapłaty",
    deliveryInfo: "Dane dostawy i kontaktu",
    paymentMethod: "Metoda płatności",
    blikCodeLabel: "Wpisz 6-cyfrowy kod BLIK",
    payAndOrder: "Płać i zamawiaj",
    purchaseSuccess: "Dziękujemy za zakup!",
    purchaseSuccessDesc: "Bilet został pomyślnie zakupiony i jest gotowy do pobrania w Twoim panelu użytkownika.",
    downloadTicket: "Pobierz bilet",
    listTicketTitle: "Wystaw bilet na sprzedaż",
    selectEvent: "1. Wybierz wydarzenie",
    enterDetails: "2. Szczegóły biletów",
    uploadFiles: "3. Prześlij pliki biletów",
    payoutDetails: "4. Dane do przelewu",
    confirmListing: "5. Potwierdzenie",
    uploadPlaceholder: "Przeciągnij i upuść plik PDF biletu lub kliknij, aby wybrać z dysku",
    uploadSuccess: "Plik wgrany pomyślnie!",
    listTicketBtn: "Wystaw bilet",
    listingSuccess: "Bilet został wystawiony!",
    listingSuccessDesc: "Twoja oferta jest już widoczna dla kupujących na stronie wydarzenia.",
    adminTitle: "Panel Zarządzania AleBilet",
    totalVolume: "Łączny obrót",
    activeListings: "Aktywne oferty",
    totalUsers: "Użytkownicy",
    postEventTitle: "Dodaj nowe wydarzenie",
    eventTitle: "Nazwa wydarzenia",
    venueName: "Nazwa obiektu / stadionu",
    city: "Miasto",
    date: "Data i godzina",
    description: "Opis wydarzenia",
    imageLink: "Link do zdjęcia okładki",
    postEventBtn: "Dodaj wydarzenie",
    manageListings: "Zarządzanie ofertami",
    action: "Akcja",
    delete: "Usuń",
    status: "Status"
  },
  en: {
    heroTitle: "Buy and Sell Tickets Safely",
    heroSubtitle: "Guaranteed ticket authenticity and secure transactions. The seller gets paid only after the event takes place.",
    searchPlaceholder: "Search artist, event, or city...",
    searchButton: "Search",
    sellButton: "Sell ticket",
    signIn: "Sign in",
    register: "Register",
    googleSignIn: "Continue with Google",
    signOut: "Sign out",
    myDashboard: "My AleBilet",
    adminDashboard: "Admin Panel",
    securityGuarantee: "🛡️ AleBilet Guarantee: 100% purchase protection and verified ticket authenticity.",
    upcomingEvents: "Upcoming Events",
    howItWorks: "How it works?",
    buyerGuarantee: "For Buyers",
    buyerGuaranteeDesc: "Receive valid tickets on time or get a full refund. Payment is escrowed and sent to seller only post-event.",
    sellerGuarantee: "For Sellers",
    sellerGuaranteeDesc: "List tickets for free. Upload the PDF and get paid automatically to your registered bank account.",
    categories: {
      All: "All",
      Concerts: "🎤 Concerts",
      Sports: "⚽ Sports",
      Festivals: "🎪 Festivals",
      Theater: "🎭 Theater"
    },
    eventDetails: "Event Details",
    activeOffers: "Available ticket offers",
    noOffers: "No active offers for this event. Be the first to list a ticket!",
    ticketCategory: "Category",
    row: "Row",
    seat: "Seat",
    quantity: "Quantity",
    price: "Price per ticket",
    buyNow: "Buy now",
    authTitle: "Welcome to AleBilet",
    email: "Email address",
    password: "Password",
    name: "Full name",
    phone: "Phone number",
    registerAsAdmin: "Register as administrator",
    alreadyHaveAccount: "Already have an account? Sign in",
    dontHaveAccount: "Don't have an account? Register",
    balance: "Account Balance",
    topUp: "Top up",
    settings: "Account settings",
    ticketsBought: "Tickets bought",
    ticketsSold: "Tickets sold",
    myOffers: "My offers",
    bankAccount: "Bank account for payouts",
    saveSettings: "Save settings",
    addFundsTitle: "Demo Balance Deposit",
    amountPLN: "Amount (PLN)",
    checkoutTitle: "Order summary",
    serviceFee: "Service Fee (3%)",
    totalPrice: "Total to pay",
    deliveryInfo: "Delivery & contact details",
    paymentMethod: "Payment method",
    blikCodeLabel: "Enter 6-digit BLIK code",
    payAndOrder: "Pay & place order",
    purchaseSuccess: "Thank you for your purchase!",
    purchaseSuccessDesc: "Your ticket has been successfully purchased and is ready to download in your dashboard.",
    downloadTicket: "Download ticket",
    listTicketTitle: "List your ticket for sale",
    selectEvent: "1. Select event",
    enterDetails: "2. Ticket details",
    uploadFiles: "3. Upload ticket PDF",
    payoutDetails: "4. Payout details",
    confirmListing: "5. Confirmation",
    uploadPlaceholder: "Drag & drop your ticket PDF here or click to select from file system",
    uploadSuccess: "File uploaded successfully!",
    listTicketBtn: "Post listing",
    listingSuccess: "Your ticket is listed!",
    listingSuccessDesc: "Your offer is now live and visible to buyers on the event page.",
    adminTitle: "AleBilet Administrative Panel",
    totalVolume: "Total Volume",
    activeListings: "Active Offers",
    totalUsers: "Total Users",
    postEventTitle: "Post New Event",
    eventTitle: "Event title",
    venueName: "Venue / Stadium name",
    city: "City",
    date: "Date & time",
    description: "Description",
    imageLink: "Cover image URL",
    postEventBtn: "Create Event",
    manageListings: "Manage listings",
    action: "Action",
    delete: "Delete",
    status: "Status"
  }
};

export default function App() {
  // Navigation & Language
  const [activePage, setActivePage] = useState('home');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [language, setLanguage] = useState('pl');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Authentication State
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [showAuthModal, setShowAuthModal] = useState(null); // 'login' | 'register' | null
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', phone: '', role: 'user' });
  const [authError, setAuthError] = useState('');
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  const [googleCustomUser, setGoogleCustomUser] = useState({ name: '', email: '' });
  const [showPassword, setShowPassword] = useState(false);

  // Data State
  const [events, setEvents] = useState([]);
  const [eventListings, setEventListings] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [highlightedListingId, setHighlightedListingId] = useState(null);
  const [createdListing, setCreatedListing] = useState(null);
  const [toast, setToast] = useState(null);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [paymentSettingsForm, setPaymentSettingsForm] = useState({ serviceName: '', number: '', referencePrefix: '' });
  const [alternativeRefCode, setAlternativeRefCode] = useState('');
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [receiptFileName, setReceiptFileName] = useState('');

  // Buy Ticket / Checkout State
  const [checkoutListing, setCheckoutListing] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({ email: '', phone: '', address: '', quantity: 1, paymentMethod: 'blik', blikCode: '' });
  const [blikProgress, setBlikProgress] = useState(0);
  const [checkoutStep, setCheckoutStep] = useState('form'); // 'form' | 'processing' | 'success'
  const [checkoutError, setCheckoutError] = useState('');

  // Sell Ticket State
  const [sellWizardStep, setSellWizardStep] = useState(1);
  const [sellForm, setSellForm] = useState({ eventId: '', category: 'Standing', row: '', seat: '', quantity: 1, pricePerTicket: '', ticketType: 'E-ticket', fileName: '' });
  const [sellFileUploaded, setSellFileUploaded] = useState(false);
  const [sellError, setSellError] = useState('');

  // User Dashboard State
  const [dashboardTab, setDashboardTab] = useState('bought');
  const [userPurchases, setUserPurchases] = useState([]);
  const [userSales, setUserSales] = useState([]);
  const [allListings, setAllListings] = useState([]); // for my listings
  const [profileForm, setProfileForm] = useState({ phone: '', bankAccount: '' });
  const [topUpAmount, setTopUpAmount] = useState('');
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  // Admin Panel State
  const [adminStats, setAdminStats] = useState({ totalUsers: 0, totalEvents: 0, totalListings: 0, totalOrders: 0, totalVolume: 0 });
  const [adminListings, setAdminListings] = useState([]);
  const [eventForm, setEventForm] = useState({ title: '', category: 'Concerts', date: '', venue: '', city: '', description: '', imageUrl: '' });
  const [adminError, setAdminError] = useState('');

  const t = translations[language];

  // Fetch standard events
  const loadEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (e) {
      console.error("Error loading events", e);
    }
  };

  const showToastMessage = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const copyShareableLink = (eventId, listingId) => {
    const shareUrl = `${window.location.origin}/?event=${eventId}&listing=${listingId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToastMessage(language === 'pl' ? 'Link skopiowany do schowka!' : 'Link copied to clipboard!');
    }).catch(err => {
      console.error('Could not copy link', err);
    });
  };

  const loadPaymentSettings = async () => {
    try {
      const res = await fetch('/api/payment-settings');
      if (res.ok) {
        const data = await res.json();
        setPaymentSettings(data);
      }
    } catch (e) {
      console.error("Error loading payment settings", e);
    }
  };

  // Sync form state when loading data
  useEffect(() => {
    if (paymentSettings) {
      setPaymentSettingsForm({
        serviceName: paymentSettings.serviceName || '',
        number: paymentSettings.number || '',
        referencePrefix: paymentSettings.referencePrefix || ''
      });
    }
  }, [paymentSettings]);

  // URL deep linking parser and payment settings boot
  useEffect(() => {
    loadPaymentSettings();
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('event');
    const listingId = params.get('listing');
    
    if (eventId) {
      navigateToEvent(eventId);
      if (listingId) {
        setHighlightedListingId(listingId);
      }
    }
  }, []);

  // Scroll to highlighted listing when listings load
  useEffect(() => {
    if (highlightedListingId && eventListings.length > 0) {
      setTimeout(() => {
        const element = document.getElementById(`listing-card-${highlightedListingId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
    }
  }, [eventListings, highlightedListingId]);

  // Auth bootstrap
  useEffect(() => {
    loadEvents();
    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setProfileForm({ phone: data.phone || '', bankAccount: data.bankAccount || '' });
      } else {
        // Token expired or invalid
        handleLogout();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --------------------------------------------------------------------------
  // USER AUTHENTICATION ACTIONS
  // --------------------------------------------------------------------------
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const endpoint = showAuthModal === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = showAuthModal === 'login' 
      ? { email: authForm.email, password: authForm.password }
      : authForm;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Authentication failed');
        return;
      }
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setShowAuthModal(null);
      setAuthForm({ name: '', email: '', password: '', phone: '', role: 'user' });
    } catch (err) {
      setAuthError('Connection error');
    }
  };

  const handleGoogleSignInClick = async (email, name) => {
    try {
      setAuthError('');
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Google Login failed');
        return;
      }
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setShowAuthModal(null);
      setShowGooglePrompt(false);
      setGoogleCustomUser({ name: '', email: '' });
    } catch (err) {
      setAuthError('Connection error during Google authentication');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setActivePage('home');
  };

  // --------------------------------------------------------------------------
  // PAGE ROUTING & STATE LOADERS
  // --------------------------------------------------------------------------
  const navigateToEvent = async (eventId) => {
    setSelectedEventId(eventId);
    try {
      const resEvent = await fetch(`/api/events/${eventId}`);
      const resListings = await fetch(`/api/events/${eventId}/listings`);
      if (resEvent.ok && resListings.ok) {
        const eventData = await resEvent.json();
        const listingsData = await resListings.json();
        setCurrentEvent(eventData);
        setEventListings(listingsData);
        setActivePage('event-details');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const navigateToDashboard = async () => {
    if (!user) {
      setShowAuthModal('login');
      return;
    }
    setActivePage('dashboard');
    loadDashboardData();
  };

  const loadDashboardData = async () => {
    try {
      const buyerRes = await fetch('/api/orders/buyer', { headers: { 'Authorization': `Bearer ${token}` } });
      const sellerRes = await fetch('/api/orders/seller', { headers: { 'Authorization': `Bearer ${token}` } });
      const listRes = await fetch('/api/events'); // fetch all to show titles for my offers
      
      // Let's get active listings
      const allListingsRes = await fetch('/api/events'); 
      const activeListingsRes = await fetch('/api/events'); // stub for user offers
      
      if (buyerRes.ok) setUserPurchases(await buyerRes.json());
      if (sellerRes.ok) setUserSales(await sellerRes.json());
      
      // Filter out user's active offers
      const listingsRes = await fetch('/api/events');
      if (listingsRes.ok) {
        const allEvs = await listingsRes.json();
        let userOffers = [];
        for (let ev of allEvs) {
          const lRes = await fetch(`/api/events/${ev.id}/listings`);
          if (lRes.ok) {
            const list = await lRes.json();
            const filtered = list.filter(l => l.sellerId === user.id);
            userOffers.push(...filtered.map(l => ({ ...l, eventTitle: ev.title, eventCity: ev.city })));
          }
        }
        setAllListings(userOffers);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const navigateToAdmin = async () => {
    if (!user || user.role !== 'admin') return;
    setActivePage('admin');
    loadAdminData();
  };

  const loadAdminData = async () => {
    try {
      const statsRes = await fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } });
      const listRes = await fetch('/api/admin/listings', { headers: { 'Authorization': `Bearer ${token}` } });
      if (statsRes.ok) setAdminStats(await statsRes.json());
      if (listRes.ok) setAdminListings(await listRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  // --------------------------------------------------------------------------
  // PROFILE & BALANCE ACTIONS
  // --------------------------------------------------------------------------
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        alert(language === 'pl' ? 'Ustawienia zapisane!' : 'Settings saved!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTopUp = async (e) => {
    e.preventDefault();
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) return;
    try {
      const res = await fetch('/api/auth/add-funds', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: parseFloat(topUpAmount) })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setShowTopUpModal(false);
        setTopUpAmount('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --------------------------------------------------------------------------
  // BUY TICKET / CHECKOUT LOGIC
  // --------------------------------------------------------------------------
  const startCheckout = (listing) => {
    if (!user) {
      setShowAuthModal('login');
      return;
    }
    setCheckoutListing(listing);
    setCheckoutForm({
      email: user.email,
      phone: user.phone || '',
      address: '',
      quantity: 1,
      paymentMethod: 'blik',
      blikCode: ''
    });
    setCheckoutStep('form');
    setCheckoutError('');
    setBlikProgress(0);

    // Generate unique reference starting with telephone_Transfer
    const uniqueRef = Math.random().toString(36).substring(2, 8).toUpperCase();
    setAlternativeRefCode(`telephone_Transfer-${uniqueRef}`);
    setReceiptUploaded(false);
    setReceiptFileName('');
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setCheckoutError('');

    // Pricing calculation
    const basePrice = checkoutListing.pricePerTicket * checkoutForm.quantity;
    const fee = basePrice * 0.03;
    const total = parseFloat((basePrice + fee).toFixed(2));

    if (checkoutForm.paymentMethod !== 'alternative' && user.balance < total) {
      setCheckoutError(language === 'pl' 
        ? 'Niewystarczające środki. Zasil swoje saldo w panelu użytkownika przed zakupem.' 
        : 'Insufficient funds. Please top up your balance in your dashboard before purchase.');
      return;
    }

    if (checkoutForm.paymentMethod === 'blik') {
      if (!checkoutForm.blikCode || checkoutForm.blikCode.length !== 6) {
        setCheckoutError(language === 'pl' ? 'Wpisz poprawny 6-cyfrowy kod BLIK' : 'Enter a valid 6-digit BLIK code');
        return;
      }
      setCheckoutStep('processing');
      // Simulate phone BLIK authorization progress bar
      let prog = 0;
      const interval = setInterval(() => {
        prog += 20;
        setBlikProgress(prog);
        if (prog >= 100) {
          clearInterval(interval);
          completePurchase();
        }
      }, 400);
    } else {
      completePurchase();
    }
  };

  const completePurchase = async () => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          listingId: checkoutListing.id,
          quantity: checkoutForm.quantity,
          deliveryEmail: checkoutForm.email,
          deliveryPhone: checkoutForm.phone,
          deliveryAddress: checkoutForm.address,
          paymentMethod: checkoutForm.paymentMethod,
          blikCode: checkoutForm.blikCode,
          receiptFile: checkoutForm.paymentMethod === 'alternative' ? receiptFileName : null,
          accountRef: checkoutForm.paymentMethod === 'alternative' ? alternativeRefCode : null
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setCheckoutStep('form');
        setCheckoutError(data.error || 'Failed to complete order');
        return;
      }
      // Success
      setCheckoutStep('success');
      // Refresh user balance details
      fetchCurrentUser();
    } catch (e) {
      setCheckoutStep('form');
      setCheckoutError('Connection failed');
    }
  };

  // --------------------------------------------------------------------------
  // SELL TICKET LOGIC
  // --------------------------------------------------------------------------
  const startSellWizard = () => {
    if (!user) {
      setShowAuthModal('login');
      return;
    }
    setSellWizardStep(1);
    setSellForm({
      eventId: '',
      category: 'Standing',
      row: '',
      seat: '',
      quantity: 1,
      pricePerTicket: '',
      ticketType: 'E-ticket',
      fileName: 'e_ticket.pdf'
    });
    setSellFileUploaded(false);
    setSellError('');
    setActivePage('sell');
  };

  const handleSellSubmit = async () => {
    setSellError('');
    if (!sellForm.eventId || !sellForm.pricePerTicket) {
      setSellError(language === 'pl' ? 'Wypełnij wszystkie pola' : 'Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sellForm)
      });
      if (res.ok) {
        const createdData = await res.json();
        setCreatedListing(createdData);
        setSellWizardStep(3); // Success confirmation stage is now Step 3
      } else {
        const errData = await res.json();
        setSellError(errData.error || 'Listing post failed');
      }
    } catch (e) {
      setSellError('Network failure');
    }
  };

  // --------------------------------------------------------------------------
  // ADMIN EVENT CREATION
  // --------------------------------------------------------------------------
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setAdminError('');
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventForm)
      });
      if (res.ok) {
        alert(language === 'pl' ? 'Pomyślnie dodano wydarzenie!' : 'Event created successfully!');
        setEventForm({ title: '', category: 'Concerts', date: '', venue: '', city: '', description: '', imageUrl: '' });
        loadEvents();
        loadAdminData();
      } else {
        const errData = await res.json();
        setAdminError(errData.error || 'Failed to create event');
      }
    } catch (e) {
      setAdminError('Network error');
    }
  };

  const handleSavePaymentSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/payment-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentSettingsForm)
      });
      if (res.ok) {
        const data = await res.json();
        setPaymentSettings(data);
        showToastMessage(language === 'pl' ? 'Zapisano ustawienia płatności!' : 'Payment settings saved successfully!');
      } else {
        const err = await res.json();
        showToastMessage(err.error || 'Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      showToastMessage('Network error');
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm(language === 'pl' ? 'Czy na pewno chcesz usunąć tę ofertę?' : 'Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        if (activePage === 'admin') loadAdminData();
        else loadDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --------------------------------------------------------------------------
  // SEARCH & FILTER COMPUTE
  // --------------------------------------------------------------------------
  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="app-container">
      {/* ----------------------------------------------------
          NAVBAR HEADER
          ---------------------------------------------------- */}
      <header className="navbar">
        <div className="container">
          <div className="logo-container" style={{cursor: 'pointer'}} onClick={() => { setActivePage('home'); setSearchQuery(''); }}>
            🎟️ AleBilet<span className="logo-dot">.pl</span>
          </div>

          <div className="search-bar-wrapper">
            <Search className="search-bar-icon" size={18} />
            <input 
              type="text" 
              className="search-bar-input" 
              placeholder={t.searchPlaceholder} 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== 'home') setActivePage('home');
              }}
            />
          </div>

          <div className="nav-actions">
            <span className="lang-badge" onClick={() => setLanguage(language === 'pl' ? 'en' : 'pl')}>
              🌐 {language === 'pl' ? 'EN' : 'PL'}
            </span>

            {user && user.role === 'admin' && (
              <button className="btn btn-secondary admin-badge" onClick={navigateToAdmin}>
                {t.adminDashboard}
              </button>
            )}

            <button className="btn btn-secondary" onClick={startSellWizard}>
              <PlusCircle size={16} />
              {t.sellButton}
            </button>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span 
                  onClick={navigateToDashboard} 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontWeight: 600, color: 'var(--dark-blue-text)' }}
                >
                  <User size={18} />
                  {user.name.split(' ')[0]} ({user.balance.toFixed(2)} zł)
                </span>
                <button className="btn-link" onClick={handleLogout} title={t.signOut}>
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={() => setShowAuthModal('login')}>
                {t.signIn}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* ----------------------------------------------------
            HOME PAGE VIEW
            ---------------------------------------------------- */}
        {activePage === 'home' && (
          <div>
            <section className="hero-section">
              <div className="container">
                <h1 className="hero-title">{t.heroTitle}</h1>
                <p className="hero-subtitle">{t.heroSubtitle}</p>
                <div className="hero-search-wrapper">
                  <input 
                    type="text" 
                    className="hero-search-input" 
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="hero-search-btn">{t.searchButton}</button>
                </div>
              </div>
            </section>

            <div className="guarantee-bar">
              <div className="container">{t.securityGuarantee}</div>
            </div>

            <div className="container">
              {/* Event Categories Navigation */}
              <div className="categories-container">
                {Object.keys(t.categories).map((cat) => (
                  <button 
                    key={cat} 
                    className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {t.categories[cat]}
                  </button>
                ))}
              </div>

              {/* Popular Events Grid */}
              <h2 className="section-title">{t.upcomingEvents}</h2>
              <div className="event-grid">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="event-card" onClick={() => navigateToEvent(event.id)}>
                    <img src={event.imageUrl} alt={event.title} className="event-card-img" />
                    <div className="event-card-body">
                      <span className="event-card-category">{event.category}</span>
                      <h3 className="event-card-title">{event.title}</h3>
                      <div className="event-card-meta">
                        <Calendar size={14} />
                        <span>{new Date(event.date).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US')}</span>
                      </div>
                      <div className="event-card-meta" style={{ marginTop: '0.4rem' }}>
                        <MapPin size={14} />
                        <span>{event.venue}, {event.city}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* How it works info panels */}
              <h2 className="section-title" style={{ marginTop: '4rem' }}>{t.howItWorks}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
                <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: '#fafafa' }}>
                  <h3 style={{ marginBottom: '0.8rem', color: 'var(--primary-blue)' }}>{t.buyerGuarantee}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{t.buyerGuaranteeDesc}</p>
                </div>
                <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: '#fafafa' }}>
                  <h3 style={{ marginBottom: '0.8rem', color: 'var(--accent-pink)' }}>{t.sellerGuarantee}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{t.sellerGuaranteeDesc}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            EVENT DETAILS VIEW
            ---------------------------------------------------- */}
        {activePage === 'event-details' && currentEvent && (
          <div>
            <div className="event-hero">
              <div className="container event-hero-layout">
                <img src={currentEvent.imageUrl} alt={currentEvent.title} className="event-hero-img" />
                <div className="event-hero-info">
                  <span className="event-hero-date-pill">{currentEvent.category}</span>
                  <h1 className="event-hero-title">{currentEvent.title}</h1>
                  <div className="event-hero-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={18} /> {new Date(currentEvent.date).toLocaleString(language === 'pl' ? 'pl-PL' : 'en-US')}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={18} /> {currentEvent.venue}, {currentEvent.city}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="container listings-layout">
              <div>
                <h2 className="section-title">{t.activeOffers}</h2>
                <div className="listings-list" style={{ marginTop: '1.5rem' }}>
                  {eventListings.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
                      <Ticket size={48} style={{ margin: '0 auto 1rem', color: 'var(--border-color)' }} />
                      <p>{t.noOffers}</p>
                      <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={startSellWizard}>{t.sellButton}</button>
                    </div>
                  ) : (
                    eventListings.map((listing) => {
                      const isHighlighted = listing.id === highlightedListingId;
                      return (
                        <div 
                          key={listing.id} 
                          id={`listing-card-${listing.id}`} 
                          className="listing-card"
                          style={isHighlighted ? {
                            borderColor: 'var(--primary-blue)',
                            borderWidth: '2px',
                            backgroundColor: 'rgba(0, 174, 239, 0.03)',
                            boxShadow: '0 0 12px rgba(0, 174, 239, 0.2)'
                          } : {}}
                        >
                          <div className="listing-card-details">
                            {isHighlighted && (
                              <div style={{
                                alignSelf: 'flex-start',
                                backgroundColor: 'var(--primary-blue)',
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                padding: '0.2rem 0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                marginBottom: '0.4rem',
                                display: 'inline-block',
                                width: 'fit-content'
                              }}>
                                {language === 'pl' ? '📌 Oferta bezpośrednia' : '📌 Shared Direct Offer'}
                              </div>
                            )}
                            <span className="listing-card-category">{listing.category}</span>
                            <span className="listing-card-meta">{t.row}: {listing.row} | {t.seat}: {listing.seat}</span>
                            <span className="listing-card-meta" style={{ color: 'var(--color-success)', fontWeight: '600' }}>✓ Zweryfikowany bilet elektroniczny (PDF)</span>
                          </div>
                          <div className="listing-card-pricing">
                            <span className="listing-card-price">{listing.pricePerTicket.toFixed(2)} zł</span>
                            <span className="listing-card-qty">{t.quantity}: {listing.quantity}</span>
                            <button className="btn btn-primary" onClick={() => startCheckout(listing)}>{t.buyNow}</button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="event-info-panel">
                <h3>{t.eventDetails}</h3>
                <p>{currentEvent.description}</p>
                <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#e6f7ff', borderRadius: 'var(--radius-md)', border: '1px solid #bae7ff', fontSize: '0.85rem', color: 'var(--dark-blue-text)' }}>
                  <strong>🔒 Bezpieczeństwo AleBilet:</strong><br />
                  Kupując na tej aukcji, chroni Cię Program Gwarancji Biletów. Otrzymasz dokładnie wybrane miejsca, a bilet pobierzesz bezpośrednio z systemu.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            SELL TICKET WIZARD VIEW
            ---------------------------------------------------- */}
        {activePage === 'sell' && (
          <div className="container">
            <div className="sell-wizard-card">
              <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{t.listTicketTitle}</h2>

              {/* Wizard Steps indicator */}
              <div className="wizard-steps">
                <div className={`wizard-step ${sellWizardStep >= 1 ? (sellWizardStep > 1 ? 'completed' : 'active') : ''}`}>1</div>
                <div className={`wizard-step ${sellWizardStep >= 2 ? (sellWizardStep > 2 ? 'completed' : 'active') : ''}`}>2</div>
                <div className={`wizard-step ${sellWizardStep >= 3 ? 'completed' : ''}`}>3</div>
              </div>

              {sellError && (
                <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <AlertTriangle size={20} />
                  <span>{sellError}</span>
                </div>
              )}

              {/* Step 1: Select Event */}
              {sellWizardStep === 1 && (
                <div>
                  <h3 style={{ marginBottom: '1rem' }}>{t.selectEvent}</h3>
                  <div className="form-group">
                    <label>{t.eventTitle}</label>
                    <select 
                      className="form-control"
                      value={sellForm.eventId}
                      onChange={(e) => setSellForm({ ...sellForm, eventId: e.target.value })}
                    >
                      <option value="">-- Wybierz wydarzenie --</option>
                      {events.map(ev => (
                        <option key={ev.id} value={ev.id}>{ev.title} ({ev.city})</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                    <button 
                      className="btn btn-primary" 
                      disabled={!sellForm.eventId}
                      onClick={() => setSellWizardStep(2)}
                    >
                      Dalej <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Ticket details */}
              {sellWizardStep === 2 && (
                <div>
                  <h3 style={{ marginBottom: '1rem' }}>{t.enterDetails}</h3>
                  <div className="form-group">
                    <label>{t.ticketCategory}</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="np. Płyta GA, Sektor G12"
                      value={sellForm.category}
                      onChange={(e) => setSellForm({ ...sellForm, category: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>{t.row}</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="np. 14 (opcjonalnie)"
                        value={sellForm.row}
                        onChange={(e) => setSellForm({ ...sellForm, row: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>{t.seat}</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="np. 24 (opcjonalnie)"
                        value={sellForm.seat}
                        onChange={(e) => setSellForm({ ...sellForm, seat: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>{t.quantity}</label>
                      <input 
                        type="number" 
                        min="1"
                        className="form-control"
                        value={sellForm.quantity}
                        onChange={(e) => setSellForm({ ...sellForm, quantity: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="form-group">
                      <label>{t.price} (PLN)</label>
                      <input 
                        type="number" 
                        placeholder="np. 350"
                        className="form-control"
                        value={sellForm.pricePerTicket}
                        onChange={(e) => setSellForm({ ...sellForm, pricePerTicket: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                    <button className="btn btn-tertiary" onClick={() => setSellWizardStep(1)}>Wstecz</button>
                    <button 
                      className="btn btn-primary"
                      disabled={!sellForm.category || !sellForm.pricePerTicket || sellForm.pricePerTicket <= 0}
                      onClick={handleSellSubmit}
                    >
                      {t.listTicketBtn}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Success screen */}
              {sellWizardStep === 3 && (
                <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-full)', backgroundColor: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <CheckCircle size={36} style={{ color: 'var(--color-success)' }} />
                  </div>
                  <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{t.listingSuccess}</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{t.listingSuccessDesc}</p>
                  
                  {createdListing && (
                    <div style={{ backgroundColor: 'var(--bg-light)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.2rem', marginBottom: '2rem' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                        {language === 'pl' ? 'Udostępnij tę ofertę bezpośrednio kupującemu:' : 'Share this listing directly with your buyer:'}
                      </p>
                      <button 
                        type="button"
                        className="btn btn-secondary" 
                        style={{ width: '100%', border: '1.5px solid var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        onClick={() => copyShareableLink(createdListing.eventId, createdListing.id)}
                      >
                        <Link2 size={16} />
                        {language === 'pl' ? 'Skopiuj bezpośredni link do oferty' : 'Copy direct link to listing'}
                      </button>
                    </div>
                  )}

                  <button className="btn btn-primary" onClick={() => { setActivePage('home'); loadEvents(); }}>Powrót do strony głównej</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            MY ALEBILET USER DASHBOARD
            ---------------------------------------------------- */}
        {activePage === 'dashboard' && user && (
          <div className="container">
            <div className="dashboard-layout">
              {/* Sidebar */}
              <aside className="dashboard-sidebar">
                <button 
                  className={`dashboard-tab-btn ${dashboardTab === 'bought' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('bought')}
                >
                  <ShoppingBag size={18} />
                  {t.ticketsBought}
                </button>
                <button 
                  className={`dashboard-tab-btn ${dashboardTab === 'sold' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('sold')}
                >
                  <DollarSign size={18} />
                  {t.ticketsSold}
                </button>
                <button 
                  className={`dashboard-tab-btn ${dashboardTab === 'offers' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('offers')}
                >
                  <Ticket size={18} />
                  {t.myOffers}
                </button>
                <button 
                  className={`dashboard-tab-btn ${dashboardTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('settings')}
                >
                  <User size={18} />
                  {t.settings}
                </button>
              </aside>

              {/* Main panel */}
              <section>
                <div className="dashboard-header-block">
                  <h2>Mój Panel Użytkownika</h2>
                </div>

                {/* Profile balance info box */}
                <div className="profile-balance-box" style={{ marginBottom: '2rem' }}>
                  <div>
                    <h4>{t.balance}</h4>
                    <span className="profile-balance-value">{user.balance.toFixed(2)} zł</span>
                  </div>
                  <button className="btn btn-primary" style={{ backgroundColor: '#ffffff', color: 'var(--primary-blue)' }} onClick={() => setShowTopUpModal(true)}>
                    <PlusCircle size={16} />
                    {t.topUp}
                  </button>
                </div>

                {/* Tab: Tickets Bought */}
                {dashboardTab === 'bought' && (
                  <div className="dashboard-card">
                    <h3>{t.ticketsBought}</h3>
                    <div className="table-responsive">
                      {userPurchases.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', padding: '2rem 0', textAlign: 'center' }}>Brak zakupionych biletów.</p>
                      ) : (
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Wydarzenie</th>
                              <th>Miejsce</th>
                              <th>Ilość</th>
                              <th>Cena Razem</th>
                              <th>Bilet</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userPurchases.map(order => (
                              <tr key={order.id}>
                                <td>
                                  <strong>{order.eventTitle}</strong><br />
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.eventCity}, {new Date(order.eventDate).toLocaleDateString()}</span>
                                </td>
                                <td>{order.ticketCategory} (Rząd {order.row}, M. {order.seat})</td>
                                <td>{order.quantity}</td>
                                <td>{order.totalPrice.toFixed(2)} zł</td>
                                <td>
                                  <a 
                                    href={`/api/tickets/download/${order.id}`} 
                                    className="btn btn-secondary" 
                                    style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem', display: 'inline-flex' }}
                                    download
                                  >
                                    <Download size={14} />
                                    {t.downloadTicket}
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab: Tickets Sold */}
                {dashboardTab === 'sold' && (
                  <div className="dashboard-card">
                    <h3>{t.ticketsSold}</h3>
                    <div className="table-responsive">
                      {userSales.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', padding: '2rem 0', textAlign: 'center' }}>Brak sprzedanych biletów.</p>
                      ) : (
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Wydarzenie</th>
                              <th>Ilość</th>
                              <th>Przychód</th>
                              <th>Data</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userSales.map(order => (
                              <tr key={order.id}>
                                <td>
                                  <strong>{order.eventTitle}</strong><br />
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.eventCity}</span>
                                </td>
                                <td>{order.quantity}</td>
                                <td>{(order.quantity * order.pricePerTicket).toFixed(2)} zł</td>
                                <td>{new Date(order.date).toLocaleDateString()}</td>
                                <td><span className="badge badge-paid">Oczekuje na wypłatę</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab: My Offers */}
                {dashboardTab === 'offers' && (
                  <div className="dashboard-card">
                    <h3>{t.myOffers}</h3>
                    <div className="table-responsive">
                      {allListings.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', padding: '2rem 0', textAlign: 'center' }}>Brak aktywnych ofert biletów.</p>
                      ) : (
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Wydarzenie</th>
                              <th>Kategoria / Miejsce</th>
                              <th>Ilość</th>
                              <th>Cena / szt.</th>
                              <th>Akcja</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allListings.map(listing => (
                              <tr key={listing.id}>
                                <td>
                                  <strong>{listing.eventTitle}</strong><br />
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{listing.eventCity}</span>
                                </td>
                                <td>{listing.category} (Rząd {listing.row}, M. {listing.seat})</td>
                                <td>{listing.quantity}</td>
                                <td>{listing.pricePerTicket.toFixed(2)} zł</td>
                                <td>
                                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                                    <button 
                                      className="btn btn-secondary" 
                                      style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem', border: '1.5px solid var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '0.3rem' }} 
                                      onClick={() => copyShareableLink(listing.eventId, listing.id)}
                                    >
                                      <Link2 size={12} />
                                      {language === 'pl' ? 'Kopiuj link' : 'Copy link'}
                                    </button>
                                    <button 
                                      className="btn btn-danger" 
                                      style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }} 
                                      onClick={() => handleDeleteListing(listing.id)}
                                    >
                                      {t.delete}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab: User Settings */}
                {dashboardTab === 'settings' && (
                  <div className="dashboard-card">
                    <h3>{t.settings}</h3>
                    <form onSubmit={handleSaveProfile} style={{ marginTop: '1rem' }}>
                      <div className="form-group">
                        <label>{t.name}</label>
                        <input type="text" className="form-control" value={user.name} disabled />
                      </div>
                      <div className="form-group">
                        <label>{t.email}</label>
                        <input type="text" className="form-control" value={user.email} disabled />
                      </div>
                      <div className="form-group">
                        <label>{t.phone}</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="+48 123 456 789"
                          value={profileForm.phone} 
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>{t.bankAccount} (IBAN)</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="PL00000000000000000000000000"
                          value={profileForm.bankAccount} 
                          onChange={(e) => setProfileForm({ ...profileForm, bankAccount: e.target.value })}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>{t.saveSettings}</button>
                    </form>
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ADMIN CONSOLE VIEW
            ---------------------------------------------------- */}
        {activePage === 'admin' && user && user.role === 'admin' && (
          <div className="container">
            <h2 style={{ marginBottom: '2rem' }}>{t.adminTitle}</h2>

            {/* Admin Stats Grid */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-icon"><Users size={24} /></div>
                <div>
                  <div className="admin-stat-num">{adminStats.totalUsers}</div>
                  <div className="admin-stat-label">{t.totalUsers}</div>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon"><Calendar size={24} /></div>
                <div>
                  <div className="admin-stat-num">{adminStats.totalEvents}</div>
                  <div className="admin-stat-label">Wydarzenia</div>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon"><Ticket size={24} /></div>
                <div>
                  <div className="admin-stat-num">{adminStats.totalListings}</div>
                  <div className="admin-stat-label">{t.activeListings}</div>
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-icon"><TrendingUp size={24} /></div>
                <div>
                  <div className="admin-stat-num">{adminStats.totalVolume.toFixed(2)} zł</div>
                  <div className="admin-stat-label">{t.totalVolume}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
              <div> {/* Left Column Wrapper */}
                {/* Event Creation Form */}
                <div className="dashboard-card">
                  <h3>{t.postEventTitle}</h3>
                  {adminError && (
                    <div style={{ color: 'var(--color-error)', backgroundColor: '#fee2e2', padding: '0.8rem', borderRadius: 'var(--radius-md)', margin: '1rem 0' }}>
                      {adminError}
                    </div>
                  )}
                  <form onSubmit={handleCreateEvent} style={{ marginTop: '1rem' }}>
                    <div className="form-group">
                      <label>{t.eventTitle}</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required
                        placeholder="np. Taylor Swift - Eras Tour"
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Kategoria</label>
                        <select 
                          className="form-control"
                          value={eventForm.category}
                          onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                        >
                          <option value="Concerts">Koncerty</option>
                          <option value="Sports">Sport</option>
                          <option value="Festivals">Festiwale</option>
                          <option value="Theater">Teatr</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>{t.date}</label>
                        <input 
                          type="datetime-local" 
                          className="form-control"
                          required
                          value={eventForm.date}
                          onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label>{t.venueName}</label>
                        <input 
                          type="text" 
                          className="form-control"
                          required
                          placeholder="np. PGE Narodowy"
                          value={eventForm.venue}
                          onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>{t.city}</label>
                        <input 
                          type="text" 
                          className="form-control"
                          required
                          placeholder="np. Warsaw"
                          value={eventForm.city}
                          onChange={(e) => setEventForm({ ...eventForm, city: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>{t.description}</label>
                      <textarea 
                        rows="3" 
                        className="form-control"
                        placeholder="Szczegóły trasy, regulaminu, itp."
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>{t.imageLink}</label>
                      <input 
                        type="text" 
                        className="form-control"
                        placeholder="Link URL do grafiki (pozostaw puste dla domyślnego)"
                        value={eventForm.imageUrl}
                        onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>{t.postEventBtn}</button>
                  </form>
                </div>

                {/* Alternative Payment Settings */}
                <div className="dashboard-card" style={{ marginTop: '1.5rem' }}>
                  <h3>{language === 'pl' ? 'Konfiguracja płatności alternatywnych' : 'Alternative Payment Settings'}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
                    {language === 'pl' 
                      ? 'Dane te będą widoczne dla kupujących jako opcja przelewu bezpośredniego (np. BLIK).' 
                      : 'These details will be displayed to buyers as a direct transfer payment option (e.g. BLIK).'}
                  </p>
                  <form onSubmit={handleSavePaymentSettings}>
                    <div className="form-group">
                      <label>{language === 'pl' ? 'Nazwa (np. Blik / Odbiorca)' : 'Name (e.g. Blik / Recipient)'}</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required 
                        placeholder="e.g. Blik"
                        value={paymentSettingsForm.serviceName}
                        onChange={(e) => setPaymentSettingsForm({ ...paymentSettingsForm, serviceName: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>{language === 'pl' ? 'Numer Blik (Telefon)' : 'Blik (Phone Number)'}</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required 
                        placeholder="e.g. +48 123 456 789"
                        value={paymentSettingsForm.number}
                        onChange={(e) => setPaymentSettingsForm({ ...paymentSettingsForm, number: e.target.value })}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                      {language === 'pl' ? 'Zapisz ustawienia płatności' : 'Save Payment Settings'}
                    </button>
                  </form>
                </div>
              </div> {/* Left Column Wrapper Close */}

              {/* Manage Listings Table */}
              <div className="dashboard-card" style={{ alignSelf: 'start' }}>
                <h3>{t.manageListings}</h3>
                <div className="table-responsive" style={{ maxHeight: '550px', overflowY: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Wydarzenie</th>
                        <th>Cena</th>
                        <th>Seller</th>
                        <th>Status</th>
                        <th>{t.action}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminListings.map(listing => (
                        <tr key={listing.id}>
                          <td>
                            <strong>{listing.eventTitle}</strong><br />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{listing.category}</span>
                          </td>
                          <td>{listing.pricePerTicket.toFixed(2)} zł</td>
                          <td>{listing.sellerName}</td>
                          <td>
                            <span className={`badge ${listing.status === 'active' ? 'badge-active' : 'badge-sold'}`}>
                              {listing.status}
                            </span>
                          </td>
                          <td>
                            {listing.status === 'active' && (
                              <button className="btn btn-danger" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }} onClick={() => handleDeleteListing(listing.id)}>
                                {t.delete}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ----------------------------------------------------
          FOOTER COMPONENT
          ---------------------------------------------------- */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <h4>O nas</h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6' }}>
                AleBilet to wiodąca platforma wtórnego rynku biletów w Polsce. Zapewniamy gwarancję bezpiecznego zakupu oraz łatwą sprzedaż niewykorzystanych biletów.
              </p>
            </div>
            <div>
              <h4>Kategorie</h4>
              <ul className="footer-links">
                <li><a href="#" onClick={() => { setActivePage('home'); setSelectedCategory('Concerts'); }}>Koncerty</a></li>
                <li><a href="#" onClick={() => { setActivePage('home'); setSelectedCategory('Sports'); }}>Sport</a></li>
                <li><a href="#" onClick={() => { setActivePage('home'); setSelectedCategory('Festivals'); }}>Festiwale</a></li>
                <li><a href="#" onClick={() => { setActivePage('home'); setSelectedCategory('Theater'); }}>Teatr</a></li>
              </ul>
            </div>
            <div>
              <h4>Pomoc i Kontakt</h4>
              <p style={{ fontSize: '0.85rem' }}>
                E-mail: pomoc@alebilet.pl<br />
                Infolinia: +48 22 123 45 67<br />
                Pon - Pt: 9:00 - 17:00
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; {new Date().getFullYear()} AleBilet.pl Replica - Stworzone dla demonstracji pair programming.
          </div>
        </div>
      </footer>

      {/* ----------------------------------------------------
          AUTHENTICATION MODAL
          ---------------------------------------------------- */}
      {showAuthModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={() => setShowAuthModal(null)}><X size={20} /></button>
            <h3 className="modal-title">{t.authTitle}</h3>
            {authError && (
              <div style={{ color: 'var(--color-error)', backgroundColor: '#fee2e2', padding: '0.8rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                {authError}
              </div>
            )}
            <form onSubmit={handleAuthSubmit}>
              {showAuthModal === 'register' && (
                <div className="form-group">
                  <label>{t.name}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    required 
                    placeholder="np. Jan Kowalski"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  />
                </div>
              )}
              <div className="form-group">
                <label>{t.email}</label>
                <input 
                  type="email" 
                  className="form-control" 
                  required 
                  placeholder="np. nazwa@domena.pl"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>{t.password}</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="form-control" 
                    style={{ paddingRight: '2.5rem' }}
                    required 
                    placeholder="••••••••"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.8rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {showAuthModal === 'register' && (
                <>
                  <div className="form-group">
                    <label>{t.phone}</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="+48 123 456 789"
                      value={authForm.phone}
                      onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                    />
                  </div>
                </>
              )}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}>
                {showAuthModal === 'login' ? t.signIn : t.register}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
              <span style={{ padding: '0 0.8rem' }}>lub</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
            </div>

            <button 
              type="button" 
              className="btn" 
              style={{ 
                width: '100%', 
                backgroundColor: '#ffffff', 
                color: '#333333', 
                border: '1px solid var(--border-color)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.8rem',
                padding: '0.7rem' 
              }}
              onClick={() => setShowGooglePrompt(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              {t.googleSignIn}
            </button>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
              {showAuthModal === 'login' ? (
                <button className="btn-link" onClick={() => { setShowAuthModal('register'); setAuthError(''); setShowPassword(false); }}>{t.dontHaveAccount}</button>
              ) : (
                <button className="btn-link" onClick={() => { setShowAuthModal('login'); setAuthError(''); setShowPassword(false); }}>{t.alreadyHaveAccount}</button>
              )}
            </div>
            
            {!import.meta.env.PROD && (
              <div style={{ marginTop: '1rem', padding: '0.8rem', backgroundColor: '#f8f9fa', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <strong>Konta demonstracyjne:</strong><br />
                • Admin: <code>admin@alebilet.pl</code> / <code>admin123</code><br />
                • Seller: <code>seller@alebilet.pl</code> / <code>seller123</code><br />
                • Buyer: <code>buyer@alebilet.pl</code> / <code>buyer123</code>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          SIMULATED GOOGLE ACCOUNT CHOOSER
          ---------------------------------------------------- */}
      {showGooglePrompt && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px', borderTop: '4px solid #4285F4' }}>
            <button className="modal-close-btn" onClick={() => setShowGooglePrompt(false)}><X size={20} /></button>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              {/* Google G Logo SVG */}
              <svg width="32" height="32" viewBox="0 0 24 24" style={{ margin: '0 auto 0.5rem' }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)' }}>
                {language === 'pl' ? 'Zaloguj się przez Google' : 'Sign in with Google'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {language === 'pl' 
                  ? 'Wybierz konto, aby przejść do aplikacji AleBilet' 
                  : 'Choose an account to continue to AleBilet'}
              </p>
            </div>

            {/* List of Mock Google Accounts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <div 
                className="listing-card" 
                style={{ cursor: 'pointer', padding: '0.8rem 1rem' }} 
                onClick={() => handleGoogleSignInClick('tomasz.zielinski@gmail.com', 'Tomasz Zieliński')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-full)', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>TZ</div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', margin: 0 }}>Tomasz Zieliński</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>tomasz.zielinski@gmail.com</span>
                  </div>
                </div>
              </div>

              <div 
                className="listing-card" 
                style={{ cursor: 'pointer', padding: '0.8rem 1rem' }} 
                onClick={() => handleGoogleSignInClick('marta.wisniewska@gmail.com', 'Marta Wiśniewska')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-full)', backgroundColor: '#ec4899', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>MW</div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', margin: 0 }}>Marta Wiśniewska</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>marta.wisniewska@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form for custom mock Google user */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.2rem' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.8rem', color: 'var(--text-muted)' }}>
                {language === 'pl' ? 'Użyj innego konta Google' : 'Use another Google account'}
              </h4>
              <div className="form-group">
                <label>{t.name}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="np. Robert Lewandowski"
                  value={googleCustomUser.name}
                  onChange={(e) => setGoogleCustomUser({ ...googleCustomUser, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>{t.email}</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="np. lewy@gmail.com"
                  value={googleCustomUser.email}
                  onChange={(e) => setGoogleCustomUser({ ...googleCustomUser, email: e.target.value })}
                />
              </div>
              <button 
                type="button" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '0.6rem' }}
                disabled={!googleCustomUser.name || !googleCustomUser.email}
                onClick={() => handleGoogleSignInClick(googleCustomUser.email, googleCustomUser.name)}
              >
                {language === 'pl' ? 'Zaloguj jako inne konto' : 'Sign in as other account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          CHECKOUT MODAL
          ---------------------------------------------------- */}
      {checkoutListing && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <button className="modal-close-btn" onClick={() => setCheckoutListing(null)}><X size={20} /></button>
            <h3 className="modal-title">{t.checkoutTitle}</h3>

            {checkoutError && (
              <div style={{ color: 'var(--color-error)', backgroundColor: '#fee2e2', padding: '0.8rem', borderRadius: 'var(--radius-md)', marginBottom: '1.2rem', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
                <AlertTriangle size={20} />
                <span>{checkoutError}</span>
              </div>
            )}

            {checkoutStep === 'form' && (
              <form onSubmit={handleCheckoutSubmit} className="checkout-grid">
                {/* Summary box */}
                <div className="checkout-summary-box">
                  <h4 style={{ color: 'var(--dark-blue-text)', marginBottom: '0.5rem' }}>{currentEvent.title}</h4>
                  <div className="checkout-price-row">
                    <span>{checkoutListing.category} (x{checkoutForm.quantity})</span>
                    <span>{(checkoutListing.pricePerTicket * checkoutForm.quantity).toFixed(2)} zł</span>
                  </div>
                  <div className="checkout-price-row">
                    <span>{t.serviceFee}</span>
                    <span>{(checkoutListing.pricePerTicket * checkoutForm.quantity * 0.03).toFixed(2)} zł</span>
                  </div>
                  <div className="checkout-price-row total">
                    <span>{t.totalPrice}</span>
                    <span>{(checkoutListing.pricePerTicket * checkoutForm.quantity * 1.03).toFixed(2)} zł</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>{t.quantity}</label>
                  <select 
                    className="form-control"
                    value={checkoutForm.quantity}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, quantity: parseInt(e.target.value) })}
                  >
                    {[...Array(checkoutListing.quantity).keys()].map(i => (
                      <option key={i+1} value={i+1}>{i+1}</option>
                    ))}
                  </select>
                </div>

                {/* Delivery Info */}
                <div>
                  <h4 style={{ marginBottom: '0.8rem', color: 'var(--dark-blue-text)' }}>{t.deliveryInfo}</h4>
                  <div className="form-group">
                    <label>{t.email}</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      required
                      value={checkoutForm.email}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t.phone}</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required
                      value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Payment selection */}
                <div>
                  <h4 style={{ marginBottom: '0.8rem', color: 'var(--dark-blue-text)' }}>{t.paymentMethod}</h4>
                  <div className="payment-methods-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
                    <div 
                      className={`payment-method-card ${checkoutForm.paymentMethod === 'blik' ? 'active' : ''}`}
                      onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'blik' })}
                    >
                      <span style={{ display: 'block', color: '#dd3a92', fontWeight: 800, fontSize: '1.2rem', fontStyle: 'italic' }}>blik</span>
                      Płatność BLIK
                    </div>
                    <div 
                      className={`payment-method-card ${checkoutForm.paymentMethod === 'card' ? 'active' : ''}`}
                      onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'card' })}
                    >
                      <span style={{ display: 'block', fontSize: '1.1rem' }}>💳</span>
                      Karta płatnicza
                    </div>
                    <div 
                      className={`payment-method-card ${checkoutForm.paymentMethod === 'alternative' ? 'active' : ''}`}
                      onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'alternative' })}
                    >
                      <span style={{ display: 'block', fontSize: '1.1rem' }}>💸</span>
                      {language === 'pl' ? 'Przelew bezpośredni' : 'Direct Transfer'}
                    </div>
                  </div>

                  {checkoutForm.paymentMethod === 'blik' && (
                    <div className="blik-input-wrapper">
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t.blikCodeLabel}</label>
                      <div className="blik-code-inputs">
                        <input 
                          type="text" 
                          className="blik-code-field" 
                          maxLength="6"
                          placeholder="000000"
                          value={checkoutForm.blikCode}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, blikCode: e.target.value })}
                          style={{ width: '150px' }}
                        />
                      </div>
                    </div>
                  )}

                  {checkoutForm.paymentMethod === 'card' && (
                    <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-light)' }}>
                      <div className="form-group">
                        <label>Numer karty</label>
                        <input type="text" className="form-control" placeholder="0000 0000 0000 0000" disabled value="4000 1234 5678 9010 (Demo)" />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label>Data ważności</label>
                          <input type="text" className="form-control" placeholder="MM/YY" disabled value="12/29" />
                        </div>
                        <div className="form-group">
                          <label>CVC</label>
                          <input type="password" className="form-control" placeholder="CVV" disabled value="123" />
                        </div>
                      </div>
                    </div>
                  )}

                  {checkoutForm.paymentMethod === 'alternative' && paymentSettings && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.2rem' }}>
                      <div style={{
                        backgroundColor: '#0f172a',
                        color: '#e2e8f0',
                        padding: '1.2rem',
                        borderRadius: 'var(--radius-md)',
                        borderLeft: '4px solid var(--primary-blue)',
                        fontSize: '0.85rem',
                        fontFamily: 'monospace',
                        textAlign: 'left'
                      }}>
                        <strong style={{ color: '#ffffff', display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', fontFamily: 'var(--font-heading)' }}>
                          {language === 'pl' ? 'Instrukcja Płatności' : 'Payment Instructions'}
                        </strong>
                        <p style={{ marginBottom: '0.8rem', color: '#94a3b8', fontFamily: 'var(--font-body)' }}>
                          {language === 'pl' 
                            ? '1. Dokonaj bezpośredniego przelewu na poniższe dane:' 
                            : '1. Make direct transfer to the merchant details below:'}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.8rem', borderLeft: '2px solid #334155', paddingLeft: '0.8rem' }}>
                          <div><strong>Name:</strong> {paymentSettings.serviceName}</div>
                          <div><strong>Blik:</strong> {paymentSettings.number}</div>
                          <div><strong>Account Ref:</strong> {alternativeRefCode}</div>
                        </div>
                        <div style={{ color: 'var(--color-success)', fontWeight: 'bold', fontFamily: 'var(--font-body)' }}>
                          💰 {language === 'pl' ? 'Kwota do zapłaty:' : 'Amount due:'} {(checkoutListing.pricePerTicket * checkoutForm.quantity * 1.03).toFixed(2)} zł
                        </div>
                      </div>

                      {/* Receipt upload box */}
                      <div 
                        style={{
                          border: '2px dashed var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1.2rem',
                          textAlign: 'center',
                          backgroundColor: 'var(--bg-light)',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          setReceiptUploaded(true);
                          setReceiptFileName(`receipt_${alternativeRefCode.split('-')[1]}.pdf`);
                        }}
                      >
                        {!receiptUploaded ? (
                          <div>
                            <span style={{ display: 'block', fontSize: '1.8rem', marginBottom: '0.4rem' }}>📄</span>
                            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--dark-blue-text)' }}>
                              {language === 'pl' ? 'Wyślij potwierdzenie przelewu' : 'Upload payment receipt'}
                            </span>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                              {language === 'pl' ? 'Kliknij, aby załączyć plik PDF lub zdjęcie' : 'Click to attach PDF or image receipt'}
                            </p>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--color-success)' }}>
                            <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                              {language === 'pl' ? 'Załączono:' : 'Attached:'} {receiptFileName}
                            </span>
                            <button 
                              type="button" 
                              style={{ border: 'none', background: 'none', color: 'var(--color-error)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline', marginLeft: '0.5rem' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setReceiptUploaded(false);
                                setReceiptFileName('');
                              }}
                            >
                              {language === 'pl' ? 'Usuń' : 'Remove'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="btn btn-tertiary" style={{ flex: 1 }} onClick={() => setCheckoutListing(null)}>Anuluj</button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ flex: 2 }}
                    disabled={checkoutForm.paymentMethod === 'alternative' && !receiptUploaded}
                  >
                    {checkoutForm.paymentMethod === 'alternative' 
                      ? (language === 'pl' ? 'Potwierdź wpłatę i zamów' : 'Mark as Paid & Confirm')
                      : t.payAndOrder}
                  </button>
                </div>
              </form>
            )}

            {checkoutStep === 'processing' && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <img src="https://images.squarespace-cdn.com/content/v1/55b3eb25e4b0c266014e7a78/1560938475253-1Q2S96M881UX2V50005C/BLIK.png" alt="BLIK Logo" className="blik-logo" style={{ height: '32px' }} />
                <h4 style={{ fontSize: '1.2rem', marginTop: '1rem' }}>Autoryzuj płatność w aplikacji bankowej...</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Kod BLIK: <strong>{checkoutForm.blikCode}</strong></p>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginTop: '1.5rem' }}>
                  <div style={{ width: `${blikProgress}%`, height: '100%', backgroundColor: 'var(--accent-pink)', transition: 'width 0.3s ease' }}></div>
                </div>
              </div>
            )}

            {checkoutStep === 'success' && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-full)', backgroundColor: '#d1fae5', display: 'flex', alignItems: 'center', justifycontent: 'center', margin: '0 auto 1.5rem' }}>
                  <CheckCircle size={36} style={{ color: 'var(--color-success)' }} />
                </div>
                <h3>{t.purchaseSuccess}</h3>
                <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 2rem' }}>{t.purchaseSuccessDesc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => {
                      setCheckoutListing(null);
                      navigateToDashboard();
                      setDashboardTab('bought');
                    }}
                  >
                    Idź do moich biletów
                  </button>
                  <button className="btn btn-tertiary" onClick={() => setCheckoutListing(null)}>Zamknij</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TOP UP FUNDS MODAL
          ---------------------------------------------------- */}
      {showTopUpModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <button className="modal-close-btn" onClick={() => setShowTopUpModal(false)}><X size={20} /></button>
            <h3 className="modal-title">{t.addFundsTitle}</h3>
            <form onSubmit={handleTopUp}>
              <div className="form-group">
                <label>{t.amountPLN}</label>
                <input 
                  type="number" 
                  className="form-control" 
                  required 
                  min="1"
                  placeholder="np. 200"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                />
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Zasilenie jest całkowicie wirtualne i służy do przetestowania pełnej ścieżki zakupu biletów.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn btn-tertiary" style={{ flex: 1 }} onClick={() => setShowTopUpModal(false)}>Anuluj</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Zasil konto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#1e293b',
          color: '#ffffff',
          padding: '0.8rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 2000,
          animation: 'slideUp var(--transition-normal)'
        }}>
          <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
