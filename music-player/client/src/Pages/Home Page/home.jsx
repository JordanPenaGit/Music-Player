/* eslint-disable no-undef */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable react/prop-types */
/* eslint-disable global-require */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MusicScreen from '../../Components/Music-screen';
import Sidebar from '../../Components/Sidebar-left';
import '../../Components/css/home.css';

function Home() {
  return (
    <div>routing page</div>
    // <Router>
    //   <div className="main-body">
    //     <Routes>
    //       <Route path="/" element={<Sidebar />} />
    //       {/* <div className="playlist-card">
    //         <img src={require(`../../Components/images/${props.song.img_src}.jpg`)} alt="" />
    //       </div> */}
    //       {/* <Route path="/" element={<Login />} /> */}
    //       {/* <Route path="/player" element={<MusicScreen />} /> */}
    //     </Routes>
    //   </div>
    // </Router>
  );
}

export default Home;
