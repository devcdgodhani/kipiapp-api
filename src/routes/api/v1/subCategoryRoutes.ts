import { Router } from 'express';
import SubCategoryController from '../../../controllers/subCategoryController';
import SubCategoryValidator from '../../../validators/subCategoryValidators';

const router = Router();
const subCategoryController = new SubCategoryController();
const subSubCategoryValidator = new SubCategoryValidator();

/*********** Fetch subSubCategory api ************/
router.get('/getOne', subSubCategoryValidator.getOne, subCategoryController.getOne);
router.get('/getAll', subSubCategoryValidator.getAll, subCategoryController.getAll);
router.get('/getWithPagination', subSubCategoryValidator.getWithPagination, subCategoryController.getWithPagination);

router.post('/getOne', subSubCategoryValidator.getOne, subCategoryController.getOne);
router.post('/getAll', subSubCategoryValidator.getAll, subCategoryController.getAll);
router.post(
  '/getWithPagination',
  subSubCategoryValidator.getWithPagination,
  subCategoryController.getWithPagination
);

/*********** Update subSubCategory api ************/
router.put('/bulkUpdate', subSubCategoryValidator.updateByFilter, subCategoryController.updateManyByFilter);
router.put('/updateOneByFilter', subSubCategoryValidator.updateByFilter, subCategoryController.updateOneByFilter);
router.put(
  '/updateManyByFilter',
  subSubCategoryValidator.updateManyByFilter,
  subCategoryController.updateManyByFilter
);

/*********** Create subSubCategory api ************/
router.post('/bulkCreate', subSubCategoryValidator.bulkCreate, subCategoryController.create);
router.post('/', subSubCategoryValidator.create, subCategoryController.create);

/*********** Delete subSubCategory api ************/
router.delete('/deleteByFilter', subSubCategoryValidator.deleteByFilter, subCategoryController.deleteByFilter);

export default router;
