import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'completed', 'archived'],
        default: 'active',
    },
    category: String,
    targetUsers: String,
    industry: String,
    region: String,
    revenueModel: String,
    pricingModel: String,
    budgetRange: String,
    teamSize: String,
    goals: String,

    // AI Generated Content Stored Here
    aiRoadmap: {
        type: Object,
        default: null,
    },
    milestones: [{
        title: String,
        description: String,
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed'],
            default: 'pending'
        },
        dueDate: Date
    }],
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
