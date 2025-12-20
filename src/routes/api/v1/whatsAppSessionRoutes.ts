import { Router } from 'express';
import WhatsAppSessionController from '../../../controllers/whatsAppSessionController';
import WhatsAppSessionValidator from '../../../validators/whatsAppSessionValidators';

const router = Router();
const whatsAppSessionController = new WhatsAppSessionController();
const whatsAppSessionValidator = new WhatsAppSessionValidator();

/*********** Fetch whatsAppSession api ************/
router.get('/getOne', whatsAppSessionValidator.getOne, whatsAppSessionController.getOne);
router.get('/getAll', whatsAppSessionValidator.getAll, whatsAppSessionController.getAll);
router.get('/getWithPagination', whatsAppSessionValidator.getWithPagination, whatsAppSessionController.getWithPagination);

router.post('/getOne', whatsAppSessionValidator.getOne, whatsAppSessionController.getOne);
router.post('/getAll', whatsAppSessionValidator.getAll, whatsAppSessionController.getAll);
router.post(
  '/getWithPagination',
  whatsAppSessionValidator.getWithPagination,
  whatsAppSessionController.getWithPagination
);

/*********** Update whatsAppSession api ************/
router.put('/bulkUpdate', whatsAppSessionValidator.updateByFilter, whatsAppSessionController.updateManyByFilter);
router.put('/updateOneByFilter', whatsAppSessionValidator.updateByFilter, whatsAppSessionController.updateOneByFilter);
router.put(
  '/updateManyByFilter',
  whatsAppSessionValidator.updateManyByFilter,
  whatsAppSessionController.updateManyByFilter
);

/*********** Create whatsAppSession api ************/
router.post('/', whatsAppSessionValidator.create, whatsAppSessionController.create);

/*********** Delete whatsAppSession api ************/
router.delete('/deleteByFilter', whatsAppSessionValidator.deleteByFilter, whatsAppSessionController.deleteByFilter);

export default router;
