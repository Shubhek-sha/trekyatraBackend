import 'dotenv/config';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/user.routes.js';
import recommendationRoutes from './routes/recommendation.routes.js';
import trekRoutes from './routes/trek.routes.js';
import imageRoutes from './routes/image.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/auth', authRoutes);

app.use('/api/recommend', recommendationRoutes);

app.use('/api/treks', trekRoutes);
app.use('/api/images', imageRoutes);

//serve images
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Server running');
});

// 404 handler
app.use((req, res) => {
  console.log(` 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({error: 'Route not found'});
});

// Error handler
app.use((err, req, res, next) => {
  console.error(' Server error:', err.message);
  res.status(500).json({error: err.message});
});

app.listen(5000, () => {
  console.log(' Server running on port 5000');
});
