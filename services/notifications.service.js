const Notification = require('../models/Notification.model');

const notifyUsers = async ({ recipients, type, message, reportId }) => {
  // Envoi de notifications aux utilisateurs

  const notifications = recipients.map(userId => ({
    recipient: userId,
    type,
    message,
    relatedReport: reportId,
    read: false,
  }));

  await Notification.insertMany(notifications);
};

module.exports = { notifyUsers };
