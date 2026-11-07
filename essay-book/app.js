'use strict';
const essays=window.MYEONGDO_ESSAYS||[];
const $=s=>document.querySelector(s),escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mobile=matchMedia('(max-width:800px)');let pages=[],index=0,speech=null,paused=false,speechToken=0;
// Measure text in a real-sized, hidden book leaf, never by character count.
function fragments(essay){
 const paragraphs=essay.text.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
 const host=document.createElement('article');
 host.className='page measure-leaf';
 host.style.width=$('#left').getBoundingClientRect().width+'px';
 $('#book').appendChild(host);
 let result=[],remaining=paragraphs.slice(),first=true;
 const prepare=()=>{
  host.innerHTML=htmlFor({type:'essay',essay,part:[],partNumber:first?1:2,total:2});
  return host.querySelector('.essay-body');
 };
 const fits=(body,items)=>{
  body.innerHTML=items.map(t=>'<p>'+escapeHtml(t)+'</p>').join('');
  return body.scrollHeight<=body.clientHeight+1;
 };
 // A paragraph longer than the remaining page is split at word boundaries.
 function splitToFit(body,current,paragraph){
  const words=paragraph.split(/\s+/).filter(Boolean);
  let lo=1,hi=words.length,best=0;
  while(lo<=hi){
   const mid=(lo+hi)>>1;
   if(fits(body,current.concat(words.slice(0,mid).join(' ')))){best=mid;lo=mid+1}
   else hi=mid-1;
  }
  if(best===0)return null;
  return [words.slice(0,best).join(' '),words.slice(best).join(' ')];
 }
 let guard=0;
 while(remaining.length&&guard++<200){
  const body=prepare(),piece=[];
  while(remaining.length){
   const para=remaining[0];
   if(fits(body,piece.concat(para))){piece.push(para);remaining.shift();continue}
   if(piece.length&&body.clientHeight<70)break;
   const split=splitToFit(body,piece,para);
   if(split){
    piece.push(split[0]);remaining.shift();
    if(split[1])remaining.unshift(split[1]);
   }
   break;
  }
  if(!piece.length){
   // Ensure progress even on unusually short screens, without silently dropping text.
   const para=remaining.shift();
   piece.push(para);
   console.warn('Essay paragraph exceeds the available page height:',essay.title);
  }
  result.push(piece);
  first=false;
 }
 // If the final continuation leaf is nearly empty, try fitting it into
 // the preceding leaf with subtly tighter typesetting. Never discard prose.
 if(result.length>1){
  const last=result[result.length-1],penultimate=result[result.length-2];
  const full=penultimate.concat(last);
  const lastChars=last.join('').length;
  if(lastChars<=220){
   host.classList.add('compact-leaf');
   first=false;
   const body=prepare();
   if(fits(body,full)){
    result.splice(result.length-2,2,full);
    result.compactLast=true;
   }
   host.classList.remove('compact-leaf');
  }
 }
 host.remove();
 if(remaining.length)console.error('Unpaginated essay text:',essay.title);
 return result;
}
function build(){pages=[{type:'cover',title:'표지'},{type:'intro',title:'여는 글'}];for(const essay of essays){const parts=fragments(essay);parts.forEach((part,i)=>pages.push({type:'essay',essay,part,compact:!!(parts.compactLast&&i===parts.length-1),partNumber:i+1,total:parts.length,title:essay.title+(i?' · 계속':'')}))}pages.push({type:'end',title:'맺는 글'});if(pages.length%2===0)pages.push({type:'blank',title:'속지'});pages.push({type:'back',title:'뒤표지'});const toc=$('#toc-list');toc.innerHTML=pages.map((p,i)=>(i===0||p.type==='intro'||(p.type==='essay'&&p.partNumber===1))?`<button data-to="${i}">${escapeHtml(p.title)}<span>${p.type==='essay'?escapeHtml(p.essay.subtitle):'명도재 디지털 수필집'}</span></button>`:'').join('')}
function htmlFor(p){if(!p)return '';
if(p.type==='cover')return '<section class="cover hardback-front"><div class="cover-copy"><div class="eyebrow">명도재 이명우 · 디지털 수필집</div><h1>명도재,<br>창작으로 다시 걷다</h1><p class="cover-subtitle">삶에서 건져 올린 다섯 빛깔의 이야기</p><p class="author">명도재에서 이명우지음</p></div></section>';
if(p.type==='intro')return '<section class="frontmatter intro-preface"><span class="emblem">❧</span><h2>서문 · 다시 걷는 길</h2><p><strong>명도재는 단순한 서재가 아니라, 퇴직 후 창작으로 새로운 삶을 열어가는 나의 두 번째 출근지이다.</strong></p><p>삼십육 년의 교직 생활을 마치고 나는 익숙한 시간표 대신 내 마음의 걸음을 따라 걷기 시작했다. 신천의 물길에서 삶을 돌아보고, 월촌역에서 사람의 온기를 만나며, 오래된 거울 앞에서 아버지를 기억했다. 입동의 백로는 서두르지 않아도 자기 길을 걸을 수 있다고 말해 주었다.</p><p>이 다섯 편의 수필은 직장인의 삶을 마치고 글쓰기와 예술을 통해 인생의 두 번째 막을 열어가는 한 사람의 기록이다. 남은 날들을 배움과 창작으로 차분히 채워 가고 싶다.</p><p class="disclaimer">이 책은 생활수필 다섯 편의 핵심 경험을 바탕으로 문학적으로 재창작한 편집본입니다.</p></section>';
if(p.type==='back')return '<section class="cover hardback-back"><div class="cover-copy back-copy"><div class="back-emblem">❦</div><p class="back-quote">명도재는 나의 두 번째 출근지이다.<br>오늘도 창작으로 다시 걷는다.</p><p class="author">명도재에서 이명우지음</p></div></section>';
if(p.type==='blank')return '<section class="frontmatter"></section>';
if(p.type==='end')return '<section class="frontmatter"><span class="emblem">✦</span><h2>그늘을 지나면<br>다시 햇살이 있다</h2><p>다섯 편의 수필을 덮으며, 오늘의 평범한 하루가 내일의 문장이 되기를.</p><p class="disclaimer">© 명도재 이명우 · 작가 최종 승인 전 시안</p></section>';
const e=p.essay,first=p.partNumber===1;return `<section class="essay" data-essay="${e.id}"><div class="eyebrow">명도재 생활수필 · 제${e.number}편 · ${p.partNumber}/${p.total}</div>${first?`<h2>${escapeHtml(e.title)}</h2><p class="subtitle">${escapeHtml(e.subtitle)}</p><img src="images/${escapeHtml(e.illustration)}.svg" alt="${escapeHtml(e.motif)}을 소재로 그린 수필 삽화">`:`<div class="continued">${escapeHtml(e.title)} — 이어 읽기</div>`}<div class="essay-body">${p.part.map(x=>'<p>'+escapeHtml(x)+'</p>').join('')}</div></section><button class="page-read" data-read>▶ 이 페이지 읽기</button>`}
function stop(){speechToken++;if('speechSynthesis'in window)window.speechSynthesis.cancel();speech=null;paused=false;updateReads()}
function updateReads(){document.querySelectorAll('[data-read]').forEach(b=>b.textContent=speech===Number(b.closest('.page').dataset.page)?(paused?'▶ 이어 읽기':'⏸ 일시정지'):'▶ 이 페이지 읽기')}
function read(i){if(!('speechSynthesis'in window)){alert('이 브라우저는 한국어 음성 읽기를 지원하지 않습니다. 크롬을 이용해 주세요.');return}if(speech===i){paused=!paused;if(paused)speechSynthesis.pause();else speechSynthesis.resume();updateReads();return}stop();const p=pages[i];if(!p||p.type!=='essay')return;const text=[p.partNumber===1?p.essay.title:'',...p.part].filter(Boolean).join('. ');const voices=speechSynthesis.getVoices(),ko=voices.filter(v=>/^ko/i.test(v.lang)),female=ko.find(v=>/female|여성|sora|sunhi|yuna|heami|seoyeon/i.test(v.name))||ko[0];const chunks=text.match(/.{1,150}(?:[.!?。]|$)/g)||[text];const token=++speechToken;speech=i;updateReads();let at=0;const next=()=>{if(token!==speechToken)return;if(at>=chunks.length){speech=null;updateReads();return}const u=new SpeechSynthesisUtterance(chunks[at++]);u.lang='ko-KR';if(female)u.voice=female;u.rate=.83;u.pitch=1.03;u.onend=next;u.onerror=()=>{speech=null;updateReads()};speechSynthesis.speak(u)};next()}
function fitPreface(el){
 const intro=el.querySelector('.intro-preface');
 if(!intro)return;
 intro.style.zoom='1';
 // Keep the whole preface on its own leaf, without clipping its final lines.
 for(let z=100;z>=75;z-=2){
  intro.style.zoom=String(z/100);
  if(intro.scrollHeight<=intro.clientHeight+1)break;
 }
}
function renderPage(el,p,i){el.classList.toggle('compact-leaf',!!(p&&p.compact));el.innerHTML=htmlFor(p);el.dataset.page=i;el.dataset.number=String(i+1).padStart(2,'0');el.hidden=!p;fitPreface(el);el.querySelector('[data-read]')?.addEventListener('click',()=>read(i))}
function render(){const step=mobile.matches?1:2;renderPage($('#left'),pages[index],index);renderPage($('#right'),mobile.matches?null:pages[index+1],index+1);$('#prev').disabled=index===0;$('#next').disabled=index+step>=pages.length;history.replaceState(null,'','#page-'+(index+1));updateReads()}
function move(delta){const step=mobile.matches?1:2;index=Math.max(0,Math.min(pages.length-step,index+delta*step));stop();closeToc(false);render()}
function closeToc(focus=true){$('#toc').hidden=true;$('#contents').setAttribute('aria-expanded','false');if(focus)$('#contents').focus()}
$('#contents').addEventListener('click',()=>{const open=$('#toc').hidden;$('#toc').hidden=!open;$('#contents').setAttribute('aria-expanded',String(open));if(open)$('#toc-close').focus()});
$('#toc-close').addEventListener('click',()=>closeToc());
$('#toc-list').addEventListener('click',e=>{const b=e.target.closest('[data-to]');if(!b)return;index=Number(b.dataset.to);if(!mobile.matches)index-=index%2;stop();closeToc(false);render()});
$('#prev').onclick=()=>move(-1);$('#next').onclick=()=>move(1);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeToc();if(!$('#toc').hidden||/INPUT|TEXTAREA/.test(e.target.tagName))return;if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1)});
let start=null;$('#book').addEventListener('touchstart',e=>{start={x:e.touches[0].clientX,y:e.touches[0].clientY}},{passive:true});$('#book').addEventListener('touchend',e=>{if(!start)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5&&$('#toc').hidden)move(dx<0?1:-1);start=null},{passive:true});
mobile.addEventListener('change',()=>{stop();build();index=0;render()});window.addEventListener('pagehide',stop);
build();const match=location.hash.match(/page-(\d+)/);if(match){index=Math.min(pages.length-1,Math.max(0,Number(match[1])-1));if(!mobile.matches)index-=index%2}render();