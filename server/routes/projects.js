import express from 'express';
import mongoose from 'mongoose';
import { apiKeys } from '../config/ai/api.keys.js';
import Project from '../models/Project.js';
import AiResponse from '../models/AiResponse.js';

// START SAFE MODIFICATION — ObjectId validation helper
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
// END SAFE MODIFICATION

const router = express.Router();

// GET /api/projects — list all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 }).select('title description status category createdAt');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/projects/:id — get single project with AI data
router.get('/:id', async (req, res) => {
    try {
        // START SAFE MODIFICATION — Validate ObjectId format
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ error: 'Invalid project ID format.' });
        }
        // END SAFE MODIFICATION
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });

        const aiResponses = await AiResponse.find({ projectId: project._id }).sort({ createdAt: -1 });
        res.json({ ...project.toObject(), aiResponses });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/projects/:id/insights — generate AI insights for a specific project
router.post('/:id/insights', async (req, res) => {
    try {
        // START SAFE MODIFICATION — Validate ObjectId format
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ error: 'Invalid project ID format.' });
        }
        // END SAFE MODIFICATION
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });

        const { analysisType = 'roadmap' } = req.body;

        const prompts = {
            roadmap: `Generate a strategic project roadmap for "${project.title}": ${project.description || ''}. Include 4-6 milestones with phases, titles, descriptions, and timelines. Return ONLY valid JSON: { "summary": "...", "milestones": [{ "id": "m1", "phase": 1, "title": "...", "description": "...", "suggestedTimeline": "Month 1-2" }] }`,
            risk: `Analyze risks for the project "${project.title}": ${project.description || ''}. Industry: ${project.industry || 'N/A'}, Region: ${project.region || 'N/A'}. Return ONLY valid JSON: { "technical": 0-100, "market": 0-100, "financial": 0-100, "operational": 0-100, "security": 0-100, "summary": "2-3 sentence risk summary" }`,
            financial: `Generate a 6-month financial forecast for "${project.title}". Budget: ${project.budgetRange || 'N/A'}, Revenue Model: ${project.revenueModel || 'N/A'}. Return ONLY valid JSON: { "growthData": [{ "month": "M1", "users": number, "revenue": number, "costs": number }], "breakEvenMonth": number, "roi6Month": number, "summary": "..." }`,
            market: `Analyze the market for "${project.title}". Industry: ${project.industry || 'N/A'}, Target: ${project.targetUsers || 'N/A'}, Region: ${project.region || 'N/A'}. Return ONLY valid JSON: { "marketSize": "...", "growthRate": "...", "competitors": ["..."], "opportunities": ["..."], "threats": ["..."], "summary": "..." }`,
            kpi: `Suggest KPIs for "${project.title}". Category: ${project.category || 'N/A'}. Return ONLY valid JSON: { "kpis": [{ "name": "...", "target": "...", "current": number, "unit": "..." }], "summary": "..." }`,
        };

        const prompt = prompts[analysisType] || prompts.roadmap;
        let aiResult = null;

        // Query Gemini
        if (apiKeys.gemini) {
            try {
                const geminiRes = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKeys.gemini}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
                        }),
                    }
                );
                const data = await geminiRes.json();
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                const match = text.match(/\{[\s\S]*\}/);
                if (match) aiResult = JSON.parse(match[0]);
            } catch (e) {
                console.error('Gemini insights error:', e.message);
            }
        }

        // OpenAI fallback
        if (!aiResult && apiKeys.openai) {
            try {
                const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKeys.openai}` },
                    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.7 }),
                });
                const data = await openaiRes.json();
                const text = data?.choices?.[0]?.message?.content || '';
                const match = text.match(/\{[\s\S]*\}/);
                if (match) aiResult = JSON.parse(match[0]);
            } catch (e) {
                console.error('OpenAI insights error:', e.message);
            }
        }

        if (!aiResult) {
            return res.status(503).json({
                error: 'AI could not generate the requested insight at the moment. Please try again.',
                fallback: true,
            });
        }

        // Store in MongoDB
        const saved = await AiResponse.create({
            projectId: project._id,
            userId: req.body.userId || '000000000000000000000000',
            analysisType,
            content: aiResult,
            modelUsed: apiKeys.gemini ? 'gemini-2.0-flash' : 'gpt-4o-mini',
        });

        res.json({ analysisType, content: aiResult, id: saved._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
