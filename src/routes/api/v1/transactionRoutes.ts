import { Router } from 'express';
import TransactionController from '../../../controllers/transactionController';
import TransactionValidator from '../../../validators/transactionValidators';

const router = Router();
const transactionController = new TransactionController();
const transactionValidator = new TransactionValidator();

/*********** Fetch transaction api ************/
router.get('/getOne', transactionValidator.getOne, transactionController.getOne);
router.get('/getAll', transactionValidator.getAll, transactionController.getAll);
router.get('/getWithPagination', transactionValidator.getWithPagination, transactionController.getWithPagination);

router.post('/getOne', transactionValidator.getOne, transactionController.getOne);
router.post('/getAll', transactionValidator.getAll, transactionController.getAll);
router.post(
  '/getWithPagination',
  transactionValidator.getWithPagination,
  transactionController.getWithPagination
);

/*********** Update transaction api ************/
router.put('/bulkUpdate', transactionValidator.updateByFilter, transactionController.updateManyByFilter);
router.put('/updateOneByFilter', transactionValidator.updateByFilter, transactionController.updateOneByFilter);
router.put(
  '/updateManyByFilter',
  transactionValidator.updateManyByFilter,
  transactionController.updateManyByFilter
);

/*********** Create transaction api ************/
router.post('/bulkCreate', transactionValidator.bulkCreate, transactionController.create);
router.post('/', transactionValidator.create, transactionController.create);

/*********** Delete transaction api ************/
router.delete('/deleteByFilter', transactionValidator.deleteByFilter, transactionController.deleteByFilter);

export default router;
