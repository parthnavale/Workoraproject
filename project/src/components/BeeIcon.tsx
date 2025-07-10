import React from 'react'

const StrongBeeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
    {/* Bee Body - Main oval */}
    <ellipse cx="12" cy="14" rx="5" ry="7" className="fill-yellow-500" />
    
    {/* Black stripes on body */}
    <ellipse cx="12" cy="11" rx="4.5" ry="1.2" className="fill-slate-800" />
    <ellipse cx="12" cy="14" rx="4.5" ry="1.2" className="fill-slate-800" />
    <ellipse cx="12" cy="17" rx="4.5" ry="1.2" className="fill-slate-800" />
    
    {/* Bee Head */}
    <circle cx="12" cy="7" r="3.5" className="fill-yellow-400" />
    
    {/* Eyes */}
    <circle cx="10.5" cy="6.5" r="0.8" className="fill-slate-800" />
    <circle cx="13.5" cy="6.5" r="0.8" className="fill-slate-800" />
    <circle cx="10.7" cy="6.2" r="0.3" className="fill-white" />
    <circle cx="13.7" cy="6.2" r="0.3" className="fill-white" />
    
    {/* Antennae */}
    <line x1="10.5" y1="4.5" x2="9.5" y2="3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <line x1="13.5" y1="4.5" x2="14.5" y2="3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <circle cx="9.5" cy="3" r="0.6" className="fill-slate-800" />
    <circle cx="14.5" cy="3" r="0.6" className="fill-slate-800" />
    
    {/* Wings - simplified */}
    <ellipse cx="8" cy="10" rx="2.5" ry="4" className="fill-white opacity-90" transform="rotate(-15 8 10)" />
    <ellipse cx="16" cy="10" rx="2.5" ry="4" className="fill-white opacity-90" transform="rotate(15 16 10)" />
    <ellipse cx="7.5" cy="12" rx="1.8" ry="3" className="fill-white opacity-70" transform="rotate(-20 7.5 12)" />
    <ellipse cx="16.5" cy="12" rx="1.8" ry="3" className="fill-white opacity-70" transform="rotate(20 16.5 12)" />
    
    {/* Wing veins */}
    <path d="M7 8 Q8 10 7 12" className="fill-none stroke-slate-300" strokeWidth="0.5" />
    <path d="M17 8 Q16 10 17 12" className="fill-none stroke-slate-300" strokeWidth="0.5" />
    
    {/* Small stinger */}
    <path d="M12 20 L11.5 21.5 L12.5 21.5 Z" className="fill-slate-700" />
  </svg>
)

export default StrongBeeIcon