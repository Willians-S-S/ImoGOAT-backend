import { Router } from 'express';

import { FavoriteController } from '../src/controllers/FavoriteControllers';
import { FeedbackController } from '../src/controllers/FeedbackControllers';
import { ImageController } from '../src/controllers/ImageControllers';
import { ImmobileController } from '../src/controllers/ImmobileControllers';
import { UserController } from '../src/controllers/UserControllers';
import { authMiddleware } from '../src/middlewares/authMiddleware';

const routes = Router();

const multer = require('multer');

const uploadImovel = require('./services/firebase.js');

const Multer = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 10,
    files: 10
  }
});

// Rotas de usuário
routes.get('/user', new UserController().getAllUsers);
routes.get('/user/:id', new UserController().getUserById);
routes.post('/create-user', new UserController().createUser);
routes.post('/login', new UserController().signUser);
routes.put('/alter-user/:id', new UserController().updateUser);
routes.delete('/delete-user/:id', new UserController().deleteUser);
routes.post('/esqueci', new UserController().sendResetEmail);
routes.post('/trocarSenha', new UserController().resetPassword);

// Rotas de imóveis
routes.get('/immobile/:id', new ImmobileController().getImmobileById);
routes.get('/immobile', new ImmobileController().getAllImmobiles);
routes.post('/create-immobile', authMiddleware, new ImmobileController().createImmobile);
routes.put('/alter-immobile/:id', authMiddleware, new ImmobileController().updateImmobile);
routes.delete('/delete-immobile/:id', authMiddleware, new ImmobileController().deleteImmobile);

// Rotas de feedback
routes.get('/feedback', new FeedbackController().getAllFeedbacks);
routes.get('/feedback/:id', new FeedbackController().getFeedbackById);
routes.post('/create-feedback', authMiddleware, new FeedbackController().createFeedback);
routes.put('/alter-feedback/:id', authMiddleware, new FeedbackController().updateFeedback);
routes.delete('delete-/feedback/:id', authMiddleware, new FeedbackController().deleteFeedback);

// Rotas de imagens
routes.post('/create-image', authMiddleware, Multer.array('img', 10), uploadImovel, new ImageController().createImage);
routes.get('/image', new ImageController().getAllImages);
routes.get('/image/:id', new ImageController().getImageById);

// Rotas de favoritos
routes.post('/create-favorites', authMiddleware, new FavoriteController().addFavorite);
routes.delete('/delete-favorites/:id', authMiddleware, new FavoriteController().deleteFavorite);
routes.get('/favorites/:userId', authMiddleware, new FavoriteController().getFavorites);

export default routes;
