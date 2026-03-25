import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiKeys } from './config/ai/api.keys.js';
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import projectRoutes from './routes/projects.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/machrou3i';

app.use(cors());
app.use(express.json());

// Mount route modules
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/projects', projectRoutes);

// Basic health check and DB string verifying
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Configuration Check Route (Does not return keys, just availability)
app.get('/api/config/ai/status', (req, res) => {
    res.json({
        geminiConfigured: !!apiKeys.gemini,
        openaiConfigured: !!apiKeys.openai,
        anthropicConfigured: !!apiKeys.anthropic,
    });
});

// Future endpoint structure for generating roadmaps
app.post('/api/ai/generate-project', async (req, res) => {
    try {
        const { idea, targeting, budget, team, goals } = req.body;

        if (!apiKeys.gemini && !apiKeys.openai && !apiKeys.anthropic) {
            return res.status(500).json({ error: 'No AI providers configured in backend.' });
        }

        // Logic to call the actual LLM API will go here
        // Following that, the payload will be saved to MongoDB

        res.json({ status: 'success', message: 'Endpoint scaffolded successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log(`Connected to MongoDB: ${MONGO_URI}`);
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
    });
