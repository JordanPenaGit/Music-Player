/* eslint-disable */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-alert */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

// FIXME: WE NEED TO IMPORT THE USERID (username) so that we can access the user's playlist.
// We could see if the playlist name and the userID could be the inputs of this function or maybe we could
// just get the objectID of the playlist and fetch it right away.

// This page takes in playlist ID and the number of playlists the user currently has.
function EditPlaylist() {
  // Save the information passed to this page in consts.
  const location = useLocation();
  const navigate = useNavigate();

  const { userInfo, selectedPlaylistId } = location.state;

  // FIXME: UNCOMMENT ONCE THE PLAYER PAGE ACTUALLY SENDS THIS INFO
  // const { playlistID } = location.state;
  // const { numOfPlaylists } = location.state; 

  // Following are the 3 useStates used in this page:
  const [numSongs, setNumSongs] = useState(0); // Number of songs in the playlist
  const [playlist, setPlaylist] = useState({}); // Playlist object
  const [songs, setSongs] = useState([]); // Songs within the playlist object

  const getSongById = async (ID) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: ID }),
    };

    const response = await fetch('http://localhost:3001/users/songs', requestOptions);
    return response.json();
  };

  const fetchPlaylistById = async (ID) => {
    console.log('USE EFFECT RUNNING');
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // FIXME: THIS NEEDS TO BE CHANGED WITH WHATEVER USER REQUESTED. FOR NOW, THIS IS HARDCODED (object id of the playlist).
      body: JSON.stringify({ id: ID }),
    };

    const response = await fetch('http://localhost:3001/users/editPlaylist', requestOptions);

    if (response.status === 400) {
      alert('This playlist does not exist.');
      return;
    }

    const temp = await response.json();
    const pl = await temp.PLAYLIST;

    // This returns that array of song objects.
    const songsInPlaylist = await Promise.all(pl.Songs.map((songID) => getSongById(songID)));

    // Note that to reach the song object, there is a middleman scope called
    // 'song'. So, to reach song 0's name, we would do: songs[0].Song.SongName.
    setSongs(songsInPlaylist);

    setPlaylist(pl);
    setNumSongs(songsInPlaylist.length);
  };

  // Fetches the songs of the playlist into the songs useState array and updates number of songs in the playlist.
  useEffect(() => {
    fetchPlaylistById(selectedPlaylistId); // PASTE THE PLAYLIST ID HERE FOR TESTING
  }, [numSongs]);

  // Deletes the song on the specified index.
  async function deleteSongInPlaylist(songInd) {
    if (numSongs === 1) {
      alert('There must be at least 1 song within the playlist');
      return;
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playlistId: playlist._id, songIndex: songInd }),
    };

    const response = await fetch(
      'http://localhost:3001/users/editPlaylist/deleteSong',
      requestOptions
    );

    const temp = await response.json();
    const isSuccessful = temp.isSongDeleted;

    if (isSuccessful) setNumSongs(numSongs - 1);
    else alert('Song cannot be deleted due to unknown reasons');
  }
 
  // Deletes the current playlist being worked on at this page (so, the ObjectId of it is already known in the useState playlist).
  async function deletePlaylistById() {
    // If user has only one playlist left, he/she cannot delete it.
    if (userInfo.PlaylistIDs.length < 2) {
      alert('This playlist cannot be deleted since each user must have at least 1 playlist');
      return;
    }

    // FIXME: DO THE COMMENT BELOW ONCE USER AUTHENTICATION IS DONE.
    // First, delete the playlist from the user table's PlaylistIDs array.

    // Delete the playlist both from the user's PlaylistIDs array and the playlist tables.
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playlistId: playlist._id, userInfo: userInfo }),
    };

    const response = await fetch(
      'http://localhost:3001/users/editPlaylist/deletePlaylist',
      requestOptions
    );

    const temp = await response.json();
    const isSuccessful = temp.isDeleted;

    if (isSuccessful) {
      navigate('/player', { state: { userInfo } }); 
    }
    else alert('Playlist was not found in the database to be deleted');
  }

  return (
    <div>
      {/* Following link is taken from boostrap to create a table. */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css"
        integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
        crossOrigin="anonymous"
      />

      <div className="flex-row flex items-center justify-between">
        <h1 className="text-orange-300 px-4 py-4">{playlist.PlaylistName}</h1>
        <button
          type="button"
          className="text-blue-500 px-4 py-4 text-lg font-medium text-white bg-black rounded-md hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          onClick={() => navigate('/addSongs', { state: { userInfo, selectedPlaylistId: playlist._id } })}
        >
          Add Songs
        </button>
        <button
          type="button"
          className="text-red-500 px-4 py-4 text-lg font-medium text-white bg-black rounded-md hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          onClick={() => deletePlaylistById()}
        >
          Delete Playlist
        </button>
        <button
          type="button"
          className="text-green-500 px-4 py-4 text-lg font-medium text-white bg-black rounded-md hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          onClick={() => navigate('/player', { state: { userInfo } })}
        >
          Done
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">Song Name</th>
            <th scope="col">Artist</th>
            <th scope="col">Release Year</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((item, index) => (
            <tr key={index}>
              <th className="text-orange-300" scope="row">{item.Song.SongName}</th>
              <td className="text-orange-300" >{item.Song.ArtistName}</td>
              <td className="text-orange-300" >{item.Song.ReleaseYear}</td>
              <td>
                <button
                  type="button"
                  className="text-orange-300 px-4 py-2 text-lg font-medium text-white bg-black rounded-md hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                  onClick={() => deleteSongInPlaylist(index)} // Delete songs by their index
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EditPlaylist;
