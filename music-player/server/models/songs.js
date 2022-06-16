import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
  SongName: {
    type: String,
    required: true,
  },
  ArtistName: {
    type: String,
    required: true,
  },
  AlbumName: {
    type: String,
    required: true,
  },
  ReleaseYear: {
    type: Number,
    required: true,
  },
  Genre: {
    type: String,
    required: true,
  },
  AudioSrcPath: {
    type: String,
    required: true,
  },
  ImageSrcPath: {
    type: String,
    required: true,
  },
});

const SongModel = mongoose.model('songs', SongSchema);
export default SongModel;
