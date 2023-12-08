import { Router } from 'express';
import { auth, roleAuth } from '../helpers/authorisation';
import UserController from '../controllers/user';
import ProductController from '../controllers/product';

var router: Router = Router();

router.route('/registration').post(UserController.registration);
router.route('/login').post(UserController.login);
router.route('/user/info').get(auth, UserController.getInfo);
router.route('/user').get(roleAuth('admin'), UserController.get);
router.route('/users').get(roleAuth('admin'), UserController.getAll);
router.route('/user').put(roleAuth('admin'), UserController.update);
router.route('/user').delete(roleAuth('admin'), UserController.delete);

router.route('/product').get(auth, ProductController.get);
router.route('/products').get(auth, ProductController.getAll);
router.route('/product').post(roleAuth('admin'), ProductController.create);
router.route('/product').delete(roleAuth('admin'), ProductController.delete);
router.route('/product').put(roleAuth('admin'), ProductController.update);

export default router;
