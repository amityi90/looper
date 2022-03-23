import React, { useState, useRef, useEffect } from 'react';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import tambourineShakeHigher from '../../audio/_tambourine_shake_higher.mp3';
import allTrack from '../../audio/ALL TRACK.mp3';
import bVoc from '../../audio/B VOC.mp3';
import drums from '../../audio/DRUMS.mp3';
import heHeVoc from '../../audio/HE HE VOC.mp3';
import highVoc from '../../audio/HIGH VOC.mp3';
import jibrish from '../../audio/JIBRISH.mp3';
import lead from '../../audio/LEAD 1.mp3';
import { audioDetailsContext } from '../../contexts/audioDetailsContext';
import Controls from '../Controls/Controls';



function App() {

  // initial tracks list

  const tracksList = [tambourineShakeHigher, drums, allTrack, bVoc, heHeVoc, highVoc, jibrish, lead];

  const detailedTracksList = tracksList.map((track, index) => {
    const randomColor = (track.slice(-15, -9)).toString(16);// generate unique color for each track
    const newTrack = {
      track: track,
      name: `Track ${index + 1}`,
      color: randomColor
    }
    return newTrack;
  });

  const mainProgressBarRef = useRef();
  const loopRef = useRef({ loop: false });

  const [play, setPlay] = useState(false);
  const [stop, setStop] = useState(true);
  const [loop, setLoop] = useState(false);
  const [mainAudioDetails, setMainAudioDetails] = useState({});// hook for the context

  // play all tracks

  const playAll = () => {
    setStop(false);
    setPlay(true);
  }

  // stop all tracks

  const stopAll = () => {
    setPlay(false);
    setStop(true);
  }

  // turn the loop option on and off

  const toggleLoop = () => {
    setLoop(!loop);
    loopRef.current.loop = !loopRef.current.loop;
  }

  // set all of the tracks crusers

  const setMainTime = () => {
    setMainAudioDetails({
      ...mainAudioDetails,
      currentTime: mainProgressBarRef.current.value
    })
  }

  //  set the max value of the main progress bar

  useEffect(() => {
    mainProgressBarRef.current.max = mainAudioDetails.duration;
  }, [mainAudioDetails.duration]);



  return (
    <div className='app'>
      <h1 className='app__title'>Sound Looper</h1>
      <p className='app__description'>play with sounds and make canons</p>
      <audioDetailsContext.Provider value={mainAudioDetails}>
        <section className='app__traks-list'>
          <input
            className='app__progress-bar audio-player__progress-bar'
            ref={mainProgressBarRef}
            type="range" defaultValue="0"
            step="0.001"
            onChange={setMainTime}
          />
          {
            detailedTracksList.map((track, index) => {
              return (
                <AudioPlayer
                  key={index}
                  name={track.name}
                  color={track.color}
                  track={track.track}
                  play={play}
                  stop={stop}
                  loop={loopRef}
                  setMainAudioDetails={setMainAudioDetails}
                  stopAll={stopAll}
                  setPlay={setPlay}
                />
              );
            })
          }
        </section>
        <Controls
          playAll={playAll}
          stopAll={stopAll}
          toggleLoop={toggleLoop}
          loop={loop}
        />
      </audioDetailsContext.Provider>
    </div>
  );
}

export default App;
