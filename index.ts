import express from 'express';
import authRoutes from './src/routes/authRoutes'
import insghtRoutes from './src/routes/insightRoutes'
import taskRoutes from './src/routes/taskRoutes'
import statusChangeRoutes from './src/routes/statusChangeRoutes'
import streamRoutes from './src/routes/streamRoutes'
import userRoutes from './src/routes/userRoutes'
import callRoutes from './src/routes/callRoutes'
import settingRoutes from './src/routes/settingRoutes'
import appointement from './src/routes/appointment'
import notification from './src/routes/notificationRoutes'
import { authenticateToken } from './src/middleware/authMiddleware';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/insight', authenticateToken, insghtRoutes);
app.use('/task', authenticateToken, taskRoutes);
app.use('/statusChange', authenticateToken, statusChangeRoutes);
app.use('/stream', authenticateToken, streamRoutes);
app.use('/users', authenticateToken, userRoutes)
app.use('/call', authenticateToken, callRoutes)
app.use('/settings', authenticateToken, settingRoutes)
app.use('/appointment', authenticateToken, appointement)
app.use('/notification', authenticateToken, notification)

app.post('/', (req, res) => {
  res.json("success");
});

app.listen(3000, () => {
  console.log('Server ready at localhost:3000');
});