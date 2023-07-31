"use client"
import React, { useEffect, useState, useRef } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export interface TruthOrDareTileProps {
  className?: string,
  setSuccess(state: boolean): void,
  truth: string,
  dare: string
}

const TruthOrDareTile = ({ className, truth, dare, setSuccess }: TruthOrDareTileProps) => {
  const [chosen, setChosen] = useState<null|number>(null);
  const [TruthOrDare, setTruthOrDare] = useState<null|string>(null);
  const [open, setOpen] = useState<boolean>(false);

  function handlePopupClose() {
    if (chosen !== null)
      setSuccess(chosen !== null);
  }

  return (
    <Popup open={open} trigger={<button className={"button bg-black/25 text-white font-montserrat p-3 ".concat(className || '')}> Prepare for a Truth or Dare! You will be given a prompt based on your choice. There's no coming back! </button>} onClose={handlePopupClose} modal>
      <div>
        <div className='text-4xl text-center my-6'>{!TruthOrDare ? "Truth or Dare?" : TruthOrDare == "truth" ? "Truth" : "Dare"}</div>
        { !TruthOrDare ? 
          <>
            <button className='block text-center w-full py-5 text-xl bg-blue-300 hover:bg-blue-400 duration-150 rounded-lg' onClick={() => {setTruthOrDare('truth'); setOpen(true);}}>Truth</button>
            <button className='block text-center w-full py-5 text-xl bg-red-300 hover:bg-red-400 duration-150 rounded-lg mt-5' onClick={() => {setTruthOrDare('dare'); setOpen(true);}}>Dare</button>
          </> :
          <>
            <div className='block text-center p-5 text-xl bg-blue-300 rounded-lg'>
              { TruthOrDare == 'truth' ? truth : dare }
            </div>
            <div className='text-l flex text-center justify-around mt-5'>
              <button className='bg-red-600 rounded-lg p-3 duration-150 text-white/75 hover:text-white' onClick={() => {setSuccess(false); setOpen(false)}}>Surrender</button>
              <button className='bg-green-600 rounded-lg p-3 duration-150 text-white/75 hover:text-white' onClick={() => {setSuccess(true); setOpen(false)}}>Completed</button>
            </div>
          </>
        }
      </div>
    </Popup>
    
  );
};

export default TruthOrDareTile;