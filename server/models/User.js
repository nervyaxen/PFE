import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'manager', 'admin'],
        default: 'user',
    },
    preferences: {
        type: Object,
        default: {},
    },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
