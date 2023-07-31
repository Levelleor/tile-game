"use client"
import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export interface PollTileProps {
  className?: string,
  question: string,
  options: string[],
  setSuccess(state: boolean): void
}

const PollTile = ({ className, question, setSuccess, options }: PollTileProps) => {
  const [chosen, setChosen] = useState<null|number>(null);

  function handleAnswer(picked: number) {
    if (chosen !== null && chosen !== undefined) return;
    setChosen(picked);
  }

  function handlePopupClose() {
    if (chosen !== null)
      setSuccess(chosen !== null);
  }

  return (
    <Popup trigger={<button className={"button tile-instructions-text text-white ".concat(className || '')}> Prepare for a poll! You have to pick only one! </button>} onClose={handlePopupClose} modal>
      <div>
        <div className='text-4xl text-center my-6'>{question}</div>
        <ul className='text-center'>
          { options.map((el, i) => 
            <li className={`p-1 bg-blue-300 ${chosen === null && 'hover:bg-purple-400'} rounded-lg w-1/3 mx-auto my-3 text-xl cursor-pointer select-none ${chosen !== null && i === chosen && 'bg-green-400'}`}
                key={el} 
                onClick={handleAnswer.bind(null, i)}>{el}</li>) }
        </ul>
      </div>
    </Popup>
    
  );
};

export default PollTile;