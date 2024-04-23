import express from 'express';
import authRoutes from './src/routes/authRoutes'
import insghtRoutes from './src/routes/insightRoutes'
import taskRoutes from './src/routes/taskRoutes'
import statusChangeRoutes from './src/routes/statusChangeRoutes'
import streamRoutes from './src/routes/streamRoutes'
import userRoutes from './src/routes/userRoutes'
import callRoutes from './src/routes/callRoutes'
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

app.get('/', (req, res) => {
  res.json("Hello welcome matthew");
});

app.listen(3000, () => {
  console.log('Server ready at localhost:3000');
});