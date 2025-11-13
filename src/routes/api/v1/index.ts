import { Router } from 'express';
const router = Router();

import { jwtAuth } from '../../../middlewares';
import authRoute from './authRoute';
import userRoutes from './userRoutes';
import categoryRoutes from './categoryRoutes';
import subCategoryRoutes from './subCategoryRoutes';
import productLotRoutes from './productLotRoutes';
import storeRoutes from './storeRoutes';
import productRoutes from './productRoutes';
import productSpecificationRoutes from './productSpecificationRoutes';
import openRoutes from './openRoutes';
import orderRoutes from './orderRoutes';

router.get('/healthCheck', (req, res) => {
  const now = new Date();
  res.status(200).json({
    status: 'OK',
    message: 'Server is healthy',
    timestamp: now.toTimeString().split(' ')[0],
    date: now.toISOString().split('T')[0],
  });
});

router.use('/open', openRoutes);

router.use('/auth', authRoute);

router.use('/user', jwtAuth(), userRoutes);

router.use('/category', jwtAuth(), categoryRoutes);

router.use('/subCategory', jwtAuth(), subCategoryRoutes);

router.use('/productLot', jwtAuth(), productLotRoutes);

router.use('/store', jwtAuth({ byPassStoreValidation: true }), storeRoutes);

router.use('/product', jwtAuth(), productRoutes);

router.use('/productSpecification', jwtAuth(), productSpecificationRoutes);

router.use('/order', jwtAuth(), orderRoutes);

export default router;
