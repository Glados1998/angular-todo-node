import {Router, Request, Response} from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';

const router = Router();

/**
 * Registers a new user.
 *
 * @param {Request} req - The incoming request containing user data.
 * @param {Response} res - The response to be sent back.
 *
 * @returns {Promise<void>}
 */
router.post('/register', async (req: Request, res: Response) => {
    try {

        const user = req.body;
        const {username, email, password} = user;

        const isEmailTaken = await User.findOne({email});
        if (isEmailTaken) return res.status(400).json({message: 'Email already taken'});

        const newUser = await User.create({username, email, password});

        const token = jwt.sign({
            email: email,
            username: username
        }, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.status(200).json({user: newUser, message: 'User created successfully', token: token});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

/**
 * Authenticates a user and generates a JWT token.
 *
 * @param {Request} req - The incoming request containing user credentials.
 * @param {Response} res - The response to be sent back.
 *
 * @returns {Promise<void>}
 */
router.post('/login', async (req: Request, res: Response) => {
    try {

        const user = req.body;
        const {email, password} = user;

        const foundUser = await User.findOne({email});
        if (!foundUser) return res.status(401).json({message: 'Invalid email or password'});

        const pwdMatch = foundUser.password === password;
        if (!pwdMatch) return res.status(401).json({message: 'Invalid email or password'});

        const token = jwt.sign({
            email: foundUser.email,
            username: foundUser.username
        }, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.status(200).json({
            message: 'Logged in successfully',
            token: token,
            user: {
                username: foundUser.username,
                email: foundUser.email
            }
        });

    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

/**
 * Deletes a user by their ID.
 *
 * @param {Request} req - The incoming request containing the user ID.
 * @param {Response} res - The response to be sent back.
 *
 * @returns {Promise<void>}
 */
router.delete('/delete/:id', async (req: Request, res: Response) => {
    try {

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({message: 'User not found'});

        res.status(200).json({message: 'User deleted successfully'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.post('/update/account-details', async (req: Request, res: Response) => {
    try {

        const updatedUser = await User.findByIdAndUpdate(req.body.id, req.body.data, {new: true});
        if (!updatedUser) return res.status(404).json({message: 'User not found'});

        res.status(200).json({message: 'User details updated successfully', user: updatedUser});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.post('/update/password', async (req: Request, res: Response) => {
    try {

        const updatedUser = await User.findByIdAndUpdate(req.body.id, {password: req.body.password}, {new: true});
        if (!updatedUser) return res.status(404).json({message: 'User not found'});

        res.status(200).json({message: 'Password updated successfully', user: updatedUser});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

export default router;
