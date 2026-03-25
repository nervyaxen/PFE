import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Project from './models/Project.js';
import AiResponse from './models/AiResponse.js';
import Settings from './models/Settings.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/machrou3i';

const seed = async () => {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await AiResponse.deleteMany({});
    await Settings.deleteMany({});

    // Seed Users
    const adminPwd = await bcrypt.hash('admin123', 12);
    const userPwd = await bcrypt.hash('user123', 12);
    const managerPwd = await bcrypt.hash('manager123', 12);

    const admin = await User.create({
        email: 'alex@machrou3i.com',
        password: adminPwd,
        role: 'admin',
        preferences: { name: 'Alex Admin' },
    });
    const manager = await User.create({
        email: 'sara@machrou3i.com',
        password: managerPwd,
        role: 'manager',
        preferences: { name: 'Sara Manager' },
    });
    const user = await User.create({
        email: 'hamza@machrou3i.com',
        password: userPwd,
        role: 'user',
        preferences: { name: 'Hamza' },
    });

    // Seed Settings
    await Settings.create({ userId: admin._id, theme: 'dark', language: 'en' });
    await Settings.create({ userId: manager._id, theme: 'dark', language: 'fr' });
    await Settings.create({ userId: user._id, theme: 'dark', language: 'ar' });

    // Seed Projects
    const projectAlpha = await Project.create({
        userId: admin._id,
        title: 'Project Alpha',
        description: 'AI-driven analysis of market trends for the MENA SaaS ecosystem.',
        status: 'active',
        category: 'startup',
        targetUsers: 'Enterprise teams and startup founders',
        industry: 'SaaS & AI',
        region: 'MENA',
        revenueModel: 'Subscription',
        pricingModel: '$29/mo per seat',
        budgetRange: '$50,000-$100,000',
        teamSize: '5-10',
        goals: 'Launch MVP, acquire 500 beta users in Q2',
        aiRoadmap: {
            summary: 'Strategic 6-month roadmap: MVP in Month 2, beta launch Month 3, scale from Month 5.',
            milestones: [
                { id: 'm1', phase: 1, title: 'Foundation & Architecture', description: 'Tech stack setup, core backend, auth system.', suggestedTimeline: 'Month 1' },
                { id: 'm2', phase: 2, title: 'MVP Development', description: 'Core features, AI integration, dashboard.', suggestedTimeline: 'Month 2-3' },
                { id: 'm3', phase: 3, title: 'Beta & Validation', description: 'Launch beta, feedback collection, iterate.', suggestedTimeline: 'Month 3-4' },
                { id: 'm4', phase: 4, title: 'Growth & Monetization', description: 'Implement payments, marketing, scale.', suggestedTimeline: 'Month 5-6' },
            ],
        },
        milestones: [
            { title: 'Planning', status: 'completed' },
            { title: 'Development', status: 'in-progress' },
            { title: 'Beta Launch', status: 'pending' },
        ],
    });

    const projectBeta = await Project.create({
        userId: manager._id,
        title: 'EduPulse Platform',
        description: 'Smart education analytics platform connecting students, teachers, and institutions.',
        status: 'active',
        category: 'platform',
        targetUsers: 'Universities, K-12 schools, and EdTech companies',
        industry: 'Education Technology',
        region: 'North Africa & EU',
        revenueModel: 'Freemium + Enterprise licenses',
        budgetRange: '$20,000-$50,000',
        teamSize: '3-5',
        goals: 'Pilot with 3 universities by Q3',
    });

    // Seed AI Responses
    await AiResponse.create({
        projectId: projectAlpha._id,
        userId: admin._id,
        analysisType: 'roadmap',
        content: projectAlpha.aiRoadmap,
        modelUsed: 'gemini-2.0-flash',
    });

    await AiResponse.create({
        projectId: projectAlpha._id,
        userId: admin._id,
        analysisType: 'risk',
        content: { technical: 72, market: 58, financial: 45, operational: 63, security: 85, summary: 'Moderate risk profile. Technical complexity and market competition are primary concerns.' },
        modelUsed: 'gemini-2.0-flash',
    });

    await AiResponse.create({
        projectId: projectAlpha._id,
        userId: admin._id,
        analysisType: 'financial',
        content: {
            growthData: [
                { month: 'M1', users: 50, revenue: 0, costs: 8000 },
                { month: 'M2', users: 200, revenue: 2900, costs: 12000 },
                { month: 'M3', users: 800, revenue: 11600, costs: 15000 },
                { month: 'M4', users: 2500, revenue: 36250, costs: 18000 },
                { month: 'M5', users: 6000, revenue: 87000, costs: 22000 },
                { month: 'M6', users: 12000, revenue: 174000, costs: 28000 },
            ],
            breakEvenMonth: 3,
            roi6Month: 245,
            summary: 'Break-even expected by Month 3. Strong unit economics with projected 245% ROI by Month 6.',
        },
        modelUsed: 'gemini-2.0-flash',
    });

    console.log('✅ Seed data inserted successfully!');
    console.log(`   Users: ${3}`);
    console.log(`   Projects: ${2}`);
    console.log(`   AI Responses: ${3}`);
    console.log(`   Settings: ${3}`);
    process.exit(0);
};

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
