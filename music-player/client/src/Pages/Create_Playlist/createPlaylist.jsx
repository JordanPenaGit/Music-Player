/* eslint-disable */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/button-has-type */
/* eslint-disable prettier/prettier */
import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';
import { Menu, MenuItem } from 'react-pro-sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../../Components/Search-bar';

function CreatePlaylist() {

    const location = useLocation();
    const navigate = useNavigate();

    console.log('LOCATION VARIABLE AT CREATE PLAYLIST PAGE');
    console.log(location);
    const { userInfo } = location.state;
    
    // useState that will save a playlist and then send it to mongodb
    const [playlistName, setPlaylistName] = useState('');
    const [newPlayList, setPlayList] = useState([]);

    // EVENT HANDLER FOR PLAYLISTNAME (anytime there is a change in the input box of the playlist name, it gets updated).
    const handlePlaylistName = (event) => {
        setPlaylistName(event.target.value);
    };

    // each song will be a "button", when clicked on, it will send that element of 
    // the json array to a new playlist array 
    function addSong(song) {
      // Add song into new playlist
      const newArr = newPlayList.concat(song);
      setPlayList(newArr);
    }

    // Want to send UserID (username), playlist name, and newPlaylist. Afterwards, want to save the the Id of the
    // newly created playlist into the PlaylistIDs array of the user. We will assume that this page has all the
    // info about the user (user's id, username, and such).
    async function sendPlaylist(){
        if (playlistName === '') {
            alert('Please name your playlist');
            return;
        }
        else if (newPlayList.length < 1)
        {
            alert('The playlist must have at least one song');
            return;
        }

        // Get only the song IDs of the songs.
        const songIDs = newPlayList.map(item => item._id);
        
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username: userInfo.Username, PlayListName: playlistName, SongsInPlaylist: songIDs })
        }
        const response = await fetch('http://localhost:3001/users/createPlaylist', requestOptions);
        const temp = await response.json();
        const { isCreated, createdPlaylist } = temp;

        if (isCreated) {
          userInfo.PlaylistIDs.push(createdPlaylist._id);
          navigate('/player', { state: { userInfo } });
        }
        else alert('Playlist cannot be created due to unknown reasons. Please try again later.');
    }

  return (
    <div>
        <h1 className="text-center py-4 text-lg font-bold leading-6 text-gray-900"
          style={{title:'Centered title'}}
        >
          Create Your Playlist!
        </h1>

        <div className="px-2" >
            <TextField
                hiddenLabel
                id="filled-hidden-label-small"
                placeholder='Name of the Playlist'
                variant="filled"
                size="small"
                onChange={handlePlaylistName}
            />

            <button 
            type="button"
            className="absolute left-60 px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-opacity-30 focus:outline-none
            text-blue-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            onClick={() => sendPlaylist()}
            >
            Create playlist
            </button>

            <button 
            type="button" 
            className="absolute right-10 text-red-600 px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-opacity-30 focus:outline-none
            focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75" 
            onClick={() => userInfo.PlaylistIDs.length < 1 ? alert('You must have at least one playlist in order to listen to music') : navigate('/player', { state: { userInfo } })}
            >
            Cancel
          </button>

          <SearchBar setNewPlaylist={addSong} />
        </div>
        <h1 className="text-center py-4 text-lg font-bold leading-6 text-gray-900"
            style={{title:'Centered title'}}>Songs selected below</h1>
        <div>
            { newPlayList.map((item, index) => (
              <div key={index} className="text-center text-orange-300">
                <h1>
                    {item.SongName}
                </h1>
              </div>
              ))
            }
        </div>
    </div>
    
  );
}

export default CreatePlaylist;