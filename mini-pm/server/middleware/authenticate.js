import jwt    from 'jsonwebtoken';
import User   from '../models/User.js';
import 'dotenv/config';

export default async function authenticate(req, res, next) {
  const header = req.header('Authorization');
  const token  = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ message: 'Unauthorized' });
  }
}