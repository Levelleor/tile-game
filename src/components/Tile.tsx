"use client"
import React, { Children, useEffect, useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import { SpotifyTileProps } from '@/components/tiles/SpotifyTile'

// export interface TileProps {
//   image: string,
//   text: string,
//   truth: string,
//   dare: string
// }

// tile flow
// Welcome component 
// load in closed cardflip state
// click flips the card and load the data (wait for loading) (should be managed by tile, all loadings are the same...)
// tile has the unique logic under it (managed by each specific tile component)
// Once completed or failed it should elevate the results to to global (managed by global component with global db object in it)
// global data is passed down as params to set the tile as succeeded or failed (managed by tile component as all fail/success screens are same)
// global component computes the results and curates the flow. (balances, names)
// once the flow is completed a unique "Summary" component is rendered with shop and gifts

export interface TileProps {
  children: React.ReactNode,
  done: boolean,
  onFlip?(): void,
  canflip: boolean,
  icon: string,
  tileBgClass: string
}

const Tile = ({children, done, onFlip, canflip, icon, tileBgClass}: TileProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!done && canflip) {
      setIsFlipped(true);
      onFlip && onFlip();
    }
  }

  return (
    <ReactCardFlip isFlipped={done === null && isFlipped} flipDirection="horizontal">
      <div className='flex flex-col bg-black w-48 h-48 text-white text-center cursor-pointer select-none relative' onClick={handleClick}>
        <div className={`basis-2/3 flex items-center justify-center text-8xl codename duration-700 hover:scale-105 font-concert-one${done !== null ? (done ? ' success' : ' fail') : ''}`}>
          { done === null ? "?" : icon.charAt(0).toLocaleUpperCase()}
        </div>
        <div className='grow font-montserrat'>
          <p>{ done === null ? "Click to flip" : (done ? 'Good job ✔️' : 'That sucks ❌') }</p>
        </div>
      </div>
      <div className='relative w-full h-full'>
        <div className={`w-48 h-48 bg-black text-white text-9xl flex items-center justify-center${tileBgClass ? ' '+tileBgClass : ''}`}>
          <div className='codename duration-700 hover:scale-105 font-concert-one'>
            {icon.charAt(0).toLocaleUpperCase()}
          </div>
        </div>
        <div className='absolute top-0 left-0 w-full h-full'>
          {children}
        </div>
      </div>
    </ReactCardFlip>
  );
};

export default Tile;