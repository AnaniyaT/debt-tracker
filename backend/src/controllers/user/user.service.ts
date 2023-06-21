import User, { UserInterface } from "../../models/user.model";

const usernameAvailable = async (username: string) =>  {
    const user: UserInterface = await User.findOne({ username: username});

    if (!user) {
        return true;
    }

    return false;
}

const emailAvailable = async (email: string) => {
    const user: UserInterface = await User.findOne({ email: email });

    if (user) {
        return false;
    }
    
    return true;
}

export { usernameAvailable, emailAvailable };