"use client"
import React, { useEffect, useState } from 'react';
// import Tile, {TileProps} from './Tile';
import Tile from './Tile';
import SpotifyTile from './tiles/SpotifyTile';
import TriviaTile from './tiles/TriviaTile';
import PollTile from './tiles/PollTile';
import TruthOrDareTile from './tiles/TruthOrDare';
import Announcer from './Announcer';
import { setupTiles, getRandomAnyTile, getRandomKindTile } from '@/components/config/TileManager';

interface Round {
  id: number,
  data: {
    layout: string
  },
  setComplete(): void,
  useBalance: [number, (value: number) => void],
  name2: string,
  isHorny: boolean
  isDifficultConfig: boolean
}

const colors: {[key: string]: string} = {
  "trivia": "bg-trivia",
  "spotify trivia": "bg-spotify",
  "poll": "bg-poll",
  "heart": "bg-heart",
  "image trivia": "bg-itrivia",
  "truth or dare": "bg-truthordare"
}

const generateTile = (kind: string, isHorny: boolean, isDifficultConfig: boolean) => {
  switch(kind) {
    case 'x':
      return getRandomAnyTile(false, isHorny, isDifficultConfig);
    case 'X':
      return getRandomAnyTile(true, isHorny, true);
    case 'h':
      return getRandomKindTile('heart', false, isHorny, isDifficultConfig);
    case 'H':
      return getRandomKindTile('heart', true, isHorny, true);
    case 't':
      return getRandomKindTile('trivia', false, isHorny, isDifficultConfig);
    case 'T':
      return getRandomKindTile('trivia', true, isHorny, true);
    case 'p':
      return getRandomKindTile('poll', false, isHorny, isDifficultConfig);
    case 'P':
      return getRandomKindTile('poll', true, isHorny, true);
    case 's':
      return getRandomKindTile('spotify trivia', false, isHorny, isDifficultConfig);
    case 'S':
      return getRandomKindTile('spotify trivia', true, isHorny, true);
    case 'i':
      return getRandomKindTile('image trivia', false, isHorny, isDifficultConfig);
    case 'I':
      return getRandomKindTile('image trivia', true, isHorny, true);
    case 'y':
      return getRandomKindTile('truth or dare', false, isHorny, isDifficultConfig);
    case 'Y':
      return getRandomKindTile('truth or dare', true, isHorny, true);
    default:
      return {type: null};
  }
}

const Empty = ({className} : {className: string}) => {
  return <div className={className}></div>;
}

setupTiles();

const Round = ({ id, data, setComplete, useBalance, name2, isHorny, isDifficultConfig }: Round) => {
  const [grid, setGrid] = useState<any[][]>([]);
  const [done, setDone] = useState<any[][]>([]);
  const numOfItems = data.layout.match(/[xhtpsiyXHTPSIY]/gm)!.length;
  const [numOfCompletedItems, setNumOfCompletedItems] = useState<number>(0);
  const [balance, setBalance] = useBalance;
  const [announcerActive, setAnnouncerActive] = useState<boolean|string>(false);
  const [tileopen, setTileopen] = useState<boolean>(false);

  const handleSuccess = (i: number, j: number, state: boolean) => {
    const newDone = [...done];
    newDone[i][j] = state;
    setDone(newDone);
    setNumOfCompletedItems(numOfCompletedItems+1);
    checkComplete(numOfCompletedItems+1);
    setTileopen(false);
    if (state) {
      if (!grid[i][j].difficult) setBalance(balance+1);
      else setBalance(balance+2);
    }
  }

  const checkComplete = (numofcompleted: number) => {
    if (numofcompleted >= numOfItems)
      setComplete();
  }

  useEffect(() => {
    const grid = setupGrid();
    setGrid(grid);
    setDone(Array.from({ length: grid.length }, () => Array(grid[0].length).fill(null)));
  }, []);

  function setupGrid(): any[][] {
    return data.layout.split('\n').map(a => a.split('').map(a => generateTile(a, isHorny, isDifficultConfig)));
  }

  const handleCardFlip = (type: string) => {
    setAnnouncerActive(type);
    setTileopen(true);
  }

  const handleAnnounceComplete = () => {
    setAnnouncerActive(false);
  }

  // todo:

  // ✔ only single card can be opened at a time
  // ✔ fix colors for the background of the description block (should be different for all different challenges)
  // ✔ truth or dare tile
  // ✔ create timer for timed tiles
  // ✔ make "?" display the type of the tile a "W" or a "Spotify" etc.
  // ✔ fix square positioning, empty square should not shrink
  // ✔ rename card types. Spotify really should be called music tile or something like that
  // ✔ difficulty meter
  // balance icon
  // ✔ make welcome page nicer looking
  // ✔ enable horny switch
  // actually make content
  // ✔ remove an item from the pool once it is picked for a tile
  // ✔ make difficulty actually affect the results. In easy mode less difficult questions in difficult mode more.
  // poll tiles to support images
  // ✔ trivia tiles to support images
  // actually collect results for the poll tile and display them somewhere
  // make a game summary
  // spotify tiles to implement guess the album cover (image functionality)

  return (
    <div className="tile-matrix flex justify-center flex-col items-center">
      { typeof announcerActive === "string" && <Announcer value={announcerActive} complete={handleAnnounceComplete} />}
      { grid.length > 0 && grid.map((row, i) => (
        <div className='flex' key={`${id}-${i}`}>
          { row.map((cell, j) => 
            !cell.type 
            ? <Empty key={`${id}-${i}-${j}`} className='w-48 h-48 shrink-0' />
            : <Tile key={`${id}-${i}-${j}`}
                    done={done[i][j]}
                    onFlip={handleCardFlip.bind(null, cell.wild ? 'wild' : cell.kind)}
                    canflip={!tileopen}
                    icon={cell.type}
                    tileBgClass={colors[cell.kind as string]}>
              
              { (() => {switch(cell.type) {

                case "spotify":
                  return (
                        <SpotifyTile 
                          track={cell.track}
                          question={cell.question}
                          answer={cell.answer}
                          options={shuffle(cell.options)}
                          className={`w-48 h-48`}
                          setSuccess={handleSuccess.bind(null, i, j)}
                          timeout={15}
                        />
                  );

                case "trivia":
                  return (
                      <TriviaTile 
                        question={cell.question?.replace(/\{2\}/mg, name2)}
                        answer={cell.answer} 
                        options={shuffle(cell.options)}
                        image={cell.image}
                        className={`w-48 h-48`}
                        setSuccess={handleSuccess.bind(null, i, j)}
                        timeout={20}
                      />
                  );

                case "poll":
                  return (
                      <PollTile
                        question={cell.question} 
                        options={shuffle(cell.options)} 
                        className={`w-48 h-48`} 
                        setSuccess={handleSuccess.bind(null, i, j)} 
                      />
                  );

                case "dareortruth":
                  return (
                      <TruthOrDareTile 
                        truth={cell.truth?.replace(/\{2\}/mg, name2)} 
                        dare={cell.dare?.replace(/\{2\}/mg, name2)}
                        className={`w-48 h-48`} 
                        setSuccess={handleSuccess.bind(null, i, j)} 
                      />
                  );

              }})()}

            </Tile>
          )}
        </div>
      ))}
    </div>
  );
};

function shuffle(array: any[]) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export default Round;