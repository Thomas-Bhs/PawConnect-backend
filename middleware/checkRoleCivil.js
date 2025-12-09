
const User = require('../models/users');

function checkRoleCivil(req, res, next) {
  const userId = req.params.userId; // ou req.body.userId 

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.json({ result: false, error: "Utilisateur non trouvé" });
      }

      if (user.role !== 'civil') {
        return res.json({ result: false, error: "Accès réservé aux civils" });
      }

      // Tout est ok, on continue vers la route
      next();
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ result: false, error: 'Erreur serveur' });
    });
}

module.exports = checkRoleCivil;
