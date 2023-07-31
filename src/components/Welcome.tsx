"use client"
import React, { useEffect, useState, useRef } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Switch from "react-switch";
import TruthOrDareTile from './tiles/TruthOrDare';

export interface WelcomeProps {
  className?: string,
  name: string, 
  name2: string,
  setName(value: string): void,
  setName2(value: string): void,
  onComplete(): void,
  useHorny(): [boolean, (a: boolean) => void],
  useDifficult(): [boolean, (a: boolean) => void]
}

declare global {
  interface Window {
    enableHorny(): void
  }
}

// Welcome
// Who is the main character, I mean, birthday girl today? 
// Who is the side character?

// 3 ... [photo]
// 2 ... [photo] [photo2]
// 1 ... [photo] [photo2] [photo3]

const Welcome = ({ className, name, setName, name2, setName2, onComplete, useHorny, useDifficult }: WelcomeProps) => {
  const [startDisabled, setStartDisabled] = useState(false);
  const [imageDisplay, setImageDisplay] = useState([false, false, false]);
  const [showHorny, setShowHorny] = useState<boolean>(false);
  const [isHornyOn, setHorny] = useHorny();
  const [isHardDiff, setDiff] = useDifficult();

  const images = ['/3-min.jpg', '/2-min.jpg', '/1-min.jpg'];

  useEffect(() => {
    //preloading images
    images.forEach((url) => {
      new Image().src = url;
    });
  }, []);

  function handleStart() {
    if (startDisabled) return;
    setStartDisabled(!startDisabled);
    kickoff();
  }

  function kickoff() {
    setTimeout(() => setImageDisplay([true, false, false]), 500);
    setTimeout(() => setImageDisplay([true, true, false]), 1500);
    setTimeout(() => setImageDisplay([true, true, true]), 2100);
    setTimeout(() => onComplete(), 2400);
  }

  window.enableHorny = () => {
    setShowHorny(true);
  }

  return (
    <div className='font-montserrat'>
      <div className='text-2xl mb-16'>
        <p>Welcome <input value={name} onChange={e => setName(e.target.value)} className='text-center mx-3 font-concert-one' placeholder='Your Name' disabled={startDisabled} />!</p>
        <span className='text-sm italic'>Names will be actually used in questions so try to use real names :)</span>
      </div>
      <div className='mb-12'>
        <p>And your partner known as <input value={name2} onChange={e => setName2(e.target.value)} className='text-center mx-1 font-concert-one' placeholder='Partner Name' disabled={startDisabled} />.</p>
      </div>
      <div className='mb-12 align-middle'>
        <p className='mb-3'>Choose difficulty:</p>
        <span>Alina4ka</span> <Switch onChange={checked => setDiff(checked)} checked={isHardDiff} className='align-middle' onColor="#f00" offColor="#4d9130" /> <span className={`text-red-800 demondifficulty${isHardDiff ? ' active' : ''}`}>Demolina4ka</span>
      </div>
      { showHorny === true ? <div className='mb-12 align-middle'>
        <p className='mb-3'>Enable horny:</p>
        <span>No horny</span> <Switch onChange={checked => setHorny(checked)} checked={isHornyOn} className='align-middle' checkedIcon={<>🍆</>} /> <span className='text-pink-800'>Some horny</span>
      </div> : ''}
      <button className='rounded-full px-5 py-1 mb-8 bg-blue-300 hover:bg-purple-400 disabled:bg-gray-400' onClick={handleStart} disabled={startDisabled || name2.length < 3 || name.length < 3}>Start</button>
      <div className='flex justify-start'>
        <div className={`w-4/12 h-60 bg-black relative${!imageDisplay[0] ? ' hidden' : ''}`} style={{marginRight: '4%'}}>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl text-white'>3</div>
          <img className="object-cover w-full h-full" src='/3-min.jpg' />
        </div>
        <div className={`w-4/12 h-60 bg-black relative${!imageDisplay[1] ? ' hidden' : ''}`} style={{marginRight: '4%'}}>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl text-white'>2</div>
          <img className="object-cover w-full h-full" src='/2-min.jpg' />
        </div>
        <div className={`w-3/12 h-60 bg-black relative${!imageDisplay[2] ? ' hidden' : ''}`}>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl text-white'>1</div>
          <img className="object-cover w-full h-full" src='/1-min.jpg' />
        </div>
      </div>
    </div>
  );
};

export default Welcome;