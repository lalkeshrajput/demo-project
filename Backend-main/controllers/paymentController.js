import Payment from '../models/payment.js';
import jwt from 'jsonwebtoken';

export const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('rental');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
