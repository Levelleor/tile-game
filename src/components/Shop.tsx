"use client"
import React, { useEffect, useState } from 'react';
import { motion, easeIn, easeOut } from 'framer-motion';
import { getRandomInt } from '@/components/config/TileManager';

interface ShopProps {
  shop: any[],
  name: string,
  name2: string,
  Obought: [number[], (i: number) => void]
}

function interpolate(startValue: number, endValue: number, currentStep: number, easing: (c: number) => number){
  let easedTime = easing(currentStep);
  const interpolated = startValue + (endValue - startValue) * easedTime;
  return interpolated;
}

const Shop = ({ shop, name, name2, Obought }: ShopProps) => {
  const [bought, setBought] = Obought;
  const [particles, setParticles] = useState<any[]>([]);

  const totalSteps = 10;
  let keyframes: any[] = [];
  for(var i=0; i<=totalSteps; i++) {
    keyframes.push({
      timestamp: i/totalSteps,
      x: interpolate(0, 300, i/totalSteps, easeOut),
      y: interpolate(0, 50, i/totalSteps, easeIn),
      opacity: interpolate(1, 0, i/totalSteps, easeIn)
    });
  }
  const handleBuy = (i: number) => {
    setBought(i);

    const direction = Math.random() > 0.5 ? 1 : -1;
    setParticles((prev) => [
      ...prev,
      {
        id: Date.now(), // Unique id for the key prop
        parent: i,
        x: 0, // Initial position
        y: 0,
        rotationFrom: 0,
        opacityFrom: 1,
        // direction: Math.random() * Math.PI * 2, // Random direction
        direction: direction, // Random direction
        speed: Math.random() * 2 + 1, // Random speed
        keyframes: keyframes.map(k => ({x: k.x * direction, y: k.y, timestamp: k.timestamp, opacity: k.opacity})),
        rotationTo: getRandomInt(2, 10) * direction,
      }
    ]);
  }

  const renderAmount = (a: number) => {
    if (a == Infinity) return '∞';
    return a;
  }

  return (
    <ul>
    { shop.map((item, i) => 
      <li className='relative'>
        <div className={`flex relative mb-2 border-2 shop-item-border z-10 bg-white ${ item.amount-(bought[i] || 0) ? 'border-gradient-purple' : 'soldout-border'}`}>
          { item.amount-(bought[i] || 0) ? '' :
            <div className='absolute top-0 left-0 w-full h-full bg-white/75 flex justify-center items-center select-none'>
              <span className='bg-black/75 text-white/75 rotate-6 p-1'>
                Sold Out
              </span>
            </div>
          }
          <div className='w-[420px] shrink-0 p-2'>
            <header className='flex justify-between'>
              <h1 className='text-lg'>{item.name?.replace(/\{2\}/mg, name2).replace(/\{1\}/mg, name)}</h1>
              <div>amount: {renderAmount((item.amount ?? 0)-(bought[i] ?? 0))} | cost: {item.cost}</div></header>
            <p>{item.description?.replace(/\{2\}/mg, name2).replace(/\{1\}/mg, name)}</p>
          </div>
          <div className='flex flex-col justify-center w-64 text-center bg-black/50 bg-gradient-to-r hover:from-pink-500 hover:via-red-500 hover:to-yellow-500 background-animate select-none, cursor-pointer group' 
               onClick={handleBuy.bind(null, i)}>
            <button className='text-lg group-hover:text-purple-400 group-active:text-purple-200'>Buy</button>
            <span className='text-xs text-black/60 italic select-none'>VAT included</span>
          </div>
        </div>
        {particles.filter(p => p.parent === i).map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ x: particle.x, y: particle.y, rotate: particle.rotationFrom, opacity: particle.opacityFrom }}
            animate={{
              x: particle.keyframes.map((v: any) => Number(v.x)),
              y: particle.keyframes.map((v: any) => Number(v.y)),
              opacity: particle.keyframes.map((v: any) => Number(v.opacity)),
              rotate: particle.rotationTo
            }}
            transition={{ duration: 0.3, ease: "linear", times: particle.keyframes.map((v: any) => v.timestamp) }}
            onAnimationComplete={() => {setParticles((prevState) => prevState.filter(p => p.id !== particle.id))}}
            className='absolute -z-10 top-0 left-0'
          >
            <div className={`flex relative mb-2 border-2 shop-item-border border-gradient-purple bg-white`}>
              <div className='w-[420px] shrink-0 p-2'>
                <header className='flex justify-between'>
                  <h1 className='text-lg'>{item.name?.replace(/\{2\}/mg, name2).replace(/\{1\}/mg, name)}</h1>
                  <div>amount: {renderAmount((item.amount ?? 0)-(bought[i] ?? 0))} | cost: {item.cost}</div></header>
                <p>{item.description?.replace(/\{2\}/mg, name2).replace(/\{1\}/mg, name)}</p>
              </div>
              <div className='flex flex-col justify-center w-64 text-center bg-black/50'>
                <button className='text-lg'>Buy</button>
                <span className='text-xs text-black/60 italic'>VAT included</span>
              </div>
            </div>
          </motion.div>
        ))}
      </li>
    )}
    </ul>
  )
}

export default Shop;