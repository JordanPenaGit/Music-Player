/* eslint-disable */
import React from 'react';
import Login from './Pages/Login_Page/login-index';
import EditPlaylist from './Pages/Edit_Playlist_Page/edit-playlist-index';
import './index.css';
import MusicScreen from './Components/Music-screen';
import Home from './Pages/Home Page/home';
import CreatePlaylist from './Pages/Create_Playlist/createPlaylist';
import AddSongs from './Pages/Add_Song_Page/addSong';
import ErrorPage from './Pages/ErrorPage/ErrorPage';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';

function App() {
  return (

    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/createPlaylist' element={<CreatePlaylist />} />
      <Route path='/player' element={<MusicScreen /> } />
      <Route path='/addSongs' element={<AddSongs />} />
      <Route path='/editPlaylist' element={<EditPlaylist />} />
      <Route path='*' element={<ErrorPage/>} />
    </Routes>
  );
}

export default App;
