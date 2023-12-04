import { Router } from 'express';
import userController from '../controllers/userController.js';
import { auth, roleAuth } from '../helpers/authorization.js';
import productController from '../controllers/productController.js';
import cartController from '../controllers/cartController.js';
import orderController from '../controllers/orderController.js';

var router = Router();

router.route('/registration').post(userController.registration);
router.route('/login').post(userController.login);
router.route('/user/info').get(auth, userController.getInfo);
router.route('/user').get(roleAuth('admin'), userController.get);
router.route('/users').get(roleAuth('admin'), userController.getAll);
router.route('/user').put(roleAuth('admin'), userController.update);
router.route('/user').delete(roleAuth('admin'), userController.delete);

router.route('/product').get(auth, productController.get);
router.route('/products').get(auth, productController.getAll);
router.route('/product').post(roleAuth('admin'), productController.create);
router.route('/product').delete(roleAuth('admin'), productController.delete);
router.route('/product').put(roleAuth('admin'), productController.update);

router.route('/cart').post(auth, cartController.add);
router.route('/cart').get(auth, cartController.get);
router.route('/cart').delete(auth, cartController.delete);

router.route('/order').post(auth, orderController.add);
router.route('/order/info').get(auth, orderController.getInfo);
router.route('/order').get(roleAuth('admin'), orderController.get);
router.route('/order').delete(roleAuth('admin'), orderController.delete);

export default router;
