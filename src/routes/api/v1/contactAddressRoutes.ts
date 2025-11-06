import { Router } from 'express';
import ContactAddressController from '../../../controllers/contactAddressController';
import ContactAddressValidator from '../../../validators/contactAddressValidators';

const router = Router();
const contactAddressController = new ContactAddressController();
const contactAddressValidator = new ContactAddressValidator();

/*********** Fetch contactAddress api ************/
router.get('/getOne', contactAddressValidator.getOne, contactAddressController.getOne);
router.get('/getAll', contactAddressValidator.getAll, contactAddressController.getAll);
router.get('/getWithPagination', contactAddressValidator.getWithPagination, contactAddressController.getWithPagination);

router.post('/getOne', contactAddressValidator.getOne, contactAddressController.getOne);
router.post('/getAll', contactAddressValidator.getAll, contactAddressController.getAll);
router.post(
  '/getWithPagination',
  contactAddressValidator.getWithPagination,
  contactAddressController.getWithPagination
);

/*********** Update contactAddress api ************/
router.put('/bulkUpdate', contactAddressValidator.updateByFilter, contactAddressController.updateManyByFilter);
router.put('/updateOneByFilter', contactAddressValidator.updateByFilter, contactAddressController.updateOneByFilter);
router.put(
  '/updateManyByFilter',
  contactAddressValidator.updateManyByFilter,
  contactAddressController.updateManyByFilter
);

/*********** Create contactAddress api ************/
router.post('/bulkCreate', contactAddressValidator.bulkCreate, contactAddressController.create);
router.post('/', contactAddressValidator.create, contactAddressController.create);

/*********** Delete contactAddress api ************/
router.delete('/deleteByFilter', contactAddressValidator.deleteByFilter, contactAddressController.deleteByFilter);

export default router;
