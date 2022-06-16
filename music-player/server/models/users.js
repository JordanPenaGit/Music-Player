import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  PlaylistIDs: {
    type: [mongoose.Types.ObjectId],
    required: false,
    default: [],
  },
  LastPlaylistID: {
    type: String,
    required: false,
    default: 'none',
  },
  LastSongID: {
    type: String,
    required: false,
    default: 'none',
  },
});

const UserModel = mongoose.model('users', UserSchema);
export default UserModel;
