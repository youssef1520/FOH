import 'dotenv/config';
import 'dotenv/config';
import './db/conn.js';

import express        from 'express';
import authRoutes     from './routes/auth.routes.js';
import projectRoutes  from './routes/project.routes.js';
import taskRoutes     from './routes/task.routes.js';
import logRoutes      from './routes/log.routes.js';
import authenticate   from './middleware/authenticate.js';

const app = express();
app.use(express.json());

// Public auth endpoints
app.use('/api', authRoutes);

// Protected resources
app.use('/api/projects',     authenticate, projectRoutes);
app.use('/api/tasks',        authenticate, taskRoutes);
app.use('/api/activity-log', authenticate, logRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});

// Start server
const port = parseInt(process.env.PORT ?? '3001', 10);
app.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});