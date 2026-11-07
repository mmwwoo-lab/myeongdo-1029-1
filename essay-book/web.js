'use strict';
const essays=Array.isArray(window.MYEONGDO_ESSAYS)?window.MYEONGDO_ESSAYS:[];
const $=s=>document.querySelector(s);
const escapeHtml=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cards=$('#essay-grid'),reader=$('#reader');
let active=null,size=16,utterance=null,paused=false,readToken=0;
function shortNumber(n){return '제'+String(n).padStart(2,'0')+'편'}
function renderCards(query=''){
 const q=query.trim().toLocaleLowerCase('ko');
 const matches=essays.filter(e=>[e.title,e.subtitle,e.motif,e.text].some(v=>String(v).toLocaleLowerCase('ko').includes(q)));
 cards.innerHTML=matches.map(e=>'<article class="essay-card"><a href="#essay-'+e.number+'" data-essay="'+e.number+'" aria-label="'+escapeHtml(shortNumber(e.number)+' '+e.title)+' 전문 읽기"><img src="images/'+encodeURIComponent(e.illustration)+'.svg" loading="lazy" alt="'+escapeHtml(e.motif+' 삽화')+'"><div class="card-copy"><span class="card-num">'+shortNumber(e.number)+'</span><h3 class="card-title">'+escapeHtml(e.title)+'</h3><p class="card-subtitle">'+escapeHtml(e.subtitle)+'</p><span class="card-hint">작품 읽기 →</span></div></a></article>').join('');
 $('#empty-state').hidden=matches.length!==0;
}
function renderParagraph(p,e){
 const s=escapeHtml(p),key=e.highlight?escapeHtml(e.highlight):'',at=key?s.indexOf(key):-1;
 return '<p>'+(at===-1?s:s.slice(0,at)+'<strong class="key-line">'+key+'</strong>'+s.slice(at+key.length))+'</p>';
}
function openEssay(n,push=true){
 const e=essays.find(x=>x.number===n);if(!e)return;
 stopReading();active=e;
 $('#article-number').textContent=shortNumber(e.number)+' · 명도재 생활수필';
 $('#article-title').textContent=e.title;$('#article-subtitle').textContent=e.subtitle;
 const img=$('#article-img');img.src='images/'+encodeURIComponent(e.illustration)+'.svg';img.alt=e.motif+'을 소재로 한 삽화';
 $('#article-body').innerHTML=e.text.split(/\n\s*\n/).map(x=>renderParagraph(x,e)).join('');
 $('#previous-essay').disabled=!essays.some(x=>x.number===n-1);
 $('#next-essay').disabled=!essays.some(x=>x.number===n+1);
 reader.hidden=false;if(push)history.pushState({essay:n},'', '#essay-'+n);
 requestAnimationFrame(()=>reader.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'}));
}
function stopReading(){readToken++;if('speechSynthesis'in window)speechSynthesis.cancel();utterance=null;paused=false;$('#read-aloud').textContent='▶ 듣기'}
function readEssay(){
 if(!active)return;if(!('speechSynthesis'in window)){alert('이 브라우저에서는 음성 낭독을 지원하지 않습니다.');return}
 if(utterance){if(paused){speechSynthesis.resume();paused=false;$('#read-aloud').textContent='⏸ 일시정지'}else{speechSynthesis.pause();paused=true;$('#read-aloud').textContent='▶ 이어 듣기'}return}
 stopReading();const token=readToken;const body=active.title+'. '+active.text.replace(/\n+/g,' ');
 const chunks=body.match(/.{1,125}(?:[.!?。]|$)/g)||[body];const voice=speechSynthesis.getVoices().find(v=>/^ko/i.test(v.lang));let index=0;
 function next(){if(token!==readToken)return;if(index>=chunks.length){utterance=null;$('#read-aloud').textContent='▶ 듣기';return}const u=new SpeechSynthesisUtterance(chunks[index++]);u.lang='ko-KR';if(voice)u.voice=voice;u.rate=.86;u.onend=next;u.onerror=()=>{utterance=null;$('#read-aloud').textContent='▶ 듣기'};utterance=u;speechSynthesis.speak(u)}
 $('#read-aloud').textContent='⏸ 일시정지';next();
}
function route(){const m=location.hash.match(/^#essay-(\d+)$/);if(m)openEssay(Number(m[1]),false);else{stopReading();reader.hidden=true;active=null}}
cards.addEventListener('click',ev=>{const link=ev.target.closest('[data-essay]');if(!link)return;ev.preventDefault();openEssay(Number(link.dataset.essay))});
$('#search').addEventListener('input',ev=>renderCards(ev.target.value));
$('#larger').onclick=()=>{size=Math.min(22,size+1);$('#article-body').style.fontSize=size+'px'};
$('#smaller').onclick=()=>{size=Math.max(13,size-1);$('#article-body').style.fontSize=size+'px'};
$('#read-aloud').onclick=readEssay;$('#stop-aloud').onclick=stopReading;
$('#previous-essay').onclick=()=>{if(active)openEssay(active.number-1)};
$('#next-essay').onclick=()=>{if(active)openEssay(active.number+1)};
$('#back-works').addEventListener('click',()=>{stopReading();reader.hidden=true;active=null});
window.addEventListener('hashchange',route);window.addEventListener('popstate',route);window.addEventListener('pagehide',stopReading);
renderCards();route();

const newspaperDialog=$('#newspaper-dialog');
function openNewspaper(){if(typeof newspaperDialog.showModal==='function')newspaperDialog.showModal();else newspaperDialog.setAttribute('open','')}
function closeNewspaper(){if(typeof newspaperDialog.close==='function')newspaperDialog.close();else newspaperDialog.removeAttribute('open')}
$('#newspaper-open').addEventListener('click',openNewspaper);
$('#newspaper-image-button').addEventListener('click',openNewspaper);
$('#newspaper-close').addEventListener('click',closeNewspaper);
$('#newspaper-read').addEventListener('click',closeNewspaper);
newspaperDialog.addEventListener('click',e=>{if(e.target===newspaperDialog)closeNewspaper()});
