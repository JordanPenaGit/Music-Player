/* eslint-disable */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-duplicates */
/* eslint-disable react/jsx-no-undef */
import 'react-pro-sidebar/dist/css/styles.css';
import { Link, Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// import useState hook to create menu collapse state
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import './css/Sidebar-left.css';

// import react pro sidebar components
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SubMenu,
} from 'react-pro-sidebar';

// import icons from react icons
import { FaRegHeart } from 'react-icons/fa';
import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle, FiArchive } from 'react-icons/fi';
import { RiPencilLine } from 'react-icons/ri';
import { BiCog } from 'react-icons/bi';
import { GiMusicalNotes } from 'react-icons/gi';

// import sidebar css from react-pro-sidebar module and our custom css
import 'react-pro-sidebar/dist/css/styles.css';

function Sidebar( props ) {

  const navigate = useNavigate();
  const { Playlists, setSelectedPlaylist, setSelectedPlaylistSongs, userInfo, setShowSongs, showSongs } = props;
  const [menuCollapse, setMenuCollapse] = useState(false);

  // create a custom function that will change menucollapse state from false to true and true to false
  const menuIconClick = () => {
    // condition checking to change state from true to false and vice versa
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
  };

  const getSongById = async (ID) => {
    const requestOptions = {
      method: 'POST', // FIXME: CHANGE TO GET REQUEST ONCE YOU KNOW HOW TO
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: ID }),
    };

    const response = await fetch('http://localhost:3001/users/songs', requestOptions);
    return response.json();
  };

  const fetchSongsOfPlaylist = async (playlist) => {
    // This returns that array of song objects.
    const songsInPlaylist = await Promise.all(playlist.PLAYLIST.Songs.map((songID) => getSongById(songID)));

    console.log('SONGSSSS');
    console.log(songsInPlaylist);

    // Note that to reach the song object, there is a middleman scope called
    // 'Song'. So, to reach song 0's name, we would do: songs[0].Song.SongName.
    setSelectedPlaylistSongs(songsInPlaylist);
    setSelectedPlaylist(playlist);
    setShowSongs(true);

    console.log(showSongs);
  };

  return (
    <div id="sidebar">
      {/* collapsed props to change menu size using menucollapse state */}
      <ProSidebar collapsed={menuCollapse}>
        <SidebarHeader>
          <div className="logotext">
            {/* small and big change using menucollapse state */}
            <p>{menuCollapse ? 'MA' : 'Music App'}</p>
          </div>
          <div className="closemenu" onClick={menuIconClick}>
            {/* changing menu collapse icon on click */}
            {menuCollapse ? <FiArrowRightCircle /> : <FiArrowLeftCircle />}
          </div>
        </SidebarHeader>
        {/* // _________________ */}
        <SidebarContent>
          <Menu iconShape="square">
            <Link to='/createPlaylist' state={ { userInfo: userInfo } }>
              <MenuItem active icon={<FiArchive />}>
                Create Playlist
              </MenuItem>
            </Link>
            <SubMenu title="My Playlists" icon={<GiMusicalNotes />}>
              { Playlists.map((item, index) => (
                <div key={index} onClick={() => fetchSongsOfPlaylist(Playlists[index])}> 
                  <MenuItem>{item.PLAYLIST.PlaylistName}</MenuItem>
                </div>
              ))}
            </SubMenu>
          </Menu>
        </SidebarContent>
        {/* // _________________ */}
        <SidebarFooter>
          <Menu iconShape="square">
            <MenuItem 
              onClick={() => navigate('/')} 
              icon={<FiLogOut />}
            >
                Logout
            </MenuItem>
          </Menu>
        </SidebarFooter>
      </ProSidebar>
    </div>
  );
}

export default Sidebar;
