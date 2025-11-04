import { Router } from 'express';
import ProductSpecificationController from '../../../controllers/productSpecificationController';
import ProductSpecificationValidator from '../../../validators/productSpecificationValidators';

const router = Router();
const productSpecificationController = new ProductSpecificationController();
const productSpecificationValidator = new ProductSpecificationValidator();

/*********** Fetch productSpecification api ************/
router.get('/getOne', productSpecificationValidator.getOne, productSpecificationController.getOne);
router.get('/getAll', productSpecificationValidator.getAll, productSpecificationController.getAll);
router.get('/getWithPagination', productSpecificationValidator.getWithPagination, productSpecificationController.getWithPagination);

router.post('/getOne', productSpecificationValidator.getOne, productSpecificationController.getOne);
router.post('/getAll', productSpecificationValidator.getAll, productSpecificationController.getAll);
router.post(
  '/getWithPagination',
  productSpecificationValidator.getWithPagination,
  productSpecificationController.getWithPagination
);

/*********** Update productSpecification api ************/
router.put('/bulkUpdate', productSpecificationValidator.updateByFilter, productSpecificationController.updateManyByFilter);
router.put('/updateOneByFilter', productSpecificationValidator.updateByFilter, productSpecificationController.updateOneByFilter);
router.put(
  '/updateManyByFilter',
  productSpecificationValidator.updateManyByFilter,
  productSpecificationController.updateManyByFilter
);

/*********** Create productSpecification api ************/
router.post('/bulkCreate', productSpecificationValidator.bulkCreate, productSpecificationController.create);
router.post('/', productSpecificationValidator.create, productSpecificationController.create);

/*********** Delete productSpecification api ************/
router.delete('/deleteByFilter', productSpecificationValidator.deleteByFilter, productSpecificationController.deleteByFilter);

export default router;
