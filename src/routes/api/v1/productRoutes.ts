import { Router } from 'express';
import ProductController from '../../../controllers/productController';
import ProductValidator from '../../../validators/productValidators';

const router = Router();
const productController = new ProductController();
const productValidator = new ProductValidator();

/*********** Fetch product api ************/
router.get('/getOne', productValidator.getOne, productController.getOne);
router.get('/getAll', productValidator.getAll, productController.getAll);
router.get('/getWithPagination', productValidator.getWithPagination, productController.getWithPagination);

router.post('/getOne', productValidator.getOne, productController.getOne);
router.post('/getAll', productValidator.getAll, productController.getAll);
router.post(
  '/getWithPagination',
  productValidator.getWithPagination,
  productController.getWithPagination
);

/*********** Update product api ************/
router.put('/bulkUpdate', productValidator.updateByFilter, productController.updateManyByFilter);
router.put('/updateOneByFilter', productValidator.updateByFilter, productController.updateOneByFilter);
router.put(
  '/updateManyByFilter',
  productValidator.updateManyByFilter,
  productController.updateManyByFilter
);

/*********** Create product api ************/
router.post('/bulkCreate', productValidator.bulkCreate, productController.create);
router.post('/', productValidator.create, productController.create);

/*********** Delete product api ************/
router.delete('/deleteByFilter', productValidator.deleteByFilter, productController.deleteByFilter);

export default router;
