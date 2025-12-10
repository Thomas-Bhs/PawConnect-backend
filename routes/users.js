var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

/* ---ADD Security - max 10 request by ID each 15 min --- 

const rateLimit = require('express-rate-limit');
const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { result: false, error: 'Too many signup attempts, please try again later.' }
});
*/

router.post('/signup', (req, res) => {
  const { lastName, firstName, email, password, role, establishmentRef } = req.body;

  console.log("BODY REÇU :", req.body);
  console.log("establishmentRef =", establishmentRef);

  if (!checkBody(req.body, ['lastName', 'firstName', 'email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Check the length of password
  if (password.length < 6) {
    return res.json({ result: false, error: 'Password must be at least 6 characters' });
  }

  // Check if the user has not already been registered by this email
  User.findOne({ email: req.body.email }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        lastName,
        firstName,
        email,
        password: hash,
        token: uid2(32),
        createdAt: Date.now(),
        role: role || 'civil',
        establishmentRef: establishmentRef || null,
      });

      newUser.save().then((savedUser) => {
        res.json({ 
          result: true, 
          user: {
            id: savedUser._id,
            firstName: savedUser.firstName,
            role: savedUser.role,
            token: savedUser.token,
          },
        });
      });
    } else {
      res.json({ result: false, error: 'This Email is already used by an User' });
    }
  });
});

module.exports = router;
