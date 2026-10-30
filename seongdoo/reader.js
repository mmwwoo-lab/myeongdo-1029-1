'use strict';
const $=id=>document.getElementById(id);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mobile=matchMedia('(max-width:800px)');
let pages=[],pos=0,speechId=null,paused=false,token=0,recitalLines=[],recitalIndex=0,utterance=null;
const step=()=>mobile.matches?1:2;
function add(html,txt,kind='page'){pages.push({html,txt,kind})}
function readBtn(i){return '<div class="read"><button data-read="'+i+'" aria-label="이 페이지 읽기">▶ 이 페이지 읽기</button></div>'}
function render(){
 for(let i=0;i<2;i++){let x=pos+i,el=$(i?'right':'left'),p=pages[x];
 el.className='page'+(p?.kind==='cover'?' cover':p?.kind==='divider'?' divider':p?.kind==='illustration-page'?' illustration-page':p?.kind==='poem-page'?' poem-page':p?.kind==='reading-page'?' reading-page':'')+(mobile.matches&&i?' hide-mobile':'');
 el.innerHTML=p?((p.kind==='poem-page'||p.kind==='reading-page')?readBtn(x):'')+p.html+'<div class="number">'+(x+1)+'</div>':'';el.scrollTop=0}
 $('progress').textContent=(pos+1)+' — '+Math.min(pos+step(),pages.length)+' / '+pages.length;
 $('prev').disabled=$('edgePrev').hidden=pos===0;
 $('next').disabled=$('edgeNext').hidden=pos+step()>=pages.length;
 document.querySelectorAll('[data-read]').forEach(b=>{if(speechId===Number(b.dataset.read))b.textContent=paused?'▶ 이어 읽기':'⏸ 일시정지'});
 fitVisiblePages();
}
function fitVisiblePages(){
 document.querySelectorAll('.page:not(.hide-mobile)').forEach(page=>{
  const content=page.querySelector('.poem, .critical, .editorial, .part-intro');
  if(!content)return;
  // Keep a fixed paper height and shrink text only when the body would overflow.
  const verse=content.querySelectorAll('.verse');
  const editable=verse.length?[...verse]:[content];
  let tries=0;
  while(tries<14&&content.getBoundingClientRect().bottom>page.getBoundingClientRect().bottom-20){
   editable.forEach(el=>{
    const style=getComputedStyle(el);
    const fs=parseFloat(style.fontSize);
    if(fs>10)el.style.setProperty('font-size',Math.max(10,fs-0.45)+'px','important');
    const lh=parseFloat(style.lineHeight);
    if(Number.isFinite(lh)&&lh>15)el.style.setProperty('line-height',Math.max(1.25,(lh-1)/Math.max(10,fs-0.45)),'important');
   });tries++;
  }
 });
}
function stop(){token++;speechId=null;paused=false;if('speechSynthesis'in window)window.speechSynthesis.cancel();$('readingStatus').hidden=true}
function go(page){let p=Math.max(0,Math.min(pages.length-step(),page));if(!mobile.matches)p-=p%2;if(p===pos)return;stop();pos=p;render();history.replaceState(null,'','#page-'+(pos+1))}
function pauseResume(){if(speechId===null)return;try{if(paused){speechSynthesis.resume();paused=false}else{speechSynthesis.pause();paused=true}$('pauseToggle').textContent=paused?'▶ 이어 읽기':'⏸ 낭송 일시정지';document.querySelectorAll('[data-read]').forEach(b=>{if(Number(b.dataset.read)===speechId)b.textContent=paused?'▶ 이어 읽기':'⏸ 일시정지'})}catch(e){console.warn(e)}}
function readPage(i){
 if(speechId===i){pauseResume();return}
 stop();
 const p=pages[i];if(!p||!['poem-page','reading-page'].includes(p.kind)||!p.txt.trim())return;
 if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){alert('이 환경에서는 낭송을 지원하지 않습니다. 크롬에서 열어 주세요.');return}
 const synth=window.speechSynthesis;
 synth.cancel();
 const lines=p.txt.split(/\n+/).map(x=>x.trim()).filter(Boolean);
 if(!lines.length)return;
 const voices=synth.getVoices().filter(v=>/^ko([-_]|$)/i.test(v.lang));
 const voice=voices.find(v=>/female|여성|heami|sunhi|sora|yuna|서연|선희/i.test(v.name))||voices[0]||null;
 speechId=i;recitalLines=lines;recitalIndex=0;paused=false;
 const local=++token;
 $('readingStatus').hidden=false;$('pauseToggle').textContent='⏸ 낭송 일시정지';
 // Longer passages are spoken in short chunks to prevent browser speech cutoff.
 function next(){
  if(local!==token||speechId!==i)return;
  if(recitalIndex>=recitalLines.length){stop();render();return}
  const line=recitalLines[recitalIndex++];
  const chunks=line.match(/[\s\S]{1,90}/gu)||[line];
  const chunk=chunks.shift();
  if(chunks.length)recitalLines.splice(recitalIndex,0,...chunks);
  utterance=new SpeechSynthesisUtterance(chunk);
  utterance.lang='ko-KR';if(voice)utterance.voice=voice;
  utterance.rate=.88;utterance.pitch=1.03;utterance.volume=1;
  utterance.onend=()=>{if(local===token)next()};
  utterance.onerror=e=>{
   if(local!==token)return;
   if(e.error==='interrupted'||e.error==='canceled')return;
   console.warn('낭송 오류',e.error);
   stop();render();alert('음성 재생이 중단되었습니다. 크롬에서 다시 시도해 주세요.');
  };
  synth.speak(utterance);
 }
 next();render();
}
function splitPoemIntoPages(text){
 // Most poems occupy a single fixed-layout page; exceptionally long poems use two.
 // Keep original line and stanza boundaries; do not alter poem wording.
 const whole=String(text||'').trim().replace(/\n{3,}/g,'\n\n');
 const lines=whole.split('\n');
 const visibleLines=lines.reduce((n,line)=>n+(line.trim()?Math.max(1,Math.ceil(line.length/29)):0.65),0);
 if(visibleLines<=22&&whole.length<=580)return [whole];
 let best=1,score=Infinity;
 for(let i=1;i<lines.length;i++){
  const left=lines.slice(0,i).join('\n'),right=lines.slice(i).join('\n');
  const weight=x=>x.split('\n').reduce((n,line)=>n+(line.trim()?Math.max(1,Math.ceil(line.length/29)):0.65),0);
  const l=weight(left),rr=weight(right);
  const penalty=Math.max(0,l-22)*100+Math.max(0,rr-22)*100;
  const mid=Math.abs(l-rr),stanza=lines[i-1]?.trim()===''||lines[i]?.trim()===''?-2:0;
  const v=penalty+mid+stanza;
  if(v<score){score=v;best=i}
 }
 return [lines.slice(0,best).join('\n').trim(),lines.slice(best).join('\n').trim()].filter(Boolean);
}
function partIllustration(part){
 const motifs=[
  '<path d="M85 460 Q175 280 355 145" fill="none" stroke="#544a35" stroke-width="7" stroke-linecap="round"/><path d="M198 338 Q125 270 88 235 M275 242 Q334 244 390 210" fill="none" stroke="#66533a" stroke-width="4"/>'
  +Array.from({length:8},(_,i)=>{const x=135+i*34,y=402-i*32;return '<g transform="translate('+x+' '+y+')"><circle r="20" fill="#dba9a7" opacity=".7"/><circle cx="-12" cy="-8" r="15" fill="#efd1ca"/><circle cx="12" cy="-9" r="15" fill="#e7b1ae"/><circle cx="0" cy="-20" r="14" fill="#f6ded2"/><circle r="5" fill="#c8a358"/></g>'}).join(''),
  '<circle cx="340" cy="145" r="70" fill="#efdfb2" opacity=".85"/><path d="M60 465 Q170 340 300 380 T450 365" stroke="#6b806b" stroke-width="8" fill="none"/><path d="M225 410 Q210 310 245 215" stroke="#5f735b" stroke-width="6" fill="none"/><g transform="translate(248 208)"><path d="M0 0 Q-100 -50 -38 -102 Q0 -132 36 -90 Q90 -40 0 0" fill="#f3e6b6" stroke="#c3b987" stroke-width="3"/><circle cy="-45" r="12" fill="#bf9c60"/></g>',
  '<rect x="98" y="92" width="304" height="335" rx="10" fill="none" stroke="#9c9a85" stroke-width="8"/><path d="M250 95 V424 M100 264 H399" stroke="#bbb49e" stroke-width="7"/><circle cx="348" cy="151" r="54" fill="#e7cba2" opacity=".8"/><path d="M140 432 Q260 280 375 390" stroke="#77866d" stroke-width="5" fill="none"/><path d="M150 425 Q98 375 135 344 Q191 345 205 407 M302 380 Q323 314 381 320 Q378 375 302 380" fill="#9cab92" opacity=".8"/>',
  '<path d="M88 463 Q158 265 350 123" fill="none" stroke="#645746" stroke-width="7"/><path d="M171 332 Q101 269 110 222 M286 186 Q348 182 391 136" fill="none" stroke="#71624e" stroke-width="4"/>'
  +Array.from({length:9},(_,i)=>{const x=135+i*29,y=406-i*31;return '<g transform="translate('+x+' '+y+')"><circle r="11" fill="#f2e3cb"/><circle cx="-12" cy="-9" r="10" fill="#e7dfcc"/><circle cx="12" cy="-7" r="10" fill="#f2e8d5"/><circle cx="0" cy="-16" r="10" fill="#f1e4d5"/><circle r="4" fill="#d2b56a"/></g>'}).join('')
 ];
 return '<div class="illustration" aria-label="제'+part+'부 수묵담채풍 꽃과 자연 삽화"><svg viewBox="0 0 500 520" role="img" aria-hidden="true"><ellipse cx="248" cy="460" rx="170" ry="22" fill="#c7c6ae" opacity=".18"/>'+motifs[part-1]+'</svg></div>';
}
function start(data){
 const parts=data.parts,poems=data.poems;
 add('<div><p class="kicker">明道齋 · 시 읽기</p><h1>별꽃은<br>피고 지고</h1><p>이성두 시인의 다섯 번째 시집</p><p class="author">원시 이성두<br>이명우 시읽기 · 명도재 편집</p></div>','별꽃은 피고 지고\n이성두 시인의 다섯 번째 시집\n원시 이성두. 이명우 시읽기.','cover');
 add('<div class="editorial"><p class="partnum">明道齋</p><h2>이 책을 펼치며</h2><p>이성두 시인의 원시와 이명우의 시읽기를 함께 감상하는 디지털 시집입니다.</p><p>왼쪽에는 시, 오른쪽에는 이명우 시읽기를 배치했습니다. 각 페이지의 음성 버튼으로 내용을 들을 수 있습니다.</p></div>','이 책을 펼치며\n이성두 시인의 원시와 이명우 시읽기를 함께 감상합니다.','divider');
 const toc=[];
 for(let part=1;part<=4;part++){
  const section=pages.length;
  add(partIllustration(part),'제'+part+'부 삽화','illustration-page');
  toc.push({title:'제'+part+'부 · '+parts[part-1],page:section});
  const list=poems.filter(p=>p.part===part);
  add('<div class="part-intro"><p class="partnum">PART '+String(part).padStart(2,'0')+'</p><h2>'+esc(parts[part-1])+'</h2><p>'+list.length+'편 · 이성두 시인</p><p>이성두의 시와 이명우 시읽기를 함께 펼쳐 읽습니다.</p></div>','제'+part+'부 '+parts[part-1]+'\n이성두 시인','divider');
  for(const p of list){
   const idx=pages.length;toc.push({title:(p.n||'')+' · '+p.title,page:idx});
   const poem=String(p.text||'원문을 확인 중입니다.').trim().replace(/\n{3,}/g,'\n\n');
   const lines=poem.split('\n');
   const measure=line=>line.trim()?Math.max(1,Math.ceil(line.length/24)):0.65;
   const total=lines.reduce((n,line)=>n+measure(line),0);
   const needsColumns=total>17||poem.length>250;
   let cut=lines.length;
   if(needsColumns){
    const half=total/2;let bestScore=Infinity;
    for(let i=1;i<lines.length;i++){
     const before=lines.slice(0,i).reduce((n,line)=>n+measure(line),0);
     const after=total-before;
     const stanzaBoundary=lines[i-1].trim()===''||lines[i].trim()==='';
     const score=Math.abs(before-after)-(stanzaBoundary?1.4:0);
     if(score<bestScore){bestScore=score;cut=i}
    }
   }
   const leftText=needsColumns?lines.slice(0,cut).join('\n').trim():poem;
   const rightText=needsColumns?lines.slice(cut).join('\n').trim():'';
   const poemMarkup='<section class="poem"><p class="poem-number">제'+part+'부 · '+esc(parts[part-1])+'</p><h2>'+esc(p.title)+'</h2><div class="poet">이성두 · 『별꽃은 피고 지고』</div><div class="poem-columns'+(rightText?' two':'')+'"><div class="verse">'+esc(leftText)+'</div>'+(rightText?'<div class="verse">'+esc(rightText)+'</div>':'')+'</div></section>';
   add(poemMarkup,p.title+'\n'+poem,'poem-page');
   const comment=String(p.commentary||'').trim();
   add('<section class="critical"><p class="poem-number">明道齋 · 이명우 시읽기</p><h2>'+esc(p.title)+' · 이명우 시읽기</h2><p>'+esc(comment)+'</p><p class="poet">이명우 시읽기 · 명도재</p></section>',p.title+' 이명우 시읽기\n'+comment,'reading-page');
  }
 }
 add('<div><p class="kicker">明道齋</p><h1>별꽃은<br>피고 지고</h1><p>원시 이성두<br>이명우 시읽기 · 명도재 편집</p></div>','별꽃은 피고 지고. 원시 이성두. 이명우 시읽기.','cover');
 if(pages.length%2)add('<div class="partnum">明道齋</div><h2>시의 여운이 오래 머물기를.</h2>','시의 여운이 오래 머물기를.','divider');
 $('tocPanel').innerHTML='<h2>작품 차례</h2>'+toc.map(x=>'<button data-go="'+x.page+'">'+esc(x.title)+'</button>').join('');
 const match=location.hash.match(/^#page-(\d+)/);if(match)pos=Number(match[1])-1;
 pos=Math.max(0,Math.min(pos,pages.length-step()));if(!mobile.matches)pos-=pos%2;render();
}
document.addEventListener('click',e=>{
 const read=e.target.closest('[data-read]');if(read){e.preventDefault();readPage(Number(read.dataset.read));return}
 const link=e.target.closest('[data-go]');if(link){$('tocPanel').hidden=true;go(Number(link.dataset.go));return}
});
$('prev').onclick=$('edgePrev').onclick=()=>go(pos-step());
$('next').onclick=$('edgeNext').onclick=()=>go(pos+step());
$('contents').onclick=()=>{$('tocPanel').hidden=!$('tocPanel').hidden};
$('pauseToggle').onclick=pauseResume;
$('book').addEventListener('click',e=>{if(e.target.closest('button'))return;if(speechId!==null){pauseResume();return}const el=e.target.closest('.page');if(!el)return;go(pos+(el.id==='left'?-step():step()))});
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')go(pos+step());if(e.key==='ArrowLeft')go(pos-step())});
window.addEventListener('pagehide',stop);
window.addEventListener('resize',()=>{if(pages.length)render()});
fetch('./poems.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('작품 파일을 열 수 없습니다.');return r.json()}).then(start).catch(e=>{$('progress').textContent='시집 불러오기 실패';console.error(e)});
