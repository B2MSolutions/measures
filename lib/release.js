var release = { };

release.versions = function(done) {
  var data = [
    { version: 1, date: Date.now() },
    { version: 2, date: Date.now() },
    { version: 3, date: Date.now() }
  ];

  done(null, data);
};

module.exports = release;