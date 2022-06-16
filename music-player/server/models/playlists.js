import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
  UserID: {
    type: String,
    required: true,
  },
  PlaylistName: {
    type: String,
    required: true,
  },
  Songs: {
    type: [mongoose.Types.ObjectId],
    required: true,
  },
});

const PlaylistModel = mongoose.model('playlists', PlaylistSchema);
export default PlaylistModel;
