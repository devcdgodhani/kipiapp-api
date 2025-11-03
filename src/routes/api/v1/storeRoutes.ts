import { Router } from 'express';
import StoreController from '../../../controllers/storeController';
import StoreValidator from '../../../validators/storeValidators';

const router = Router();
const storeController = new StoreController();
const storeValidator = new StoreValidator();

/*********** Fetch store api ************/
router.get('/getOne', storeValidator.getOne, storeController.getOne);
router.get('/getAll', storeValidator.getAll, storeController.getAll);
router.get('/getWithPagination', storeValidator.getWithPagination, storeController.getWithPagination);

router.post('/getOne', storeValidator.getOne, storeController.getOne);
router.post('/getAll', storeValidator.getAll, storeController.getAll);
router.post(
  '/getWithPagination',
  storeValidator.getWithPagination,
  storeController.getWithPagination
);

/*********** Update store api ************/
router.put('/bulkUpdate', storeValidator.updateByFilter, storeController.updateManyByFilter);
router.put('/updateOneByFilter', storeValidator.updateByFilter, storeController.updateOneByFilter);
router.put(
  '/updateManyByFilter',
  storeValidator.updateManyByFilter,
  storeController.updateManyByFilter
);

/*********** Create store api ************/
router.post('/bulkCreate', storeValidator.bulkCreate, storeController.create);
router.post('/', storeValidator.create, storeController.create);

/*********** Delete store api ************/
router.delete('/deleteByFilter', storeValidator.deleteByFilter, storeController.deleteByFilter);

export default router;
