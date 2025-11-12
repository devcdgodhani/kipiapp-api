import { Router } from 'express';
import ProductController from '../../../controllers/productController';
import ProductValidator from '../../../validators/productValidators';

const router = Router();
const productController = new ProductController();
const productValidator = new ProductValidator();

/*********** Fetch product api ************/
router.get('/product/getOne', productValidator.getOne, productController.getOne);

export default router;
