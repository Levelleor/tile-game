"use client"
import React, { useEffect, useState, useRef } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './SpotyfyTile.css';
import { motion } from 'framer-motion';

export interface SpotifyTileProps {
  className?: string,
  track: string,
  question: string,
  answer: string,
  options: string[],
  setSuccess(state: boolean): void,
  timeout: number
}

const SpotifyTile = ({ className, track, question, answer, options, setSuccess, timeout }: SpotifyTileProps) => {
  if (!options.some(x => x.toLowerCase() == answer.toLowerCase())) throw new Error('Options array must include an answer');

  const [trackData, setTrack] = useState<any>(null);
  const [soundBuffer, setSoundBuffer] = useState<AudioBuffer|undefined>(undefined);
  const audioContext = useRef(new AudioContext());
  const sourceNode = useRef<AudioBufferSourceNode|null>(null);
  const gainNode = useRef(audioContext.current.createGain());
  const [failed, setFailed] = useState<null|boolean>(null);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    async function getTrack() {
      const data = await fetch('/api/spotify?track=' + track + '?market=ES');
      const trackData = await data.json();
      setTrack(trackData);
    }
    getTrack();
  }, []);

  useEffect(() => {
    if (trackData) {
      fetch(trackData.preview_url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.current.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          setSoundBuffer(audioBuffer);
        });
    }
  }, [trackData]);
  
  function play() {
    if (!soundBuffer) return;
    sourceNode.current = audioContext.current.createBufferSource();
    sourceNode.current.buffer = soundBuffer;
    sourceNode.current.connect(gainNode.current);
    gainNode.current.connect(audioContext.current.destination);
    gainNode.current.gain.setValueAtTime(0, audioContext.current.currentTime);
    gainNode.current.gain.linearRampToValueAtTime(1, audioContext.current.currentTime + 3);
    sourceNode.current.start();
  }

  function stop() {
    if (sourceNode.current) {
      sourceNode.current.stop();
      sourceNode.current = null;
    }
  }

  function handlePopupClose() {
    stop();
    if (failed === null) {
      setSuccess(false);
      return;
    }
    setSuccess(!failed);
  }

  function handlePopupOpen() {
    play();
  }

  function handleAnswer(picked: string) {
    if (failed !== null) return;
    if (picked === answer) {
      setFailed(false);
      adjustVolume();
    } else {
      setFailed(true);
    }
  }

  function handleTimeout() {
    setFailed(true);
  }

  function adjustVolume() {
    gainNode.current.gain.setValueAtTime(1.5, audioContext.current.currentTime);
  }

  function handlePopupOpenButton() {
    if (!soundBuffer) return;
    setOpen(true);
  }

  const popup = <>
    <button className={"button bg-black/25 text-white font-montserrat p-3 ".concat(className || '')} onClick={handlePopupOpenButton}>
      Prepare to listen to music. You will have to solve a trivia about it in {timeout} seconds! 
    </button>
    <Popup 
      onClose={handlePopupClose} onOpen={handlePopupOpen}
      modal
      closeOnDocumentClick={failed !== null}
      closeOnEscape={failed !== null}
      open={open}
    >
      <div>
        <div className='text-4xl text-center my-6'>{question}</div>
        <ul className='text-center'>
          { options.map((el) => 
            <li className={`p-1 bg-blue-300 ${failed === null && 'hover:bg-purple-400'} rounded-lg w-1/3 mx-auto my-3 text-xl cursor-pointer select-none ${failed !== null && (el === answer ? 'bg-green-400' : 'bg-red-400')}`}
                key={el} 
                onClick={handleAnswer.bind(null, el)}>{el}</li>) }
        </ul>
        { failed === null && 
          <div className='absolute h-3 top-0 left-0 w-full bg-gray-500'>
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: timeout, ease: "linear" }}
              onAnimationComplete={() => handleTimeout()}
              className='absolute top-0 left-0 h-full bg-red-400'
            />
          </div>
        }
      </div>
    </Popup>
  </>

  const loading = 
  <button type="button"
          className={"absolute bottom-0 left-0 w-full p-3 hover:py-5 duration-500 z-10 bg-gradient-to-r cursor-wait from-pink-500 via-red-500 to-yellow-500 background-animate flex items-center justify-center font-mono"} 
          disabled>
    <svg width="64px" height="64px" viewBox="-2.4 -2.4 20.80 20.80" xmlns="http://www.w3.org/2000/svg" fill="none" 
        className="animate-spin h-6 w-6 mx-2 grow-0 hds-flight-icon--animation-loading" 
        stroke="#000000" strokeWidth="1.6" transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.32"></g>
      <g id="SVGRepo_iconCarrier">
        <g fill="#000000" fillRule="evenodd" clipRule="evenodd">
          <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z" opacity=".2"></path>
          <path d="M7.25.75A.75.75 0 018 0a8 8 0 018 8 .75.75 0 01-1.5 0A6.5 6.5 0 008 1.5a.75.75 0 01-.75-.75z"></path>
        </g>
      </g>
    </svg>
    Loading...
  </button>
  
  return <>
    {!soundBuffer ? loading : ""}
    {popup}
  </>
};

export default SpotifyTile;