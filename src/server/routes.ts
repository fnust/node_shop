import { Router } from 'express';
import { auth, roleAuth } from '../helpers/authorisation';
import UserController from '../controllers/user';

var router: Router = Router();

router.route('/registration').post(UserController.registration);
router.route('/login').post(UserController.login);
router.route('/user/info').get(auth, UserController.getInfo);
router.route('/user').get(roleAuth('admin'), UserController.get);
router.route('/users').get(roleAuth('admin'), UserController.getAll);
router.route('/user').put(roleAuth('admin'), UserController.update);
router.route('/user').delete(roleAuth('admin'), UserController.delete);

export default router;
