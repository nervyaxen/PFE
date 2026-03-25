import mongoose from 'mongoose';

const aiResponseSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    analysisType: {
        type: String,
        enum: ['roadmap', 'risk', 'financial', 'market', 'kpi'],
        required: true,
    },
    content: {
        type: Object,
        required: true,
    },
    modelUsed: {
        type: String,
        default: 'gpt-4o'
    }
}, { timestamps: true });

export default mongoose.model('AiResponse', aiResponseSchema);
