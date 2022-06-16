/* eslint-disable */
/* eslint-disable import/no-duplicates */
/* eslint-disable consistent-return */
import { useEffect } from 'react';
import { useState } from 'react';
import Player from './Player';
import './css/Music-screen.css';
import Sidebar from './Sidebar-left';
import SidebarRight from './Sidebar-right';
import { useLocation, useNavigate } from 'react-router-dom';
import { breadcrumbsClasses } from '@mui/material';

function MusicScreen() {
  const navigation = useNavigate();
  const location = useLocation();
  
  const { userInfo } = location.state;

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [nextSongIndex, setNextSongIndex] = useState(currentSongIndex + 1);

  const [user, setUser] = useState({}); // Will hold all the information of the user fetched from database.
  const [playlists, setPlaylists] = useState([]); // Holds all the playlists of the user.
  const [selectedPlaylist, setSelectedPlaylist] = useState({}); // Will hold the currently selected playlist information.

  // Note that to reach the song object, there is a middleman scope called
  // 'Song'. So, to reach song 0's name, we would do: songs[0].Song.SongName.
  const [selectedPlaylistSongs, setSelectedPlaylistSongs] = useState([]); // Will hold the songs of the selected playlist.
  const [playingPlaylist, setPlayingPlaylist] = useState({}); // Will hold the currently playing playlist information.
  const [playingPlaylistSongs, setPlayingPlaylistSongs] = useState([]); // Will hold the song contents (not the audio) of the playing playlist.
  const [playingSong, setPlayingSong] = useState({}); // Will hold the currently playing song information.
  const [showSongs, setShowSongs] = useState(false);

  const updateRecentInfoUser = async () => {
    console.log('USE EFFECT OF UPDATING THE USER INFO STARTED');
    if (Object.keys(playingPlaylist).length === 0 || Object.keys(playingSong).length === 0) {
      console.log('use effect ended since last playing are not anything at the moment');
      return;
    }

    console.log('here is the user usestate');
    console.log(user);

    console.log('last playlist of user that we have');
    console.log(playingPlaylist);
    console.log('here is the ID of the users last playlist');
    console.log(user.LastPlaylistID);
    console.log('last song of user that we have');
    console.log(playingSong);
    console.log('here is the ID of the users last song');
    console.log(user.LastSongID);

    // Update the user's information in the database.
    const reqOpt = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ id: user._id, LastPlaylistID: playingPlaylist.PLAYLIST._id, LastSongID: playingSong.Song._id })
    }
    const response = await fetch('http://localhost:3001/users/musicScreen/updateRecentlyPlayed', reqOpt);
    console.log('here is the response');
    console.log(response);
    console.log('SUCCESSFUL UPDATE?');
    const temp = await response.json();
    console.log('here is after json');
    console.log(temp);
    console.log(temp.isUpdated);
    console.log('USE EFFECT OF UPDATING THE USER INFO ENDED');
  };

  const getSongById = async (ID) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: ID }),
    };

    // There is a bug that happens only with Safari where if the user deletes their last played song and gets routed to the player page, connection gets lost.
    // Currently, there seems to be no solution to this with Safari. For that reason, we recommend our app to be used on Chrome or web browser.
    const response = await fetch('http://localhost:3001/users/songs', requestOptions).catch(() => alert('Connection lost. We recommend using a web browser other than Safari, such as Google Chrome for better experience.'));
    return response.json();
  };

  const getPlaylistById = async (ID) => {
    const requestOptions = {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: ID }),
    };

    const response = await fetch('http://localhost:3001/users/editPlaylist', requestOptions);
    return response.json();
  };

  // Fetches the user by ID and all his/her playlists.
  async function fetchUserById(userID) {
    console.log('ON MOUNT USE EFFECT STARTED');
    setUser(userInfo);
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ id: userID })
    }
    const response = await fetch('http://localhost:3001/users/musicScreen/getUser', requestOptions);
    const temp = await response.json();
    const { returnedUser } = temp;

    // This returns that array of playlist objects.
    const Playlists = await Promise.all(returnedUser.PlaylistIDs.map((ID) => getPlaylistById(ID)));

    // If either LastPlaylistID or LastSongID is 'none' or LastPlaylistID isn't in user's PlaylistIDs array or
    // LastSongID isn't in the LastPlaylistID's table, then set the last played song to be the first song of the
    // first playlist of the user. This means that the user is new or deleted the latest things he/she played.
    // Note that since we always update the playlist tables along with the user's PlaylistIDs array, we do not
    // have to check for the first case.
    let resetRecentInfo = false;
    if (returnedUser.LastPlaylistID === 'none' || returnedUser.LastSongID === 'none') resetRecentInfo = true;

    let lastPlaylistContent, lastSongContent;

    // If resetRecentInfo is still false, then check if the information actually exists in the database still.
    if (resetRecentInfo === false) {
      // Check if the LastSongID is in the LastPlaylistID's table for that user.
      const reqOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: returnedUser.Username, LastPlaylistID: returnedUser.LastPlaylistID, LastSongID: returnedUser.LastSongID })
      }
      const response = await fetch('http://localhost:3001/users/musicScreen/isRecentlyPlayedValid', reqOptions);
      const temp = await response.json();
      lastPlaylistContent = temp.lastPlaylist;
      lastSongContent = temp.lastSong;

      resetRecentInfo = ((lastPlaylistContent === null) || (lastSongContent === null));
    }

    if (resetRecentInfo) {
      console.log('USER last info isnt valid!!!!');
      lastPlaylistContent = Playlists[0];
      console.log(Playlists[0]);
      lastSongContent = await getSongById(Playlists[0].PLAYLIST.Songs[0]); // over here is the issue
      console.log(lastSongContent);

      console.log('HERE IS THE USER INFO BEFORE WE UPDATE THEM');
      console.log(returnedUser._id);
      console.log(lastPlaylistContent);
      console.log(lastSongContent);

      // Update the user's information in the database.
      const reqOpt = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id: returnedUser._id, LastPlaylistID: lastPlaylistContent.PLAYLIST._id, LastSongID: lastSongContent.Song._id })
      }
      const response = await fetch('http://localhost:3001/users/musicScreen/updateRecentlyPlayed', reqOpt);
      console.log(response);
      const temp = await response.json();
      const { isUpdated } = temp;

      // FOR DEBUGGING 
      console.log('USERS INFORMATION UPDATED??????');
      console.log(isUpdated);
    }

    console.log('LAST PLAYLIST CONTENT');
    console.log(lastPlaylistContent);

    console.log('LAST SONG CONTENT');
    console.log(lastSongContent);

    // This returns that array of songs in the playing playlist. There is an inconsistency between the middleman
    // scopes. The if statement is there for that reason. It chooses whichever isn't undefined and goes with it.
    let playingPLsongs;
    if (lastPlaylistContent.PLAYLIST === undefined) {
      playingPLsongs = await Promise.all(lastPlaylistContent.Songs.map((ID) => getSongById(ID)));
    }
    else {
      playingPLsongs = await Promise.all(lastPlaylistContent.PLAYLIST.Songs.map((ID) => getSongById(ID)));
    }

    setPlayingPlaylistSongs(playingPLsongs);

    console.log('playing playlist songs:');
    console.log(playingPLsongs);

    // // FIXME: Find current song index
    for (let i = 0; i < playingPLsongs.length; i++) {
      if (playingPLsongs[i].Song._id === lastSongContent._id) {
        setCurrentSongIndex(i);
        console.log('current song index');
        console.log(i);
        break;
      }
    }
    // playingPLsongs.forEach((element, index) => {
    //   if (element._id === lastSongContent._id)
    //     setCurrentSongIndex(index);
    // });
    
    setUser(returnedUser);

    // Note that to reach the playlist object, there is a middleman scope called
    // 'PLAYLIST'. So, to reach playlist 0's name, we would do: playlists[0].PLAYLIST.PlaylistName.
    setPlaylists(Playlists);
    console.log('ON MOUNT USE EFFECT ENDED');
  }

  // On mount, fetch the user's data.
  useEffect(
    async () => fetchUserById(userInfo._id),
    []
  );

  // When the last song or playlist changes, update it within user's table.
  useEffect(async () => updateRecentInfoUser(), [playingSong, playingPlaylist]);

  // Anytime the current song index changes, update next song index.
  useEffect(() => {
    setNextSongIndex(() => {
      if (currentSongIndex + 1 > playingPlaylistSongs.length - 1) {
        return 0;
      }
      return currentSongIndex + 1;
    });
  }, [currentSongIndex, playingPlaylistSongs]);

  console.log('NEXT SONG INDEX');
  console.log(nextSongIndex);

  return (
    <>
      <div className="flex">
        <Sidebar
          Playlists={playlists}
          setSelectedPlaylist={setSelectedPlaylist}
          setSelectedPlaylistSongs={setSelectedPlaylistSongs}
          userInfo={user}
          showSongs={showSongs}
          setShowSongs={setShowSongs}
        />
      </div>
      <div className="MusicScreen" style={{ display: 'inline-flex' }}>
        <Player
          currentSongIndex={currentSongIndex}
          setCurrentSongIndex={setCurrentSongIndex}
          nextSongIndex={nextSongIndex}
          songs={playingPlaylistSongs}
        />
      </div>
      <div>
        <SidebarRight
          selectedPlaylist={selectedPlaylist}
          selectedPlaylistSongs={selectedPlaylistSongs}
          userInfo={user}
          setPlayingSong={setPlayingSong}
          setPlayingPlaylistSongs={setPlayingPlaylistSongs} 
          setPlayingPlaylist={setPlayingPlaylist}
          setCurrentSongIndex={setCurrentSongIndex}
        />
      </div>
    </>
  );
}

export default MusicScreen;
