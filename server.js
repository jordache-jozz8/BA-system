import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// In-memory demo data
let reservations = [
  {
    id: 1,
    customer: 'John Smith',
    activity: 'Kayak Tour',
    date: '2024-01-15',
    time: '10:00 AM',
    status: 'confirmed',
    guide: 'Harry Weaver',
  },
  {
    id: 2,
    customer: 'Sarah Johnson',
    activity: 'Jet Ski Rental',
    date: '2024-01-16',
    time: '2:00 PM',
    status: 'pending',
    guide: 'Shawn Weaver',
  },
  {
    id: 3,
    customer: 'Mike Davis',
    activity: 'Fishing Charter',
    date: '2024-01-17',
    time: '6:00 AM',
    status: 'confirmed',
    guide: 'Harry Weaver',
  },
];

let customers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@email.com',
    phone: '555-0123',
    totalBookings: 5,
    lastVisit: '2024-01-10',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@email.com',
    phone: '555-0456',
    totalBookings: 2,
    lastVisit: '2024-01-12',
  },
  {
    id: 3,
    name: 'Mike Davis',
    email: 'mike@email.com',
    phone: '555-0789',
    totalBookings: 8,
    lastVisit: '2024-01-14',
  },
];

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Reservation endpoints
app.get('/api/reservations', (_req, res) => {
  res.json(reservations);
});

app.post('/api/reservations', (req, res) => {
  const { customer, activity, date, time, guide, notes } = req.body;

  if (!customer || !activity || !date || !time || !guide) {
    return res.status(400).json({ message: 'Missing required reservation fields.' });
  }

  const newReservation = {
    id: reservations.length ? Math.max(...reservations.map((r) => r.id)) + 1 : 1,
    customer,
    activity,
    date,
    time,
    guide,
    notes: notes || '',
    status: 'pending',
  };

  reservations.push(newReservation);
  res.status(201).json(newReservation);
});

app.put('/api/reservations/:id', (req, res) => {
  const { id } = req.params;
  const reservationIndex = reservations.findIndex((r) => r.id === Number(id));

  if (reservationIndex === -1) {
    return res.status(404).json({ message: `Reservation ${id} not found.` });
  }

  const updatedReservation = {
    ...reservations[reservationIndex],
    ...req.body,
    id: reservations[reservationIndex].id,
  };

  reservations[reservationIndex] = updatedReservation;
  res.json(updatedReservation);
});

app.delete('/api/reservations/:id', (req, res) => {
  const { id } = req.params;
  const reservationIndex = reservations.findIndex((r) => r.id === Number(id));

  if (reservationIndex === -1) {
    return res.status(404).json({ message: `Reservation ${id} not found.` });
  }

  const [deleted] = reservations.splice(reservationIndex, 1);
  res.json(deleted);
});

// Customer endpoints
app.get('/api/customers', (_req, res) => {
  res.json(customers);
});

app.post('/api/customers', (req, res) => {
  const { name, email, phone, address } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Missing required customer fields.' });
  }

  const newCustomer = {
    id: customers.length ? Math.max(...customers.map((c) => c.id)) + 1 : 1,
    name,
    email,
    phone,
    address: address || '',
    totalBookings: 0,
    lastVisit: new Date().toISOString().split('T')[0],
  };

  customers.push(newCustomer);
  res.status(201).json(newCustomer);
});

app.put('/api/customers/:id', (req, res) => {
  const { id } = req.params;
  const customerIndex = customers.findIndex((c) => c.id === Number(id));

  if (customerIndex === -1) {
    return res.status(404).json({ message: `Customer ${id} not found.` });
  }

  const updatedCustomer = {
    ...customers[customerIndex],
    ...req.body,
    id: customers[customerIndex].id,
  };

  customers[customerIndex] = updatedCustomer;
  res.json(updatedCustomer);
});

// Analytics endpoint
app.get('/api/analytics', (_req, res) => {
  const totalReservations = reservations.length;
  const activeCustomers = customers.length;
  const totalRevenue = totalReservations * 150; // mock average ticket value
  const confirmedCount = reservations.filter((r) => r.status === 'confirmed').length;
  const occupancyRate = totalReservations ? Math.round((confirmedCount / totalReservations) * 100) : 0;

  res.json({ totalReservations, totalRevenue, activeCustomers, occupancyRate });
});

// Simple auth simulation endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  res.json({
    message: 'Login successful',
    user: { id: 1, name: 'Demo User', email },
    token: 'demo-token',
  });
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  res.status(201).json({
    message: 'Account created successfully',
    user: { id: 1, name, email },
    token: 'demo-token',
  });
});

// Serve static assets if needed (public folder)
app.use(express.static(path.join(__dirname, 'public')));

// Serve existing HTML at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Untitled-1.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



