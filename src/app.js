import {config,capabilities} from './config.js';
import {createEventBus} from './core/event-bus.js';
import {createRouter} from './core/router.js';
import {initScroll} from './core/scroll.js';
import {createI18n} from './core/i18n.js';
import {animate,createTimeline,tween,morphPath} from './core/animation.js';
import {mountRatio} from './features/ratio/controller.js';
import {mountJourney} from './features/journey/controller.js';
import {mountNetwork} from './features/network/controller.js';

const bus=createEventBus(),i18n=createI18n(bus);
document.documentElement.classList.add('js-enabled');
i18n.start();
const service={bus,t:i18n.t,getLanguage:i18n.getLanguage};
mountRatio(service);mountJourney(service);mountNetwork(service);
const scroll=initScroll();

// A native HTML document exists for search engines and for visitors with JS disabled.
// Interactive studio is a separate client-side route, lazy-imported only on demand.
let studio=null,studioLoaded=false,routeVersion=0;
const storyView=document.getElementById('story-view'),studioView=document.getElementById('studio-view'),rail=document.getElementById('chapter-rail');
const route=createRouter({async onRoute(next,previous){const ticket=++routeVersion;
 if(next.view==='studio'&&config.features.studio){storyView.hidden=true;studioView.hidden=false;rail.hidden=true;window.scrollTo({top:0,behavior:'instant'});animate(studioView,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:650});
  if(!studioLoaded){try{const {mountStudio}=await import('./features/studio/controller.js');if(ticket!==routeVersion)return;studio=mountStudio(service);studioLoaded=true}catch(error){console.error('Studio failed to load',error);studioView.querySelector('.studio-intro')?.removeAttribute('hidden')}}else studio.resume();return;
 }
 studio?.pause();studioView.hidden=true;storyView.hidden=false;rail.hidden=false;if(previous?.view==='studio')animate(storyView,[{opacity:0},{opacity:1}],{duration:550});
 const target=document.getElementById(next.chapter||'top');
 // Allow browser layout to update after restoring story route.
 requestAnimationFrame(()=>{if(ticket!==routeVersion)return;const smooth=!capabilities.reducedMotion&&previous!==null;target?.scrollIntoView({behavior:smooth?'smooth':'instant',block:'start'});scroll.update()});
 }});
route.start();

// Cinematic entrance combines CSS keyframes with a native WAAPI timeline.
const intro=[...document.querySelectorAll('.intro-fade')];
if(capabilities.reducedMotion)intro.forEach(el=>el.classList.add('is-intro'));
else intro.forEach((el,i)=>setTimeout(()=>el.classList.add('is-intro'),i*140+80));

// Pointer-driven SVG orbit parallax with an optional path morph. No draw loop.
const hero=document.querySelector('.hero'),object=document.getElementById('duality-object'),morph=document.getElementById('morphMaskPath');
const shapeA='M 300 50 L 550 300 L 300 550 L 50 300 Z';
const shapeB='M 300 100 L 500 260 L 340 510 L 100 340 Z';
let lastMorph=null,heroPending=false,heroX=0,heroY=0;
if(config.features.pointer&&capabilities.pointer&&!capabilities.reducedMotion){
 hero.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const rect=hero.getBoundingClientRect();heroX=(e.clientX-rect.left)/rect.width-.5;heroY=(e.clientY-rect.top)/rect.height-.5;if(heroPending)return;heroPending=true;requestAnimationFrame(()=>{heroPending=false;object.style.translate=`${heroX*-16}px ${heroY*-16}px`})},{passive:true});
 hero.addEventListener('pointerenter',()=>{if(!config.features.svgMorph)return;lastMorph?.cancel();lastMorph=morphPath(morph,morph.getAttribute('d'),shapeB)});
 hero.addEventListener('pointerleave',()=>{lastMorph?.cancel();lastMorph=morphPath(morph,morph.getAttribute('d'),shapeA);object.style.translate='0 0'});
}

// SVG animated stroke and WAAPI-backed chapter sequence; no perpetual timer.
const path=document.getElementById('process-path'),process=document.getElementById('process-art'),steps=[...document.querySelectorAll('.process-step')];let seq=null;
async function runProcess(){seq?.cancel();seq=createTimeline();const length=path.getTotalLength();path.style.strokeDasharray=String(length);path.style.strokeDashoffset=String(length);steps.forEach(el=>el.classList.remove('is-highlight'));
 if(capabilities.reducedMotion){path.style.strokeDashoffset='0';steps.forEach(el=>el.classList.add('is-highlight'));return}
 seq.add(()=>animate(path,[{strokeDashoffset:length},{strokeDashoffset:length*.66}],{duration:650,fill:'forwards'}))
 .add(()=>{steps[0].classList.add('is-highlight');return animate(steps[0],[{opacity:.4},{opacity:1}],{duration:350})},100)
 .add(()=>animate(path,[{strokeDashoffset:length*.66},{strokeDashoffset:length*.31}],{duration:650,fill:'forwards'}))
 .add(()=>{steps[1].classList.add('is-highlight');return animate(steps[1],[{opacity:.4},{opacity:1}],{duration:350})},100)
 .add(()=>animate(path,[{strokeDashoffset:length*.31},{strokeDashoffset:0}],{duration:650,fill:'forwards'}))
 .add(()=>{steps[2].classList.add('is-highlight');return animate(steps[2],[{opacity:.4},{opacity:1}],{duration:350})},90);
 await seq.play();path.style.strokeDashoffset='0';
}
document.getElementById('replay-process').addEventListener('click',runProcess);
if('IntersectionObserver' in window){const ob=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){runProcess();ob.disconnect()}},{threshold:.28});ob.observe(process)}

// Native SVG motion path updates a single transform; stopped when not visible.
const token=document.getElementById('flow-token'),flow=document.getElementById('wallet-flow');let tokenRunning=false,tokenRaf=0,tokenOrigin=0;
function tokenTick(now){if(!tokenRunning)return;if(!tokenOrigin)tokenOrigin=now;const progress=((now-tokenOrigin)/9600)%1;const pt=flow.getPointAtLength(progress*flow.getTotalLength());token.setAttribute('cx',pt.x.toFixed(1));token.setAttribute('cy',pt.y.toFixed(1));tokenRaf=requestAnimationFrame(tokenTick)}
if(!capabilities.reducedMotion&&'IntersectionObserver' in window){const ob=new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&!document.hidden){if(!tokenRunning){tokenRunning=true;tokenOrigin=0;tokenRaf=requestAnimationFrame(tokenTick)}}else{tokenRunning=false;cancelAnimationFrame(tokenRaf)}},{threshold:.05});ob.observe(document.querySelector('.wallet-graphic'))}

// Meaningful disclosure about token allowances; it never requests a wallet signature.
const permissionToggle=document.getElementById('permission-toggle'),permissionNote=document.getElementById('permission-note');permissionToggle.setAttribute('aria-expanded','false');permissionToggle.addEventListener('click',()=>{permissionNote.hidden=!permissionNote.hidden;permissionToggle.setAttribute('aria-expanded',String(!permissionNote.hidden));bus.emit('interaction','permissions')});

// Sound is initially OFF, opt-in only, and intentionally minimal.
let audioEnabled=false,audioCtx=null;const audioButton=document.getElementById('audio-toggle');
function chime(){if(!audioEnabled||!config.features.audio||!capabilities.audio)return;try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain(),now=audioCtx.currentTime;osc.type='sine';osc.frequency.setValueAtTime(440,now);osc.frequency.exponentialRampToValueAtTime(620,now+.12);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.025,now+.025);gain.gain.exponentialRampToValueAtTime(.0001,now+.21);osc.connect(gain).connect(audioCtx.destination);osc.start(now);osc.stop(now+.22)}catch{audioEnabled=false}}
audioButton.addEventListener('click',()=>{audioEnabled=!audioEnabled;audioButton.setAttribute('aria-pressed',String(audioEnabled));audioButton.setAttribute('aria-label',audioEnabled?'Disable optional sound':'Enable optional sound');if(audioEnabled)chime()});
bus.on('interaction',chime);
document.addEventListener('visibilitychange',()=>{if(document.hidden){tokenRunning=false;cancelAnimationFrame(tokenRaf)}});

// Diagnostic surface for non-destructive smoke tests.
window.__AUAG__={getLanguage:i18n.getLanguage,capabilities,config,route:()=>location.hash};
