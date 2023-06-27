import User, { UserInterface } from "../../models/user.model";
import Debt, { DebtInterface } from "../../models/debt.model";
import { Request, Response } from "express";
import { Types } from 'mongoose';

const getDebts = async (req: Request, res: Response) => {
    const { userId } = req.body;

    const user: UserInterface = await User.findById(userId._id);
    
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    const debtIds: Types.ObjectId[] = user.debts;

    if (debtIds.length === 0) {
        return res.status(200).json([]);
    }

    try {
        const debts: DebtInterface[] = await Debt.find({ _id: { $in: debtIds } });
        return res.status(200).json(debts);
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

const getDebtById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = req.body;

    const user: UserInterface = await User.findById(userId._id);

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid debt id.' });
    }

    const debt: DebtInterface = await Debt.findById(id);

    if (!debt) {
        return res.status(404).json({ message: 'Debt not found.' });
    }

    if (!debt.lender.equals(userId._id) && !debt.borrower.equals(userId._id)) {
        return res.status(403).json({ message: 'Unauthorized.' });
    }

    return res.status(200).json(debt);
}

const requestDebt = async (req: Request, res: Response) => {
    const { userId, amount, description, lenderId } = req.body;

    const user = await User.findById(userId._id);

    if (!amount || !lenderId) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    if (!Types.ObjectId.isValid(lenderId)) {
        return res.status(400).json({ message: 'Invalid lender id.' });
    }

    const lender = await User.findById(lenderId);

    if (!lender) {
        return res.status(404).json({ message: 'Lender not found.' });
    }

    if (lender._id.equals(user._id)) {
        return res.status(400).json({ message: 'You cannot request a debt to yourself.' });
    }

    const debt = await Debt.create(
        {
            lender: lender._id,
            borrower: user._id, 
            amount: amount, 
            description: description,
            requestedDate: new Date(),
        }
    );

    lender.debts.push(debt._id);
    user.debts.push(debt._id);

    try {
        await lender.save();
        await user.save();
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
    
    return res.status(200).json(debt);
}

const approveDebt = async (req: Request, res: Response) => {
    const { debtId } = req.params;
    const { userId } = req.body;

    const user = await User.findById(userId._id);

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    if (!Types.ObjectId.isValid(debtId)) {
        return res.status(400).json({ message: 'Invalid debt id.' });
    }

    const debt = await Debt.findById(debtId);

    if (!debt) {
        return res.status(404).json({ message: 'Debt not found.' });
    }

    if (debt.lender.toString() !== userId._id.toString()) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }

    if (debt.status !== 'pending') {
        return res.status(400).json({ message: 'Debt is not pending.' });
    }

    const borrower = await User.findById(debt.borrower);

    if (!borrower) {
        return res.status(404).json({ message: 'Borrower not found.' });
    }

    debt.status = 'approved';
    debt.approvedDate = new Date();

    borrower.amountOwing += debt.amount;
    user.amountOwed += debt.amount;

    await debt.save();
    await borrower.save();
    await user.save();

    return res.status(200).json({ message: 'Debt approved.' });
}

const declineDebt = async (req: Request, res: Response) => {
    const { debtId } = req.params;
    const { userId } = req.body;

    const user = await User.findById(userId._id);

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    if (!Types.ObjectId.isValid(debtId)) {
        return res.status(400).json({ message: 'Invalid debt id.' });
    }

    const debt = await Debt.findById(debtId);

    if (!debt) {
        return res.status(404).json({ message: 'Debt not found.' });
    }

    if (debt.lender.toString() !== userId._id.toString()) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }

    if (debt.status !== 'pending') {
        return res.status(400).json({ message: 'Debt is not pending.' });
    }

    const borrower = await User.findById(debt.borrower);

    if (!borrower) {
        return res.status(404).json({ message: 'Borrower not found.' });
    }

    debt.status = 'declined';
    debt.declinedDate = new Date();
    const lenderDebtIndex = user.debts.indexOf(debt._id);
    const borrowerDebtIndex = borrower.debts.indexOf(debt._id);
    user.debts.splice(lenderDebtIndex, 1);
    borrower.debts.splice(borrowerDebtIndex, 1);
    borrower.history.push(debt._id);

    try {
        await debt.save();
        await borrower.save();
        await user.save();
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error.' });
    }

    return res.status(200).json({ message: 'Debt declined.' });
}

const deleteRequest = async (req: Request, res: Response) => {
    const { debtId } = req.params;
    const { userId } = req.body;

    const user = await User.findById(userId._id);

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    if (!Types.ObjectId.isValid(debtId)) {
        return res.status(400).json({ message: 'Invalid debt id.' });
    }

    const debt = await Debt.findById(debtId);

    if (!debt) {
        return res.status(404).json({ message: 'Debt not found.' });
    }

    if (!debt.borrower.equals(userId._id)) {
        return res.status(403).json({ message: 'Unauthorized.' });
    }

    if (debt.status !== 'pending') {
        return res.status(400).json({ message: 'Debt is not pending.' });
    }

    const lender = await User.findById(debt.lender);

    if (!lender) {
        return res.status(404).json({ message: 'Lender not found.' });
    }

    const lenderDebtIndex = lender.debts.indexOf(debt._id);
    const borrowerDebtIndex = user.debts.indexOf(debt._id);

    lender.debts.splice(lenderDebtIndex, 1);
    user.debts.splice(borrowerDebtIndex, 1);

    try {
        await lender.save();
        await user.save();
        await Debt.findByIdAndDelete(debt._id);
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error.' });
    }

    return res.status(200).json({ message: 'Debt deleted.' });
}

const deleteApprovedDebt = async (req: Request, res: Response) => {
    const { debtId } = req.params;
    const { userId } = req.body;

    const user = await User.findById(userId._id);

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    if (!Types.ObjectId.isValid(debtId)) {
        return res.status(400).json({ message: 'Invalid debt id.' });
    }

    const debt = await Debt.findById(debtId);

    if (!debt) {
        return res.status(404).json({ message: 'Debt not found.' });
    }

    if (!debt.lender.equals(userId._id)) {
        return res.status(403).json({ message: 'Unauthorized.' });
    }

    if (debt.status !== 'approved') {
        return res.status(400).json({ message: 'Debt is not approved.' });
    }

    const borrower = await User.findById(debt.borrower);

    if (!borrower) {
        return res.status(404).json({ message: 'Borrower not found.' });
    }

    const lenderDebtIndex = user.debts.indexOf(debt._id);
    const borrowerDebtIndex = borrower.debts.indexOf(debt._id);

    user.debts.splice(lenderDebtIndex, 1);
    borrower.debts.splice(borrowerDebtIndex, 1);
    user.amountOwed -= debt.amount;
    borrower.amountOwing -= debt.amount;

    try {
        await user.save();
        await borrower.save();
        await Debt.findByIdAndDelete(debt._id);
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error.' });
    }

    return res.status(200).json({ message: 'Debt deleted.' });
}

const confirmPayment = async (req: Request, res: Response) => {
    const { debtId } = req.params;
    const { userId } = req.body;

    const user = await User.findById(userId._id);

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    if (!Types.ObjectId.isValid(debtId)) {
        return res.status(400).json({ message: 'Invalid debt id.' });
    }

    const debt = await Debt.findById(debtId);

    if (!debt) {
        return res.status(404).json({ message: 'Debt not found.' });
    }

    if (!debt.lender.equals(userId._id) ) { 
        return res.status(403).json({ message: 'Unauthorized.' });
    }

    if (debt.status !== 'approved') {
        return res.status(400).json({ message: 'Debt is not approved.' });
    }

    const borrower = await User.findById(debt.borrower);

    if (!borrower) {
        return res.status(404).json({ message: 'Borrower not found.' });
    }

    const lenderDebtIndex = user.debts.indexOf(debt._id);
    const borrowerDebtIndex = borrower.debts.indexOf(debt._id);

    user.debts.splice(lenderDebtIndex, 1);
    borrower.debts.splice(borrowerDebtIndex, 1);
    user.amountOwed -= debt.amount;
    borrower.amountOwing -= debt.amount;
    user.history.push(debt._id);
    borrower.history.push(debt._id);
    debt.paidDate = new Date();
    debt.status = 'paid';
    debt.paid = true;

    try {
        await user.save();
        await borrower.save();
        await debt.save();
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error.' });
    }

    return res.status(200).json({ message: 'Debt paid.' });
}

export { getDebts, getDebtById, requestDebt, approveDebt, declineDebt, deleteRequest, deleteApprovedDebt, confirmPayment };