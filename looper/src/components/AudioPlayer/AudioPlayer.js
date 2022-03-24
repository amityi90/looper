import React, { useState, useRef, useEffect, useCallback, forwardRef, useContext } from 'react';
import { GoUnmute, GoMute } from 'react-icons/go';
import { audioDetailsContext } from '../../contexts/audioDetailsContext';

const AudioPlayer = forwardRef((props, ref) => {

    const mainAudioDetails = useContext(audioDetailsContext);

    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    const audioPlayer = useRef();
    const progressBar = useRef();
    const animationRef = useRef();

    const stopAudio = useCallback(
        () => {
            props.setPlay(false);
            audioPlayer.current.pause();
            cancelAnimationFrame(animationRef.current);
            audioPlayer.current.currentTime = 0;
            progressBar.current.value = audioPlayer.current.currentTime;
            setCurrentTime(progressBar.current.value);
        }
        ,
        [],
    );

    // visualisation of track while playing

    const whilePlaying = useCallback(() => {
            if (props.loop.current.loop && audioPlayer.current.currentTime > (audioPlayer.current.duration - 0.15)) {
                audioPlayer.current.currentTime = 0;
            }
        progressBar.current.value = audioPlayer.current.currentTime;
        setCurrentTime(progressBar.current.value);
        animationRef.current = requestAnimationFrame(whilePlaying);
    },
        [props.loop],
    );

    // play track

    useEffect(() => {
        if (props.play && !isMuted) {
            audioPlayer.current.play();
            animationRef.current = requestAnimationFrame(whilePlaying);

        }
    }, [props.play, props.loop]);

    // stop track

    useEffect(() => {
        if (props.stop) {
            stopAudio();
            props.stopAll();
        }
    }, [props.stop]);

    // set the track current time by the main progress bar

    useEffect(() => {
        if (mainAudioDetails.currentTime && !isMuted) {
            progressBar.current.value = mainAudioDetails.currentTime;
            audioPlayer.current.currentTime = mainAudioDetails.currentTime;
            setCurrentTime(mainAudioDetails.currentTime);
        }
    }, [mainAudioDetails.currentTime]);

    // initial the visualisation

    useEffect(() => {
        const seconds = Math.floor(audioPlayer.current.duration);
        setDuration(seconds);
        props.setMainAudioDetails({ duration: seconds });
        progressBar.current.max = seconds;
    }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

    // convert time to minutes:seconds format 

    const calculateTime = (secs) => {
        const minutes = Math.floor(secs / 60);
        const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${returnedMinutes}:${returnedSeconds}`;
    }

    // change audio current time by progress bar

    const changeRange = () => {
        audioPlayer.current.currentTime = progressBar.current.value;
        setCurrentTime(progressBar.current.value);
    }

    // mute track

    const mutePlayer = () => {
        audioPlayer.current.muted = audioPlayer.current.muted ? false : true;
        setIsMuted(audioPlayer.current.muted);
    }

    return (
        <div className='audio-player' style={{ borderBottom: `2px solid #${props.color}` }}>
            <h2 className='audio-player__name' style={{ color: `#${props.color}` }}>{props.name}</h2>
            <audio
                className='audio-player__audio'
                ref={audioPlayer} src={props.track}
                onEnded={stopAudio}
            />
            <div className='audio-player__current-time audio-player__time'>{calculateTime(currentTime)}</div>
            <input className='audio-player__progress-bar' type="range" defaultValue="0" ref={progressBar} onChange={changeRange} step="0.001" />
            <div className='audio-player__duration audio-player__time'>{isNaN(duration) ? '00:00' : (duration && !isNaN(duration)) && calculateTime(duration)}</div>
            <button className='audio-player__mute' onClick={mutePlayer}>{isMuted ? <GoMute /> : <GoUnmute />}</button>
        </div>
    );
})

export default AudioPlayer;
