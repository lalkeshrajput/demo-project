import ReturnRequest from '../models/returnrequest.js';

export const requestReturn = async (req, res) => {
  const { order_id, reason } = req.body;
  const request = await ReturnRequest.create({ order_id, reason });
  res.status(201).json(request);
};

export const getReturnRequests = async (req, res) => {
  const returns = await ReturnRequest.find().populate('order_id');
  res.json(returns);
};
