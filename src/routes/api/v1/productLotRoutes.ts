import { Router } from 'express';
import ProductLotController from '../../../controllers/productLotController';
import ProductLotValidator from '../../../validators/productLotValidators';

const router = Router();
const productLotController = new ProductLotController();
const productLotValidator = new ProductLotValidator();

/*********** Fetch productLot api ************/
router.get('/getOne', productLotValidator.getOne, productLotController.getOne);
router.get('/getAll', productLotValidator.getAll, productLotController.getAll);
router.get('/getWithPagination', productLotValidator.getWithPagination, productLotController.getWithPagination);

router.post('/getOne', productLotValidator.getOne, productLotController.getOne);
router.post('/getAll', productLotValidator.getAll, productLotController.getAll);
router.post(
  '/getWithPagination',
  productLotValidator.getWithPagination,
  productLotController.getWithPagination
);

/*********** Update productLot api ************/
router.put('/bulkUpdate', productLotValidator.updateByFilter, productLotController.updateManyByFilter);
router.put('/updateOneByFilter', productLotValidator.updateByFilter, productLotController.updateOneByFilter);
router.put(
  '/updateManyByFilter',
  productLotValidator.updateManyByFilter,
  productLotController.updateManyByFilter
);

/*********** Create productLot api ************/
router.post('/bulkCreate', productLotValidator.bulkCreate, productLotController.create);
router.post('/', productLotValidator.create, productLotController.create);

/*********** Delete productLot api ************/
router.delete('/deleteByFilter', productLotValidator.deleteByFilter, productLotController.deleteByFilter);

export default router;
