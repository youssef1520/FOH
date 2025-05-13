import jwt    from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User   from '../models/User.js';
import 'dotenv/config';

const SECRET  = process.env.JWT_SECRET;
if (!SECRET) throw new Error('Missing JWT_SECRET');
const EXPIRES = process.env.TOKEN_EXPIRES_IN || '8h';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: EXPIRES });
    res.json({ token, role: user.role });
  } catch (err) {
    next(err);
  }
}

export async function demoLogin(req, res, next) {
  try {
    const { role } = req.body;
    if (!['admin','member'].includes(role)) {
      return res.status(400).json({ message: 'Role must be "admin" or "member"' });
    }
    const user = await User.findOne({ role });
    if (!user) {
      return res.status(404).json({ message: 'Demo user not found' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: EXPIRES });
    res.json({ token, role: user.role });
  } catch (err) {
    next(err);
  }
}