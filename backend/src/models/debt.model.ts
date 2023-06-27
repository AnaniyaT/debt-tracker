import mongoose  from "mongoose";

export interface DebtInterface{
    lender: mongoose.Types.ObjectId;
    borrower: mongoose.Types.ObjectId;
    amount: number;
    description: string;
    requestedDate: Date;
    approvedDate: Date;
    declinedDate: Date;
    paidDate: Date;
    paid: boolean;
    status: string;
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
    requestedDate: {
        type: Date,
        required: true
    },
    approvedDate: {
        type: Date,
    },
    declinedDate: {
        type: Date,
    },
    paidDate: {
        type: Date,
    },
    status: {
        type: String,
        required: true,
        default: 'pending'
    },
    paid: {
        type: Boolean,
        default: false
    }
})

const Debt = mongoose.model<DebtInterface>('Debt', debtSchema);

export default Debt;