import { Router } from 'express';
import UserController from '../../../controllers/userController';
import UserValidator from '../../../validators/userValidators';

const router = Router();
const userController = new UserController();
const userValidator = new UserValidator();

/*********** Fetch users api ************/
router.get('/getOne', userValidator.getOne, userController.getOne);
router.get('/getAll', userValidator.getAll, userController.getAll);
router.get('/getWithPagination', userValidator.getWithPagination, userController.getWithPagination);

router.post('/getOne', userValidator.getOne, userController.getOne);
router.post('/getAll', userValidator.getAll, userController.getAll);
router.post(
  '/getWithPagination',
  userValidator.getWithPagination,
  userController.getWithPagination
);

/*********** Update users api ************/
router.put('/bulkUpdate', userValidator.updateByFilter, userController.updateManyByFilter);
router.put('/updateOneByFilter', userValidator.updateByFilter, userController.updateOneByFilter);
router.put(
  '/updateManyByFilter',
  userValidator.updateManyByFilter,
  userController.updateManyByFilter
);

/*********** Create users api ************/
router.post('/bulkCreate', userValidator.bulkCreate, userController.create);
router.post('/', userValidator.create, userController.create);

/*********** Delete users api ************/
router.delete('/deleteByFilter', userValidator.deleteByFilter, userController.deleteByFilter);

export default router;
