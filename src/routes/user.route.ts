import {Router, Request, Response} from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = Router();

/**
 * Registers a new user.
 *
 * @param {Request} req - The incoming request containing user data.
 * @param {Response} res - The response to be sent back.
 *
 * @returns {Promise<Response>}
 */
router.post('/register', async (req: Request, res: Response): Promise<Response> => {
    try {
        const {username, email, password} = req.body;

        const isEmailTaken = await User.findOne({email});
        if (isEmailTaken) return res.status(400).json({message: 'Email already taken'});

        const isUsernameTaken = await User.findOne({username});
        if (isUsernameTaken) return res.status(400).json({message: 'Username already taken'});

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({username, email, password: hashedPassword});

        const token = jwt.sign({
            email: email,
            username: username,
            id: newUser._id
        }, process.env.JWT_SECRET as string, {expiresIn: '1h'});

        return res.status(200).json({user: newUser, message: 'User created successfully', token: token});

    } catch (error) {
        return res.status(500).json({message: (error as Error).message});
    }
});

/**
 * Authenticates a user and generates a JWT token.
 *
 * @param {Request} req - The incoming request containing user credentials.
 * @param {Response} res - The response to be sent back.
 *
 * @returns {Promise<Response>}
 */
router.post('/login', async (req: Request, res: Response): Promise<Response> => {
    try {
        const {email, password} = req.body;

        const foundUser = await User.findOne({email});
        if (!foundUser) return res.status(401).json({message: 'Invalid email or password'});

        const pwdMatch = await bcrypt.compare(password, foundUser.password);
        if (!pwdMatch) return res.status(401).json({message: 'Invalid email or password'});

        const token = jwt.sign({
            email: foundUser.email,
            username: foundUser.username
        }, process.env.JWT_SECRET as string, {expiresIn: '1h'});

        return res.status(200).json({
            message: 'Logged in successfully',
            token: token,
            user: {
                username: foundUser.username,
                email: foundUser.email,
                id: foundUser._id
            }
        });

    } catch (error) {
        return res.status(500).json({message: (error as Error).message});
    }
});

/**
 * Deletes a user by their ID.
 *
 * @param {Request} req - The incoming request containing the user ID.
 * @param {Response} res - The response to be sent back.
 *
 * @returns {Promise<Response>}
 */
router.delete('/delete/:id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({message: 'User not found'});

        return res.status(200).json({message: 'User deleted successfully'});

    } catch (error) {
        return res.status(500).json({message: (error as Error).message});
    }
});

/**
 * Updates user account details.
 *
 * @param {Request} req - The incoming request containing user data.
 * @param {Response} res - The response to be sent back.
 *
 * @returns {Promise<Response>}
 */
router.post('/update/account-details', async (req: Request, res: Response): Promise<Response> => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.body.id, req.body.data, {new: true});
        if (!updatedUser) return res.status(404).json({message: 'User not found'});

        return res.status(200).json({message: 'User details updated successfully', user: updatedUser});

    } catch (error) {
        return res.status(500).json({message: (error as Error).message});
    }
});

/**
 * Updates user password.
 *
 * @param {Request} req - The incoming request containing the new password.
 * @param {Response} res - The response to be sent back.
 *
 * @returns {Promise<Response>}
 */
router.post('/update/password', async (req: Request, res: Response): Promise<Response> => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const updatedUser = await User.findByIdAndUpdate(req.body.id, {password: hashedPassword}, {new: true});
        if (!updatedUser) return res.status(404).json({message: 'User not found'});

        return res.status(200).json({message: 'Password updated successfully', user: updatedUser});

    } catch (error) {
        return res.status(500).json({message: (error as Error).message});
    }
});

export default router;
