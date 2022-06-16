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

function AddSongs() {

    const navigate = useNavigate();
    const location = useLocation();

    const { userInfo, selectedPlaylistId } = location.state;
    
    // useState that will save a playlist and then send it to mongodb
    const [playlist, setPlaylist] = useState('');
    const [addedSongs, setAddedSongs] = useState([]);

    // each song will be a "button", when clicked on, it will send that element of 
    // the json array to a new playlist array 
    function addSong(song) {
      // Add song into new playlist
      const newArr = addedSongs.concat(song);
      setAddedSongs(newArr);
    }

    const fetchPlaylistById = async (ID) => {
      console.log('USE EFFECT RUNNING');
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ID }),
      };
  
      const response = await fetch('http://localhost:3001/users/editPlaylist', requestOptions);
  
      if (!response.ok) {
        alert('This playlist does not exist.');
        return;
      }
  
      const temp = await response.json();
      const pl = await temp.PLAYLIST;
      setPlaylist(pl);
    };
  
    // Fetch the playlist on mount.
    useEffect(() => {
      fetchPlaylistById(selectedPlaylistId); // PASTE THE PLAYLIST ID HERE FOR TESTING
    }, []);
  
    async function addSongsToPlaylist(){
        if (addedSongs.length < 1)
        {
            alert('You did not add any songs to update the playlist with');
            return;
        }

        // Get only the song IDs of the songs.
        const songIDs = addedSongs.map(item => item._id);
        
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ playlistId: playlist._id, AddedSongs: addedSongs })
        }
        const response = await fetch('http://localhost:3001/users/addSongsToPlaylist', requestOptions);
        const temp = await response.json();
        const { isUpdated } = temp;

        if (isUpdated) navigate('/editPlaylist', { state: { userInfo, selectedPlaylistId: playlist._id } });
        else alert('Playlist cannot be updated due to unknown reasons. Please try again later.');
    }

  return (
    <div>
        <h1 className="text-center py-4 text-lg font-bold leading-6 text-gray-900"
        style={{title:'Centered title'}}
        >Add Songs To Your Playlist!</h1>

        <div className="px-2" >
            <h1 className="px-2 text-orange-300 text-4xl">{playlist.PlaylistName}</h1>

          <div className="px-1 py-1">
          <button 
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-opacity-30 focus:outline-none
            text-blue-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            onClick={() => addSongsToPlaylist()}
            >
            Update playlist
            </button>
          </div>

            <button 
            type="button" 
            className="absolute top-16 right-10 text-red-600 px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-opacity-30 focus:outline-none
            focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75" 
            onClick={() => navigate('/editPlaylist', { state: { userInfo, selectedPlaylistId: playlist._id } })}
            >
            Cancel
          </button>

          <SearchBar setNewPlaylist={addSong} />
        </div>
        <h1 className="text-center py-4 text-lg font-bold leading-6 text-gray-900"
            style={{title:'Centered title'}}>Songs selected below</h1>
        <div>
            { addedSongs.map((item, index) => (
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

export default AddSongs;