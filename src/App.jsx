import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, RefreshCcw, X, ArrowDown } from 'lucide-react';

const TALK_THEMES = [
  { id: 1, text: "人生で一番高かった買い物は？", category: "Money", color: "bg-yellow-400" },
  { id: 2, text: "子供の頃の将来の夢は？", category: "Past", color: "bg-blue-400" },
  { id: 3, text: "もし明日世界が終わるなら何食べる？", category: "Food", color: "bg-red-500" },
  { id: 4, text: "最近あった「小さな幸せ」", category: "Daily", color: "bg-green-400" },
  { id: 5, text: "実は苦手なもの・こと", category: "Secret", color: "bg-purple-500" },
  { id: 6, text: "100万円もらったら何に使う？", category: "Dream", color: "bg-amber-400" },
  { id: 7, text: "初恋のエピソードを少しだけ！", category: "Love", color: "bg-pink-400" },
  { id: 8, text: "自分を動物に例えると？", category: "Self", color: "bg-orange-400" },
  { id: 9, text: "スマホの待ち受け画面見せて！", category: "Mobile", color: "bg-sky-400" },
  { id: 10, text: "今一番行きたい旅行先は？", category: "Travel", color: "bg-cyan-400" },
  { id: 11, text: "最近ハマっている推しは？", category: "Hobby", color: "bg-fuchsia-400" },
  { id: 12, text: "誰にも言っていない黒歴史...", category: "Secret", color: "bg-slate-500" },
  { id: 13, text: "理想の休日の過ごし方", category: "Life", color: "bg-emerald-400" },
  { id: 14, text: "特殊能力が一つもらえるなら？", category: "Fantasy", color: "bg-indigo-500" },
  { id: 15, text: "あなたの「座右の銘」は？", category: "Motto", color: "bg-rose-500" },
];

const CapsuleDisplay = ({ color, style, size = 48 }) => (
  <div 
    className="absolute rounded-full flex items-center justify-center overflow-hidden"
    style={{
      width: `${size}px`,
      height: `${size}px`,
      boxShadow: 'inset -4px -4px 8px rgba(0,0,0,0.3), 2px 5px 5px rgba(0,0,0,0.2)',
      ...style
    }}
  >
    <div className={`w-full h-1/2 absolute bottom-0 ${color}`}></div>
    <div className="w-full h-1/2 absolute top-0 bg-white/30 backdrop-blur-[0.5px]"></div>
    <div className="w-full h-[3%] bg-black/10 absolute top-1/2 -translate-y-1/2 z-10 box-border border-t border-white/20"></div>
    <div className="absolute top-[15%] left-[15%] w-[25%] h-[15%] bg-white rounded-full opacity-70 blur-[2px]"></div>
    <div className="absolute bottom-[15%] right-[15%] w-[10%] h-[10%] bg-white rounded-full opacity-30 blur-[1px]"></div>
  </div>
);

export default function App() {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDispensed, setHasDispensed] = useState(false);
  const [capsule, setCapsule] = useState(null);
  const [isOpened, setIsOpened] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const knobRef = useRef(null);
  const lastAngleRef = useRef(0);
  const cumulativeRotationRef = useRef(0);

  const generateInventory = () => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 90 + 5,
      top: Math.random() * 60 + 35,
      color: TALK_THEMES[i % TALK_THEMES.length].color,
      rotate: Math.random() * 360,
      zIndex: Math.floor(Math.random() * 20),
      scale: 0.8 + Math.random() * 0.4
    })).sort((a, b) => a.top - b.top);
  };

  const [inventory, setInventory] = useState(generateInventory());

  const getAngle = (clientX, clientY) => {
    if (!knobRef.current) return 0;
    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  };

  const handleStart = (e) => {
    if (hasDispensed) return;
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    lastAngleRef.current = getAngle(clientX, clientY);
  };

  const handleMove = useCallback((e) => {
    if (!isDragging || hasDispensed) return;
    if(e.cancelable) e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const currentAngle = getAngle(clientX, clientY);
    let delta = currentAngle - lastAngleRef.current;

    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    const newRotation = rotation + delta;
    setRotation(newRotation);
    
    cumulativeRotationRef.current += delta;
    lastAngleRef.current = currentAngle;

    if (Math.abs(cumulativeRotationRef.current) % 60 < 5 && navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    if (Math.random() > 0.7) {
       setInventory(prev => prev.map(item => ({
         ...item,
         rotate: item.rotate + (Math.random() - 0.5) * 5,
         top: Math.min(95, Math.max(35, item.top + (Math.random() - 0.5) * (item.top > 80 ? 0.2 : 1)))
       })));
    }

    if (cumulativeRotationRef.current > 340) {
      dispenseCapsule();
    }
  }, [isDragging, rotation, hasDispensed]);

  const handleEnd = () => {
    setIsDragging(false);
  };

  const dispenseCapsule = () => {
    setHasDispensed(true);
    cumulativeRotationRef.current = 0;
    
    const theme = TALK_THEMES[Math.floor(Math.random() * TALK_THEMES.length)];
    setCapsule(theme);
    setInventory(prev => {
        const newInv = [...prev];
        newInv.pop(); 
        return newInv;
    });

    if (navigator.vibrate) navigator.vibrate([80, 50, 80]);
  };

  const resetGacha = () => {
    setRotation(0);
    setHasDispensed(false);
    setCapsule(null);
    setIsOpened(false);
    setShowModal(false);
    cumulativeRotationRef.current = 0;
    
    if (inventory.length < 30) {
        setInventory(generateInventory());
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleMove]);

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center p-4 font-sans text-slate-800 overflow-hidden select-none">
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-300 to-slate-400"></div>

      <div className="relative w-full max-w-[360px] bg-white rounded-[50px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden flex flex-col items-center z-10 ring-8 ring-slate-200/50">
        
        <div className="w-full h-[400px] relative border-b-[12px] border-slate-200 overflow-hidden bg-slate-50">
          <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_0_10px_30px_rgba(0,0,0,0.1)] rounded-t-[42px]"></div>
          
          <div className="absolute inset-0 z-0 p-4 opacity-90">
             <div className="absolute inset-2 bg-gradient-to-b from-slate-200/50 to-white rounded-[40px] border border-slate-100"></div>
          </div>

          <div className="absolute inset-0 z-10 px-6 pb-2">
            {inventory.map((item) => (
              <CapsuleDisplay 
                key={item.id}
                color={item.color}
                size={52 * item.scale}
                style={{
                  left: `${item.left}%`,
                  top: `${item.top}%`,
                  transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
                  zIndex: item.zIndex,
                  transition: 'top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 z-30 pointer-events-none rounded-t-[42px]">
             <div className="absolute top-4 right-8 w-24 h-64 bg-gradient-to-b from-white/70 to-transparent skew-x-[-20deg] rounded-full blur-[2px]"></div>
             <div className="absolute top-4 left-6 w-3 h-32 bg-gradient-to-b from-white/50 to-transparent skew-x-[-20deg] rounded-full blur-[1px]"></div>
          </div>
        </div>

        <div className="w-full bg-slate-50 py-8 flex flex-col items-center justify-center relative z-20 shadow-lg">
          
          <div className="w-full h-1 bg-slate-200 absolute top-2"></div>
          <div className="w-full h-1 bg-slate-200 absolute bottom-2"></div>

          <div className="absolute top-4 right-6 bg-slate-200 px-4 py-1.5 rounded-lg shadow-inner border border-slate-300 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-slate-800 rounded-full"></div>
            <div className="flex flex-col leading-none">
                <span className="text-[9px] font-bold text-slate-500">INSERT COIN</span>
                <span className="text-xs font-black text-slate-600">FREE</span>
            </div>
          </div>
          
           <div className="absolute top-4 left-6 bg-pink-500 text-white px-3 py-1 rounded shadow-md transform -rotate-6">
                <span className="text-xs font-bold">¥0</span>
           </div>

          <div className="relative mt-4">
            <div className="absolute inset-0 rounded-full bg-slate-200 transform scale-105 blur-sm"></div>
            
            <div 
              ref={knobRef}
              className={`w-64 h-64 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 shadow-[0_12px_24px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.9)] border-4 border-white flex items-center justify-center cursor-grab active:cursor-grabbing ${hasDispensed ? 'opacity-90 pointer-events-none grayscale-[0.2]' : ''} relative z-10`}
              style={{ transform: `rotate(${rotation}deg)` }}
              onMouseDown={handleStart}
              onTouchStart={handleStart}
            >
              <div className="absolute inset-2 rounded-full border-2 border-slate-300 border-dashed opacity-30"></div>

              <div className="absolute w-[90%] h-16 bg-white rounded-2xl shadow-[0_4px_8px_rgba(0,0,0,0.1),inset_0_-4px_4px_rgba(0,0,0,0.05)] flex items-center justify-between px-2">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl shadow-inner border border-slate-200"></div>
                  <div className="w-12 h-12 bg-slate-100 rounded-xl shadow-inner border border-slate-200"></div>
              </div>
              
              <div className="absolute h-[90%] w-16 bg-white rounded-2xl shadow-[0_4px_8px_rgba(0,0,0,0.1),inset_0_-4px_4px_rgba(0,0,0,0.05)] flex flex-col items-center justify-between py-2">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl shadow-inner border border-slate-200"></div>
                  <div className="w-12 h-12 bg-slate-100 rounded-xl shadow-inner border border-slate-200"></div>
              </div>

              <div className="absolute w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-400 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.2)] flex items-center justify-center z-20 border-4 border-white">
                 <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 flex items-center justify-center shadow-inner">
                    <RefreshCcw className="text-white/90 w-8 h-8 drop-shadow-md" />
                 </div>
              </div>
            </div>
            
            {!hasDispensed && (
              <div className="absolute -inset-8 pointer-events-none opacity-50 z-0">
                  <div className="w-full h-full animate-spin-slow rounded-full border-t-4 border-r-4 border-pink-400/50"></div>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center gap-2 text-slate-400 font-bold tracking-widest text-sm bg-white px-4 py-1 rounded-full shadow-sm">
             <ArrowDown size={16} className="animate-bounce" />
             {hasDispensed ? "PICK UP" : "TURN HANDLE"}
             <ArrowDown size={16} className="animate-bounce" />
          </div>
        </div>

        <div className="w-full h-40 bg-slate-200 relative flex items-end justify-center pb-6 overflow-hidden shadow-[inset_0_10px_20px_rgba(0,0,0,0.1)]">
           <div className="absolute top-0 w-48 h-32 bg-slate-800/20 rounded-b-[3rem] blur-sm transform scale-x-110"></div>
           <div className="absolute -top-4 w-56 h-36 bg-slate-100 rounded-b-[4rem] shadow-lg z-0 border-b-4 border-slate-300"></div>

           {hasDispensed && capsule && !isOpened && (
             <button 
               onClick={() => {
                 setIsOpened(true);
                 setTimeout(() => setShowModal(true), 600);
               }}
               className="relative z-30 animate-bounce-in cursor-pointer focus:outline-none group transform hover:scale-105 transition-transform"
               aria-label="カプセルを開く"
             >
                <div className={`w-28 h-28 rounded-full border-[6px] border-white shadow-2xl relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(255,255,255,0.8)] transition-shadow`}>
                   <div className={`absolute bottom-0 w-full h-1/2 ${capsule.color}`}></div>
                   <div className="absolute top-0 w-full h-1/2 bg-white/50 backdrop-blur-sm"></div>
                   <div className="absolute top-1/2 w-full h-[3px] bg-black/10 -translate-y-1/2"></div>
                   
                   <div className="absolute top-5 left-5 w-8 h-5 bg-white/80 rounded-full blur-[3px]"></div>
                   
                   <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-white/90 text-slate-800 font-black text-sm px-3 py-1 rounded-full shadow-lg animate-pulse tracking-wider">OPEN</span>
                   </div>
                </div>
             </button>
           )}

           {isOpened && (
              <div className="relative w-28 h-28 z-20">
                 <div className={`absolute left-0 top-0 w-14 h-28 bg-gradient-to-r from-gray-100 to-white/90 rounded-l-full border-l-[6px] border-t-[6px] border-b-[6px] border-white shadow-lg transition-all duration-500 -translate-x-10 rotate-[-30deg] opacity-0`}></div>
                 <div className={`absolute right-0 top-0 w-14 h-28 bg-gradient-to-l from-${capsule.color.replace('bg-', '')} to-white/30 rounded-r-full border-r-[6px] border-t-[6px] border-b-[6px] border-white shadow-lg transition-all duration-500 translate-x-10 rotate-[30deg] opacity-0`}></div>
              </div>
           )}
        </div>
      </div>

      {hasDispensed && (
        <div className="fixed bottom-8 z-40 animate-fade-in">
            <button 
            onClick={resetGacha}
            className="px-8 py-4 bg-white/90 backdrop-blur rounded-full font-bold text-slate-600 shadow-xl active:scale-95 transition-transform flex items-center gap-2 hover:bg-white border-2 border-slate-100"
            >
            <RefreshCcw size={20} /> リセット
            </button>
        </div>
      )}

      {showModal && capsule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center relative shadow-2xl animate-pop-up border-[10px] border-slate-100">
            
            <button 
              onClick={resetGacha}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X size={24} className="text-slate-500" />
            </button>

            <div className="mb-8 flex justify-center relative">
               <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-violet-200 blur-2xl opacity-50 rounded-full"></div>
              <div className={`relative p-8 rounded-full ${capsule.color} text-white shadow-xl ring-8 ring-white transform rotate-3`}>
                <Sparkles size={48} />
              </div>
            </div>

            <span className="inline-block px-4 py-1.5 bg-slate-100 text-slate-500 text-xs font-extrabold rounded-full mb-6 uppercase tracking-widest shadow-inner">
              {capsule.category}
            </span>

            <h2 className="text-2xl font-black text-slate-800 leading-snug mb-10 break-words drop-shadow-sm">
              {capsule.text}
            </h2>

            <div className="space-y-3">
              <button 
                onClick={resetGacha}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-300 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCcw size={18} /> 次へ
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce-in {
          0% { transform: translateY(-150px) rotate(180deg); opacity: 0; }
          50% { transform: translateY(20px) rotate(-10deg); opacity: 1; }
          70% { transform: translateY(-10px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes pop-up {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-pop-up {
          animation: pop-up 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
}