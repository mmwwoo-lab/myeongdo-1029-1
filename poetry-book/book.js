'use strict';
const $=s=>document.querySelector(s), esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let pages=[],position=0,busy=false;const mobile=matchMedia('(max-width:800px)');let step=()=>mobile.matches?1:2;
const song=`<section class="song"><div class="eyebrow">OPENING · 시에서 노래로</div><h1>물에게<br>길을 묻다</h1><p class="lead">한 편의 시가 노래가 되어,<br>책의 첫 장에 흐릅니다.</p><video controls playsinline preload="metadata" poster="media/song-poster.jpg" aria-label="물에게 길을 묻다 창작시 노래 영상"><source src="media/asking-water.mp4" type="video/mp4">이 브라우저에서는 영상을 재생할 수 없습니다.</video><div class="caption">「물에게 길을 묻다」 · 창작시를 노래로 만든 영상<br>시 이명우 · 제공 영상 수록 · 3분 47초</div><hr><p class="intro">물의 흐름을 따라 삶의 방향을 묻는 시.<br>먼저 노래로 만나고, 다음 장에서 시의 문장으로 천천히 돌아오세요.</p></section>`;
const cover=`<section class="cover"><div class="eyebrow">MYEONGDO · POETRY</div><h2 class="vertical">물에게<br>길을 묻다</h2><p class="author">명도재 이명우 창작 시집</p><div class="imprint">기억을 건너, 계절을 지나</div></section>`;
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
function render(){for(const [i,side] of ['left','right'].entries()){const el=$('#'+side),n=position+i;el.innerHTML=pages[n]||'';el.dataset.number=String(n+1).padStart(2,'0');el.scrollTop=0;el.classList.toggle('mobile-hidden',mobile.matches&&i===1)}$('#prev').disabled=position===0;$('#next').disabled=position+step()>=pages.length;$('#progress').textContent=mobile.matches?`${position+1} / ${pages.length}`:`${position+1} — ${Math.min(position+2,pages.length)} / ${pages.length}`;$('#fill').style.width=`${Math.min(100,(position+step())/pages.length*100)}%`;}
function go(target){
 if(!pages.length)return;
 target=Math.max(0,Math.min(pages.length-step(),target));
 if(!mobile.matches)target-=target%2;
 if(busy||target===position)return;
 busy=true;
 playPageTurnSound();
 document.querySelectorAll('video').forEach(v=>v.pause());
 const backward=target<position,turn=$('#turn');
 const source=$(mobile.matches?'#left':backward?'#left':'#right');
 const makeFace=(html,number,side)=>{
  const face=document.createElement('div');face.className=`sheet-face sheet-${side}`;
  const paper=document.createElement('div');paper.className='page';paper.dataset.number=String(number+1).padStart(2,'0');paper.innerHTML=html;
  paper.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
  paper.querySelectorAll('video').forEach(v=>{v.removeAttribute('controls');v.preload='none';v.removeAttribute('autoplay')});
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
 under.innerHTML=pages[underIndex]||'';under.dataset.number=String(underIndex+1).padStart(2,'0');under.scrollTop=0;
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
document.addEventListener('keydown',e=>{if(e.key==='Escape')toggleToc(false);if(!$('#toc').hidden||/INPUT|TEXTAREA|VIDEO/.test(e.target.tagName))return;if(e.key==='ArrowRight'){e.preventDefault();go(position+step())}if(e.key==='ArrowLeft'){e.preventDefault();go(position-step())}});
let suppressClickUntil=0;
let start=null;$('#book').addEventListener('touchstart',e=>{if(e.target.closest('video'))return;start={x:e.touches[0].clientX,y:e.touches[0].clientY}},{passive:true});$('#book').addEventListener('touchend',e=>{if(!start)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;start=null;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5){suppressClickUntil=Date.now()+500;go(position+(dx<0?step():-step()))}},{passive:true});mobile.addEventListener('change',()=>{if(!mobile.matches)position-=position%2;render()});
const sections = [
 {title:'어머니의 시간',subtitle:'가족의 기억과 오래된 뿌리',categories:['가족과 기억','역사와 뿌리'],intro:'바늘이 지나간 자리에는 옷감만 이어지는 것이 아닙니다. 어머니와 아버지의 손길에서 시작한 기억은, 우리가 걸어온 오래된 길로 이어집니다.'},
 {title:'꽃이 머무는 계절',subtitle:'피어나고 저무는 것들 곁에서',categories:['꽃과 서정','계절과 사색','동시와 동심'],intro:'꽃과 작은 물방울, 계절 사이에 잠시 머물러 봅니다. 피어나는 순간과 저무는 순간을 함께 바라보며 삶의 속도를 늦추는 시간입니다.'},
 {title:'저녁을 건너는 사람들',subtitle:'일상의 사물과 도시의 마음',categories:['도시와 관계','일상의 발견','예술과 융합'],intro:'마지막 버스가 떠난 자리, 오래 신은 구두, 한 짝의 장갑. 익숙한 사물과 풍경을 따라 걸으며 일상에 남은 온기를 살핍니다.'},
 {title:'물이 기억하는 풍경',subtitle:'앞산에서 주리못까지',categories:['대구의 풍경','주리못 연작'],intro:'앞산과 신천, 주리못의 물가에 발걸음을 멈춥니다. 흘러가는 물과 돌아오는 계절을 바라보며, 오늘의 길을 다시 묻습니다.'}
];
const tocButton=(title,page)=>`<button data-page="${page}">${esc(title)}<span>${String(page+1).padStart(2,'0')}</span></button>`;
fetch('poems.json').then(r=>{if(!r.ok)throw Error('poems');return r.json()}).then(poems=>{
 pages=[song,cover,'',''];
 const entries=[{title:'시에서 노래로 · 여는 장',page:0},{title:'이 책을 펼치며 · 편집의 말',page:2},{title:'차례 · 네 갈래의 길',page:3}];
 let count=0;
 for(const [sectionIndex,section] of sections.entries()){
  section.poems=poems.filter(p=>section.categories.includes(p.category));
  if(sectionIndex===3)section.poems.sort((a,b)=>Number(b.title==='물에게 길을 묻다')-Number(a.title==='물에게 길을 묻다'));
  section.page=pages.length;pages.push('');section.entries=[];
  entries.push({title:`제${sectionIndex+1}부 ${section.title}`,page:section.page,heading:true});
  for(const p of section.poems){
   count++;const entry={title:p.title,page:pages.length};entries.push(entry);section.entries.push(entry);
   // Preserve every original line, including blank stanza separators.
   const lines=p.text.split('\n'),chunks=[];let chunk=[],units=0;
   for(const line of lines){const cost=Math.max(1,Math.ceil(line.length/23));if(units+cost>18&&chunk.length){chunks.push(chunk.join('\n'));chunk=[];units=0}chunk.push(line);units+=cost}if(chunk.length)chunks.push(chunk.join('\n'));
   chunks.forEach((text,i)=>pages.push(`<section class="poem"><div class="poem-header"><span>제${sectionIndex+1}부 · ${esc(section.title)}</span><span>${String(count).padStart(2,'0')} / 38</span></div><h2>${esc(p.title)}${i?'<span class="continuation">계속</span>':''}</h2><p class="verse">${esc(text)}</p></section>`));
  }
  pages[section.page]=`<section class="section-opener"><div class="eyebrow">PART ${String(sectionIndex+1).padStart(2,'0')} · ${section.poems.length}편</div><h2>${esc(section.title)}</h2><p class="section-subtitle">${esc(section.subtitle)}</p><p class="section-note">${esc(section.intro)}</p><div class="chapter-list">${section.entries.map(e=>tocButton(e.title,e.page)).join('')}</div></section>`;
 }
 if(count!==poems.length)throw Error('Unassigned poems');
 pages[2]=`<section class="colophon editorial"><div class="eyebrow">EDITOR’S NOTE · 편집의 말</div><h2>기억을 건너,<br>계절을 지나</h2><p>『물에게 길을 묻다』는 명도재 이명우의 창작시 서른여덟 편을 네 갈래의 길로 엮은 디지털 시집입니다.</p><p>가족의 기억에서 계절의 표정으로, 도시의 저녁에서 주리못의 물가로. 서로 다른 풍경을 지나며 삶을 바라보는 시선의 결을 따라갑니다.</p><p>첫 장의 노래를 듣고, 마음이 머무는 작품을 골라 읽어도 좋습니다. 천천히 한 장씩 넘기며 자신만의 순서로 이 책을 만나보세요.</p><p class="caption">시 제목과 본문은 기존 원문을 보존했습니다.<br>부제·부 구성·부별 여는 글은 이 디지털 판의 편집입니다.<br>편집의 말은 시인의 서문과 구분합니다.</p></section>`;
 pages[3]=`<section class="book-contents"><div class="eyebrow">CONTENTS · 차례</div><h2>네 갈래의 길</h2><p class="section-subtitle">물에게 길을 묻다<br><small>기억을 건너, 계절을 지나</small></p>${sections.map((section,i)=>`<div class="part-link">${tocButton(`제${i+1}부 ${section.title}`,section.page)}<p>${esc(section.subtitle)} · ${section.poems.length}편</p></div>`).join('')}<p class="caption">각 부의 첫 장에서 작품별 차례를 만날 수 있습니다.<br>상단 ‘목차’에서는 모든 작품으로 바로 이동할 수 있습니다.</p></section>`;
 const closing=pages.length;entries.push({title:'책을 덮으며 · 판권',page:closing});
 pages.push(`<section class="colophon"><div class="eyebrow">COLOPHON · 책을 덮으며</div><h2>흐르는 것들은<br>저마다 길을 품고 있다.</h2><p>명도재 이명우 창작 시집<br>『물에게 길을 묻다』<br><small>기억을 건너, 계절을 지나</small></p><p>수록 작품 · 이명우 창작시 38편<br>여는 영상 · 「물에게 길을 묻다」<br>구성 · 4부 주제별 편집</p><p class="caption">기존 저장소의 창작시 제목과 본문을 보존해 엮었습니다.<br>시집 부제와 구성, 여는 글은 이 디지털 판을 위한 편집입니다.<br>영상은 작가가 제공한 파일을 수록했습니다.<br>시와 영상의 권리는 각 권리자에게 있습니다.</p></section>`);
 if(pages.length%2)pages.push('<section class="colophon"><div class="eyebrow">明道齋</div><h2>당신의 다음 계절에도<br>시가 함께하기를.</h2></section>');
 $('#toc-list').innerHTML=entries.map(e=>e.heading?`<h3>${tocButton(e.title,e.page)}</h3>`:tocButton(e.title,e.page)).join('');
 const navigate=e=>{const button=e.target.closest('[data-page]');if(button){if(!$('#toc').hidden)toggleToc(false);go(Number(button.dataset.page))}};
 $('#toc-list').onclick=navigate;
 $('#book').onclick=e=>{
  if(e.target.closest('[data-page]')){navigate(e);return}
  if(busy||Date.now()<suppressClickUntil||!$('#toc').hidden)return;
  if(e.target.closest('a,button,video,input,textarea,select')||window.getSelection()?.toString())return;
  const page=e.target.closest('#left,#right');if(!page)return;
  const rect=page.getBoundingClientRect();
  const backward=mobile.matches?e.clientX<rect.left+rect.width/2:page.id==='left';
  go(position+(backward?-step():step()));
 };
 const match=location.hash.match(/^#page-(\d+)$/);if(match){position=Math.min(pages.length-step(),Math.max(0,Number(match[1])-1));if(!mobile.matches)position-=position%2}render();
}).catch(()=>{$('#error').hidden=false;$('#prev').disabled=true;$('#next').disabled=true});
