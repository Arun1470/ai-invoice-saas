import Client from "../models/Client.js";

export const getClients = async (req, res) => {
  try {
    const clients = await Client.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, clients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getClient = async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, userId: req.userId });
    if (!client) return res.status(404).json({ success: false, message: "Client not found" });
    res.json({ success: true, client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createClient = async (req, res) => {
  try {
    const client = await Client.create({ ...req.body, userId: req.userId });
    res.status(201).json({ success: true, client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!client) return res.status(404).json({ success: false, message: "Client not found" });
    res.json({ success: true, client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!client) return res.status(404).json({ success: false, message: "Client not found" });
    res.json({ success: true, message: "Client deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
