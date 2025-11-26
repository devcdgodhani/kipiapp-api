import { Router } from 'express';
import DashboardController from '../../../controllers/dashboardController';
import DashboardValidator from '../../../validators/dashboardValidators';

const router = Router();
const dashboardController = new DashboardController();
const dashboardValidator = new DashboardValidator();

router.post('/chart/incomeExpense', dashboardValidator.incomeExpense, dashboardController.incomeExpense);

export default router;
