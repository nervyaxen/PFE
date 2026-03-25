import express from 'express';
import { apiKeys } from '../config/ai/api.keys.js';
import Project from '../models/Project.js';
import AiResponse from '../models/AiResponse.js';

const router = express.Router();

/**
 * POST /api/ai/generate-project
 * 
 * Accepts the 5-step form payload, queries the configured LLM,
 * stores both the Project and the AiResponse in MongoDB,
 * and returns the cinematic results payload to the frontend.
 */
router.post('/generate-project', async (req, res) => {
    try {
        const {
            idea, shortDescription, category,
            problem, solution, uniqueness,
            targetUsers, industry, region,
            revenueModel, pricingModel, monetizationStrategy,
            competitors, advantages,
            technicalRisks, marketRisks, financialRisks, operationalChallenges,
            budget, teamSize, goals,
        } = req.body;

        // Build the prompt for the LLM
        const prompt = `You are an expert startup advisor and project architect. Analyze this project idea and respond ONLY with valid JSON (no markdown, no explanation).

Project: ${idea || 'Untitled'}
Description: ${shortDescription || 'N/A'}
Category: ${category || 'N/A'}
Problem: ${problem || 'N/A'}
Solution: ${solution || 'N/A'}
Uniqueness: ${uniqueness || 'N/A'}
Target Users: ${targetUsers || 'N/A'}
Industry: ${industry || 'N/A'}
Region: ${region || 'N/A'}
Revenue Model: ${revenueModel || 'N/A'}
Pricing: ${pricingModel || 'N/A'}
Monetization: ${monetizationStrategy || 'N/A'}
Competitors: ${competitors || 'N/A'}
Advantages: ${advantages || 'N/A'}
Technical Risks: ${technicalRisks || 'N/A'}
Market Risks: ${marketRisks || 'N/A'}
Financial Risks: ${financialRisks || 'N/A'}
Operational Challenges: ${operationalChallenges || 'N/A'}
Budget: ${budget || 'N/A'}
Team Size: ${teamSize || 'N/A'}
Goals: ${goals || 'N/A'}

Return this JSON structure:
{
  "roadmap": {
    "summary": "A 2-3 sentence strategic summary",
    "milestones": [
      { "id": "m1", "phase": 1, "title": "...", "description": "...", "suggestedTimeline": "Month 1-2" },
      { "id": "m2", "phase": 2, "title": "...", "description": "...", "suggestedTimeline": "Month 3-4" },
      { "id": "m3", "phase": 3, "title": "...", "description": "...", "suggestedTimeline": "Month 5-6" }
    ]
  },
  "riskAnalysis": { "technical": 0-100, "market": 0-100, "financial": 0-100, "operational": 0-100, "security": 0-100 },
  "marketInsights": {
    "growthData": [
      { "month": "M1", "users": number, "revenue": number },
      { "month": "M2", "users": number, "revenue": number },
      { "month": "M3", "users": number, "revenue": number },
      { "month": "M4", "users": number, "revenue": number },
      { "month": "M5", "users": number, "revenue": number },
      { "month": "M6", "users": number, "revenue": number }
    ]
  },
  "confidenceScore": 0-100
}`;

        let aiResult = null;

        // Try Gemini first
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
                const geminiData = await geminiRes.json();
                const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                // Extract JSON from the response
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    aiResult = JSON.parse(jsonMatch[0]);
                }
            } catch (geminiErr) {
                console.error('Gemini API error:', geminiErr.message);
            }
        }

        // Try OpenAI as fallback
        if (!aiResult && apiKeys.openai) {
            try {
                const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKeys.openai}`,
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [{ role: 'user', content: prompt }],
                        temperature: 0.7,
                        max_tokens: 2048,
                    }),
                });
                const openaiData = await openaiRes.json();
                const text = openaiData?.choices?.[0]?.message?.content || '';
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    aiResult = JSON.parse(jsonMatch[0]);
                }
            } catch (openaiErr) {
                console.error('OpenAI API error:', openaiErr.message);
            }
        }

        // Fallback to generated mock data if no AI keys configured
        if (!aiResult) {
            aiResult = {
                roadmap: {
                    summary: `Strategic roadmap for "${idea || 'your project'}": Focus on core MVP, validate with target users, and iterate based on market signals.`,
                    milestones: [
                        { id: 'm1', phase: 1, title: 'Foundation & MVP', description: 'Build core infrastructure, set up tech stack, and develop minimum viable product.', suggestedTimeline: 'Month 1-2' },
                        { id: 'm2', phase: 2, title: 'User Validation & Growth', description: 'Launch beta, collect user feedback, iterate on features, and begin marketing.', suggestedTimeline: 'Month 3-4' },
                        { id: 'm3', phase: 3, title: 'Scale & Monetize', description: 'Implement revenue model, scale infrastructure, and expand to new markets.', suggestedTimeline: 'Month 5-6' },
                    ],
                },
                riskAnalysis: { technical: 65, market: 55, financial: 45, operational: 50, security: 80 },
                marketInsights: {
                    growthData: [
                        { month: 'M1', users: 100, revenue: 0 },
                        { month: 'M2', users: 800, revenue: 2000 },
                        { month: 'M3', users: 3000, revenue: 8000 },
                        { month: 'M4', users: 8000, revenue: 22000 },
                        { month: 'M5', users: 18000, revenue: 55000 },
                        { month: 'M6', users: 35000, revenue: 120000 },
                    ],
                },
                confidenceScore: 78.5,
            };
        }

        // Save to MongoDB (userId is optional at this stage)
        const project = await Project.create({
            userId: req.body.userId || '000000000000000000000000',
            title: idea || 'Untitled Project',
            description: shortDescription || '',
            category,
            targetUsers,
            industry,
            region,
            revenueModel,
            pricingModel,
            budgetRange: budget,
            teamSize,
            goals,
            aiRoadmap: aiResult.roadmap,
            milestones: (aiResult.roadmap?.milestones || []).map(m => ({
                title: m.title,
                description: m.description,
                status: 'pending',
            })),
        });

        await AiResponse.create({
            projectId: project._id,
            userId: req.body.userId || '000000000000000000000000',
            analysisType: 'roadmap',
            content: aiResult,
            modelUsed: apiKeys.gemini ? 'gemini-2.0-flash' : apiKeys.openai ? 'gpt-4o-mini' : 'mock',
        });

        res.json({
            projectId: project._id,
            ...aiResult,
        });
    } catch (err) {
        console.error('Generate project error:', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
