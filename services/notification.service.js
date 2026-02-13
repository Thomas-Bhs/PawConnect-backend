const notificationRepo = require('../repositories/notification.repo');
const { assertValidObjectId, assertUserExists } = require('../utils/validators');
const { AppError } = require('../errors/AppError');

async function notifyUsers({ recipients, type, message, reportId }) {
  // Keep payload construction centralized so all notification types stay consistent.
  const notifications = recipients.map(userId => ({
    recipient: userId,
    type,
    message,
    relatedReport: reportId,
    read: false,
  }));

  await notificationRepo.saveNewNotifications(notifications);
}

async function getNewUserNotifications(userId) {
  await assertUserExists(userId);

  const notifications = await notificationRepo.getNewUserNotifications(userId);
  return notifications;
}

async function markNotificationAsRead(userId, notificationId) {
  await assertUserExists(userId);
  assertValidObjectId(notificationId, 'Invalid notification ID');

  const result = await notificationRepo.markNotificationAsRead(userId, notificationId);
  if (!result) {
    throw new AppError('NOT_FOUND', 'Notification not found');
  }
}

async function markAllUserNotificationsAsRead(userId) {
  await assertUserExists(userId);
  await notificationRepo.markAllUserNotificationsAsRead(userId);
}

// async function deleteReadNotifications() {
//   // delete notifications if time is passed by one day
// }

module.exports = {
  notifyUsers,
  getNewUserNotifications,
  markNotificationAsRead,
  markAllUserNotificationsAsRead,
};
