import express from 'express';
import bodyParser from 'body-parser';
import { authorizationMiddleware } from './middlewares.js';
import { ORDERS } from './db.js';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(authorizationMiddleware);

// API for returning last 5 unique address for "from" point
app.get('/address/from/last-5', (req, res) => {
  const userToken = req.headers.authorization;
  const userOrders = ORDERS.filter(order => order.login === userToken);

  if (userOrders.length === 0) {
    return res.status(400).json({ message: `User was not found by token: ${userToken}` });
  }

  const fromAddresses = [...new Set(userOrders.map(order => order.from))];
  const last5UniqueAddresses = fromAddresses.slice(-5).reverse();

  res.json(last5UniqueAddresses);
});

// API for returning last 3 unique address for "to" point
app.get('/address/to/last-3', (req, res) => {
  const userToken = req.headers.authorization;
  const userOrders = ORDERS.filter(order => order.login === userToken);

  if (userOrders.length === 0) {
    return res.status(400).json({ message: `User was not found by token: ${userToken}` });
  }

  const toAddresses = [...new Set(userOrders.map(order => order.to))];
  const last3UniqueAddresses = toAddresses.slice(-3).reverse();

  res.json(last3UniqueAddresses);
});

// API for creating orders
app.post('/orders', (req, res) => {
  const userToken = req.headers.authorization;
  const { from, to } = req.body;
  const price = Math.floor(Math.random() * (100 - 20 + 1)) + 20;

  ORDERS.push({ from, to, login: userToken, price });

  res.json({ message: 'Order was created', order: { login: userToken, from, to, price } });
});

// API for getting lowest order by price
app.get('/orders/lowest', (req, res) => {
  const userToken = req.headers.authorization;
  const userOrders = ORDERS.filter(order => order.login === userToken);

  if (userOrders.length === 0) {
    return res.status(400).json({ message: `User was not found by token: ${userToken}` });
  }

  const lowestOrder = userOrders.reduce((prev, current) => (prev.price < current.price) ? prev : current);

  res.json(lowestOrder);
});

// API for getting biggest order by price
app.get('/orders/biggest', (req, res) => {
  const userToken = req.headers.authorization;
  const userOrders = ORDERS.filter(order => order.login === userToken);

  if (userOrders.length === 0) {
    return res.status(400).json({ message: `User was not found by token: ${userToken}` });
  }

  const biggestOrder = userOrders.reduce((prev, current) => (prev.price > current.price) ? prev : current);

  res.json(biggestOrder);
});

// Start the server
app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
