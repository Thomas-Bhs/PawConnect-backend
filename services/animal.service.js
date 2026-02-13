const animalRepo = require('../repositories/animal.repo');
const userRepo = require('../repositories/user.repo');
const notificationService = require('../services/notification.service');
const { setPriority } = require('../utils/setPriority');
const { getRecipientsForNewReport } = require('./report.service');
const { assertValidObjectId, assertUserExists } = require('../utils/validators');
const { AppError } = require('../errors/AppError');

async function newReport(userId, userRole, title, desc, location, state, animalType) {
  await assertUserExists(userId);

  if (userRole === 'agent') {
    throw new AppError('FORBIDDEN', 'Agents cannot create reports');
  }

  const priority = setPriority(state);
  const newAnimal = {
    location,
    date: new Date(),
    animalType,
    title,
    desc,
    state,
    priority,
    photoUrl: null,
    status: 'nouveau',
    reporter: userId,
    history: [],
  };
  const result = await animalRepo.newReport(newAnimal);
  if (!result) {
    throw new AppError('SERVER_ERROR', 'Failed to create report');
  }
  try {
    const agentsToNotify = await getRecipientsForNewReport(result);
    await notificationService.notifyUsers({
      recipients: agentsToNotify,
      type: 'NEW_REPORT',
      message: 'Un nouveau signalement a été effectué à proximité de votre établissement.',
      reportId: result._id,
    });
  } catch (err) {
    // Report creation must succeed even if notification delivery fails.
    console.error('Failed to send notifications for new report:', err);
  }

  // Caller needs the id to attach a photo in a separate request.
  return result._id;
}

async function addPhotoUrlToReport(userId, reportId, photoUrl) {
  assertValidObjectId(userId, 'Invalid user ID');
  assertValidObjectId(reportId, 'Invalid report ID');

  const isUserValid = await animalRepo.isReporterValid(userId, reportId);
  if (!isUserValid) {
    throw new AppError('FORBIDDEN', 'Not the reporter of this animal');
  }

  const result = await animalRepo.patchReportWithPhoto(reportId, photoUrl);
  if (!result) {
    throw new AppError('SERVER_ERROR', 'Failed to update report photo');
  }

  return result;
}

async function updateHistory(reportId, status, action, handler) {
  assertValidObjectId(reportId, 'Invalid report ID');
  assertValidObjectId(handler.userId, 'Invalid user ID');

  if (handler.role !== 'agent') {
    throw new AppError('FORBIDDEN', 'Only agents can update report history');
  }

  assertValidObjectId(handler.establishmentId, 'Invalid establishment ID');

  const handlerDetails = await userRepo.findUserById(handler.userId);
  if (!handlerDetails) {
    throw new AppError('NOT_FOUND', 'Handler not found');
  }

  if (String(handlerDetails.establishment) !== String(handler.establishmentId)) {
    throw new AppError('FORBIDDEN', 'Handler establishment mismatch');
  }

  const payload = {
    date: new Date(),
    status,
    action,
    handler: handler.userId,
  };

  const result = await animalRepo.updateHistory(reportId, status, handler, payload);
  if (!result) {
    throw new AppError('SERVER_ERROR', 'Failed to update report history');
  }

  try {
    await notificationService.notifyUsers({
      recipients: [result.reporter],
      type: 'REPORT_UPDATE',
      message: `Le statut de votre signalement "${result.title}" a été mis à jour : ${status}.`,
      reportId: result._id,
    });
  } catch (err) {
    // History update remains the source of truth; notifications are best effort.
    console.error('Failed to send notification for report update:', err);
  }

  return result;
}

async function getUserReports(userId, role, establishmentId) {
  if (role === 'civil') {
    const result = await animalRepo.getCivilianReports(userId);
    return result;
  } else if (role === 'agent') {
    const result = await animalRepo.getAgentReports(establishmentId);
    return result;
  }
}

module.exports = { getUserReports, newReport, addPhotoUrlToReport, updateHistory };
