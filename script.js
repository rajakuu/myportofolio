const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
$('#yr').textContent=new Date().getFullYear();

const hdr=$('#hdr'),prog=$('#progress');
addEventListener('scroll',()=>{
  hdr.classList.toggle('solid',scrollY>20);
  const h=document.documentElement;prog.style.width=(scrollY/(h.scrollHeight-innerHeight)*100)+'%';
},{passive:true});
const menu=$('.menu'),links=$('#links');
menu.onclick=()=>menu.setAttribute('aria-expanded',links.classList.toggle('open'));
links.onclick=e=>{if(e.target.tagName==='A')links.classList.remove('open')};

const secs=$$('main section[id]'),nav=$$('.links a:not(.pill)');
new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)nav.forEach(a=>a.classList.toggle('on',a.hash==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'}).observe&&secs.forEach(s=>new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)nav.forEach(a=>a.classList.toggle('on',a.hash==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'}).observe(s));

const glow=$('#glow');
addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'},{passive:true});

const roles=['Mahasiswa Teknik Komputer','Pencinta sistem operasi','Programmer C & C++','Web developer','Fotografer'];
const typed=$('#typed');let ri=0,ci=0,del=false;
(function tick(){
  const w=roles[ri];
  typed.textContent=w.slice(0,ci);
  if(!del&&ci===w.length){del=true;return setTimeout(tick,1400)}
  if(del&&ci===0){del=false;ri=(ri+1)%roles.length}
  ci+=del?-1:1;setTimeout(tick,del?35:70);
})();

const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  const t=e.target;t.classList.add('in');io.unobserve(t);
  $$('.fill',t).forEach(f=>f.style.width=f.dataset.w+'%');
  $$('[data-n]',t).forEach(n=>{let v=0,end=+n.dataset.n;const i=setInterval(()=>{n.textContent=++v;if(v>=end)clearInterval(i)},350)});
}),{threshold:.2});
$$('.rv').forEach(el=>io.observe(el));
$$('.fill').forEach(f=>f.style.setProperty('--w',f.dataset.w+'%'));

/* tilt 3D + sorot kartu */
$$('.tilt').forEach(c=>{
  c.addEventListener('pointermove',e=>{
    const r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
    c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');
    if(matchMedia('(hover:hover)').matches)c.style.transform=`rotateX(${(.5-y/r.height)*6}deg) rotateY(${(x/r.width-.5)*6}deg)`;
  });
  c.addEventListener('pointerleave',()=>c.style.transform='');
});

const photo=$('#photo'),img=$('#img'),file=$('#file');
img.onload=()=>photo.classList.add('has');
img.onerror=()=>{img.style.display='none'};
if(img.complete&&img.naturalWidth)photo.classList.add('has');
file.onchange=()=>{
  const f=file.files[0];if(!f)return;
  img.style.display='block';img.src=URL.createObjectURL(f);
};
const peek=$('#peek');
function placePeek(e){
  const pad=24,w=peek.offsetWidth,h=peek.offsetHeight;
  let x=e.clientX+pad,y=e.clientY+pad;
  if(x+w>innerWidth-pad)x=e.clientX-w-pad;
  if(y+h>innerHeight-pad)y=innerHeight-h-pad;
  x=Math.max(pad,x);y=Math.max(pad,y);
  peek.style.left=x+'px';peek.style.top=y+'px';
}
$$('.shot').forEach(s=>{
  s.addEventListener('pointerenter',e=>{
    if(!matchMedia('(hover:hover)').matches)return;
    const m=s.firstElementChild.cloneNode(true),p=document.createElement('p');
    p.textContent=$('figcaption',s).textContent;
    peek.replaceChildren(m,p);
    if(m.tagName==='IMG')m.onload=()=>placePeek(e);
    placePeek(e);peek.classList.add('show');
  });
  s.addEventListener('pointermove',placePeek);
  s.addEventListener('pointerleave',()=>peek.classList.remove('show'));
  s.addEventListener('click',()=>peek.classList.remove('show'));
});

/* lightbox */
const lb=$('#lb'),lbm=$('#lbm'),lbc=$('#lbc');
function open(s){const m=s.firstElementChild.cloneNode(true);lbm.replaceChildren(m);lbc.textContent=$('figcaption',s).textContent;lb.classList.add('open');$('button',lb).focus()}
$$('.shot').forEach(s=>{s.onclick=()=>open(s);s.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(s)}}});
lb.onclick=e=>{if(e.target===lb||e.target.tagName==='BUTTON')lb.classList.remove('open')};
addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('open')});

/* salin email */
$('#copy').onclick=async e=>{
  try{await navigator.clipboard.writeText(e.target.dataset.v)}catch(_){}
  const t=$('#toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800);
};