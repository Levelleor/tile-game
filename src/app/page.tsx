"use client"
import Welcome from '@/components/Welcome';
import Round from '@/components/Round';
import Shop from '@/components/Shop';
import { useState } from 'react';
import { setupTiles } from '@/components/config/TileManager';

// in hard mode gonna be more difficults
// heart - h - a personal question. A question about me or something related to us (H for difficult version)
// wildcard - x - a random question from any type (X for difficult version)
// trivia - t - specifically trivia question (T for difficult version)
// poll - p - specifically poll question (P for difficult version)
// spotify trivia - s - specifically spotify question (S for difficult version)
// image trivia - i - specifically image trivia (I for difficult version)
// truth or dare - y - a truth or dare prompt (Y for difficult version)

const rounds = [
  {
    layout: 'i-s-t'
  }, {
    layout: '-Y-x-' + '\n' +
            '-----' + '\n' +
            'x---x' + '\n' +
            '-isx-'
  }, {
    layout: 'T---t' + '\n' +
            '-x-p-' + '\n' +
            '--x--' + '\n' +
            '-y-x-' + '\n' +
            'I---s'
  }, {
    layout: 'tSTxs' + '\n' +
            '--x--' + '\n' +
            'xxttS' + '\n' +
            '--x--'
  }, {
    layout: 'PXs' + '\n' +
            'sxx' + '\n' +
            'xxx'
  }
];

const shop = [
  { cost: 0, name: '{2} kisses {1}', description: 'It\'s free, why would you miss out on this?', amount: Infinity },
  { cost: 0, name: '{2} gives {1} a candy', description: 'It\'s free, why would you miss out on this?', amount: 100 },
  { cost: 3, name: 'Buttslap {2}', description: 'Well, can\'t hurt for once', amount: 1 },
  { cost: 5, name: 'Gift', description: 'There are gifts!', amount: 3 },
  { cost: 3, name: 'Ask {2} a personal question', description: 'Payout for truth or dares', amount: 1 },
  { cost: 3, name: 'Massage ticket', description: 'You can exchange massage ticket later at any time for a massage', amount: 1 },
  { cost: 500, name: 'Delete russnia', description: 'Whole rashist nation is wiped out of the Earth.', amount: 0 }
]

export default function Home() {
  const [name, setName] = useState('');
  const [name2, setName2] = useState('');
  const [balance, setBalance] = useState(0);
  const [stage, setStage] = useState(6); // 0 is welcome, 1-N are rounds, N=last is post-game results
  const [bought, setBought] = useState<number[]>([]);
  const [transitionState, setTransitionState] = useState<Boolean>(false);
  const [isHorny, setIsHorny] = useState<boolean>(false);
  const [isDifficultConfig, setIsDifficultConfig] = useState<boolean>(false);

  const handleWelcomeComplete = () => {
    setupTiles();
    setStage(stage+1);
  }

  const handleRoundComplete = () => {
    setTransitionState(true);
    setTimeout(() => {
      setStage(stage+1);
      setTransitionState(false);
    }, 500);
  }

  const handleShopTransaction = (i: number): void => {
    const newBought = [...bought];
    newBought[i] = newBought[i] ? newBought[i] + 1 : 1;
    setBought(newBought);
  }
  
  if (stage === 0)
  return (
    <main className="flex min-h-screen flex-col items-center p-24 welcome-background">
      <div className='w-full'>
        <Welcome
          name={name} 
          setName={setName} 
          name2={name2} 
          setName2={setName2} 
          onComplete={handleWelcomeComplete}
          useHorny={() => [isHorny, setIsHorny]}
          useDifficult={() => [isDifficultConfig, setIsDifficultConfig]} />
      </div>
    </main>
  );

  if (stage <= rounds.length)
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className='shrink'>
        Balance: {balance}
      </div>
      <div className={`w-full duration-500 ${transitionState ? ' opacity-0' : ' opacity-1'}`}>
        <Round
          key={stage-1} 
          id={stage-1} 
          data={rounds[stage-1]} 
          setComplete={handleRoundComplete} 
          useBalance={[balance, setBalance]} 
          name2={name2} 
          isHorny={isHorny}
          isDifficultConfig={isDifficultConfig}
        />
      </div>
    </main>
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className='shrink'>
        Very nice, {name}! You got {balance} coins. Spend them wisely.
      </div>
      <div className='w-full flex justify-center'>
        <div>
          <Shop shop={shop} name={name} name2={name2} Obought={[bought, handleShopTransaction]} />
        </div>
      </div> 
    </main>
  );
}
