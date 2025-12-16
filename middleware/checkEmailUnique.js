const User = require('../models/users');

module.exports = (req, res, next) => {
  const { email, token } = req.body;

  // Pas d’email, pas de vérification
  if (!email) {
    return next();
  }

  User.findOne({ token }).then(user => {
    if (!user) {
      return res.status(404).json({
        result: false,
        error: 'Utilisateur non trouvé',
      });
    }

    // Email inchangé
    if (email === user.email) {
      return next();
    }

    // Vérifier unicité de l'email
    User.findOne({ email }).then(existingUser => {
      if (existingUser) {
        return res.status(409).json({
          result: false,
          error: 'Cet email est déjà utilisé',
        });
      }

      next();
    });
  });
};
