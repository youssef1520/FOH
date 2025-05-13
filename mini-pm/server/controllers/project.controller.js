import Project     from '../models/Project.js';
import ActivityLog from '../models/ActivityLog.js';

export async function create(req, res, next) {
  try {
    const p = await Project.create(req.body);
    await ActivityLog.create({
      action: `Created project "${p.name}"`,
      user:   req.user._id,
      metadata: { projectId: p._id }
    });
    res.status(201).json(p);
  } catch (err) {
    next(err);
  }
}

export async function findAll(req, res, next) {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

export async function findOne(req, res, next) {
  try {
    const p = await Project.findById(req.params.id);
    if (!p) return res.sendStatus(404);
    res.json(p);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const p = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!p) return res.sendStatus(404);
    await ActivityLog.create({
      action: `Updated project "${p.name}"`,
      user:   req.user._id,
      metadata: { projectId: p._id }
    });
    res.json(p);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const p = await Project.findByIdAndDelete(req.params.id);
    if (!p) return res.sendStatus(404);
    await ActivityLog.create({
      action: `Deleted project "${p.name}"`,
      user:   req.user._id,
      metadata: { projectId: p._id }
    });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}