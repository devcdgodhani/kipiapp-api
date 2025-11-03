import { Router } from 'express';
import CategoryController from '../../../controllers/categoryController';
import CategoryValidator from '../../../validators/categoryValidators';

const router = Router();
const categoryController = new CategoryController();
const categoryValidator = new CategoryValidator();

/*********** Fetch category api ************/
router.get('/getOne', categoryValidator.getOne, categoryController.getOne);
router.get('/getAll', categoryValidator.getAll, categoryController.getAll);
router.get('/getWithPagination', categoryValidator.getWithPagination, categoryController.getWithPagination);

router.post('/getOne', categoryValidator.getOne, categoryController.getOne);
router.post('/getAll', categoryValidator.getAll, categoryController.getAll);
router.post(
  '/getWithPagination',
  categoryValidator.getWithPagination,
  categoryController.getWithPagination
);

/*********** Update category api ************/
router.put('/bulkUpdate', categoryValidator.updateByFilter, categoryController.updateManyByFilter);
router.put('/updateOneByFilter', categoryValidator.updateByFilter, categoryController.updateOneByFilter);
router.put(
  '/updateManyByFilter',
  categoryValidator.updateManyByFilter,
  categoryController.updateManyByFilter
);

/*********** Create category api ************/
router.post('/bulkCreate', categoryValidator.bulkCreate, categoryController.create);
router.post('/', categoryValidator.create, categoryController.create);

/*********** Delete category api ************/
router.delete('/deleteByFilter', categoryValidator.deleteByFilter, categoryController.deleteByFilter);

export default router;
