import {capabilities} from '../config.js';
export function initScroll(){
 const reveals=[...document.querySelectorAll('.reveal')];
 if(!capabilities.reducedMotion&&'IntersectionObserver' in window){
  const obs=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target)}}},{threshold:.11,rootMargin:'0px 0px -25px 0px'});
  reveals.forEach(el=>obs.observe(el));
 }else reveals.forEach(el=>el.classList.add('is-visible'));
 const sections=[...document.querySelectorAll('[data-chapter]')],rail=[...document.querySelectorAll('.rail-dot')],progress=document.getElementById('read-progress');let pending=false;
 function update(){pending=false;if(document.getElementById('story-view').hidden)return;
  const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);const fraction=Math.min(1,Math.max(0,scrollY/max));progress.style.transform=`scaleX(${fraction})`;
  let current='top';const at=scrollY+innerHeight*.44;for(const el of sections)if(el.offsetTop<=at)current=el.dataset.chapter;
  const coarse={'assets':'idea','philosophy':'relationship','journey':'strategy','infrastructure':'ownership','difference':'experience','audience':'experience','vision':'risks','closing':'risks'};
  const slug=coarse[current]||current;rail.forEach(el=>el.classList.toggle('is-current',el.getAttribute('href')==='#'+slug));
 }
 const onScroll=()=>{if(!pending){pending=true;requestAnimationFrame(update)}};
 window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll,{passive:true});update();
 return {update,dispose(){window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll)}};
}
