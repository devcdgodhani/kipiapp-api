import { Router } from 'express';
import ReportsController from '../../../controllers/reportsController';
import ReportsValidator from '../../../validators/reportsValidators';

const router = Router();
const reportsController = new ReportsController();
const reportsValidator = new ReportsValidator();

router.post('/incomeExpense', reportsValidator.incomeExpense, reportsController.incomeExpense);

export default router;
