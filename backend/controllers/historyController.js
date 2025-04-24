const History = require('../models/History');
const classify = require('../../nlp/classifier');

exports.create = async (req, res) => {
  try {
    const category = classify(req.body.title || '');
    const history = await History.create({ ...req.body, category });
    res.status(201).json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const histories = await History.findAll();
    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};