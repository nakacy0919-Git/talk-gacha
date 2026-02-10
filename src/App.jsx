import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, RefreshCcw, X } from 'lucide-react';

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

// --- コンポーネント: カプセル (内部表示用: 巨大化＆キラキラ) ---
const CapsuleDisplay = ({ color, style, size = 80 }) => (
  <div 
    className="absolute rounded-full flex items-center justify-center overflow-hidden shadow-lg"
    style={{
      width: `${size}px`,
      height: `${size}px`,
      // より強い立体感の影
      boxShadow: 'inset -6px -6px 12px rgba(0,0,0,0.4), 4px 8px 10px rgba(0,0,0,0.3)',
      ...style
    }}
  >
    {/* 下半分（色付き） */}
    <div className={`w-full h-1/2 absolute bottom-0 ${color}`}></div>
    {/* 上半分（クリア素材） */}
    <div className="w-full h-1/2 absolute top-0 bg-white/30 backdrop-blur-[1px]"></div>
    {/* 接合部 */}
    <div className="w-full h-[3%] bg-black/10 absolute top-1/2 -translate-y-1/2 z-10 box-border border-t border-white/30"></div>
    
    {/* 固定ハイライト */}
    <div className="absolute top-[15%] left-[15%] w-[30%] h-[20%] bg-white rounded-full opacity-80 blur-[4px]"></div>

    {/* ★キラキラエフェクト（光が走るアニメーション） */}
    <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
      <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/60 to-transparent transform -skew-x-20 animate-shimmer"></div>
    </div>
  </div>
);

export default function App() {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDispensed, setHasDispensed] = useState(false);
  const [capsule, setCapsule] = useState(null);
  const [showResult, setShowResult] = useState(false);
  
  const knobRef = useRef(null);
  const lastAngleRef = useRef(0);
  const cumulativeRotationRef = useRef(0);

  // 在庫生成（巨大化に対応して数を調整）
  const generateInventory = () => {
    // 数を減らして一つ一つを大きく見せる
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 90 + 5,
      // より下の方に密集させる
      top: Math.random() * 40 + 55,
      color: TALK_THEMES[i % TALK_THEMES.length].color,
      rotate: Math.random() * 360,
      zIndex: Math.floor(Math.random() * 30),
      // ★サイズを大幅にアップ (基本サイズの1.1倍〜1.8倍)
      scale: 1.1 + Math.random() * 0.7,
      // キラキラのアニメーション開始時間をずらす
      shimmerDelay: Math.random() * 5
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
      navigator.vibrate(20); // 振動を少し強く
    }
    
    // ガラガラ演出（カプセルが大きいので動きは控えめに重厚感を出す）
    if (Math.random() > 0.5) {
       setInventory(prev => prev.map(item => ({
         ...item,
         rotate: item.rotate + (Math.random() - 0.5) * 5,
         left: Math.min(98, Math.max(2, item.left + (Math.random() - 0.5) * 0.5)),
         top: Math.min(98, Math.max(55, item.top + (Math.random() - 0.5) * 0.2))
       })));
    }

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
    
    setInventory(prev => {
        const newInv = [...prev];
        // 一番手前（配列の最後）のカプセルを消す
        newInv.pop(); 
        return newInv;
    });

    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 300]);
  };

  const resetGacha = () => {
    setRotation(0);
    setHasDispensed(false);
    setCapsule(null);
    setShowResult(false);
    cumulativeRotationRef.current = 0;
    
    if (inventory.length < 20) {
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
    <div className="min-h-screen bg-slate-900 flex flex-col items-center p-6 font-sans text-slate-800 overflow-hidden select-none">
      
      {/* Background Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-black"></div>

      {/* ★タイトルヘッダー（おしゃれ・スマート・心臓の鼓動） */}
      <header className="relative z-20 mb-8 text-center">
        <h1 className="text-5xl md:text-6xl font-thin tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-heartbeat">
          TALK GACHA
        </h1>
        <div className="mt-2 h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50"></div>
      </header>

      {/* Main Machine Body */}
      <div className="relative w-full max-w-4xl bg-slate-100 rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] border-4 border-slate-400 overflow-hidden flex flex-col z-10 ring-8 ring-slate-600/50 mt-auto mb-auto">
        
        {/* Top: Showcase Window */}
        <div className="w-full h-[45vh] min-h-[350px] relative border-b-[16px] border-slate-300 overflow-hidden bg-slate-200">
          
          {/* Machine Inner Shadow */}
          <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_0_20px_50px_rgba(0,0,0,0.3)] rounded-t-[54px]"></div>
          
          {/* Inventory Background */}
          <div className="absolute inset-0 z-0 p-4 opacity-90">
             <div className="absolute inset-3 bg-gradient-to-b from-slate-300 to-slate-100 rounded-[50px] border-2 border-slate-300/50 shadow-inner"></div>
          </div>

          {/* ★Capsules（巨大化＆キラキラ） */}
          <div className="absolute inset-0 z-10 px-4 pb-4 pointer-events-none">
            {inventory.map((item) => (
              <CapsuleDisplay 
                key={item.id}
                color={item.color}
                // 基本サイズを80pxに変更し、さらにスケールをかける
                size={80 * item.scale}
                style={{
                  left: `${item.left}%`,
                  top: `${item.top}%`,
                  transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
                  zIndex: item.zIndex,
                  transition: 'top 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), left 0.5s ease, transform 0.5s ease',
                  // キラキラアニメーションの開始時間を個別にずらす
                  animationDelay: `-${item.shimmerDelay}s` 
                }}
              />
            ))}
          </div>

          {/* Glass Reflections (Stronger) */}
          <div className="absolute inset-0 z-30 pointer-events-none rounded-t-[54px] mix-blend-overlay opacity-70">
             <div className="absolute top-0 right-[15%] w-40 h-[150%] bg-gradient-to-b from-white to-transparent skew-x-[-30deg] blur-[8px]"></div>
             <div className="absolute top-0 left-[5%] w-12 h-[100%] bg-gradient-to-b from-white/80 to-transparent skew-x-[-30deg] blur-[4px]"></div>
          </div>
        </div>

        {/* Bottom: Control Panel & Handle Area */}
        <div className="w-full h-auto min-h-[380px] bg-gradient-to-b from-slate-100 to-slate-200 py-8 flex flex-col items-center justify-center relative z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
          
          {/* Decorative Panel Lines */}
          <div className="w-full h-3 bg-slate-300 absolute top-0 border-b border-white/50"></div>
          <div className="w-full h-3 bg-slate-300 absolute bottom-0 border-t border-white/50"></div>

          <div className="flex w-full px-12 justify-between items-start absolute top-10">
             {/* Left: Coin Slot */}
             <div className="bg-slate-300 px-6 py-3 rounded-xl shadow-[inset_0_2px_5px_rgba(0,0,0,0.2),0_2px_5px_rgba(255,255,255,0.5)] border-2 border-slate-400 flex items-center gap-3">
                <div className="w-3 h-12 bg-slate-900 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border-2 border-slate-600"></div>
                <div className="flex flex-col leading-none">
                    <span className="text-[10px] font-bold text-slate-600">INSERT COIN</span>
                    <span className="text-base font-black text-slate-700">FREE PLAY</span>
                </div>
             </div>
             
             {/* Right: Price */}
             <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg transform rotate-3 border-4 border-white/30">
                  <span className="text-2xl font-black tracking-wider">¥0</span>
             </div>
          </div>

          {/* THE HUGE HANDLE */}
          <div className="relative mt-6 group">
            {/* Base Plate Glow */}
            <div className="absolute inset-0 rounded-full bg-slate-400 transform scale-105 blur-xl opacity-50"></div>
            
            <div 
              ref={knobRef}
              className={`w-80 h-80 rounded-full bg-gradient-to-br from-slate-100 to-slate-400 shadow-[0_30px_60px_rgba(0,0,0,0.4),inset_0_4px_20px_rgba(255,255,255,0.8)] border-[10px] border-slate-200 flex items-center justify-center cursor-grab active:cursor-grabbing ${hasDispensed ? 'opacity-80 pointer-events-none grayscale-[0.3]' : ''} relative z-10 transition-transform`}
              style={{ transform: `rotate(${rotation}deg)` }}
              onMouseDown={handleStart}
              onTouchStart={handleStart}
            >
              {/* Decorative Ring */}
              <div className="absolute inset-6 rounded-full border-[6px] border-slate-400/30 border-dashed"></div>

              {/* Handle Bar - Horizontal (Massive) */}
              <div className="absolute w-[94%] h-28 bg-gradient-to-b from-white to-slate-200 rounded-3xl shadow-[0_10px_20px_rgba(0,0,0,0.2),inset_0_-5px_10px_rgba(0,0,0,0.05)] flex items-center justify-between px-3 border-2 border-white">
                  <div className="w-24 h-24 bg-slate-200 rounded-2xl shadow-[inset_0_5px_10px_rgba(0,0,0,0.1)] border border-slate-300"></div>
                  <div className="w-24 h-24 bg-slate-200 rounded-2xl shadow-[inset_0_5px_10px_rgba(0,0,0,0.1)] border border-slate-300"></div>
              </div>
              
              {/* Handle Bar - Vertical (Massive) */}
              <div className="absolute h-[94%] w-28 bg-gradient-to-r from-white to-slate-200 rounded-3xl shadow-[0_10px_20px_rgba(0,0,0,0.2),inset_0_-5px_10px_rgba(0,0,0,0.05)] flex flex-col items-center justify-between py-3 border-2 border-white">
                  <div className="w-24 h-24 bg-slate-200 rounded-2xl shadow-[inset_0_5px_10px_rgba(0,0,0,0.1)] border border-slate-300"></div>
                  <div className="w-24 h-24 bg-slate-200 rounded-2xl shadow-[inset_0_5px_10px_rgba(0,0,0,0.1)] border border-slate-300"></div>
              </div>

              {/* Center Cap */}
              <div className="absolute w-36 h-36 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex items-center justify-center z-20 border-[8px] border-slate-100">
                 <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-[inset_0_5px_15px_rgba(0,0,0,0.3)] group-active:scale-95 transition-transform border-4 border-white/20">
                    <RefreshCcw className="text-white w-12 h-12 drop-shadow-lg" />
                 </div>
              </div>
            </div>
            
            {/* Guide Arrows */}
            {!hasDispensed && (
              <div className="absolute -inset-12 pointer-events-none opacity-70 z-0">
                  <div className="w-full h-full animate-spin-slow rounded-full border-t-[12px] border-r-[12px] border-pink-500/50 blur-[4px]"></div>
              </div>
            )}
          </div>

          <p className="mt-10 text-slate-500 font-bold tracking-[0.3em] text-xl bg-white/80 px-8 py-3 rounded-full shadow-md animate-pulse border-2 border-slate-300 backdrop-blur-sm">
             {hasDispensed ? "TAP THE CAPSULE!" : "TURN RIGHT →"}
          </p>
        </div>
      </div>

      {/* --- FLASHY CENTER CAPSULE OVERLAY (そのまま維持) --- */}
      {hasDispensed && capsule && !showResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
            <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
                <div className="w-[200vw] h-[200vw] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.1)_20deg,transparent_40deg)] animate-spin-slow opacity-60 mix-blend-overlay"></div>
            </div>

            <button 
                onClick={() => setShowResult(true)}
                className="relative z-50 animate-elastic-pop cursor-pointer group focus:outline-none"
            >
                <div className="w-96 h-96 rounded-full border-[16px] border-white shadow-[0_0_150px_rgba(255,255,255,0.6)] relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                     <div className={`absolute bottom-0 w-full h-1/2 ${capsule.color}`}></div>
                     <div className="absolute top-0 w-full h-1/2 bg-white/40 backdrop-blur-md"></div>
                     <div className="absolute top-1/2 w-full h-[6px] bg-black/10 -translate-y-1/2"></div>
                     <div className="absolute top-16 left-16 w-24 h-16 bg-white/70 rounded-full blur-[10px]"></div>
                     
                     {/* キラキラ追加 */}
                     <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                        <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/80 to-transparent transform -skew-x-20 animate-shimmer-fast"></div>
                     </div>

                     <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-white text-slate-900 font-black text-3xl px-10 py-4 rounded-full shadow-2xl animate-pulse tracking-widest border-4 border-slate-100 transform -rotate-6">
                            TAP ME!
                        </span>
                     </div>
                </div>
            </button>
        </div>
      )}

      {/* --- RESULT MODAL (そのまま維持) --- */}
      {showResult && capsule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 text-center relative shadow-2xl animate-pop-up border-[12px] border-slate-100">
            <button 
              onClick={resetGacha}
              className="absolute top-6 right-6 p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X size={28} className="text-slate-500" />
            </button>

            <div className="mb-10 flex justify-center relative">
               <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-violet-300 blur-3xl opacity-60 rounded-full transform scale-150 animate-pulse"></div>
              <div className={`relative p-10 rounded-full ${capsule.color} text-white shadow-2xl ring-8 ring-white transform rotate-3`}>
                <Sparkles size={64} />
              </div>
            </div>

            <span className="inline-block px-6 py-2 bg-slate-100 text-slate-500 text-sm font-extrabold rounded-full mb-8 uppercase tracking-[0.2em] shadow-inner">
              {capsule.category}
            </span>

            <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight mb-12 break-words drop-shadow-sm">
              {capsule.text}
            </h2>

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
        /* タイトルの心拍アニメーション */
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.05); text-shadow: 0 0 20px rgba(168,85,247,0.8); }
          30% { transform: scale(1); }
          45% { transform: scale(1.03); text-shadow: 0 0 25px rgba(168,85,247,0.8); }
          60% { transform: scale(1); }
        }
        .animate-heartbeat {
          animation: heartbeat 2.5s ease-in-out infinite;
        }

        /* カプセルのキラキラ（シマー）アニメーション */
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .animate-shimmer {
          animation: shimmer 4s infinite linear;
        }
        /* 高速版（飛び出すカプセル用） */
        .animate-shimmer-fast {
          animation: shimmer 2s infinite linear;
        }

        /* その他のアニメーション */
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