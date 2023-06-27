import mongoose, {Types} from 'mongoose';

import Debt, { DebtInterface } from './debt.model';

export interface UserInterface{
    name: string;
    username: string;
    email: string;
    password: string;
    profilePicture: string;
    bio: string;
    amountOwed: number;
    amountOwing: number;
    debts: mongoose.Types.ObjectId[];
    history: mongoose.Types.ObjectId[];
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
  bio: {
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
    type: [],
    default: []
  },
  history: {
    type: [],
    default: []
  }
});

const User = mongoose.model<UserInterface>('User', userSchema);

export default User;
