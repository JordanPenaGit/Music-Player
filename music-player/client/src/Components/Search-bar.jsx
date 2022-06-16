/* eslint-disable */
import React, { useState } from "react";
import TextField from '@mui/material/TextField';

function SearchBar(props) {
  // Initialize releaseYears from 1900 to 2022.
  var releaseYears = [];
  for (let i = 1900; i <= 2022; i = i + 1) releaseYears.push(i);

  const [searchBy, setSearchBy] = useState('SongName');
  const [searchInput, setSearchInput] = useState('');
  // const [songsAdded, setSongsAdded] = useState([]);
  const [releaseYear, setReleaseYear] = useState(0);
  const [genre, setGenre] = useState('none'); // default
  const [results, setResults] = useState([]);

  const searchInDatabase = async () => {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ SearchBy: searchBy, SearchInput: searchInput, releaseYear, genre})
    }

    const response = await fetch('http://localhost:3001/users/createPlaylist/search', requestOptions);
    const temp = await response.json();
    setResults(temp);
  }

  const handleReleaseYear = (e) => {
    if (e.target.value === 'none')
      setReleaseYear(0);
    else
      setReleaseYear(e.target.value);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div>
        <label>Search By: </label>
				<select name="searchBy" onChange={(e) => setSearchBy(e.target.value)}>
					<option value="SongName">Song Name</option>
					<option value="ArtistName">Singer Name</option>
					<option value="AlbumName">Album Name</option>
				</select>
      </div>
      <label>Filter By: </label>
      <div>
        <label>Release Year: </label>
        <select name="filterByReleaseYear" onChange={handleReleaseYear}>
          <option value='none'>None</option>
          {releaseYears.map((years, index) => <option key={index} value={years}>{years}</option>)}
        </select>
        <label> Genre: </label>
        <select name="filterByGenre" onChange={(e) => setGenre(e.target.value)}>
          {/* FIXME: ADD MORE AS THEY COME */}
          <option value="none">None</option>
					<option value="Dance">Dance</option>
          <option value="Electronic">Electronic</option>
          <option value="Indie">Indie</option>
					<option value="Pop">Pop</option>
          <option value="Rock">Rock</option>
					<option value="Soul">Soul</option>
        </select>
      </div>
      <div>
        <input className="px-2 shadow-sm border-gray-300 rounded-lg m-2 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400" type="text" placeholder="Search..." onChange={(event) => setSearchInput(event.target.value)}/>
        <button
          type="button"
          className="text-green-400 px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          onClick={() => searchInDatabase()}
        >
          Search
        </button>
      </div>
      
      {results.map((song, index) => (
        <button key={index} type="button"
        className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75" 
        onClick={() => props.setNewPlaylist(song)}>{song.SongName} - {song.ArtistName} - {song.AlbumName}</button>
      ))}
    </div>
  );
}

export default SearchBar;