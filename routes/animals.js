var express = require('express');
var router = express.Router();

const Animal = require('../models/animals');

router.get('/', (req, res) => {
  Animal.find().then((data) => {
    res.json({ data });
  });
});

module.exports = router;
