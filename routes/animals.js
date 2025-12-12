var express = require('express');
var router = express.Router();

const Animal = require('../models/animals');

router.get('/', (req, res) => {
  Animal.find().then((data) => {
    res.json({ result: true, data });
  });
});

router.patch('/:id/status', (req, res) => {});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { status, description, userId } = req.body;

  console.log('REQ BODY =>', req.body);
  console.log('USERID RECU =>', userId);

  const historyEntry = {
    date: new Date(),
    status,
    description,
    action: 'status_update',
    handler: userId,
  };

  Animal.findByIdAndUpdate(
    id,
    {
      $set: { status },
      $push: { history: historyEntry },
    },
    { new: true }
  ).then((updatedAnimal) => {
    if (!updatedAnimal) {
      return res.json({ result: false, message: 'Signalement introuvable' });
    }
    res.json({ result: true, data: updatedAnimal });
  });
});

module.exports = router;
