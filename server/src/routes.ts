import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import apiController from './controllers/apiController';
import userController from './controllers/userController';
import serviceController from './controllers/serviceController';

const routes = Router();

const Apis = new apiController();
const Users = new userController();
const Services = new serviceController();

routes.get('/apis/list', Apis.index);

routes.get('/apis/list/getPages', Apis.getPages);

routes.get('/apis/list/ids', Apis.indexByIds);

routes.post('/apis/create', celebrate({
  body: Joi.object().keys({
    apiName: Joi.string().required().error(new Error('The Api Name is a required field')),
    apiCountry: Joi.string().required().error(new Error('The API Country is a required field')),
    description: Joi.string().required().error(new Error('The Description is a required field')),
    mainUrl: Joi.string().required().error(new Error('The Main URL is a required field')),
    documentationUrl: Joi.string(),
  }),
  headers: Joi.object({
    user_id: Joi.string().required().error(new Error("Can't find any user_id on headers"))
  }).options({ allowUnknown: true })
}), Apis.create);

routes.put('/apis/incrementView', celebrate({
  headers: Joi.object({
    api_id: Joi.number().required().error(new Error('The Api Id is a required field'))
  }).options({ allowUnknown: true })
}), Apis.incrementViews);

routes.put('/apis/incrementLikes', celebrate({
  headers: Joi.object({
    user_id: Joi.string().required().error(new Error('The User Id is a required field')),
    api_id: Joi.number().required().error(new Error('The Api Id is a required field'))
  }).options({ allowUnknown: true })
}), Apis.incrementLikes);

routes.put('/apis/decrementLikes', celebrate({
  headers: Joi.object({
    api_id: Joi.string().required().error(new Error('Api ID not found on request header')),
    user_id: Joi.string().required().error(new Error('User ID not found on request header'))
  }).options({ allowUnknown: true })
}), Apis.decrementLikes);

routes.delete('/apis/delete/:api_id', Apis.delete);

routes.post('/users/create', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().error(new Error('The Name is a required field')),
    email: Joi.string().email().required().error(new Error('The Email is a required field')),
    password: Joi.string().required().error(new Error('The Password is a required field')),
    confirmPassword: Joi.string().required().error(new Error('The Confirm Password is a required field')),
    country: Joi.string().required().error(new Error('The Country is a required field'))
  }),
}), Users.create);

routes.post('/users/login', celebrate({
  body: Joi.object({
    email: Joi.string().required().error(new Error('The Email is a required field')),
    password: Joi.string().required().error(new Error('The Password is a required field'))
  })
}), Users.login);

routes.post('/users/sendMail', celebrate({
  query: Joi.object({
    userEmail: Joi.string().required().error(new Error('The userEmail is a required field'))
  }).options({ allowUnknown: true })
}), Users.sendMail);

routes.put('/users/changePassword', celebrate({
  body: Joi.object({
    newPassword: Joi.string().required().error(new Error('The New Password is required')),
    confNewPassword: Joi.string().required().error(new Error('The Confirm Password is required'))
  }),
  headers: Joi.object({
    user_email: Joi.string().required().error(new Error('Internal server error')),
  }).options({ allowUnknown: true })
}), Users.changePassword);

routes.put('/users/follow', celebrate({
  headers: Joi.object({
    followed_id: Joi.string().required().error(new Error('The Followed ID is required')),
    user_id: Joi.string().required().error(new Error('The User ID is required'))
  }).options({ allowUnknown: true })
}), Users.follow);

routes.put('/users/unfollow', celebrate({
  headers: Joi.object({
    followed_id: Joi.string().required().error(new Error('The Followed ID is required')),
    user_id: Joi.string().required().error(new Error('The User ID is required'))
  }).options({ allowUnknown: true })
}), Users.unfollow);

routes.get('/users/list', Users.index);

routes.get('/users/getName/:user_id', Users.getName);

routes.delete('/users/delete/:user_id', Users.deleteUser);

routes.post('/services/generateToken', celebrate({
  body: Joi.object({
    payload: Joi.object().required()
  })
}), Services.generateToken);

routes.post('/services/resendEmail', celebrate({
  body: Joi.object({
    lsToken: Joi.string().required().error(new Error('Not found any token on local storage'))
  })
}), Services.resendEmail);

export default routes;
