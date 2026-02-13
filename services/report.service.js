const Establishment = require('../models/Establishment.model');
const { getDistanceBetweenTwoPoints } = require('../utils/getDistanceBetweenTwoPoints');
const { AppError } = require('../errors/AppError');

const getRecipientsForNewReport = async report => {
  // 35km is the product rule for "nearby" establishments.
  if (!report?.location?.lat || !report?.location?.long) {
    throw new AppError('INVALID_INPUT', 'Report location is missing');
  }

  const establishments = await Establishment.find().select('location agents');

  const agentsToNotify = [];
  for (const establishment of establishments) {
    const distance = getDistanceBetweenTwoPoints(
      { latitude: establishment.location.lat, longitude: establishment.location.long },
      { latitude: report.location.lat, longitude: report.location.long },
    );
    if (distance !== null && distance < 35) {
      agentsToNotify.push(...establishment.agents);
    }
  }
  // Same agent can appear through multiple establishments; dedupe before insertMany.
  const uniqueAgentIds = [...new Set(agentsToNotify.map(agent => agent.toString()))];
  return uniqueAgentIds;
};

module.exports = { getRecipientsForNewReport };
