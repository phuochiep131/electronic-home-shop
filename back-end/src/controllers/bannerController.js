const Banner = require('../models/Banner');

// Get all banners (for admin)
const getAll = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, created_at: -1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get active banners (for frontend)
const getActive = async (req, res) => {
  try {
    const banners = await Banner.find({ is_active: true }).sort({ order: 1, created_at: -1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new banner
const create = async (req, res) => {
  try {
    const newBanner = new Banner(req.body);
    const savedBanner = await newBanner.save();
    res.status(201).json(savedBanner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update banner
const update = async (req, res) => {
  try {
    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedBanner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete banner
const remove = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Banner has been deleted..." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getActive,
  create,
  update,
  remove
};