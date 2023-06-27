import { Router } from "express";
import {
    getDebts,
    getDebtById, 
    requestDebt, 
    approveDebt, 
    declineDebt, 
    deleteRequest, 
    deleteApprovedDebt, 
    confirmPayment
} from "../controllers/debt/debt.controller";

const router = Router();

router.get('/', getDebts);
router.get('/:id', getDebtById);

router.post('/request', requestDebt);

router.patch('/approve/:debtId', approveDebt);
router.patch('/decline/:debtId', declineDebt);
router.patch('/confirm/:debtId', confirmPayment);

router.delete('/deleteRequest/:debtId', deleteRequest);
router.delete('/deleteApproved/:debtId', deleteApprovedDebt);

module.exports = router;