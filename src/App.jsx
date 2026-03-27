import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, RefreshCcw, X, Languages } from 'lucide-react';

// --- データ定義: トークテーマのお題（英語＆日本語のペア 50個） ---
const TALK_THEMES = [
  // 定番・アイスブレイク
  { id: 1, textEn: "What is the most expensive thing you've ever bought?", textJa: "人生で一番高かった買い物は？", category: "Money", color: "bg-yellow-400" },
  { id: 2, textEn: "What was your childhood dream job?", textJa: "子供の頃の将来の夢は？", category: "Past", color: "bg-blue-400" },
  { id: 3, textEn: "If the world ended tomorrow, what would be your last meal?", textJa: "もし明日世界が終わるなら何食べる？", category: "Food", color: "bg-red-500" },
  { id: 4, textEn: "Share a 'small happiness' you experienced recently.", textJa: "最近あった「小さな幸せ」", category: "Daily", color: "bg-green-400" },
  { id: 5, textEn: "Something you're secretly bad at or dislike.", textJa: "実は苦手なもの・こと", category: "Secret", color: "bg-purple-500" },
  { id: 6, textEn: "What would you do if you were given $10,000?", textJa: "100万円もらったら何に使う？", category: "Dream", color: "bg-amber-400" },
  { id: 7, textEn: "Share a little story about your first love!", textJa: "初恋のエピソードを少しだけ！", category: "Love", color: "bg-pink-400" },
  { id: 8, textEn: "If you were an animal, what would you be?", textJa: "自分を動物に例えると？", category: "Self", color: "bg-orange-400" },
  { id: 9, textEn: "Show us your phone's lock screen!", textJa: "スマホの待ち受け画面見せて！", category: "Mobile", color: "bg-sky-400" },
  { id: 10, textEn: "Where do you want to travel to the most right now?", textJa: "今一番行きたい旅行先は？", category: "Travel", color: "bg-cyan-400" },
  
  // 趣味・嗜好
  { id: 11, textEn: "Who or what are you currently obsessed with?", textJa: "最近ハマっている推しは？", category: "Hobby", color: "bg-fuchsia-400" },
  { id: 12, textEn: "Your all-time favorite movie or TV show.", textJa: "人生ベスト映画 or ドラマ", category: "Culture", color: "bg-indigo-400" },
  { id: 13, textEn: "How would you spend your ideal day off?", textJa: "理想の休日の過ごし方", category: "Life", color: "bg-emerald-400" },
  { id: 14, textEn: "What's your go-to karaoke song?", textJa: "カラオケの十八番は？", category: "Music", color: "bg-rose-400" },
  { id: 15, textEn: "Name one thing on your bucket list.", textJa: "死ぬまでに一度はやってみたいこと", category: "BucketList", color: "bg-teal-400" },
  { id: 16, textEn: "Something you can't help but buy at the convenience store.", textJa: "コンビニでつい買ってしまうもの", category: "Daily", color: "bg-orange-300" },
  { id: 17, textEn: "Which YouTubers or creators do you watch the most?", textJa: "YouTuber誰よく見る？", category: "Media", color: "bg-red-400" },
  { id: 18, textEn: "What is your favorite smell?", textJa: "好きな「匂い」教えて", category: "Sense", color: "bg-lime-400" },
  { id: 19, textEn: "The most relaxing spot in your home.", textJa: "家の中で一番落ち着く場所", category: "Home", color: "bg-slate-400" },
  { id: 20, textEn: "A memorable story from your school club activities.", textJa: "学生時代の部活動の思い出", category: "School", color: "bg-blue-500" },

  // 深掘り・もしも
  { id: 21, textEn: "If you could have one superpower, what would it be?", textJa: "特殊能力が一つもらえるなら？", category: "Fantasy", color: "bg-indigo-500" },
  { id: 22, textEn: "What is your life motto?", textJa: "あなたの「座右の銘」は？", category: "Motto", color: "bg-rose-500" },
  { id: 23, textEn: "If you had a time machine, what era would you go back to?", textJa: "タイムマシンで過去に戻るならいつ？", category: "If", color: "bg-violet-400" },
  { id: 24, textEn: "How do you usually treat yourself?", textJa: "自分にご褒美をあげるなら？", category: "Reward", color: "bg-yellow-300" },
  { id: 25, textEn: "If you were stranded on a desert island, what one thing would you bring?", textJa: "無人島に一つだけ持っていくなら？", category: "Survival", color: "bg-green-500" },
  { id: 26, textEn: "If you were reborn, would you be a man, a woman, or something else?", textJa: "生まれ変わるなら男？女？それ以外？", category: "Reborn", color: "bg-cyan-500" },
  { id: 27, textEn: "Would you quit your job if you won the lottery?", textJa: "宝くじで10億円当たったら仕事辞める？", category: "Money", color: "bg-amber-300" },
  { id: 28, textEn: "A dark, embarrassing past you haven't told anyone...", textJa: "誰にも言っていない黒歴史...", category: "Secret", color: "bg-gray-600" },
  { id: 29, textEn: "Just between us, I actually have a fetish for...", textJa: "ここだけの話、実は〇〇フェチです", category: "Fetish", color: "bg-pink-500" },
  { id: 30, textEn: "When was the last time you cried and why?", textJa: "最近泣いたこと", category: "Emotion", color: "bg-blue-300" },

  // 恋愛・人間関係
  { id: 31, textEn: "What gesture from the opposite sex makes your heart skip a beat?", textJa: "異性のどんな仕草に弱い？", category: "Love", color: "bg-pink-300" },
  { id: 32, textEn: "Describe your ideal date plan.", textJa: "理想のデートプラン", category: "Date", color: "bg-rose-300" },
  { id: 33, textEn: "What are your top 3 requirements for a romantic partner?", textJa: "恋人・パートナーに求める条件3つ", category: "Love", color: "bg-red-300" },
  { id: 34, textEn: "What is the best gift you've ever received?", textJa: "今までで一番嬉しかったプレゼント", category: "Gift", color: "bg-orange-200" },
  { id: 35, textEn: "Are there any weird rules in your family?", textJa: "家族の変なルールある？", category: "Family", color: "bg-green-300" },
  { id: 36, textEn: "Who is someone you deeply respect?", textJa: "尊敬する人は誰？", category: "Respect", color: "bg-purple-300" },
  { id: 37, textEn: "What is the best compliment you've ever received?", textJa: "言われて一番嬉しかった褒め言葉", category: "Happy", color: "bg-yellow-200" },
  { id: 38, textEn: "What do you look for in a friend?", textJa: "友達になる人に求めること", category: "Friend", color: "bg-teal-300" },
  { id: 39, textEn: "What do people usually think of you at first impression?", textJa: "第一印象、どう思われがち？", category: "Impression", color: "bg-indigo-300" },
  { id: 40, textEn: "Do you believe in destiny?", textJa: "「運命」って信じる？", category: "Fate", color: "bg-violet-300" },

  // その他
  { id: 41, textEn: "What is the most recent photo in your phone's camera roll?", textJa: "スマホの写真フォルダの最新の一枚は？", category: "Photo", color: "bg-sky-300" },
  { id: 42, textEn: "Show us what's inside your bag!", textJa: "カバンの中身、見せて！", category: "Bag", color: "bg-stone-400" },
  { id: 43, textEn: "What made you angry recently?", textJa: "最近怒ったことある？", category: "Anger", color: "bg-red-600" },
  { id: 44, textEn: "If you had a month off starting tomorrow, what would you do?", textJa: "明日から1ヶ月休みなら何する？", category: "Vacation", color: "bg-emerald-300" },
  { id: 45, textEn: "What is your recommended way to relieve stress?", textJa: "おすすめのストレス解消法", category: "Relax", color: "bg-lime-300" },
  { id: 46, textEn: "Do you have a weird but cool flex or hidden talent?", textJa: "地味に自慢できる特技", category: "Skill", color: "bg-orange-500" },
  { id: 47, textEn: "Do you believe in ghosts?", textJa: "幽霊は信じる？信じない？", category: "Ghost", color: "bg-slate-700" },
  { id: 48, textEn: "What's your favorite rice ball (onigiri) filling?", textJa: "好きなおにぎりの具は？", category: "Food", color: "bg-white" },
  { id: 49, textEn: "What do you usually wear to sleep?", textJa: "寝る時の服装は？", category: "Sleep", color: "bg-blue-200" },
  { id: 50, textEn: "Who do you want to meet the most right now?", textJa: "今、一番会いたい人は？", category: "Person", color: "bg-pink-600" },
];

// --- Component: Capsule ---
const CapsuleDisplay = ({ color, style, size = 80 }) => (
  <div 
    className="absolute rounded-full flex items-center justify-center overflow-hidden shadow-lg"
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

  const [inventory, setInventory] = useState(generateInventory());

  // --- Handle Rotation Logic ---
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

    const newRotation = rotation + delta;
    setRotation(newRotation);
    
    cumulativeRotationRef.current += delta;
    lastAngleRef.current = currentAngle;

    if (Math.abs(cumulativeRotationRef.current) % 60 < 10 && navigator.vibrate) {
       navigator.vibrate(5);
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
        newInv.pop(); 
        return newInv;
    });
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  };

  const resetGacha = () => {
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

      {/* Header */}
      <header className="relative z-20 mb-6 text-center w-full">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-pink-200 to-purple-400 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] animate-heartbeat font-outline">
          TALK GACHA
        </h1>
        <div className="mt-2 h-[2px] w-32 mx-auto bg-white opacity-50 rounded-full"></div>
      </header>

      {/* Main Machine Body */}
      <div className="relative w-full max-w-5xl bg-slate-100 rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] border-4 border-slate-400 overflow-hidden flex flex-col z-10 ring-8 ring-slate-600/50 mt-auto mb-auto">
        
        {/* Top: Showcase Window */}
        <div className="w-full h-[40vh] min-h-[350px] relative border-b-[16px] border-slate-300 overflow-hidden bg-slate-200">
          <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_0_20px_50px_rgba(0,0,0,0.3)] rounded-t-[54px]"></div>
          <div className="absolute inset-0 z-0 p-4 opacity-90">
             <div className="absolute inset-3 bg-gradient-to-b from-slate-300 to-slate-100 rounded-[50px] border-2 border-slate-300/50 shadow-inner"></div>
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
        <div className="w-full h-auto min-h-[380px] bg-gradient-to-b from-slate-100 to-slate-200 py-8 flex flex-col items-center justify-center relative z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
          <div className="w-full h-3 bg-slate-300 absolute top-0 border-b border-white/50"></div>
          <div className="w-full h-3 bg-slate-300 absolute bottom-0 border-t border-white/50"></div>

          <div className="flex w-full px-12 justify-between items-start absolute top-10">
             <div className="bg-slate-300 px-6 py-3 rounded-xl shadow-inner border-2 border-slate-400 flex items-center gap-3">
                <div className="w-3 h-12 bg-slate-900 rounded-full shadow-inner border-2 border-slate-600"></div>
                <div className="flex flex-col leading-none">
                    <span className="text-[10px] font-bold text-slate-600">INSERT COIN</span>
                    <span className="text-base font-black text-slate-700">FREE PLAY</span>
                </div>
             </div>
             
             <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg transform rotate-3 border-4 border-white/30">
                  <span className="text-2xl font-black tracking-wider">¥0</span>
             </div>
          </div>

          {/* THE HUGE HANDLE */}
          <div className="relative mt-6 group">
            <div className="absolute inset-0 rounded-full bg-slate-400 transform scale-105 blur-xl opacity-50"></div>
            
            <div 
              ref={knobRef}
              className={`w-80 h-80 rounded-full bg-gradient-to-br from-slate-100 to-slate-400 shadow-[0_30px_60px_rgba(0,0,0,0.4),inset_0_4px_20px_rgba(255,255,255,0.8)] border-[10px] border-slate-200 flex items-center justify-center cursor-grab active:cursor-grabbing ${hasDispensed ? 'opacity-80 pointer-events-none grayscale-[0.3]' : ''} relative z-10 transition-transform`}
              style={{ transform: `rotate(${rotation}deg)`, touchAction: 'none' }} 
              onMouseDown={handleStart}
              onTouchStart={handleStart}
            >
              <div className="absolute inset-6 rounded-full border-[6px] border-slate-400/30 border-dashed"></div>

              <div className="absolute w-[94%] h-28 bg-gradient-to-b from-white to-slate-200 rounded-3xl shadow-lg flex items-center justify-between px-3 border-2 border-white">
                  <div className="w-24 h-24 bg-slate-200 rounded-2xl shadow-inner border border-slate-300"></div>
                  <div className="w-24 h-24 bg-slate-200 rounded-2xl shadow-inner border border-slate-300"></div>
              </div>
              
              <div className="absolute h-[94%] w-28 bg-gradient-to-r from-white to-slate-200 rounded-3xl shadow-lg flex flex-col items-center justify-between py-3 border-2 border-white">
                  <div className="w-24 h-24 bg-slate-200 rounded-2xl shadow-inner border border-slate-300"></div>
                  <div className="w-24 h-24 bg-slate-200 rounded-2xl shadow-inner border border-slate-300"></div>
              </div>

              <div className="absolute w-36 h-36 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full shadow-2xl flex items-center justify-center z-20 border-[8px] border-slate-100">
                 <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-inner border-4 border-white/20">
                    <RefreshCcw className="text-white w-12 h-12 drop-shadow-lg" />
                 </div>
              </div>
            </div>
            
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

      {/* --- FLASHY CENTER CAPSULE OVERLAY --- */}
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

      {/* --- RESULT MODAL (PC横長対応・JP切替機能付き) --- */}
      {showResult && capsule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          {/* 横幅を大幅に拡大 (max-w-4xl) して例文が1行に収まりやすく調整 */}
          <div className="bg-white w-full max-w-5xl rounded-[3rem] p-10 md:p-14 text-center relative shadow-2xl animate-pop-up border-[12px] border-slate-100 flex flex-col items-center">
            
            <button 
              onClick={resetGacha}
              className="absolute top-6 right-6 p-4 bg-slate-200 rounded-full hover:bg-slate-300 active:bg-slate-400 transition-colors z-50 shadow-md"
              aria-label="Close"
            >
              <X size={32} className="text-slate-600" />
            </button>

            <div className="mb-6 flex justify-center relative">
               <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-violet-300 blur-3xl opacity-60 rounded-full transform scale-150 animate-pulse"></div>
              <div className={`relative p-8 rounded-full ${capsule.color} text-white shadow-2xl ring-8 ring-white transform rotate-3`}>
                <Sparkles size={48} />
              </div>
            </div>

            <span className="inline-block px-6 py-2 bg-slate-100 text-slate-500 text-sm font-extrabold rounded-full mb-6 uppercase tracking-[0.2em] shadow-inner">
              {capsule.category}
            </span>

            {/* テキスト表示エリア（高さを固定してガタつきを防ぐ） */}
            <div className="w-full min-h-[120px] flex items-center justify-center mb-8 px-4">
              <h2 className={`font-black text-slate-800 leading-tight drop-shadow-sm transition-all duration-300
                 ${showJa ? 'text-4xl md:text-5xl' : 'text-3xl md:text-5xl'}
              `}>
                {showJa ? capsule.textJa : capsule.textEn}
              </h2>
            </div>

            {/* 翻訳切り替えトグルボタン */}
            <button
              onClick={() => setShowJa(!showJa)}
              className={`mb-10 px-8 py-3 rounded-full font-bold text-lg border-2 shadow-sm transition-all flex items-center gap-3 hover:scale-105 active:scale-95 ${
                showJa 
                  ? 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100' 
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <Languages size={24} />
              {showJa ? 'Show English' : '日本語訳を表示'}
            </button>

            <div className="w-full md:w-2/3 mx-auto">
              <button 
                onClick={resetGacha}
                className="w-full py-5 bg-slate-900 text-white text-xl font-bold rounded-3xl shadow-xl shadow-slate-400/50 hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95"
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