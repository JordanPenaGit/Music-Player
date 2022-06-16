/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import './css/Music-screen.css';

function PlayerDetails(props) {
  const { playingSong } = props;
  return (
    <div className="c-player--details">
      <div className="details-img">
        <img src={playingSong.Song.ImageSrcPath} alt="" />
      </div>
      <h3 className="details-title">{playingSong.Song.SongName}</h3>
      <h4 className="details-artist">{playingSong.Song.ArtistName}</h4>
    </div>
  );
}
export default PlayerDetails;
