/* eslint-disable prettier/prettier */
/* eslint-disable no-alert */
/* eslint-disable no-underscore-dangle */
/* eslind-disable */
/* eslint-disable react/no-array-index-key */
// import useState hook to create menu collapse state
// eslint-disable-next-line no-unused-vars
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-duplicates */
/* eslint-disable react/jsx-no-undef */
import React, { useState } from 'react';
import './css/Sidebar-right.css';
import 'react-pro-sidebar/dist/css/styles.css';
import './css/Sidebar-right.css';

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
import { FiArrowLeftCircle, FiArrowRightCircle, FiEdit, FiSearch } from 'react-icons/fi';
import { GiMusicalNotes } from 'react-icons/gi';

import { Link } from 'react-router-dom';

function SidebarRight(props) {
  const {
    selectedPlaylist,
    selectedPlaylistSongs,
    userInfo,
    setPlayingSong,
    setPlayingPlaylistSongs,
    setPlayingPlaylist,
    setCurrentSongIndex,
  } = props;

  const [menuCollapse, setMenuCollapse] = useState(false);

  // create a custom function that will change menucollapse state from false to true and true to false
  const menuIconClick = () => {
    // condition checking to change state from true to false and vice versa
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
  };

  function handleSelectedSong(songIndex) {
    setCurrentSongIndex(songIndex);
    setPlayingPlaylistSongs(selectedPlaylistSongs);
    setPlayingPlaylist(selectedPlaylist);
    setPlayingSong(selectedPlaylistSongs[songIndex]);
  }

  return (
    <div id="sidebar-right">
      {/* collapsed props to change menu size using menucollapse state */}
      <ProSidebar collapsed={menuCollapse}>
        <SidebarHeader>
          <div className="logotext">
            {/* small and big change using menucollapse state */}
            <p>{menuCollapse ? <GiMusicalNotes /> : 'Selected Playlist'}</p>
          </div>
          <div className="closemenu" onClick={() => menuIconClick()}>
            {/* changing menu collapse icon on click */}
            {menuCollapse ? <FiArrowLeftCircle /> : <FiArrowRightCircle />}
          </div>
        </SidebarHeader>
        {/* // _________________ */}
        <SidebarContent>
          <Menu iconShape="square">
            <MenuItem active icon={<GiMusicalNotes />}>
              {Object.keys(selectedPlaylist).length === 0
                ? 'No Playlists Selected'
                : selectedPlaylist.PLAYLIST.PlaylistName}
            </MenuItem>
            <SubMenu title="Playlist's Songs" icon={<GiMusicalNotes />}>
              {Object.keys(selectedPlaylist).length === 0 ? (
                <MenuItem>No Playlists Selected</MenuItem>
              ) : (
                selectedPlaylistSongs.map((song, index) => (
                  <MenuItem onClick={() => handleSelectedSong(index)} key={index}>
                    {song.Song.SongName}
                  </MenuItem>
                ))
              )}
            </SubMenu>
          </Menu>
        </SidebarContent>
        {/* // _________________ */}
        {Object.keys(selectedPlaylist).length === 0 ? (
          <SidebarFooter>
            <Menu iconShape="square">
              {/* FIXME: WE NEED TO ADD AN ONCLICK TO THIS */}
              <MenuItem onClick={() => alert('No playlists selected to edit')} icon={<FiEdit />}>
                Edit Playlist
              </MenuItem>
            </Menu>
          </SidebarFooter>
        ) : (
          <Link
            to="/editPlaylist"
            state={{ userInfo: userInfo, selectedPlaylistId: selectedPlaylist.PLAYLIST._id }}
          >
            <SidebarFooter>
              <Menu iconShape="square">
                <MenuItem icon={<FiEdit />}> Edit Playlist</MenuItem>
              </Menu>
            </SidebarFooter>
          </Link>
        )}
      </ProSidebar>
    </div>
  );
}

export default SidebarRight;
