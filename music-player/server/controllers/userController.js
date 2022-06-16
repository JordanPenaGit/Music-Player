/* eslint-disable no-lonely-if */
/* eslint-disable prettier/prettier */
/* eslint_disable */
/* eslint-disable no-underscore-dangle */
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import UserModel from '../models/users.js';
import PlaylistModel from '../models/playlists.js';
import SongModel from '../models/songs.js';
// const { performance } = require('perf_hooks');

// @desc    Gets a user
// @route   GET /users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
  console.log('test');
  const users = await UserModel.find();

  // This returns all the users.
  res.status(200).json(users);
});

const getUserExists = asyncHandler(async (req, res) => {
  // Passing the username through URL, so: params rather than body
  const result = await UserModel.exists({ Username: req.params.Username });

  // Set res.status(200) to true (success) is the successful case. In this scnerio, return an object named "userExists" and return the userExists variable above.
  res.status(200).json({ userExists: result });

  // You can also do res.status(400) for failure (only system failures, like bad response).
});

// Returns true if user exists and their information. Else, false and null.
const loginUser = asyncHandler(async (req, res) => {
  // Returns true if user exists. Else, false.
  const user = await UserModel.findOne({Username: req.body.Username});
  console.log(user);

  // If a user with that username doesn't exist, or if the password is incorrect 
  // via comparison, then we return a false and null.
  if (user === null || !(await bcrypt.compare(req.body.Password, user.Password))) {
    res.status(200).json({ userExists: false, userInfo: null });
    return;
  }

  // Return true to indicate user exists and their info.
  res.status(200).json({ userExists: true, userInfo: user});
});

// @desc    Sets a user
// @route   POST /users
// @access  Private
const createUser = asyncHandler(async (req, res) => {
  const hashed = await bcrypt.hash(req.body.Password, 10);
  const user = await UserModel.create({
    Username: req.body.Username,
    Password: hashed,
  });

  res.status(200).json(user);
});

// @desc    Updates a user
// @route   PUT /users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    // Set status to 400 (error).
    res.status(400);
    throw new Error('User not found');
  }

  const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json(updatedUser);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.body.id);

  if (!user) {
    // Set status to 400 (error).
    res.status(400);
    throw new Error('User not found');
  }

  res.status(200).json({ returnedUser: user });
});

// @desc    Deletes a user
// @route   DELETE /users/:id
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  await user.remove();

  res.status(200).json({ id: req.params.id });
});

const getPlaylist = asyncHandler(async (req, res) => {
  const playlistContent = await PlaylistModel.findById(req.body.id);

  if (playlistContent === null) {
    res.status(400);
    throw new Error('Playlist not found');
  }

  // This returns the playlist.
  res.status(200).json({ PLAYLIST: playlistContent });
});

const getSong = asyncHandler(async (req, res) => {
  const songContents = await SongModel.findById(req.body.id);
  
  if (!songContents) {
    res.status(400);
    throw new Error('Song not found');
  }

  // This returns all the users.
  res.status(200).json({ Song: songContents });
});

const getAllSongs = asyncHandler(async (req, res) => {
  console.log('getAllSongs going');
  const songs = await SongModel.find();

  // This returns all the songs
  res.status(200).json(songs);
});

// Deletes the specified song from the playlist by its index.
const deleteSong = asyncHandler(async (req, res) => {
  // If we want to do this with songId, this is what we do. In this scenario, you also
  // need an import statement as following: import mongoose from 'mongoose';
  // const isDeleted = await PlaylistModel.findByIdAndUpdate(req.body.playlistId, {
  //   $pull: { Songs: mongoose.Types.ObjectId(req.body.songId) },
  // });

  // Deletes the song by its index. This allows duplicate songs to exist within the array.
  const response = await PlaylistModel.updateOne({ _id: req.body.playlistId }, [
    {
      $set: {
        Songs: {
          $concatArrays: [
            { $slice: ['$Songs', req.body.songIndex] },
            { $slice: ['$Songs', { $add: [1, req.body.songIndex] }, { $size: '$Songs' }] },
          ],
        },
      },
    },
  ]);

  const isDeleted = response.modifiedCount > 0;
  res.status(200).json({ isSongDeleted: isDeleted });
});

// This updates the already existing playlist by adding the selected songs to it.
const addSongsToPlaylist = asyncHandler(async (req, res) => {
  const response = await PlaylistModel.updateOne(
    { _id: req.body.playlistId },
    { $push: { Songs: { $each: req.body.AddedSongs } } }
  );

  const isSuccessful = response.modifiedCount > 0;
  res.status(200).json({ isUpdated: isSuccessful });
});

// Creates a new playlist document, and adds the id of the document to the corresponding user's PlaylistIDs array.
const createPlaylist = asyncHandler(async (req, res) => {
  const songIds = req.body.SongsInPlaylist.map((item) => mongoose.Types.ObjectId(item));

  console.log('USERNAME');
  console.log(req.body.username);
  console.log('PLAYLISTNAME');
  console.log(req.body.PlayListName);
  console.log('SONG IDS');
  console.log(songIds);

  const response = await PlaylistModel.create({
    UserID: req.body.username,
    PlaylistName: req.body.PlayListName,
    Songs: songIds,
  });

  const filter = { Username: req.body.username };
  const update = { $push: { PlaylistIDs: mongoose.Types.ObjectId(response._id) } };

  if (response instanceof PlaylistModel) {
    await UserModel.updateOne(filter, update).catch(() => {
      res.status(400).json({ isCreated: false, createdPlaylist: null });
    });
    res.status(200).json({ isCreated: true, createdPlaylist: response });
  } else res.status(400).json({ isCreated: false, createdPlaylist: null });
});

// Case-insensitive prefix matching is used.
const searchInDatabase = asyncHandler(async (req, res) => {
  let filter = 'SongName'; // default
  const { SearchBy, SearchInput, releaseYear, genre } = req.body;

  console.log(releaseYear);
  console.log(genre);

  if (releaseYear === 0 && genre === 'none') // No filters
  {
    if (SearchBy === 'SongName')
      filter = { SongName: { $regex: new RegExp(`^${SearchInput.toLowerCase()}`, 'i') } };
    else if (SearchBy === 'ArtistName')
      filter = { ArtistName: { $regex: new RegExp(`^${SearchInput.toLowerCase()}`, 'i') } };
    else filter = { AlbumName: { $regex: new RegExp(`^${SearchInput.toLowerCase()}`, 'i') } };
  } 
  else if (releaseYear === 0) // Genre filter
  {
    if (SearchBy === 'SongName')
      filter = { SongName: { $regex: new RegExp(`^${SearchInput.toLowerCase()}`, 'i') }, Genre: genre };
    else if (SearchBy === 'ArtistName')
      filter = { ArtistName: { $regex: new RegExp(`^${SearchInput.toLowerCase()}`, 'i') }, Genre: genre };
    else filter = { AlbumName: { $regex: new RegExp(`^${SearchInput.toLowerCase()}`, 'i') }, Genre: genre };
  } 
  else if (genre === 'none') // Release year filter
  {
    if (SearchBy === 'SongName')
      filter = { SongName: { $regex: new RegExp(`^${SearchInput.toLowerCase()}`, 'i') }, ReleaseYear: releaseYear };
    else if (SearchBy === 'ArtistName')
      filter = { ArtistName: { $regex: new RegExp(`^${SearchInput.toLowerCase()}`, 'i') }, ReleaseYear: releaseYear };
    else filter = { AlbumName: { $regex: new RegExp(`^${SearchInput.toLowerCase()}`, 'i') }, ReleaseYear: releaseYear };
  } 
  else // Both filters
  {
    if (SearchBy === 'SongName')
      filter = { 
        SongName: { $regex: new RegExp(`^${SearchInput.toLowerCase()}`, 'i') },
        ReleaseYear: releaseYear,
        Genre: genre
      };
    else if (SearchBy === 'ArtistName')
      filter = { 
        ArtistName: { $regex: new RegExp(`^${SearchInput.toLowerCase()}`, 'i') },
        ReleaseYear: releaseYear,
        Genre: genre
      };
    else filter = {
      AlbumName: { $regex: new RegExp(`^${SearchInput.toLowerCase()}`, 'i') },
      ReleaseYear: releaseYear,
      Genre: genre
    };
  }

  const response = await SongModel.find(filter);

  console.log(response);

  // This returns all the users.
  res.status(200).json(response);
});

// When deleting a playlist, we delete it both from the user's PlaylistIDs array
// and the playlist document within the Playlist Model.
const deletePlaylist = asyncHandler(async (req, res) => {
  // Delete the specified playlist from user's PlaylistIDs array. No need to await for this.
  const userResponse = await UserModel.findByIdAndUpdate(req.body.userInfo._id, {
    $pull: { PlaylistIDs: req.body.playlistId },
  });

  console.log('USER RESPONSEEEEEEE');
  console.log(userResponse);

  const response = await PlaylistModel.findByIdAndDelete(req.body.playlistId);

  // If the deletion returns null, that means the playlist with that ID was not found.
  if (response === null) {
    res.status(400).json({ isDeleted: false });
    throw new Error('Playlist not found');
  }

  res.status(200).json({ isDeleted: true });
});

// Returns the playlist and song if valid. Else, returns null for at least one of them.
const areRecentsValid = asyncHandler(async (req, res) => {
  const filter =  {
    UserID: req.body.username,
    _id: req.body.LastPlaylistID,
    Songs: { '$in': req.body.LastSongID }
  };
  const result = await PlaylistModel.findOne(filter);

  if (result === null) res.status(200).json({ lastPlaylist: null, lastSong: null });

  const songContents = await SongModel.findById(req.body.LastSongID);

  res.status(200).json({ lastPlaylist: result, lastSong: songContents });
});

// This updates the user's last played song and playlist on the database.
const updateUsersLastPlayed = asyncHandler(async (req, res) => {
  // const filter = {
  //   _id: req.body.id
  // };

  console.log('USER INFO OF ID, LASTPLAYLIST, AND LAST SONG');
  console.log(req.body.id);
  console.log(req.body.LastPlaylistID);
  console.log(req.body.LastSongID);

  const update = {
    LastPlaylistID: req.body.LastPlaylistID,
    LastSongID: req.body.LastSongID
  };

  const response = await UserModel.findByIdAndUpdate(req.body.id, update);
  console.log('RETURN IS THIS');
  console.log(response);

  const isSuccessful = (response !== null);
  console.log('is successful?');
  console.log(isSuccessful);
  res.status(200).json({ isUpdated: isSuccessful });
});

export {
  getUsers,
  getUserExists,
  getUserById,
  loginUser,
  createUser,
  updateUser,
  deleteUser,
  getPlaylist,
  getSong,
  getAllSongs,
  deleteSong,
  createPlaylist,
  searchInDatabase,
  addSongsToPlaylist,
  deletePlaylist,
  areRecentsValid,
  updateUsersLastPlayed,
};
