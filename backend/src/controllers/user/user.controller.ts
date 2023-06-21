import { Request, Response } from "express";
import User, { UserInterface } from "../../models/user.model";
import { isValidObjectId } from "mongoose";
import { emailAvailable, usernameAvailable } from "./user.service";
import validator from 'validator';
import bcrypt from 'bcrypt';


const getUsers = async (req: Request, res: Response) => {
    const users: UserInterface[] = await User.find();

    const usersWithoutPassword = users.map((user) => {
        user.password = "";
        return user;
    });

    return res.status(200).json(usersWithoutPassword);
};

const getMe = async (req: Request, res: Response) => {
    const { userId } = req.body;

    const user: UserInterface = await User.findById(userId._id);

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    user.password = "";

    return res.status(200).json(user);
}

const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid user id.' });
    }

    const user: UserInterface = await User.findById(id);

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    user.password = "";

    return res.status(200).json(user);
}

const getUserByUsername = async (req: Request, res: Response) => {
    const { username } = req.params;

    const user: UserInterface = await User.findOne({ username: username });

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    user.password = "";

    return res.status(200).json(user);
}

const editProfile = async (req: Request, res: Response) => {
    const { name, username, email, profilePicture, userId} = req.body;

    const originalUser = await User.findById(userId._id);

    let update = {};

    if (name) {
        update = { ...update, name };
    }

    if (username && username != originalUser.username) {
        if (!validator.isAlphanumeric(username)) {
            return res.status(400).json({ message: 'Username can only contain letters and numbers.' });
        }

        if (! await usernameAvailable(username)) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        update = { ...update, username };
    }

    if (email && email != originalUser.email) {
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email.' });
        }

        if (! await emailAvailable(email)) {
            return res.status(400).json({ message: 'Email already taken.' });
        }

        update = { ...update, email };
    }

    if (profilePicture) {
        update = { ...update, profilePicture };
    }

    const user = await User.findByIdAndUpdate(userId._id, update, { new: true });

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    user.password = "";

    return res.status(200).json(user);
}

const changePassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword, userId } = req.body;

    const user = await User.findById(userId._id);

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    if (!await bcrypt.compare(oldPassword, user.password)) {
        return res.status(400).json({ message: 'Incorrect password.' });
    }

    if (oldPassword == newPassword) {
        return res.status(400).json({ message: 'New password cannot be the same as the old password.' });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    if (!validator.isStrongPassword(newPassword)) {
        return res.status(400).json({ message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one symbol.' });
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json({ message: 'Password changed successfully.' });
}

export { getUsers, getUserById, getUserByUsername, editProfile, getMe, changePassword };