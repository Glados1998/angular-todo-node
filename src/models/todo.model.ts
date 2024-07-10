import {Schema, model} from 'mongoose';

export const todoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        required: true,
    },
    isComplete: {
        type: Boolean,
        required: true,
        default: false
    }
});

export default model('Todo', todoSchema);
