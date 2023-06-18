import mongoose  from "mongoose";

export interface DebtInterface{
    lender: mongoose.Types.ObjectId;
    borrower: mongoose.Types.ObjectId;
    amount: number;
    description: string;
    date: Date;
    paid: boolean;
    _id: mongoose.Types.ObjectId;
}

const debtSchema = new mongoose.Schema<DebtInterface>({
    lender: {
        type: "ObjectId",
        required: true,
        ref: 'User'
    },
    borrower: {
        type: "ObjectId",
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        required: true
    },
    paid: {
        type: Boolean,
        default: false
    }
})

const Debt = mongoose.model<DebtInterface>('Debt', debtSchema);

export default Debt;