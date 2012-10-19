index = {};

index.get = function(req, res) {
  res.render('index', { title: 'Hornet Measures' });
};

module.exports = index;