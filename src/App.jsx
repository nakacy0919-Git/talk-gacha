import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, RefreshCcw, X, ArrowRight } from 'lucide-react';

// --- データ定義: トークテーマのお題 ---
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

// --- コンポーネント: カプセル (内部表示用) ---
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
  </div>
);

export default function App() {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDispensed, setHasDispensed] = useState(false); // カプセルが出たか
  const [capsule, setCapsule] = useState(null);
  const [showResult, setShowResult] = useState(false); // 結果画面（お題）を表示するか
  
  const knobRef = useRef(null);
  const lastAngleRef = useRef(0);
  const cumulativeRotationRef = useRef(0);

  // ワイド画面用にカプセルを散らす
  const generateInventory = () => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: Math.random() * 94 + 3, // 横幅いっぱいに
      top: Math.random() * 50 + 45, // 下半分に溜まる
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

    if (Math.abs(cumulativeRotationRef.current) % 45 < 5 && navigator.vibrate) {
      navigator.vibrate(15); // 強めの振動
    }
    
    // ガラガラと中身が動く演出
    if (Math.random() > 0.6) {
       setInventory(prev => prev.map(item => ({
         ...item,
         rotate: item.rotate + (Math.random() - 0.5) * 10,
         left: Math.min(98, Math.max(2, item.left + (Math.random() - 0.5) * 1)),
         top: Math.min(95, Math.max(45, item.top + (Math.random() - 0.5) * 0.5))
       })));
    }

    // 360度回したら発射
    if (cumulativeRotationRef.current > 360) {
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
    
    // 在庫を減らす
    setInventory(prev => {
        const newInv = [...prev];
        newInv.pop(); 
        return newInv;
    });

    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
  };

  const resetGacha = () => {
    setRotation(0);
    setHasDispensed(false);
    setCapsule(null);
    setShowResult(false);
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
    <div className="min-h-screen bg-slate-800 flex flex-col items-center justify-center p-6 font-sans text-slate-800 overflow-hidden select-none">
      
      {/* Background Lighting Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-600 via-slate-800 to-slate-900"></div>

      {/* Main Machine Body - WIDE VERSION */}
      <div className="relative w-full max-w-4xl bg-slate-100 rounded-[60px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border-4 border-slate-300 overflow-hidden flex flex-col z-10 ring-8 ring-slate-500/50">
        
        {/* Top: Showcase Window (Huge & Wide) */}
        <div className="w-full h-[40vh] min-h-[300px] relative border-b-[16px] border-slate-300 overflow-hidden bg-slate-50">
          
          {/* Machine Inner Shadow */}
          <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_0_10px_40px_rgba(0,0,0,0.15)] rounded-t-[54px]"></div>
          
          {/* Inventory Background */}
          <div className="absolute inset-0 z-0 p-4 opacity-90">
             <div className="absolute inset-3 bg-gradient-to-b from-slate-200/50 to-white/80 rounded-[50px] border-2 border-slate-200/50"></div>
          </div>

          {/* Capsules */}
          <div className="absolute inset-0 z-10 px-8 pb-4">
            {inventory.map((item) => (
              <CapsuleDisplay 
                key={item.id}
                color={item.color}
                size={56 * item.scale}
                style={{
                  left: `${item.left}%`,
                  top: `${item.top}%`,
                  transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
                  zIndex: item.zIndex,
                  transition: 'top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), left 0.4s ease'
                }}
              />
            ))}
          </div>

          {/* Glass Reflections */}
          <div className="absolute inset-0 z-30 pointer-events-none rounded-t-[54px]">
             <div className="absolute top-0 right-[20%] w-32 h-[120%] bg-gradient-to-b from-white/40 to-transparent skew-x-[-25deg] blur-[4px]"></div>
             <div className="absolute top-0 left-[10%] w-8 h-[80%] bg-gradient-to-b from-white/30 to-transparent skew-x-[-25deg] blur-[2px]"></div>
          </div>
        </div>

        {/* Bottom: Control Panel & Handle Area */}
        <div className="w-full h-auto min-h-[350px] bg-slate-100 py-6 flex flex-col items-center justify-center relative z-20 shadow-lg">
          
          {/* Decorative Panel Lines */}
          <div className="w-full h-2 bg-slate-300 absolute top-4"></div>
          <div className="w-full h-2 bg-slate-300 absolute bottom-4"></div>

          <div className="flex w-full px-12 justify-between items-start absolute top-8">
             {/* Left: Coin Slot */}
             <div className="bg-slate-300 px-6 py-3 rounded-xl shadow-inner border-2 border-slate-400 flex items-center gap-3">
                <div className="w-2 h-10 bg-slate-800 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"></div>
                <div className="flex flex-col leading-none">
                    <span className="text-[10px] font-bold text-slate-500">INSERT COIN</span>
                    <span className="text-sm font-black text-slate-600">FREE PLAY</span>
                </div>
             </div>
             
             {/* Right: Price */}
             <div className="bg-pink-500 text-white px-5 py-2 rounded-lg shadow-lg transform rotate-3 border-2 border-pink-400">
                  <span className="text-xl font-black">¥0</span>
             </div>
          </div>

          {/* THE HUGE HANDLE */}
          <div className="relative mt-2 group">
            {/* Base Plate Glow */}
            <div className="absolute inset-0 rounded-full bg-slate-300 transform scale-105 blur-md"></div>
            
            <div 
              ref={knobRef}
              className={`w-80 h-80 rounded-full bg-gradient-to-br from-slate-50 to-slate-300 shadow-[0_20px_40px_rgba(0,0,0,0.2),inset_0_2px_10px_rgba(255,255,255,1)] border-[8px] border-white flex items-center justify-center cursor-grab active:cursor-grabbing ${hasDispensed ? 'opacity-80 pointer-events-none grayscale-[0.3]' : ''} relative z-10 transition-transform`}
              style={{ transform: `rotate(${rotation}deg)` }}
              onMouseDown={handleStart}
              onTouchStart={handleStart}
            >
              {/* Decorative Ring */}
              <div className="absolute inset-4 rounded-full border-4 border-slate-300 border-dashed opacity-40"></div>

              {/* Handle Bar - Horizontal (Massive) */}
              <div className="absolute w-[92%] h-24 bg-white rounded-3xl shadow-[0_8px_16px_rgba(0,0,0,0.1),inset_0_-4px_4px_rgba(0,0,0,0.05)] flex items-center justify-between px-2 border border-slate-100">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl shadow-inner border border-slate-200"></div>
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl shadow-inner border border-slate-200"></div>
              </div>
              
              {/* Handle Bar - Vertical (Massive) */}
              <div className="absolute h-[92%] w-24 bg-white rounded-3xl shadow-[0_8px_16px_rgba(0,0,0,0.1),inset_0_-4px_4px_rgba(0,0,0,0.05)] flex flex-col items-center justify-between py-2 border border-slate-100">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl shadow-inner border border-slate-200"></div>
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl shadow-inner border border-slate-200"></div>
              </div>

              {/* Center Cap */}
              <div className="absolute w-32 h-32 bg-gradient-to-br from-slate-200 to-slate-400 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.3)] flex items-center justify-center z-20 border-[6px] border-white">
                 <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 flex items-center justify-center shadow-inner group-active:scale-95 transition-transform">
                    <RefreshCcw className="text-white/90 w-10 h-10 drop-shadow-md" />
                 </div>
              </div>
            </div>
            
            {/* Guide Arrows */}
            {!hasDispensed && (
              <div className="absolute -inset-10 pointer-events-none opacity-60 z-0">
                  <div className="w-full h-full animate-spin-slow rounded-full border-t-[8px] border-r-[8px] border-pink-400/60"></div>
              </div>
            )}
          </div>

          <p className="mt-8 text-slate-400 font-bold tracking-[0.2em] text-lg bg-white px-6 py-2 rounded-full shadow-sm animate-pulse border border-slate-200">
             {hasDispensed ? "TAP THE CAPSULE!" : "TURN RIGHT →"}
          </p>
        </div>
      </div>

      {/* --- FLASHY CENTER CAPSULE OVERLAY --- */}
      {hasDispensed && capsule && !showResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            {/* Background Rays Effect */}
            <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
                <div className="w-[200vw] h-[200vw] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.1)_20deg,transparent_40deg)] animate-spin-slow opacity-50"></div>
            </div>

            {/* The Huge Pop-out Capsule */}
            <button 
                onClick={() => {
                    setShowResult(true); // Open Result
                }}
                className="relative z-50 animate-elastic-pop cursor-pointer group focus:outline-none"
            >
                <div className="w-80 h-80 rounded-full border-[12px] border-white shadow-[0_0_100px_rgba(255,255,255,0.5)] relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                     {/* Capsule Colors */}
                     <div className={`absolute bottom-0 w-full h-1/2 ${capsule.color}`}></div>
                     <div className="absolute top-0 w-full h-1/2 bg-white/40 backdrop-blur-md"></div>
                     <div className="absolute top-1/2 w-full h-[4px] bg-black/10 -translate-y-1/2"></div>
                     
                     {/* Highlights */}
                     <div className="absolute top-12 left-12 w-20 h-12 bg-white/70 rounded-full blur-[8px]"></div>

                     {/* Text Prompt */}
                     <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-white text-slate-900 font-black text-2xl px-8 py-3 rounded-full shadow-2xl animate-pulse tracking-widest border-4 border-slate-100 transform -rotate-6">
                            TAP ME!
                        </span>
                     </div>
                </div>
            </button>
        </div>
      )}

      {/* --- RESULT MODAL --- */}
      {showResult && capsule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 text-center relative shadow-2xl animate-pop-up border-[12px] border-slate-100">
            
            {/* Header / Close */}
            <button 
              onClick={resetGacha}
              className="absolute top-6 right-6 p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X size={28} className="text-slate-500" />
            </button>

            {/* Icon */}
            <div className="mb-10 flex justify-center relative">
               <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-violet-300 blur-3xl opacity-60 rounded-full transform scale-150"></div>
              <div className={`relative p-10 rounded-full ${capsule.color} text-white shadow-2xl ring-8 ring-white transform rotate-3`}>
                <Sparkles size={64} />
              </div>
            </div>

            {/* Category */}
            <span className="inline-block px-6 py-2 bg-slate-100 text-slate-500 text-sm font-extrabold rounded-full mb-8 uppercase tracking-[0.2em] shadow-inner">
              {capsule.category}
            </span>

            {/* Question Text */}
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight mb-12 break-words drop-shadow-sm">
              {capsule.text}
            </h2>

            {/* Action Button */}
            <div className="space-y-4">
              <button 
                onClick={resetGacha}
                className="w-full py-5 bg-slate-900 text-white text-xl font-bold rounded-3xl shadow-xl shadow-slate-400/50 hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                <RefreshCcw size={24} /> 次のガチャへ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes elastic-pop {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          60% { transform: scale(1.1) rotate(10deg); opacity: 1; }
          80% { transform: scale(0.95) rotate(-5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .animate-elastic-pop {
          animation: elastic-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
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
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}