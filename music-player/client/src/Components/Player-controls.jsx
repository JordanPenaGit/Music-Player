/* eslint-disable */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MdOutlineRepeatOneOn, MdRepeat, MdOutlineRepeatOn } from 'react-icons/md';
import React, { useState } from 'react';
import {
  faPlay,
  faPause,
  faForward,
  faBackward,
  faRepeat,
  faHeart,
  faArrowsRepeat,
  faReply,
  faArrowCircleLeft,
  faArrowRightArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import PlayerDetails from './Player-details';

import './css/Music-screen.css';

function PlayerControls(props) {
  const { songs, currentSongIndex, SkipSong } = props;
  const player = document.getElementById('audio-control');
  const [loopType, setLoopType] = useState(0); // 0: no looping, 1: looping playlist, 2: looping song
  const [isSongLooping, setIsSongLooping] = useState(false);
  const songAudio = useRef(null);

  useEffect(
    () => (setIsSongLooping(loopType === 2)),
    [loopType]
  );

  async function handleLooping() {
    // Looping playlist
    if (loopType === 1) {
      SkipSong();

      // Wait 100 milliseconds before starting the next song.
      setTimeout(() => {
        player.play();
      }, 100); 
    }
    // Nothing
    else if (loopType === 0) {
      setIsSongLooping(false);
    }
  }

  return (
    <div>
      <div>
        <PlayerDetails playingSong={songs[currentSongIndex]} />
        <audio
          className="mb-4"
          id="audio-control"
          src={songs[currentSongIndex].Song.AudioSrcPath}
          ref={songAudio}
          loop={isSongLooping}
          controls
          preload='auto'
          onEnded={() => handleLooping()}
          // autoplay='auto'
        />
      </div>
      <div>
        {/* class name of c-player--controls doesn't allow the justify between and such tailwind commands */}
        <div className="flex flex-row justify-between">
          <button className="skip-btn text-blue-400" onClick={() => SkipSong(false)}>
            <FontAwesomeIcon icon={faBackward} />
          </button>
          <button className="loop-btn text-blue-400" onClick={() => setLoopType((loopType + 1) % 3)}>
            {loopType === 0 ? (
              <MdRepeat size={27} />
            ) : loopType === 1 ? (
              <MdOutlineRepeatOn size={27} />
            ) : (
              <MdOutlineRepeatOneOn size={27} />
            )}
          </button>
          <button className="skip-btn text-blue-400" onClick={() => SkipSong()}>
            <FontAwesomeIcon icon={faForward} />
          </button>
        </div>

        {/* THIS ISN'T REQUIRED, SO LEAVE IT ALONE. BUT KEEP IT JUST INCASE YOU WANT TO IMPLEMENT LATER ON. */}
        {/* <button className="shuffle-btn-on" onClick={() => props.shuffleSongs(false)}>
        <FontAwesomeIcon icon={faShuffle} />
      </button> */}
      </div>
    </div>
  );
}

export default PlayerControls;
