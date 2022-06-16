import express from 'express';
import {
  getUsers,
  getUserExists,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getPlaylist,
  getSong,
  deleteSong,
  getAllSongs,
  createPlaylist,
  searchInDatabase,
  addSongsToPlaylist,
  deletePlaylist,
  areRecentsValid,
  updateUsersLastPlayed,
} from '../controllers/userController.js';

const userRouter = express.Router();

// The base route is /users to begin with. When you send a query to one of the following routes,
// it will call one of the functions specified based on the query. The function .get(functionName)
// just associates a function with that route.
userRouter.route('/').get(getUsers).post(createUser);
userRouter.route('/:id').put(updateUser).delete(deleteUser);
userRouter.route('/username/:Username').get(getUserExists);
userRouter.route('/username/login').post(loginUser);
userRouter.route('/editPlaylist').post(getPlaylist);
userRouter.route('/editPlaylist/deleteSong').post(deleteSong);
userRouter.route('/songs').post(getSong);
userRouter.route('/songs/all').post(getAllSongs);
userRouter.route('/createPlaylist').post(createPlaylist);
userRouter.route('/createPlaylist/search').post(searchInDatabase);
userRouter.route('/addSongsToPlaylist').post(addSongsToPlaylist);
userRouter.route('/musicScreen/getUser').post(getUserById);
userRouter.route('/editPlaylist/deletePlaylist').post(deletePlaylist);
userRouter.route('/songs').post(getSong);
userRouter.route('/musicScreen/isRecentlyPlayedValid').post(areRecentsValid);
userRouter.route('/musicScreen/updateRecentlyPlayed').post(updateUsersLastPlayed);

export default userRouter;
