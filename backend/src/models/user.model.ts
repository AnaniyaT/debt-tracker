import mongoose from 'mongoose';

import { DebtInterface } from './debt.model';

export interface UserInterface{
    name: string;
    username: string;
    email: string;
    password: string;
    profilePicture: string;
    amountOwed: number;
    amountOwing: number;
    debts: [[DebtInterface?], [DebtInterface?]];
    _id: mongoose.Types.ObjectId;
  }

const userSchema = new mongoose.Schema<UserInterface>({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    require: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  amountOwed: {
    type: Number,
    default: 0
  },
  amountOwing: {
    type: Number,
    default: 0
  },
  debts: {
    default: [[], []]
  }
});

const User = mongoose.model<UserInterface>('User', userSchema);

export default User;
