const ORIGINAL_THEMES = [
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


const replacements = {
  6: ["What would you do with one million yen?", "100万円あったら何に使う？"],
  7: ["What helps you start a conversation?", "会話を始めるきっかけは？"],
  9: ["What kind of wallpaper would you design for a phone?", "スマホの壁紙を作るならどんなデザイン？"],
  26: ["If you could become a fictional character, who would you choose?", "物語の登場人物になれるなら誰？"],
  28: ["What small mistake taught you something useful? You can invent an example.", "小さな失敗から学べることは？架空の例でもOK。"],
  29: ["What everyday design do you find interesting?", "面白いと思う身近なデザインは？"],
  30: ["What kind of story moves you?", "どんな物語に心を動かされる？"],
  31: ["What actions make someone a good teammate?", "よいチームメイトの行動とは？"],
  32: ["Plan a fun afternoon with friends.", "友達と楽しく過ごす午後を計画しよう。"],
  33: ["What three qualities matter in teamwork?", "チームワークで大切な資質を3つ挙げよう。"],
  35: ["What rule would make a shared space more comfortable?", "みんなの場所を快適にするルールは？"],
  41: ["What would you like to photograph on a walk?", "散歩中に何を撮影したい？"],
  42: ["What would you pack for an imaginary day trip?", "日帰り旅行に何を持っていく？"],
  43: ["How can people disagree respectfully?", "意見が違うとき、どうすれば相手を尊重できる？"],
  49: ["What helps you relax before bedtime?", "寝る前にリラックスできることは？"],
};
export const BASE_THEMES = ORIGINAL_THEMES.map(theme => replacements[theme.id]
  ? { ...theme, textEn: replacements[theme.id][0], textJa: replacements[theme.id][1], category: 'Daily' }
  : theme);
