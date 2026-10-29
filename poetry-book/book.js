'use strict';
const $=s=>document.querySelector(s), esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let pages=[],position=0,busy=false;const mobile=matchMedia('(max-width:800px)');let step=()=>mobile.matches?1:2;
const BOOK_TITLE='물빛에 놓아둔 마음';
const song=`<section class="song"><div class="eyebrow">OPENING · 시에서 노래로</div><h1>물에게<br>길을 묻다</h1><p class="lead">한 편의 시가 노래가 되어,<br>책의 첫 장에 흐릅니다.</p><video controls playsinline preload="metadata" poster="media/song-poster.jpg" aria-label="물에게 길을 묻다 창작시 노래 영상"><source src="media/asking-water.mp4" type="video/mp4">이 브라우저에서는 영상을 재생할 수 없습니다.</video><div class="caption">「물에게 길을 묻다」 · 창작시를 노래로 만든 영상<br>시 이명우 · 제공 영상 수록 · 3분 47초</div><hr><p class="intro">물의 흐름을 따라 삶의 방향을 묻는 시.<br>먼저 노래로 만나고, 다음 장에서 시의 문장으로 천천히 돌아오세요.</p></section>`;
const cover=`<section class="cover hardcover-front"><img class="cover-art" src="media/hardcover-art.png" alt="푸른 하늘과 구름을 배경으로 꽃무늬 도자기 위에 서 있는 다채로운 어릿광대 조형물, 작가 제공 그림을 활용한 표지"><div class="cover-type"><div class="eyebrow">명도재 이명우 창작 시집</div><h2 class="calligraphy gold-foil">${BOOK_TITLE}</h2><p class="cover-subtitle">기억을 건너, 계절을 지나</p></div><p class="author">이명우 지음</p><div class="imprint">명도재 제작</div></section>`;
const backCover=`<section class="back-cover"><div class="back-cover-mark">明道齋</div><p class="back-cover-quote">기억을 건너,<br>계절을 지나.<br><br>마음에 머문 풍경이<br>한 권의 시가 됩니다.</p><div class="back-cover-title gold-foil">${BOOK_TITLE}</div><p class="back-cover-author">명도재 이명우 창작 시집</p><div class="back-cover-imprint">명도재 제작</div></section>`;
function setPaperContent(paper,html,number){
 paper.innerHTML=html||'';paper.dataset.number=String(number+1).padStart(2,'0');
 paper.classList.toggle('cover-page',Boolean(paper.querySelector('.cover,.back-cover')));
 paper.classList.toggle('back-cover-page',Boolean(paper.querySelector('.back-cover')));
 paper.scrollTop=0;
}

let soundEnabled=true,audioContext=null;
try{soundEnabled=localStorage.getItem('myeongdo-page-sound')!=='off'}catch{}
function updateSoundControl(){
 const button=$('#sound-toggle');button.textContent=soundEnabled?'소리 켜짐':'소리 꺼짐';
 button.setAttribute('aria-pressed',String(soundEnabled));button.setAttribute('aria-label',soundEnabled?'책장 효과음 끄기':'책장 효과음 켜기');
}
function playPageTurnSound(){
 if(!soundEnabled)return;
 try{
  const AudioEngine=window.AudioContext||window.webkitAudioContext;if(!AudioEngine)return;
  audioContext??=new AudioEngine();
  const play=()=>{
   if(!soundEnabled||audioContext.state!=='running')return;
   const now=audioContext.currentTime;
   // A brief tap, followed by filtered noise shaped like a paper rustle.
   const tap=audioContext.createOscillator(),tapGain=audioContext.createGain();
   tap.type='triangle';tap.frequency.setValueAtTime(1050,now);tap.frequency.exponentialRampToValueAtTime(380,now+.025);
   tapGain.gain.setValueAtTime(.0001,now);tapGain.gain.exponentialRampToValueAtTime(.08,now+.002);tapGain.gain.exponentialRampToValueAtTime(.0001,now+.035);
   tap.connect(tapGain);tapGain.connect(audioContext.destination);tap.start(now);tap.stop(now+.04);
   tap.onended=()=>{tap.disconnect();tapGain.disconnect()};
   const duration=.62,buffer=audioContext.createBuffer(1,Math.ceil(audioContext.sampleRate*duration),audioContext.sampleRate),data=buffer.getChannelData(0);
   for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(.7+.3*Math.sin(i/audioContext.sampleRate*90));
   const paper=audioContext.createBufferSource(),filter=audioContext.createBiquadFilter(),gain=audioContext.createGain();
   paper.buffer=buffer;filter.type='bandpass';filter.Q.value=.65;
   filter.frequency.setValueAtTime(1100,now+.04);filter.frequency.exponentialRampToValueAtTime(3100,now+.26);filter.frequency.exponentialRampToValueAtTime(850,now+.66);
   gain.gain.setValueAtTime(.0001,now);gain.gain.setValueAtTime(.0001,now+.04);gain.gain.exponentialRampToValueAtTime(.15,now+.14);gain.gain.exponentialRampToValueAtTime(.06,now+.36);gain.gain.exponentialRampToValueAtTime(.0001,now+.66);
   paper.connect(filter);filter.connect(gain);gain.connect(audioContext.destination);paper.start(now+.04);paper.stop(now+.67);
   paper.onended=()=>{paper.disconnect();filter.disconnect();gain.disconnect()};
  };
  if(audioContext.state==='suspended')audioContext.resume().then(play).catch(()=>{});else play();
 }catch{/* Audio support must never block reading. */}
}
$('#sound-toggle').onclick=()=>{soundEnabled=!soundEnabled;updateSoundControl();try{localStorage.setItem('myeongdo-page-sound',soundEnabled?'on':'off')}catch{}};
updateSoundControl();
function render(){stopRecital();document.querySelectorAll('audio,video').forEach(v=>v.pause());for(const [i,side] of ['left','right'].entries()){const el=$('#'+side),n=position+i;setPaperContent(el,pages[n],n);el.classList.toggle('mobile-hidden',mobile.matches&&i===1)}$('#prev').disabled=position===0;$('#next').disabled=position+step()>=pages.length;$('#progress').textContent=mobile.matches?`${position+1} / ${pages.length}`:`${position+1} — ${Math.min(position+2,pages.length)} / ${pages.length}`;$('#fill').style.width=`${Math.min(100,(position+step())/pages.length*100)}%`;}
function go(target){
 if(!pages.length)return;
 target=Math.max(0,Math.min(pages.length-step(),target));
 if(!mobile.matches)target-=target%2;
 if(busy||target===position)return;
 busy=true;
 stopRecital();
 playPageTurnSound();
 document.querySelectorAll('video,audio').forEach(v=>v.pause());
 const backward=target<position,turn=$('#turn');
 const source=$(mobile.matches?'#left':backward?'#left':'#right');
 const makeFace=(html,number,side)=>{
  const face=document.createElement('div');face.className=`sheet-face sheet-${side}`;
  const paper=document.createElement('div');paper.className='page';setPaperContent(paper,html,number);
  face.classList.toggle('cover-sheet',paper.classList.contains('cover-page'));
  paper.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
  paper.querySelectorAll('video,audio').forEach(v=>{v.removeAttribute('controls');v.preload='none';v.removeAttribute('autoplay')});
  face.append(paper);return face;
 };
 const front=makeFace(source.innerHTML,Number(source.dataset.number)-1,'front');
 const reverseIndex=mobile.matches?target:backward?target+1:target;
 const back=makeFace(pages[reverseIndex],reverseIndex,'back');
 turn.replaceChildren(front,back);
 front.firstElementChild.scrollTop=source.scrollTop;
 // Reveal the destination under the turning sheet, never through it.
 const under=$(mobile.matches?'#left':backward?'#left':'#right');
 const underIndex=mobile.matches?target:backward?target:target+1;
 setPaperContent(under,pages[underIndex],underIndex);
 let finished=false;
 const finish=()=>{
  if(finished)return;finished=true;clearTimeout(fallback);turn.removeEventListener('animationend',onEnd);
  turn.className='turn';turn.replaceChildren();position=target;render();busy=false;
  history.replaceState(null,'',`#page-${position+1}`);
 };
 const onEnd=e=>{if(e.target===turn)finish()};
 const fallback=setTimeout(finish,1100);
 turn.addEventListener('animationend',onEnd);
 turn.className=`turn active${backward?' back':''}`;
}
function toggleToc(open){$('#toc').hidden=!open;$('#contents').setAttribute('aria-expanded',String(open));if(open)$('#close').focus();else $('#contents').focus()}
$('#prev').onclick=()=>go(position-step());$('#next').onclick=()=>go(position+step());$('#contents').onclick=()=>toggleToc($('#toc').hidden);$('#close').onclick=()=>toggleToc(false);
document.addEventListener('keydown',e=>{if(e.key==='Escape')toggleToc(false);if(!$('#toc').hidden||/INPUT|TEXTAREA|VIDEO|AUDIO/.test(e.target.tagName))return;if(e.key==='ArrowRight'){e.preventDefault();go(position+step())}if(e.key==='ArrowLeft'){e.preventDefault();go(position-step())}});
let suppressClickUntil=0;
let start=null;$('#book').addEventListener('touchstart',e=>{if(e.target.closest('video,audio'))return;start={x:e.touches[0].clientX,y:e.touches[0].clientY}},{passive:true});$('#book').addEventListener('touchend',e=>{if(!start)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;start=null;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5){suppressClickUntil=Date.now()+500;go(position+(dx<0?step():-step()))}},{passive:true});mobile.addEventListener('change',()=>{if(!mobile.matches)position-=position%2;render()});
// One watercolor motif for each work; source titles and text remain untouched.
const illustrations={
 '재봉틀 앞의 시간':[0,'실타래와 목화 가지 곁의 참새'],
 '풍경소리':[1,'물고기 모양 풍경과 날아오는 제비'],
 '연꽃을 바라보며':[2,'분홍 연꽃과 연잎 아래 은빛 물고기'],
 '산딸기 루비반지':[3,'붉은 산딸기 가지에 앉은 뻐꾸기'],
 '마지막 버스가 지나간 뒤':[9,'비 내린 길 위 클로버와 작은 참새'],
 '가창 405번 버스가 가을을 싣고':[12,'물가의 오리 가족과 갈대 위 잠자리'],
 '재봉틀':[0,'어머니의 시간을 닮은 실타래와 참새'],
 '천사의 나팔꽃':[4,'흰 나팔꽃 아래 잠든 고양이'],
 '아버지의 길':[11,'굽은 소나무와 안개에 잠긴 산길'],
 '재봉틀과 어머니':[0,'목화와 실타래, 곁을 지키는 참새'],
 '어머니':[5,'매화 가지에 머무는 작은 새'],
 '북국의 봇나무':[8,'하얀 자작나무 숲과 작은 올빼미'],
 '상사화(想思花)':[6,'긴 꽃술을 펼친 분홍 상사화'],
 '매화꽃 어머니':[5,'꽃망울을 피운 오래된 매화 가지와 새'],
 '나비가 코스모스에게 머무는 법':[7,'코스모스와 강아지풀 사이의 흰나비'],
 '가장 느린 걸음이 저녁을 건넌다':[9,'비 그친 길과 클로버 곁의 참새'],
 '우뭇가사리 한 그릇이 바다를 품다':[16,'물결 같은 해초와 조개, 하늘을 나는 갈매기'],
 '신천의 저녁 한때':[10,'물살을 바라보는 왜가리와 강가의 돌'],
 '바람 속의 어머니':[18,'바람에 기우는 풀과 작은 나비'],
 '베란다에 가을이 먼저 왔다':[14,'보랏빛 들국화와 가을 풀벌레'],
 '장갑 한 짝':[9,'젖은 길가에 내려앉은 참새와 빗방울'],
 '앞산제색도':[11,'먹빛 산봉우리와 오래된 소나무'],
 '바람은 어디서 오는가':[18,'바람을 따라 휘어지는 강아지풀과 나비'],
 '앞산을 바라보며':[11,'흰 안개 사이 푸른 산과 소나무'],
 '오래 신은 구두':[9,'비에 젖은 보도와 작은 참새'],
 '물에게 길을 묻다':[10,'흐르는 물과 돌 위에 선 왜가리'],
 '가을이 오기 전에':[14,'들국화 곁의 귀뚜라미와 마른 풀'],
 '핑크빛 빈 벤치':[17,'분홍 벤치 곁의 나리꽃과 개망초'],
 '주리못둑의 핑크빛 빈 벤치':[17,'나리꽃과 개망초가 감싼 분홍 벤치'],
 '주리못, 어머니의 수를 놓는 날':[13,'물 위에 드리운 버드나무와 옅은 달'],
 '(동시) 물방울 친구들':[15,'풀잎 위 이슬과 달팽이, 무당벌레'],
 '가을 속에 남은 사람':[12,'갈대 사이를 지나는 오리 가족과 잠자리'],
 '한여름 주리못':[12,'물결 위 오리와 풀잎에 앉은 잠자리'],
 '이팝꽃':[0,'흰 꽃을 닮은 목화 가지와 작은 참새'],
 '낮달':[13,'버드나무 가지 너머 낮달과 물결'],
 '천년의 달, 두 고도를 걷다':[19,'기와지붕 위 달과 소나무 곁의 사슴'],
 '전깃줄 위의 낮달':[13,'가느다란 버드나무 가지와 반달'],
 '못물':[15,'이슬 맺힌 풀잎 위 달팽이와 무당벌레']
};
function poemHeading(p,continued=false){
 if(continued)return '';
 const motif=illustrations[p.title];if(!motif)throw Error('Missing illustration: '+p.title);
 const x=(motif[0]%5)*25,y=Math.floor(motif[0]/5)*100/3;
 return `<div class="poem-heading">${continued?'<span aria-hidden="true"></span>':`<h2>${esc(p.title)}</h2>`}<figure class="poem-art" role="img" aria-label="시화 삽화: ${esc(motif[1])}" style="--art-x:${x}%;--art-y:${y}%"></figure></div>`;
}
// One stable, native recital button per poem; no cross-origin iframe dependency.
let poemVoiceMap=new Map(),currentSpeech=null,recitalToken=0;
function stopRecital(){
 recitalToken++;
 if('speechSynthesis' in window)window.speechSynthesis.cancel();
 document.querySelectorAll('[data-recital-id]').forEach(b=>{
  b.textContent='▶ 시 낭송';b.setAttribute('aria-pressed','false');
 });
 currentSpeech=null;
}
function voiceForPoetry(){
 const voices=window.speechSynthesis.getVoices().filter(v=>/^ko([-_]|$)/i.test(v.lang));
 const feminine=/female|woman|여성|heami|sunhi|sora|jiyeon|yuna|yuri|seoyeon|seo[- ]?yeon|jiyoung|ji[- ]?young|suyeon|sooyeon|nari|hyemi|혜미|선희|소라|지연|유나|유리|서연|지영|수연|나리/i;
 return voices.find(v=>feminine.test(v.name))||voices[0]||null;
}
function startRecital(id,btn){
 if(currentSpeech===id){stopRecital();return}
 const poem=poemVoiceMap.get(id);if(!poem)return;
 stopRecital();
 if(!('speechSynthesis' in window)){showAudioLink(poem);return}
 const synth=window.speechSynthesis,voice=voiceForPoetry();
 if(!voice){showAudioLink(poem);return}
 document.querySelectorAll('video,audio').forEach(a=>a.pause());
 const token=++recitalToken;currentSpeech=id;
 btn.textContent='■ 시 낭송 중지';btn.setAttribute('aria-pressed','true');
 const lines=[poem.title,'이명우',...poem.text.split(/\n+/)].map(t=>t.trim()).filter(Boolean);
 let index=0;
 const next=()=>{
  if(token!==recitalToken)return;
  if(index>=lines.length){stopRecital();return}
  const utterance=new SpeechSynthesisUtterance(lines[index++]);
  utterance.lang='ko-KR';utterance.voice=voice;utterance.rate=.84;utterance.pitch=1.07;utterance.volume=1;
  utterance.onend=next;
  utterance.onerror=()=>{if(token===recitalToken){stopRecital();showAudioLink(poem)}};
  synth.speak(utterance);
 };
 next();
}
function showAudioLink(poem){
 const url=poem.recital?.url;
 if(!url)return;
 const dlg=document.createElement('dialog');
 dlg.style.cssText='border:1px solid #b6c8be;border-radius:14px;padding:22px;max-width:90vw;background:#fffef9;color:#263c3b';
 const heading=document.createElement('h2');heading.textContent=poem.title+' · 시 낭송';
 const message=document.createElement('p');message.textContent='이 브라우저에서 한국어 음성 낭송을 시작할 수 없습니다. 아래 링크에서 기존 녹음 파일을 재생할 수 있습니다.';
 const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='🎧 음성파일 열기';link.style.cssText='display:inline-block;padding:10px;color:#174a5f';
 const close=document.createElement('button');close.type='button';close.textContent='닫기';close.onclick=()=>dlg.close();
 dlg.append(heading,message,link,close);document.body.append(dlg);dlg.addEventListener('close',()=>dlg.remove(),{once:true});dlg.showModal();
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-recital-id]');
 if(!b)return;
 e.preventDefault();startRecital(b.dataset.recitalId,b);
});
window.addEventListener('pagehide',stopRecital);
function recitalPlayer(p,startLine,endLine){
 return `<div class="recital"><div class="recital-label"><span>🎙️ 작품 시낭송</span><button type="button" data-recital-id="${esc(p.recital.id)}" aria-pressed="false" style="font:inherit;color:#365b49;background:#edf3e8;border:1px solid #c8d5bd;border-radius:6px;padding:7px 16px;cursor:pointer">▶ 시 낭송</button></div><small>한국어 음성 낭송 · 다시 누르면 중지합니다. 음성 미지원 환경에서는 기존 녹음 파일로 연결됩니다.</small></div>`;
}
function splitIllustratedPoem(p,header){
 const sheet=document.createElement('article');sheet.className='page measure-page';sheet.style.width=$('#left').offsetWidth+'px';document.body.append(sheet);
 const lines=p.text.split('\n');
 const measure=(continued,font)=>{
  sheet.innerHTML=`<section class="poem">${header}${poemHeading(p,continued)}<p class="verse verse-columns"></p>${recitalPlayer(p,0,1)}</section>`;
  const verse=sheet.querySelector('.verse'),player=sheet.querySelector('.recital');
  const height=Math.floor(sheet.getBoundingClientRect().bottom-parseFloat(getComputedStyle(sheet).paddingBottom)-verse.getBoundingClientRect().top-player.getBoundingClientRect().height-parseFloat(getComputedStyle(player).marginTop)-12);
  verse.style.setProperty('--verse-size',font+'px');verse.style.setProperty('--verse-height',height+'px');
  return {verse,height};
 };
 const fits=(verse,text)=>{verse.textContent=text;return verse.scrollWidth<=verse.clientWidth+1};
 // First try a single two-column page; otherwise use exactly two pages.
 for(const font of [14.5,14,13.5,13,12.5,12]){
  let {verse,height}=measure(false,font);
  if(fits(verse,p.text)){sheet.remove();return [{text:p.text,font,height}]}
  let breakAt=0;
  for(let i=1;i<lines.length;i++){if(fits(verse,lines.slice(0,i).join('\n')))breakAt=i;else break}
  if(!breakAt)continue;
  const first={text:lines.slice(0,breakAt).join('\n'),font,height};
  ({verse,height}=measure(true,font));
  const rest=lines.slice(breakAt).join('\n');
  if(fits(verse,rest)){sheet.remove();return [first,{text:rest,font,height}]}
 }
 sheet.remove();throw Error('Poem exceeds two-page layout: '+p.title);
}
// Constrain a full MP3 recording to the lines shown on this page.
$('#book').addEventListener('loadedmetadata',e=>{
 const audio=e.target;if(!audio.matches('audio[data-start]'))return;
 audio.currentTime=Number(audio.dataset.start);
},true);
$('#book').addEventListener('play',e=>{
 const media=e.target;if(!media.matches('audio,video'))return;
 document.querySelectorAll('audio,video').forEach(other=>{if(other!==media)other.pause()});
 if(media.matches('audio[data-start]')){
  const start=Number(media.dataset.start),end=Number(media.dataset.end);
  if(media.currentTime<start||media.currentTime>=end-.05)media.currentTime=start;
 }
},true);
$('#book').addEventListener('timeupdate',e=>{
 const audio=e.target;if(!audio.matches('audio[data-end]'))return;
 const start=Number(audio.dataset.start),end=Number(audio.dataset.end);
 if(!audio.paused&&audio.currentTime<start-.2)audio.currentTime=start;
 if(!audio.paused&&audio.currentTime>=end)audio.pause();
},true);

const sections = [
 {title:'어머니의 시간',subtitle:'가족의 기억과 오래된 뿌리',categories:['가족과 기억','역사와 뿌리'],intro:'바늘이 지나간 자리에는 옷감만 이어지는 것이 아닙니다. 어머니와 아버지의 손길에서 시작한 기억은, 우리가 걸어온 오래된 길로 이어집니다.'},
 {title:'꽃이 머무는 계절',subtitle:'피어나고 저무는 것들 곁에서',categories:['꽃과 서정','계절과 사색','동시와 동심'],intro:'꽃과 작은 물방울, 계절 사이에 잠시 머물러 봅니다. 피어나는 순간과 저무는 순간을 함께 바라보며 삶의 속도를 늦추는 시간입니다.'},
 {title:'저녁을 건너는 사람들',subtitle:'일상의 사물과 도시의 마음',categories:['도시와 관계','일상의 발견','예술과 융합'],intro:'마지막 버스가 떠난 자리, 오래 신은 구두, 한 짝의 장갑. 익숙한 사물과 풍경을 따라 걸으며 일상에 남은 온기를 살핍니다.'},
 {title:'물이 기억하는 풍경',subtitle:'앞산에서 주리못까지',categories:['대구의 풍경','주리못 연작'],intro:'앞산과 신천, 주리못의 물가에 발걸음을 멈춥니다. 흘러가는 물과 돌아오는 계절을 바라보며, 오늘의 길을 다시 묻습니다.'}
];
const tocButton=(title,page)=>`<button data-page="${page}">${esc(title)}<span>${String(page+1).padStart(2,'0')}</span></button>`;
Promise.all(['poems.json','ai-recitations.json'].map(file=>fetch(file).then(r=>{if(!r.ok)throw Error(file);return r.json()}))).then(async ([poems,recordings])=>{
 await document.fonts.load('32px "Myeongdo Brush"');
 poemVoiceMap=new Map(poems.map((p,i)=>[p.id||'p'+String(i+1).padStart(2,'0'),p]));
 for(const p of poems){p.recital=recordings.entries.find(r=>r.title===p.title);if(!p.recital)throw Error('Missing recital: '+p.title)}
 pages=[cover,song,'',''];
 const entries=[{title:'앞표지',page:0},{title:'시에서 노래로 · 여는 장',page:1},{title:'이 책을 펼치며 · 편집의 말',page:2},{title:'차례 · 네 갈래의 길',page:3}];
 let count=0;
 for(const [sectionIndex,section] of sections.entries()){
  section.poems=poems.filter(p=>section.categories.includes(p.category));
  if(sectionIndex===3)section.poems.sort((a,b)=>Number(b.title==='물에게 길을 묻다')-Number(a.title==='물에게 길을 묻다'));
  section.page=pages.length;pages.push('');section.entries=[];
  entries.push({title:`제${sectionIndex+1}부 ${section.title}`,page:section.page,heading:true});
  for(const p of section.poems){
   count++;const entry={title:p.title,page:pages.length};entries.push(entry);section.entries.push(entry);
   const header=`<div class="poem-header"><span>제${sectionIndex+1}부 · ${esc(section.title)}</span><span>${String(count).padStart(2,'0')} / 38</span></div>`;
   const chunks=splitIllustratedPoem(p,header);
   let lineOffset=0;
   chunks.forEach(({text,font,height},i)=>{
    const heading=poemHeading(p,i>0),nextLine=lineOffset+text.split('\n').length;
    pages.push(`<section class="poem">${header}${heading}<p class="verse verse-columns" style="--verse-size:${font}px;--verse-height:${height}px">${esc(text)}</p>${recitalPlayer(p,lineOffset,nextLine)}</section>`);
    lineOffset=nextLine;
   });
  }
  pages[section.page]=`<section class="section-opener"><div class="eyebrow">PART ${String(sectionIndex+1).padStart(2,'0')} · ${section.poems.length}편</div><h2>${esc(section.title)}</h2><p class="section-subtitle">${esc(section.subtitle)}</p><p class="section-note">${esc(section.intro)}</p><div class="chapter-list">${section.entries.map(e=>tocButton(e.title,e.page)).join('')}</div></section>`;
 }
 if(count!==poems.length)throw Error('Unassigned poems');
 pages[2]=`<section class="colophon editorial"><div class="eyebrow">EDITOR’S NOTE · 편집의 말</div><h2>기억을 건너,<br>계절을 지나</h2><p>『${BOOK_TITLE}』는 명도재 이명우의 창작시 서른여덟 편을 네 갈래의 길로 엮은 디지털 시집입니다.</p><p>가족의 기억에서 계절의 표정으로, 도시의 저녁에서 주리못의 물가로. 서로 다른 풍경을 지나며 삶을 바라보는 시선의 결을 따라갑니다.</p><p>첫 장의 노래를 듣고, 마음이 머무는 작품을 골라 읽어도 좋습니다. 천천히 한 장씩 넘기며 자신만의 순서로 이 책을 만나보세요.</p><p class="caption">시 제목과 본문은 기존 원문을 보존했습니다.<br>부제·부 구성·부별 여는 글은 이 디지털 판의 편집입니다.<br>편집의 말은 시인의 서문과 구분합니다.</p></section>`;
 pages[3]=`<section class="book-contents"><div class="eyebrow">CONTENTS · 차례</div><h2>네 갈래의 길</h2><p class="section-subtitle">${BOOK_TITLE}<br><small>기억을 건너, 계절을 지나</small></p>${sections.map((section,i)=>`<div class="part-link">${tocButton(`제${i+1}부 ${section.title}`,section.page)}<p>${esc(section.subtitle)} · ${section.poems.length}편</p></div>`).join('')}<p class="caption">각 부의 첫 장에서 작품별 차례를 만날 수 있습니다.<br>상단 ‘목차’에서는 모든 작품으로 바로 이동할 수 있습니다.</p></section>`;
 const closing=pages.length;entries.push({title:'책을 덮으며 · 판권',page:closing});
 pages.push(`<section class="colophon"><div class="eyebrow">COLOPHON · 책을 덮으며</div><h2>흐르는 것들은<br>저마다 길을 품고 있다.</h2><p>명도재 이명우 창작 시집<br>『${BOOK_TITLE}』<br><small>기억을 건너, 계절을 지나</small></p><p>수록 작품 · 이명우 창작시 38편<br>여는 영상 · 「물에게 길을 묻다」<br>구성 · 4부 주제별 편집</p><p class="caption">기존 저장소의 창작시 제목과 본문을 보존해 엮었습니다.<br>시집 부제와 구성, 여는 글은 이 디지털 판을 위한 편집입니다.<br>시화 삽화 · 작품 소재를 바탕으로 AI로 제작한 수채화.<br>시낭송 · eSpeak NG 한국어 합성음, 시인 육성 아님.<br>영상은 작가가 제공한 파일을 수록했습니다.<br>시와 영상의 권리는 각 권리자에게 있습니다.</p></section>`);
 // Keep the back cover as the final right-hand page on a desktop spread.
 if(pages.length%2===0)pages.push('<section class="colophon"><div class="eyebrow">明道齋</div><h2>당신의 다음 계절에도<br>시가 함께하기를.</h2></section>');
 entries.push({title:'뒷표지',page:pages.length});pages.push(backCover);
 $('#toc-list').innerHTML=entries.map(e=>e.heading?`<h3>${tocButton(e.title,e.page)}</h3>`:tocButton(e.title,e.page)).join('');
 const navigate=e=>{const button=e.target.closest('[data-page]');if(button){if(!$('#toc').hidden)toggleToc(false);go(Number(button.dataset.page))}};
 $('#toc-list').onclick=navigate;
 $('#book').onclick=e=>{
  if(e.target.closest('[data-page]')){navigate(e);return}
  if(busy||Date.now()<suppressClickUntil||!$('#toc').hidden)return;
  if(e.target.closest('a,button,video,audio,input,textarea,select')||window.getSelection()?.toString())return;
  const page=e.target.closest('#left,#right');if(!page)return;
  const rect=page.getBoundingClientRect();
  const backward=mobile.matches?e.clientX<rect.left+rect.width/2:page.id==='left';
  go(position+(backward?-step():step()));
 };
 const match=location.hash.match(/^#page-(\d+)$/);if(match){position=Math.min(pages.length-step(),Math.max(0,Number(match[1])-1));if(!mobile.matches)position-=position%2}render();
}).catch(()=>{$('#error').hidden=false;$('#prev').disabled=true;$('#next').disabled=true});
