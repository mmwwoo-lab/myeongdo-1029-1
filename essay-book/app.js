'use strict';
const essays=window.MYEONGDO_ESSAYS||[];
const $=s=>document.querySelector(s),escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Signature sentence is highlighted only when its full wording occurs in a leaf.
// Reading voice retains the unformatted original manuscript.
function formatParagraph(source,essay){
 if(source==='〔삽입시 끝〕')return '';
 if(source.startsWith('〔삽입시〕'))return '<p class="poem-heading">'+escapeHtml(source.replace('〔삽입시〕','').trim())+'</p>';
 const key=essay?.highlight,poemStart=essay?.text.indexOf('〔삽입시〕'),poemEnd=essay?.text.indexOf('〔삽입시 끝〕');
 const atSource=essay?.text.indexOf(source);
 const inPoem=poemStart>=0&&poemEnd>poemStart&&atSource>poemStart&&atSource<poemEnd;
 const safe=escapeHtml(source).replace(/\n/g,'<br>'),phrase=key?escapeHtml(key):'',at=phrase?safe.indexOf(phrase):-1;
 return '<p'+(inPoem?' class="poem-stanza"':'')+'>'+(at<0?safe:safe.slice(0,at)+'<strong class="key-line">'+phrase+'</strong>'+safe.slice(at+phrase.length))+'</p>';
}
const mobile=matchMedia('(max-width:800px)');let pages=[],index=0,speech=null,paused=false,speechToken=0;
// Measure text in a real-sized, hidden book leaf, never by character count.
function fragments(essay,compact=false){
 // Authored six-page essays: preserve leaf boundaries and all paragraph breaks.
 if(!compact && Array.isArray(essay.pageParts) && [6,10].includes(essay.pageParts.length))
  return essay.pageParts.map(part=>part.slice());
 const paragraphs=essay.text.split(/\n\s*\n/).map(s=>s.trim()).filter(s=>s&&s!=='〔삽입시 끝〕');
 const host=document.createElement('article');
 host.className='page measure-leaf'+(compact?' compact-essay':'');
 host.style.width=$('#left').getBoundingClientRect().width+'px';
 $('#book').appendChild(host);
 let result=[],remaining=paragraphs.slice(),first=true;
 const prepare=()=>{
  host.innerHTML=htmlFor({type:'essay',essay,part:[],partNumber:first?1:2,total:2});
  return host.querySelector('.essay-body');
 };
 const fits=(body,items)=>{
  body.innerHTML=items.map(t=>formatParagraph(t,essay)).join('');
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
// Six-leaf continuous text edition: keep every word and avoid paragraph whitespace.
function continuousSixLeaves(essay){
 const text=essay.text.replace(/\n/g,' ').replace(/\s+/g,' ').trim();
 const words=text.split(' ').filter(Boolean);
 const weights=[0.72,1.056,1.056,1.056,1.056,1.054];
 const total=words.join(' ').length;
 const limits=weights.map(w=>w*total/6);
 const leaves=Array.from({length:6},()=>[]);
 let page=0,used=0;
 for(let i=0;i<words.length;i++){
  const word=words[i],next=used+word.length+(leaves[page].length?1:0);
  if(page<5 && leaves[page].length && next>limits[page] && words.length-i>=5-page){page++;used=0}
  leaves[page].push(word);used+=word.length+1;
 }
 return leaves.map(words=>[words.join(' ')]);
}
function build(){
 pages=[{type:'cover',title:'표지'},{type:'intro',title:'여는 글'}];
 for(const essay of essays){
  // Re-measure the complete source against the denser leaf; don't honor
  // stale manually-authored 6/10 page breaks when text can fit in fewer leaves.
  // Chapter 18 alone has eight deliberately edited leaves; all prior works keep their existing pagination.
  let parts=essay.number===18 && Array.isArray(essay.pageParts) && essay.pageParts.length===8
   ? essay.pageParts.map(p=>p.slice()) : fragments(essay,true),continuousSix=false;
  if(parts.length>6 && essay.number!==18){
   parts=continuousSixLeaves(essay);
   continuousSix=true;
  }
  const needsClosing=parts.length%2===1;
  const chapterPages=parts.length+(needsClosing?1:0);
  parts.forEach((part,i)=>pages.push({
   type:'essay',essay,part,compact:false,compactEssay:true,continuousSix,
   partNumber:i+1,total:chapterPages,title:essay.title+(i?' · 계속':'')
  }));
  if(needsClosing) pages.push({type:'essay-end',essay,title:essay.title+' · 그림과 작품 요약'});
 }
 pages.push({type:'back',title:'뒤표지'});
 const toc=$('#toc-list');
 toc.innerHTML=pages.map((p,i)=>(i===0||p.type==='intro'||p.type==='back'||(p.type==='essay'&&p.partNumber===1))
  ?`<button data-to="${i}">${p.type==='essay'?`제${String(p.essay.number).padStart(2,'0')}편 · `:''}${escapeHtml(p.title)}<strong class="toc-page" aria-label="시작 페이지 ${i+1}"> ${String(i+1).padStart(2,'0')}쪽</strong><span>${p.type==='essay'?escapeHtml(p.essay.subtitle):'명도재 디지털 수필집'}</span></button>`:'').join('');
}
function htmlFor(p){if(!p)return '';
if(p.type==='cover')return '<section class="cover hardback-front"><div class="cover-copy"><div class="eyebrow">명도재 이명우 · 디지털 수필집 제1권</div><h1>명도재,<br>창작으로 다시 걷다</h1><p class="cover-subtitle">삶에서 건져 올린 열여덟 빛깔의 이야기</p><p class="author">명도재에서 이명우지음</p></div></section>';
if(p.type==='intro')return '<section class="frontmatter intro-preface"><span class="emblem">❧</span><h2>서문 · 다시 걷는 길</h2><p><strong>명도재는 교직을 마친 뒤 배움과 창작으로 다시 문을 연 나의 두 번째 교실이다.</strong></p><p>삼십육 년의 교단을 떠나 신천을 걷고 월촌역의 벗을 만나며, 아버지와 어머니의 시간을 글로 불러냈다. 시장의 한 그릇과 비 갠 앞산에서도 삶의 표정을 발견했다. 고산골 법장사 숲길에서는 나무가 써 내려가는 가을의 시를 읽었다. 아침 페이스북에서 만난 법문은 사람에게 건네는 말의 온기를 되새기게 했다. 보리밥 한 상에서는 어머니의 잔불과 함께 걷는 아내의 시간을 떠올렸다. 책장 속 두 권의 책에서는 아이들의 마음을 듣던 교실을 다시 만났다. 책장 속 상담심리 기록은 아이들의 이야기를 다시 들려주었다. 열여덟 편의 수필은 평범한 하루에서 건져 올린 기억과 새로운 출발의 기록이다.</p><p>남은 날에도 지나가는 풍경을 그냥 흘려보내지 않고, 한 문장씩 정성껏 남기고 싶다.</p><div class="author-bio"><h3>지은이 소개 <span>명도재 이명우</span></h3><p><b>활동</b> 한국미술협회·대구미술협회 회원, 대구미술대전 초대작가</p><p><b>수상</b> 대구미술대전 최우수상, 무등미술대전 우수상, 매일미술대전 우수상</p><p><b>심사</b> 대한민국미술대전·대구미술대전·광주미술대전·대전미술대전·부산미술대전 심사위원 역임</p><p><b>저서</b> 시집 『물빛에 놓아둔 마음』, 수필집 『명도재, 창작으로 다시 걷다』</p></div><p class="disclaimer">삶의 경험과 창작시를 바탕으로 문학적으로 재구성한 수필집입니다.</p></section>';
if(p.type==='essay-end'){
 const e=p.essay,src=escapeHtml(e.illustrationUrl||('images/'+e.illustration+'.svg'));
 return '<section class="frontmatter essay-closing"><p class="eyebrow">명도재 생활수필 · 제'+e.number+'편 · 그림과 작품 요약</p><h2>'+escapeHtml(e.title)+'</h2><img class="closing-illustration" src="'+src+'" alt="'+escapeHtml(e.motif)+' 삽화"><div class="closing-summary"><strong>작품 요약</strong><p>'+escapeHtml(e.subtitle)+'. '+escapeHtml(e.motif)+'을 소재로 삶의 장면을 되돌아봅니다.</p><blockquote>'+escapeHtml(e.highlight||e.title)+'</blockquote></div><p class="disclaimer">명도재 이명우 · 제'+e.number+'편 끝</p></section>';
}
if(p.type==='back')return '<section class="cover hardback-back"><div class="cover-copy back-copy"><p class="back-quote">명도재는 나의 두 번째 출근지이다.<br>오늘도 창작으로 다시 걷는다.</p><p class="author">명도재에서 이명우지음</p></div></section>';
if(p.type==='blank')return '<section class="frontmatter"></section>';
if(p.type==='end')return '<section class="frontmatter"><span class="emblem">✦</span><h2>그늘을 지나면<br>다시 햇살이 있다</h2><p>열여덟 편의 수필을 덮으며, 오늘의 평범한 하루가 내일의 문장이 되기를.</p><p class="disclaimer">© 명도재 이명우 · 작가 최종 승인 전 시안</p></section>';
const e=p.essay,first=p.partNumber===1;return `<section class="essay${e.number===13?' essay-thirteen':e.number===14?' essay-fourteen':e.number===15?' essay-fifteen':e.number===16?' essay-sixteen':e.number===18?' essay-eighteen':''}${(e.number===18||Array.isArray(e.pageParts)&&[6,10].includes(e.pageParts.length))?' essay-fixed':''}" data-essay="${e.number}"><div class="eyebrow">명도재 생활수필 · 제${e.number}편 · ${p.partNumber}/${p.total}</div>${first?`<h2>${escapeHtml(e.title)}</h2><p class="subtitle">${escapeHtml(e.subtitle)}</p><img src="${escapeHtml(e.illustrationUrl||("images/"+e.illustration+".svg"))}" alt="${escapeHtml(e.motif)}을 소재로 그린 수필 삽화">`:`<div class="continued">${escapeHtml(e.title)} — 이어 읽기</div>`}<div class="essay-body">${p.part.map(x=>formatParagraph(x,e)).join('')}</div></section><button class="page-read" data-read>▶ 이 페이지 읽기</button>`}
function stop(){speechToken++;if('speechSynthesis'in window)window.speechSynthesis.cancel();speech=null;paused=false;updateReads()}
function updateReads(){document.querySelectorAll('[data-read]').forEach(b=>b.textContent=speech===Number(b.closest('.page').dataset.page)?(paused?'▶ 이어 읽기':'⏸ 일시정지'):'▶ 이 페이지 읽기')}
function read(i){if(!('speechSynthesis'in window)){alert('이 브라우저는 한국어 음성 읽기를 지원하지 않습니다. 크롬을 이용해 주세요.');return}if(speech===i){paused=!paused;if(paused)speechSynthesis.pause();else speechSynthesis.resume();updateReads();return}stop();const p=pages[i];if(!p||p.type!=='essay')return;const text=[p.partNumber===1?p.essay.title:'',...p.part].filter(Boolean).join('. ').replace(/〔삽입시〕|〔삽입시 끝〕/g,'');const voices=speechSynthesis.getVoices(),ko=voices.filter(v=>/^ko/i.test(v.lang)),female=ko.find(v=>/female|여성|sora|sunhi|yuna|heami|seoyeon/i.test(v.name))||ko[0];const chunks=text.match(/.{1,150}(?:[.!?。]|$)/g)||[text];const token=++speechToken;speech=i;updateReads();let at=0;const next=()=>{if(token!==speechToken)return;if(at>=chunks.length){speech=null;updateReads();return}const u=new SpeechSynthesisUtterance(chunks[at++]);u.lang='ko-KR';if(female)u.voice=female;u.rate=.83;u.pitch=1.03;u.onend=next;u.onerror=()=>{speech=null;updateReads()};speechSynthesis.speak(u)};next()}
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
function fitFixedEssay(el){
 const body=el.querySelector('.essay-fixed .essay-body');
 if(!body)return;
 // Fit writing to its fixed book leaf instead of adding an inner scrollbar.
 const initial=mobile.matches?12.2:13.3;
 body.style.removeProperty('font-size');
 body.style.removeProperty('line-height');
 for(let font=initial;font>=10.2;font-=.25){
  body.style.setProperty('font-size',font.toFixed(2)+'px','important');
  body.style.setProperty('line-height',mobile.matches?'1.40':'1.46','important');
  if(body.scrollHeight<=body.clientHeight+1)break;
 }
}
function renderPage(el,p,i){el.classList.toggle('compact-leaf',!!(p&&p.compact));el.classList.toggle('compact-essay',!!(p&&p.compactEssay));el.classList.toggle('continuous-six',!!(p&&p.continuousSix));el.innerHTML=htmlFor(p);el.dataset.page=i;el.dataset.number=String(i+1).padStart(2,'0');el.hidden=!p;fitPreface(el);fitFixedEssay(el);el.querySelector('[data-read]')?.addEventListener('click',()=>read(i))}
function render(){const step=mobile.matches?1:2;renderPage($('#left'),pages[index],index);renderPage($('#right'),mobile.matches?null:pages[index+1],index+1);$('#prev').disabled=index===0;$('#next').disabled=index+step>=pages.length;history.replaceState(null,'','#page-'+(index+1));updateReads()}
function move(delta){const step=mobile.matches?1:2;index=Math.max(0,Math.min(Math.max(0,Math.ceil(pages.length/step)-1)*step,index+delta*step));stop();closeToc(false);render()}
function closeToc(focus=true){$('#toc').hidden=true;$('#contents').setAttribute('aria-expanded','false');if(focus)$('#contents').focus()}
$('#contents').addEventListener('click',()=>{const open=$('#toc').hidden;$('#toc').hidden=!open;$('#contents').setAttribute('aria-expanded',String(open));if(open)$('#toc-close').focus()});
$('#toc-close').addEventListener('click',()=>closeToc());
$('#toc-list').addEventListener('click',e=>{const b=e.target.closest('[data-to]');if(!b)return;index=Number(b.dataset.to);if(!mobile.matches)index-=index%2;stop();closeToc(false);render()});
$('#prev').onclick=()=>move(-1);$('#next').onclick=()=>move(1);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeToc();if(!$('#toc').hidden||/INPUT|TEXTAREA/.test(e.target.tagName))return;if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1)});
let start=null;$('#book').addEventListener('touchstart',e=>{start={x:e.touches[0].clientX,y:e.touches[0].clientY}},{passive:true});$('#book').addEventListener('touchend',e=>{if(!start)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5&&$('#toc').hidden)move(dx<0?1:-1);start=null},{passive:true});
mobile.addEventListener('change',()=>{stop();build();index=0;render()});window.addEventListener('resize',()=>{if(document.querySelector('.essay-fixed')){fitFixedEssay($('#left'));fitFixedEssay($('#right'))}});window.addEventListener('pagehide',stop);
build();const match=location.hash.match(/page-(\d+)/);if(match){index=Math.min(pages.length-1,Math.max(0,Number(match[1])-1));if(!mobile.matches)index-=index%2}render();