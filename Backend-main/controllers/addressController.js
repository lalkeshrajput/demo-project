import Address from '../models/address.js';

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createAddress = async (req, res) => {
  try {
    const addressData = { ...req.body, userId: req.user.id };

    if (req.body.isDefault) {
      await Address.updateMany({ userId: req.user.id }, { $set: { isDefault: false } });
    }

    const address = new Address(addressData);
    await address.save();
    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.isDefault) {
      await Address.updateMany({ userId: req.user.id }, { $set: { isDefault: false } });
    }

    const updated = await Address.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Address not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Address.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!deleted) return res.status(404).json({ error: 'Address not found' });

    res.json({ message: 'Address deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
