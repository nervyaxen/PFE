import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'dark',
    },
    language: {
        type: String,
        enum: ['en', 'fr', 'ar'],
        default: 'en',
    },
    notifications: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
