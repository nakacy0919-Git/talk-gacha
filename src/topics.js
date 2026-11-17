import { BASE_THEMES } from './themes.js';
import { EXTRA_GROUPS } from './extra-topics.js';

// Original bilingual prompts. No personal information or real experiences required.
const groups = {
  School: [
    ['Design a lesson everyone would enjoy.', 'みんなが楽しめる授業を考えよう。'],
    ['What would you put in a school relaxation space?', '学校の休憩スペースに何を置く？'],
    ['How can a class welcome a new student?', '新しい生徒をクラスでどう迎える？'],
    ['What makes group work successful?', 'グループ活動がうまくいく条件は？'],
    ['Which school event would you create?', '新しい学校行事を作るなら？'],
    ['What can students teach teachers?', '生徒が先生に教えられることは？'],
    ['What is a useful way to review vocabulary?', '語彙を復習するよい方法は？'],
    ['How would you improve the school library?', '学校図書館をどう改善する？'],
    ['What should a school garden grow?', '学校の庭で何を育てたい？'],
    ['What helps you ask questions in class?', '授業で質問しやすくなる工夫は？'],
  ],
  Exchange: [
    ['What local place would you introduce to a visitor?', '訪問者に紹介したい地元の場所は？'],
    ['Teach a greeting in a language you know.', '知っている言語の挨拶を教えよう。'],
    ['What would you ask students in another country?', '外国の生徒に何を聞きたい？'],
    ['How can we check a cultural stereotype?', '文化の思い込みをどう確かめる？'],
    ['Plan an online activity with a partner school.', '交流校と行うオンライン活動を考えよう。'],
    ['What would you put in a welcome guide for visitors?', '訪問者向けガイドに何を載せる？'],
    ['How can you explain a game without shared words?', '共通の言語がなくても遊び方をどう伝える？'],
    ['What festival would you like to learn about?', '知りたいお祭りは？'],
    ['What makes a good question about another culture?', '別の文化について聞くよい質問とは？'],
    ['What could two schools create together online?', '2校がオンラインで一緒に作れるものは？'],
  ],
  Food: [
    ['Invent a new sandwich.', '新しいサンドイッチを考えよう。'],
    ['What food would you recommend to a visitor?', '訪問者に勧めたい食べ物は？'],
    ['How can a cafeteria reduce food waste?', '食堂で食品ロスをどう減らす？'],
    ['Would you rather cook or wash the dishes? Why?', '料理と皿洗いならどちらを選ぶ？なぜ？'],
    ['Design a colorful lunch menu.', '彩りのよい昼食メニューを考えよう。'],
    ['What food would you like to learn to make?', '作り方を覚えたい料理は？'],
    ['What makes a picnic enjoyable?', 'ピクニックを楽しくするものは？'],
    ['Name a dish that can be adapted for different diets.', '食習慣の違いに合わせて変えられる料理は？'],
    ['What would a restaurant on the moon serve?', '月のレストランは何を出す？'],
    ['How would you describe a flavor without naming the food?', '食べ物の名前を使わず味をどう説明する？'],
  ],
  Travel: [
    ['Plan a trip using only public transportation.', '公共交通機関だけの旅を計画しよう。'],
    ['Would you explore a forest or a city? Why?', '森と街ならどちらを探検する？なぜ？'],
    ['What makes a place easy to visit for everyone?', '誰もが訪れやすい場所の条件は？'],
    ['What would you show a visitor on a rainy day?', '雨の日に訪問者をどこへ案内する？'],
    ['What can you learn by traveling close to home?', '近場の旅行から学べることは？'],
    ['Design a walking tour with three stops.', '3か所を巡る散歩コースを作ろう。'],
    ['Would you travel slowly or visit many places?', 'ゆっくり旅する？多くの場所を巡る？'],
    ['What would you put in a travel phrasebook?', '旅の会話集にどんな表現を入れる？'],
    ['How can visitors respect a local community?', '旅行者は地域をどう尊重できる？'],
    ['Invent a souvenir that tells a local story.', '地域の物語が伝わるお土産を考えよう。'],
  ],
  Creativity: [
    ['Invent a useful object using two everyday items.', '身近な物2つで便利な道具を考えよう。'],
    ['What title would you give a movie about a talking tree?', '話す木の映画にどんな題名を付ける？'],
    ['Design a mascot for your town.', '街のマスコットを考えよう。'],
    ['Create a new holiday and explain its purpose.', '新しい祝日とその目的を考えよう。'],
    ['What would a museum of everyday life display?', '日常生活の博物館に何を展示する？'],
    ['Tell a story beginning with a lost umbrella.', 'なくした傘から始まる物語を話そう。'],
    ['Design a playground for all ages.', 'あらゆる年齢が楽しめる遊び場を考えよう。'],
    ['What could you make from an empty box?', '空き箱で何を作れる？'],
    ['Invent a sport with simple rules.', '簡単なルールのスポーツを考えよう。'],
    ['Describe an imaginary animal and its habitat.', '架空の動物と生息地を説明しよう。'],
  ],
  Technology: [
    ['What task would you ask a robot to help with?', 'ロボットに手伝ってほしい作業は？'],
    ['What makes an app easy to use?', '使いやすいアプリの条件は？'],
    ['How can you check whether an online claim is reliable?', 'ネットの情報が信頼できるかどう確かめる？'],
    ['What should people ask before sharing a photo of someone?', '人の写真を共有する前に何を確認する？'],
    ['When is a paper notebook useful?', '紙のノートが役立つのはどんなとき？'],
    ['Design a helpful invention for a classroom.', '教室で役立つ発明を考えよう。'],
    ['How could technology help people learn languages?', '技術は言語学習にどう役立つ？'],
    ['What would you do during a screen-free afternoon?', '画面を使わない午後に何をする？'],
    ['What should an AI tool explain to its users?', 'AIツールが利用者に説明すべきことは？'],
    ['How can a game encourage cooperation?', 'ゲームで協力を促すには？'],
  ],
  Environment: [
    ['How can a school use less paper?', '学校で紙の使用をどう減らす？'],
    ['What would make reusable bottles more convenient?', '繰り返し使うボトルを便利にするには？'],
    ['Design a campaign to keep a park clean.', '公園をきれいに保つ活動を考えよう。'],
    ['How can people save water in everyday life?', '日常生活でどう節水できる？'],
    ['What can a town do to support wildlife?', '街は野生生物をどう守れる？'],
    ['What would a repair club do?', '修理クラブでは何をする？'],
    ['How could a school reuse old uniforms?', '古い制服を学校でどう再利用する？'],
    ['What makes walking or cycling more appealing?', '徒歩や自転車を魅力的にするには？'],
    ['Plan an event with very little waste.', 'ごみの少ないイベントを計画しよう。'],
    ['Which environmental question would you investigate locally?', '地域で調べたい環境の疑問は？'],
  ],
  Community: [
    ['How can a town welcome people who speak different languages?', '異なる言語を話す人を街でどう迎える？'],
    ['Design a clear sign for an emergency shelter.', '避難所の分かりやすい案内表示を考えよう。'],
    ['What makes a public space comfortable?', '公共の場所を快適にするものは？'],
    ['How could students help at a local event?', '地域行事で生徒は何を手伝える？'],
    ['What should a neighborhood map include?', '地域の地図に何を載せるべき？'],
    ['How can people share skills across generations?', '世代を越えて得意なことをどう教え合う？'],
    ['What would you put in a community newsletter?', '地域のお便りに何を載せる？'],
    ['Design a free activity for a community center.', '公民館の無料活動を考えよう。'],
    ['What makes it easier to ask for help?', '助けを求めやすくする工夫は？'],
    ['How can a team include a quiet member?', '静かなメンバーも参加しやすくするには？'],
  ],
  Future: [
    ['What skill would you like to learn next year?', '来年身に付けたい技能は？'],
    ['What might classrooms look like in twenty years?', '20年後の教室はどうなると思う？'],
    ['What job would you like to try for one day?', '1日体験したい仕事は？'],
    ['What would you put in a time capsule?', 'タイムカプセルに何を入れる？'],
    ['How might people travel in the future?', '未来の人はどう移動すると思う？'],
    ['What would you ask your future self?', '未来の自分に何を聞く？'],
    ['What habit would you like to build?', '身に付けたい習慣は？'],
    ['What new club would you like to start?', '始めたい新しいクラブは？'],
    ['What problem would you like to help solve?', '解決に協力したい問題は？'],
    ['What does a successful day mean to you?', '自分にとって充実した1日とは？'],
  ],
  Choices: [
    ['Would you rather explore the ocean or space? Why?', '海と宇宙ならどちらを探検したい？なぜ？'],
    ['Would you rather read a book or watch its film first?', '原作と映画ならどちらを先に見る？'],
    ['Would you rather have more time or more energy?', '時間と体力ならどちらを増やしたい？'],
    ['Would you rather plan a trip or be surprised?', '旅は計画したい？行き先はお楽しみがいい？'],
    ['Would you rather learn an instrument or a new sport?', '楽器と新しいスポーツならどちらを習う？'],
    ['Would you rather live near mountains or the sea?', '山と海ならどちらの近くに住みたい？'],
    ['Would you rather work alone or with a team?', '一人とチームならどちらで作業したい？'],
    ['Would you rather visit the past or the future?', '過去と未来ならどちらを訪れたい？'],
    ['Would you rather create a game or a short film?', 'ゲームと短編映画ならどちらを作りたい？'],
    ['Would you rather be able to fly or breathe underwater?', '空を飛ぶ力と水中呼吸ならどちらが欲しい？'],
  ],
};
export const TALK_THEMES = [
  ...BASE_THEMES,
  ...Object.entries(groups).flatMap(([category, prompts], group) =>
    prompts.map(([textEn, textJa], index) => ({
      id: 51 + group * 10 + index, textEn, textJa, category, color: 'bg-indigo-400',
    }))),
  ...Object.entries(EXTRA_GROUPS).flatMap(([category, prompts], group) =>
    prompts.map(([textEn, textJa], index) => ({
      id: 151 + group * 10 + index, textEn, textJa, category,
      color: ['bg-teal-400', 'bg-blue-400', 'bg-violet-400', 'bg-amber-400', 'bg-rose-400'][group],
    }))),
];
export const CATEGORIES = [...new Set(TALK_THEMES.map(theme => theme.category))].sort();

export const TOPIC_MODES = [
  { id: 'All', label: 'All topics / すべて', categories: null },
  { id: 'WarmUp', label: 'Icebreakers / アイスブレイク', categories: ['Daily', 'Food', 'Choices', 'Hobby', 'Life', 'Music', 'Friend', 'Happy', 'Sense', 'Reward', 'DailyChoices'] },
  { id: 'SchoolLife', label: 'School & teamwork / 学校・協働', categories: ['School', 'Teamwork', 'Challenges', 'Skill'] },
  { id: 'World', label: 'World & cultures / 世界・文化', categories: ['Exchange', 'Culture', 'Travel', 'Languages', 'Community'] },
  { id: 'Discussion', label: 'Think & discuss / 考える', categories: ['Technology', 'Environment', 'MediaLiteracy', 'Community', 'Future'] },
  { id: 'Imagination', label: 'Imagination / 想像する', categories: ['Creativity', 'Fantasy', 'If', 'Dream', 'BucketList'] },
  { id: 'Goals', label: 'Goals & growth / 目標・成長', categories: ['Future', 'Challenges', 'Motto', 'Dream', 'BucketList'] },
  { id: 'QuickChoices', label: 'Would you rather? / 二択', categories: ['Choices', 'DailyChoices'] },
  { id: 'Language', label: 'English practice / 英語練習', categories: ['Languages', 'Exchange', 'School', 'Teamwork'] },
];
export function getTopicPool(themes, selection) {
  if (selection === 'All') return themes;
  const mode = TOPIC_MODES.find(item => item.id === selection);
  return themes.filter(theme => mode
    ? mode.categories.includes(theme.category)
    : theme.category === selection);
}

export function drawTheme(themes, category, seen, random = Math.random) {
  const pool = getTopicPool(themes, category);
  if (!pool.length) return null;
  const unseen = pool.filter(theme => !seen.has(theme.id));
  const choices = unseen.length ? unseen : pool.filter(theme => theme.id !== [...seen].at(-1));
  const available = choices.length ? choices : pool;
  return available[Math.floor(random() * available.length)];
}
