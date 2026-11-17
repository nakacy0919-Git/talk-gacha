import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, RefreshCcw, X, Languages } from 'lucide-react';
import { TALK_THEMES, CATEGORIES, TOPIC_MODES, getTopicPool, drawTheme } from './topics.js';

// Gacha capsule visual used by the interactive arcade machine.
// --- Component: Capsule ---
const CapsuleDisplay = ({ color, style, size = 80 }) => (
  <div 
    className="tg-mini-capsule absolute rounded-full flex items-center justify-center overflow-hidden shadow-lg"
    style={{
      width: `${size}px`,
      height: `${size}px`,
      boxShadow: 'inset -6px -6px 12px rgba(0,0,0,0.4), 4px 8px 10px rgba(0,0,0,0.3)',
      ...style
    }}
  >
    <div className={`w-full h-1/2 absolute bottom-0 ${color}`}></div>
    <div className="w-full h-1/2 absolute top-0 bg-white/30 backdrop-blur-[1px]"></div>
    <div className="w-full h-[3%] bg-black/10 absolute top-1/2 -translate-y-1/2 z-10 box-border border-t border-white/30"></div>
    <div className="absolute top-[15%] left-[15%] w-[30%] h-[20%] bg-white rounded-full opacity-80 blur-[4px]"></div>
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
  const [showJa, setShowJa] = useState(false); // 日本語表示の切り替えステート
  
  const [category, setCategory] = useState('All');
  const seenRef = useRef(new Set());
  const dispensedRef = useRef(false);
  const resetButtonRef = useRef(null);
  const knobRef = useRef(null);
  const lastAngleRef = useRef(0);
  const cumulativeRotationRef = useRef(0);

  // Generate Inventory
  const generateInventory = () => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: Math.random() * 92 + 4,
      top: Math.random() * 45 + 50,
      color: TALK_THEMES[i % TALK_THEMES.length].color,
      rotate: Math.random() * 360,
      zIndex: Math.floor(Math.random() * 30),
      scale: 1.0 + Math.random() * 0.6,
      shimmerDelay: Math.random() * 5
    })).sort((a, b) => a.top - b.top);
  };

  const [inventory, setInventory] = useState(generateInventory);

  const dispenseCapsule = useCallback(() => {
    if (dispensedRef.current) return;
    const theme = drawTheme(TALK_THEMES, category, seenRef.current);
    if (!theme) return;
    dispensedRef.current = true;
    const pool = getTopicPool(TALK_THEMES, category);
    if (pool.every(t => seenRef.current.has(t.id))) {
      pool.forEach(t => seenRef.current.delete(t.id));
    }
    seenRef.current.add(theme.id);
    setIsDragging(false);
    setHasDispensed(true);
    cumulativeRotationRef.current = 0;
    setCapsule(theme);
    setInventory(prev => prev.slice(0, -1));
    try { navigator.vibrate?.([100, 50, 100]); } catch { /* Optional device feedback */ }
  }, [category]);

  // --- Handle Rotation Logic ---
  const getAngle = (clientX, clientY) => {
    if (!knobRef.current) return 0;
    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  };

  const handleStart = (e) => {
    if (dispensedRef.current) return;
    setIsDragging(true);
    if(e.cancelable) e.preventDefault();
    
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

    setRotation(previous => previous + delta);
    
    cumulativeRotationRef.current += delta;
    lastAngleRef.current = currentAngle;

    if (Math.abs(cumulativeRotationRef.current) % 60 < 10) {
      try { navigator.vibrate?.(5); } catch { /* Optional device feedback */ }
    }

    if (cumulativeRotationRef.current > 360) {
      dispenseCapsule();
    }
  }, [isDragging, hasDispensed, dispenseCapsule]);

  const handleEnd = () => {
    setIsDragging(false);
  };

  const resetGacha = () => {
    dispensedRef.current = false;
    setIsDragging(false);
    setRotation(0);
    setHasDispensed(false);
    setCapsule(null);
    setShowResult(false);
    setShowJa(false); // リセット時に日本語表示も初期化（英語に戻る）
    cumulativeRotationRef.current = 0;
    
    if (inventory.length < 20) {
        setInventory(generateInventory());
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove, { passive: false });
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
      window.addEventListener('touchcancel', handleEnd);
      window.addEventListener('blur', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
      window.removeEventListener('blur', handleEnd);
    };
  }, [isDragging, handleMove]);

  useEffect(() => {
    if (!hasDispensed) return;
    const previous = document.activeElement;
    const overlay = document.querySelector('[data-gacha-overlay]');
    const buttons = overlay?.querySelectorAll('button');
    buttons?.[0]?.focus();
    const onKey = event => {
      if (event.key === 'Escape') { event.preventDefault(); resetButtonRef.current?.click(); }
      if (event.key === 'Tab' && buttons?.length) {
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); previous?.focus(); };
  }, [hasDispensed, showResult]);

  return (
    <div className="tg-app">
      
      {/* Background Effect */}
      <div className="tg-ambient" aria-hidden="true"></div>

      {/* Header */}
      <header className="tg-header">
        <p className="tg-eyebrow"><Sparkles size={15} aria-hidden="true" /> THE CONVERSATION ARCADE</p>
        <h1 className="tg-title">
          TALK GACHA
        </h1>
        <p className="tg-subtitle">Spin a capsule. Start a conversation. <span>ガチャから広がる英会話</span></p>
      </header>

      <section className="tg-toolbar" aria-label="Topic settings">
        <label htmlFor="category" className="tg-mode-label">CHOOSE YOUR MODE <span>話題のジャンル・全{TALK_THEMES.length}題</span></label>
        <select id="category" value={category} disabled={hasDispensed || isDragging}
          onChange={e => { setCategory(e.target.value); cumulativeRotationRef.current = 0; setRotation(0); }}
          className="tg-mode-select">
           <optgroup label="Recommended modes / おすすめモード">
             {TOPIC_MODES.map(mode => <option key={mode.id} value={mode.id}>{mode.label} ({getTopicPool(TALK_THEMES, mode.id).length})</option>)}
           </optgroup>
           <optgroup label="Detailed categories / 詳細カテゴリ">
             {CATEGORIES.map(name => <option key={name} value={name}>{name} ({getTopicPool(TALK_THEMES, name).length})</option>)}
           </optgroup>
        </select>
        <p className="tg-safe-note">答えたくないお題はパスできます。架空の話でもOK。個人情報は不要です。</p>
        <button onClick={dispenseCapsule} disabled={hasDispensed} className="tg-draw-button"><Sparkles size={19} aria-hidden="true" /> DRAW A TOPIC <span>お題を引く</span></button>
      </section>
      {/* Main Machine Body */}
      <div className="tg-machine">
        
        {/* Top: Showcase Window */}
        <div className="tg-showcase">
          <div className="tg-showcase-label"><span><span className="tg-live-dot" aria-hidden="true"></span> TALK STATION</span><span>{TALK_THEMES.length} PROMPTS</span></div>
          <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_0_20px_50px_rgba(0,0,0,0.3)] rounded-t-[32px]"></div>
          <div className="absolute inset-0 z-0 p-4 opacity-90">
             <div className="tg-showcase-inner"></div>
          </div>
          
          <div className="absolute inset-0 z-10 px-4 pb-4 pointer-events-none">
            {inventory.map((item) => (
              <CapsuleDisplay 
                key={item.id}
                color={item.color}
                size={80 * item.scale}
                style={{
                  left: `${item.left}%`,
                  top: `${item.top}%`,
                  transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
                  zIndex: item.zIndex,
                  transition: 'top 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), left 0.5s ease, transform 0.5s ease',
                  animationDelay: `-${item.shimmerDelay}s` 
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 z-30 pointer-events-none rounded-t-[54px] mix-blend-overlay opacity-70">
             <div className="absolute top-0 right-[15%] w-40 h-[150%] bg-gradient-to-b from-white to-transparent skew-x-[-30deg] blur-[8px]"></div>
          </div>
        </div>

        {/* Bottom: Control Panel */}
        <div className="tg-machine-panel">
          <div className="w-full h-3 bg-slate-300 absolute top-0 border-b border-white/50"></div>
          <div className="w-full h-3 bg-slate-300 absolute bottom-0 border-t border-white/50"></div>

          <div className="tg-machine-meta">
             <div className="tg-free-play">
                <div className="w-3 h-12 bg-slate-900 rounded-full shadow-inner border-2 border-slate-600"></div>
                <div className="flex flex-col leading-none">
                    <span className="text-[10px] font-bold text-slate-600">INSERT COIN</span>
                    <span className="text-base font-black text-slate-700">FREE PLAY</span>
                </div>
             </div>
             
             <div className="tg-price">
                  <span className="text-2xl font-black tracking-wider">¥0</span>
             </div>
          </div>

          {/* THE HUGE HANDLE */}
          <div className="tg-handle-wrap group">
            <div className="absolute inset-0 rounded-full bg-slate-400 transform scale-105 blur-xl opacity-50"></div>
            
            <div 
              ref={knobRef}
              className={`tg-knob ${hasDispensed ? 'tg-knob-disabled' : ''}`}
              style={{ transform: `rotate(${rotation}deg)`, touchAction: 'none' }} 
              onMouseDown={handleStart}
              onTouchStart={handleStart}
            >
              <div className="absolute inset-6 rounded-full border-[6px] border-slate-400/30 border-dashed"></div>

              <div className="tg-knob-arm tg-knob-arm-horizontal">
                  <div className="w-24 h-24 bg-slate-200 rounded-2xl shadow-inner border border-slate-300"></div>
                  <div className="w-24 h-24 bg-slate-200 rounded-2xl shadow-inner border border-slate-300"></div>
              </div>
              
              <div className="tg-knob-arm tg-knob-arm-vertical">
                  <div className="w-24 h-24 bg-slate-200 rounded-2xl shadow-inner border border-slate-300"></div>
                  <div className="w-24 h-24 bg-slate-200 rounded-2xl shadow-inner border border-slate-300"></div>
              </div>

              <div className="tg-knob-hub">
                 <div className="tg-knob-hub-inner">
                    <RefreshCcw className="text-white tg-knob-icon" />
                 </div>
              </div>
            </div>
            
            {!hasDispensed && (
              <div className="tg-handle-halo">
                  <div className="w-full h-full animate-spin-slow rounded-full border-t-[12px] border-r-[12px] border-pink-500/50 blur-[4px]"></div>
              </div>
            )}
          </div>

          <p className="tg-turn-instruction">
             {hasDispensed ? "TAP THE CAPSULE!" : "TURN RIGHT →"}
          </p>
        </div>
      </div>

      {/* --- FLASHY CENTER CAPSULE OVERLAY --- */}
      {hasDispensed && capsule && !showResult && (
        <div data-gacha-overlay className="tg-overlay tg-capsule-overlay animate-fade-in">
            <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
                <div className="w-[200vw] h-[200vw] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.1)_20deg,transparent_40deg)] animate-spin-slow opacity-60 mix-blend-overlay"></div>
            </div>

            <button 
                aria-label="Open topic / お題を開く"
                autoFocus
                onClick={() => setShowResult(true)}
                className="tg-capsule-trigger animate-elastic-pop group"
            >
                <div className="w-[min(24rem,85vw)] h-[min(24rem,85vw)] rounded-full border-[16px] border-white shadow-[0_0_150px_rgba(255,255,255,0.6)] relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                     <div className={`absolute bottom-0 w-full h-1/2 ${capsule.color}`}></div>
                     <div className="absolute top-0 w-full h-1/2 bg-white/40 backdrop-blur-md"></div>
                     <div className="absolute top-1/2 w-full h-[6px] bg-black/10 -translate-y-1/2"></div>
                     <div className="absolute top-16 left-16 w-24 h-16 bg-white/70 rounded-full blur-[10px]"></div>
                     
                     <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                        <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/80 to-transparent transform -skew-x-20 animate-shimmer-fast"></div>
                     </div>

                     <div className="absolute inset-0 flex items-center justify-center">
                        <span className="tg-tap-label">
                            TAP ME!
                        </span>
                     </div>
                </div>
            </button>
            <button ref={resetButtonRef} onClick={resetGacha} className="tg-pass-button">PASS / パス</button>
        </div>
      )}

      {/* --- RESULT MODAL (PC横長対応・JP切替機能付き) --- */}
      {showResult && capsule && (
        <div data-gacha-overlay className="tg-overlay tg-result-overlay animate-fade-in">
          {/* 横幅を大幅に拡大 (max-w-4xl) して例文が1行に収まりやすく調整 */}
          <div role="dialog" aria-modal="true" aria-labelledby="topic-title"
            className="tg-result-card animate-pop-up">
            
            <button 
              onClick={resetGacha}
              className="tg-close-button"
              ref={resetButtonRef}
              aria-label="Close / パス"
            >
              <X size={32} className="text-slate-600" />
            </button>

            <div className="tg-result-icon-wrap">
               <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-violet-300 blur-3xl opacity-60 rounded-full transform scale-150 animate-pulse"></div>
              <div className={`tg-result-icon ${capsule.color}`}>
                <Sparkles size={48} />
              </div>
            </div>

            <span className="tg-result-category">
              {capsule.category}
            </span>

            {/* テキスト表示エリア（高さを固定してガタつきを防ぐ） */}
            <div className="tg-topic-container">
              <h2 id="topic-title" className="tg-topic-text">
                {showJa ? capsule.textJa : capsule.textEn}
              </h2>
            </div>

            {/* 翻訳切り替えトグルボタン */}
            <button
              onClick={() => setShowJa(!showJa)}
              className={`tg-language-toggle ${
                showJa 
                  ? 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100' 
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <Languages size={24} />
              {showJa ? 'Show English' : '日本語訳を表示'}
            </button>

            <div className="tg-followup-box">
              <p className="tg-followup-title">KEEP TALKING <span>会話を広げよう</span></p>
              <p>Why? / なぜ？ · Can you give an example? / 例えば？ · What about you? / あなたは？</p>
              <p className="mt-2">I think … because … / 私は…と思います。理由は…</p>
            </div>
            <div className="tg-next-wrap">
              <button 
                onClick={resetGacha}
                className="tg-next-button"
              >
                <RefreshCcw size={24} /> NEXT GACHA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        .font-outline {
          -webkit-text-stroke: 2px rgba(255,255,255,0.3);
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.05); text-shadow: 0 0 20px rgba(255,192,203,0.8); }
          30% { transform: scale(1); }
          45% { transform: scale(1.03); text-shadow: 0 0 25px rgba(255,192,203,0.8); }
          60% { transform: scale(1); }
        }
        .animate-heartbeat {
          animation: heartbeat 2.5s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .animate-shimmer {
          animation: shimmer 4s infinite linear;
        }
        .animate-shimmer-fast {
          animation: shimmer 2s infinite linear;
        }
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