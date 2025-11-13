import { Router } from 'express';
import OrderController from '../../../controllers/orderController';
import OrderValidator from '../../../validators/orderValidators';

const router = Router();
const orderController = new OrderController();
const orderValidator = new OrderValidator();

/*********** Fetch order api ************/
router.get('/getOne', orderValidator.getOne, orderController.getOne);
router.get('/getAll', orderValidator.getAll, orderController.getAll);
router.get('/getWithPagination', orderValidator.getWithPagination, orderController.getWithPagination);

router.post('/getOne', orderValidator.getOne, orderController.getOne);
router.post('/getAll', orderValidator.getAll, orderController.getAll);
router.post(
  '/getWithPagination',
  orderValidator.getWithPagination,
  orderController.getWithPagination
);

/*********** Update order api ************/
router.put('/bulkUpdate', orderValidator.updateByFilter, orderController.updateManyByFilter);
router.put('/updateOneByFilter', orderValidator.updateByFilter, orderController.updateOneByFilter);
router.put(
  '/updateManyByFilter',
  orderValidator.updateManyByFilter,
  orderController.updateManyByFilter
);

/*********** Create order api ************/
router.post('/bulkCreate', orderValidator.bulkCreate, orderController.create);
router.post('/', orderValidator.create, orderController.create);

/*********** Delete order api ************/
router.delete('/deleteByFilter', orderValidator.deleteByFilter, orderController.deleteByFilter);

export default router;
