exports.getStats = async (req, res) => {
  try {
    const totalTime = await History.sum('duration');
    const categories = await History.findAll({
      attributes: [
        'category',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: 'category'
    });
    
    res.json({
      totalTime: Math.floor(totalTime / 60), // В минутах
      categories: categories.map(cat => ({
        name: cat.category,
        count: cat.get('count')
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};