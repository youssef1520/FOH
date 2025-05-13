import ActivityLog from '../models/ActivityLog.js';

export async function list(req, res, next) {
  try {
    const logs = await ActivityLog
      .find()
      .populate('user', 'name role')
      .sort('-createdAt');
    res.json(logs);
  } catch (err) {
    next(err);
  }
}