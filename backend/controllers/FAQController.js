const FAQ = require("../models/FAQModel");

const createFAQ = async (req, res) => {
  try {
    const newFAQ = new FAQ(req.body);
    const savedFAQ = await newFAQ.save();
    res.status(201).json(savedFAQ);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const updateFAQ = async (req, res) => {
  try {
    const updatedFAQ = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedFAQ) {
      return res.status(404).json({message: "FAQ not found"});
    }
    res.status(200).json(updatedFAQ);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const deleteFAQ = async (req, res) => {
  try {
    const deletedFAQ = await FAQ.findByIdAndDelete(req.params.id);
    if (!deletedFAQ) {
      return res.status(404).json({message: "FAQ not found"});
    }
    res.status(200).json(deletedFAQ);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const getAllFAQS = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const getFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({message: "FAQ not found"});
    }
    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

module.exports = {
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getAllFAQS,
  getFAQ,
};
