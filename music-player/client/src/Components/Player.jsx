/* eslint-disable */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-plusplus */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-filename-extension */
import React, { useState, useRef, useEffect } from 'react';
import PlayerControls from './Player-controls';
import './css/Music-screen.css';

function Player(props) {
  const { currentSongIndex, setCurrentSongIndex, nextSongIndex, songs } = props;
  console.log('SONGS in player');
  console.log(songs);

  // Takes care of skipping the song forwards and backwards.
  const SkipSong = async (forwards = true) => {
    if (forwards) {
      setCurrentSongIndex(() => {
        let temp = currentSongIndex;
        temp++;

        if (temp > songs.length - 1) {
          temp = 0;
        }

        return temp;
      });
    } else {
      setCurrentSongIndex(() => {
        let temp = currentSongIndex;
        temp--;

        if (temp < 0) {
          temp = props.songs.length - 1;
        }

        return temp;
      });
    }
  };

  // SHUFFLE FEATURE IS NOT REQUIRED, SO LEAVE IT ALONE. BUT KEEP THE CODE HERE JUST INCASE YOU WANT TO IMPLEMENT LATER ON.
  // const shuffleSong = (shuffleS = false) => {
  //   const copy = [...props.songs];
  //   if (shuffleS) {
  //     props.copy.sort(() => 0.5 - Math.random());

  //     props.setCurrentSongIndex(() => {
  //       let temp = props.currentSongIndex;

  //       if (temp > props.copy.length - 1) {
  //         temp = 0;
  //       }
  //       return temp;
  //     });
  //   } else {
  //     props.setCurrentSongIndex(() => {
  //       let temp = props.currentSongIndex;
  //       if (temp < 0) {
  //         temp = props.copy.length - 1;
  //       }
  //       return temp;
  //     });
  //   }
  // };

  console.log('here is the song array');
  console.log(songs);

  // function sleep(ms) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }

  // const showNextUp = async () => {
  //   console.log('before wait');
  //   // await sleep(2000);
  //   console.log('after wait');
  //   return (
  //     <p className="mt-4">
  //       Next up:{' '}
  //       {((songs[nextSongIndex].Song === undefined) || (songs[nextSongIndex].Song === null)) ? (
  //         <span>
  //           {songs[nextSongIndex].SongName} by {songs[nextSongIndex].ArtistName}
  //         </span>
  //       ) : (
  //         <span>
  //           {songs[nextSongIndex].Song.SongName} by {songs[nextSongIndex].Song.ArtistName}
  //         </span>
  //       )}
  //     </p>
  //   );
  // }

  return (
    <div>
      {songs.length > 0 && currentSongIndex >= 0 && currentSongIndex < songs.length ? (
        <div className="c-player">
          <h4>Playing now</h4>
          <PlayerControls
            currentSongIndex={currentSongIndex}
            songs={songs}
            SkipSong={SkipSong}
            nextSongIndex={nextSongIndex}
          />
          <p className="mt-4">
            Next up:{' '}
            {(nextSongIndex >= songs.length) ? null : ((songs[nextSongIndex].Song === undefined) || (songs[nextSongIndex].Song === null)) ? (
              <span>
                {songs[nextSongIndex].SongName} by {songs[nextSongIndex].ArtistName}
              </span>
            ) : (
              <span>
                {songs[nextSongIndex].Song.SongName} by {songs[nextSongIndex].Song.ArtistName}
              </span>
            )}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default Player;
