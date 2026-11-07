'use strict';
const essays=window.MYEONGDO_ESSAYS||[];
const $=s=>document.querySelector(s),escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mobile=matchMedia('(max-width:800px)');let pages=[],index=0,speech=null,paused=false,speechToken=0;
function fragments(text){
 const paras=text.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
 const small=mobile.matches;
 // Wider interior margins with denser typography: fit more prose on desktop.
 const openingTarget=small?195:265;
 const target=small?335:525;
 const out=[];let group=[],length=0;
 for(const para of paras){
  const cap=out.length===0?openingTarget:target;
  if(group.length&&length+para.length>cap){out.push(group);group=[];length=0;}
  group.push(para);length+=para.length;
 }
 if(group.length)out.push(group);
 // Distribute text from the last short leaf across the preceding two leaves.
 if(out.length>2&&out[out.length-1].join('').length<(small?110:195)){
  const remainder=out.pop(),prev=out.pop(),combined=prev.concat(remainder);
  const half=combined.reduce((n,s)=>n+s.length,0)/2;
  const first=[],second=[];let count=0;
  for(const line of combined){if(count<half||!first.length){first.push(line);count+=line.length;}else second.push(line);}
  out.push(first);if(second.length)out.push(second);
 }
 return out;
}
function build(){pages=[{type:'cover',title:'표지'},{type:'intro',title:'여는 글'}];for(const essay of essays){const parts=fragments(essay.text);parts.forEach((part,i)=>pages.push({type:'essay',essay,part,partNumber:i+1,total:parts.length,title:essay.title+(i?' · 계속':'')}))}pages.push({type:'end',title:'맺는 글'});if(pages.length%2)pages.push({type:'end',title:'뒷장'});const toc=$('#toc-list');toc.innerHTML=pages.map((p,i)=>(i===0||p.type==='intro'||(p.type==='essay'&&p.partNumber===1))?`<button data-to="${i}">${escapeHtml(p.title)}<span>${p.type==='essay'?escapeHtml(p.essay.subtitle):'명도재 디지털 수필집'}</span></button>`:'').join('')}
function htmlFor(p){if(!p)return '';
if(p.type==='cover')return '<section class="cover"><div class="cover-copy"><div class="eyebrow">명도재 이명우 · 디지털 수필집</div><h1>그늘을 지나,<br>양지로</h1><p>삶에서 건져 올린 다섯 빛깔의 이야기</p><p class="author">이명우 지음 · 명도재 제작</p></div></section>';
if(p.type==='intro')return '<section class="frontmatter"><span class="emblem">❧</span><h2>삶은 아직<br>쓰이는 중이다</h2><p>교실을 떠나 다시 배움을 시작하고, 강물 앞에서 자기 걸음을 돌아보고, 사람과 사람 사이의 온기를 기억한다. 오래된 거울과 입동의 백로까지, 다섯 수필은 삶의 풍경을 새로 읽는 여행이다.</p><p class="disclaimer">기존 생활수필의 주제와 핵심 장면을 바탕으로 문학적으로 재창작한 편집본입니다.</p></section>';
if(p.type==='end')return '<section class="frontmatter"><span class="emblem">✦</span><h2>그늘을 지나면<br>다시 햇살이 있다</h2><p>다섯 편의 수필을 덮으며, 오늘의 평범한 하루가 내일의 문장이 되기를.</p><p class="disclaimer">© 명도재 이명우 · 작가 최종 승인 전 시안</p></section>';
const e=p.essay,first=p.partNumber===1;return `<section class="essay" data-essay="${e.id}"><div class="eyebrow">명도재 생활수필 · 제${e.number}편 · ${p.partNumber}/${p.total}</div>${first?`<h2>${escapeHtml(e.title)}</h2><p class="subtitle">${escapeHtml(e.subtitle)}</p><img src="images/${escapeHtml(e.illustration)}.svg" alt="${escapeHtml(e.motif)}을 소재로 그린 수필 삽화">`:`<div class="continued">${escapeHtml(e.title)} — 이어 읽기</div>`}<div class="essay-body">${p.part.map(x=>'<p>'+escapeHtml(x)+'</p>').join('')}</div></section><button class="page-read" data-read>▶ 이 페이지 읽기</button>`}
function stop(){speechToken++;if('speechSynthesis'in window)window.speechSynthesis.cancel();speech=null;paused=false;updateReads()}
function updateReads(){document.querySelectorAll('[data-read]').forEach(b=>b.textContent=speech===Number(b.closest('.page').dataset.page)?(paused?'▶ 이어 읽기':'⏸ 일시정지'):'▶ 이 페이지 읽기')}
function read(i){if(!('speechSynthesis'in window)){alert('이 브라우저는 한국어 음성 읽기를 지원하지 않습니다. 크롬을 이용해 주세요.');return}if(speech===i){paused=!paused;if(paused)speechSynthesis.pause();else speechSynthesis.resume();updateReads();return}stop();const p=pages[i];if(!p||p.type!=='essay')return;const text=[p.partNumber===1?p.essay.title:'',...p.part].filter(Boolean).join('. ');const voices=speechSynthesis.getVoices(),ko=voices.filter(v=>/^ko/i.test(v.lang)),female=ko.find(v=>/female|여성|sora|sunhi|yuna|heami|seoyeon/i.test(v.name))||ko[0];const chunks=text.match(/.{1,150}(?:[.!?。]|$)/g)||[text];const token=++speechToken;speech=i;updateReads();let at=0;const next=()=>{if(token!==speechToken)return;if(at>=chunks.length){speech=null;updateReads();return}const u=new SpeechSynthesisUtterance(chunks[at++]);u.lang='ko-KR';if(female)u.voice=female;u.rate=.83;u.pitch=1.03;u.onend=next;u.onerror=()=>{speech=null;updateReads()};speechSynthesis.speak(u)};next()}
function renderPage(el,p,i){el.innerHTML=htmlFor(p);el.dataset.page=i;el.dataset.number=String(i+1).padStart(2,'0');el.hidden=!p;el.querySelector('[data-read]')?.addEventListener('click',()=>read(i))}
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