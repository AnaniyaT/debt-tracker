import User, { UserInterface } from "../../models/user.model";
import { Request, Response } from 'express';
import validator from 'validator';
import { Types } from "mongoose";

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const getToken = (_id: Types.ObjectId, remember: boolean) => {
    return jwt.sign({ _id }, JWT_SECRET, { expiresIn: remember ? '7d' : '2h'});
}

const validateUsername = async (req: Request, res: Response) => {
    const { username } = req.params;

    if (username.length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters long.' });
    }

    const usernameExists = await User.findOne({ username: username });

    if (usernameExists) {
        return res.status(400).json({ message: 'Username already exists.' });
    }

    return res.status(200).json({ message: 'Username is available.' });
}


const signup = async (req: Request, res: Response) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields.' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    const emailExists = await User.findOne({ email: email });

    if (emailExists) {
        return res.status(400).json({ message: 'Email already exists.' });
    }

    if (username.length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters long.' });
    }

    if (!validator.isAlphanumeric(username)) {
        return res.status(400).json({ message: 'Username can only contain letters and numbers'});
    }

    if (!validator.isLength(password, { min: 8 })) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: 'Password must contain at least 1 lowercase, 1 uppercase, 1 number and 1 symbol.' });
    }

    const usernameExists = await User.findOne({ username: username });

    if (usernameExists) {
        return res.status(400).json({ message: 'Username already exists.' });
    }

    try {
        const user = await User.create({ name, username, email, password: await bcrypt.hash(password, 10) });
        const token = getToken(user._id, false);

        user.password = '';

        return res.status(201).json({ user, token });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong.' });
    }
}


const signin = async (req: Request, res: Response) => {
    const {usernameOrEmail, password, remember} = req.body;
    let user: UserInterface;

    if (validator.isEmail(usernameOrEmail)) {
        user = await User.findOne({ email: usernameOrEmail });
    } else {
        user = await User.findOne({ username: usernameOrEmail });
    }

    if (!user) {
        return res.status(401).json({message: "Invalid credentials"});
    }

    const correctPassword: boolean = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
        return res.status(401).json({message: "Invalid credentials"});
    }

    const token: string = getToken(user._id, remember);

    user.password = "";

    return res.status(201).json({user, token})

}

export { signup, signin, validateUsername };