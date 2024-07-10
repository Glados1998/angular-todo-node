import {Router, Request, Response} from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    try {

        const user = req.body;
        const {username, email, password} = user;

        const isEmailTaken = await User.findOne({email});
        if (isEmailTaken) return res.status(400).json({message: 'Email already taken'});

        const newUser = await User.create({username, email, password});

        res.status(200).json({user: newUser, message: 'User created successfully'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

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

router.delete('/delete/:id', async (req: Request, res: Response) => {
    try {

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({message: 'User not found'});

        res.status(200).json({message: 'User deleted successfully'});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

export default router;
