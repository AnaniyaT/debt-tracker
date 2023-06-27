import { Types } from "mongoose";
import { UserInterface } from "./user.model";

export class Profile {
    name: string;
    username: string;
    email: string;
    profilePicture: string;
    bio: string;
    _id: Types.ObjectId;

    constructor(name: string, username: string, email: string, profilePicture: string, bio: string, _id?: Types.ObjectId) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.profilePicture = profilePicture;
        this.bio = bio;
        this._id = _id;
    }

    static fromUser(user: UserInterface): Profile {
        return new Profile(user.name, user.username, user.email, user.profilePicture, user.bio, user._id);
    }
    
}