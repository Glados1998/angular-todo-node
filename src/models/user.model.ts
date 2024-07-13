import {Schema, model} from "mongoose";

export const userModel = new Schema({
    username: {
        type: String,
        required: true,
        unique: false
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    }
});

export default model("User", userModel);
