import Task        from '../models/Task.js';
import ActivityLog from '../models/ActivityLog.js';

/**
 * POST /api/tasks
 * Admin only
 */
export async function create(req, res, next) {
  try {
    const t = await Task.create(req.body);
    await ActivityLog.create({
      action: `Assigned task "${t.title}"`,
      user:   req.user._id,
      metadata: { taskId: t._id }
    });
    res.status(201).json(t);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/tasks
 * Admin sees all, member sees only theirs
 */
export async function list(req, res, next) {
  try {
    const filter = req.user.role === 'admin'
      ? {}
      : { assignedTo: req.user._id };
    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/tasks/:id
 * Admin can update any field; Member can only update `status`
 */
export async function update(req, res, next) {
  try {
    const t = await Task.findById(req.params.id);
    if (!t) return res.sendStatus(404);

    if (req.user.role === 'admin') {
      // admin may update all provided fields
      Object.assign(t, req.body);
    } else {
      // member may only change status
      if (!('status' in req.body)) {
        return res.status(403).json({ message: 'Members can only update status' });
      }
      t.status = req.body.status;
    }

    await t.save();
    await ActivityLog.create({
      action: `Updated task "${t.title}"` + 
              (req.user.role==='member' ? ` → ${t.status}` : ''),
      user:   req.user._id,
      metadata: { taskId: t._id }
    });

    res.json(t);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/tasks/:id
 * Admin only
 */
export async function remove(req, res, next) {
  try {
    const t = await Task.findByIdAndDelete(req.params.id);
    if (!t) return res.sendStatus(404);

    await ActivityLog.create({
      action: `Deleted task "${t.title}"`,
      user:   req.user._id,
      metadata: { taskId: t._id }
    });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}