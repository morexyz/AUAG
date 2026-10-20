import {capabilities} from '../config.js';
export const easing={linear:t=>t,outCubic:t=>1-(1-t)**3,inOutCubic:t=>t<.5?4*t*t*t:1-(-2*t+2)**3/2,outExpo:t=>t===1?1:1-Math.pow(2,-10*t)};
export function tween({duration=700,ease=easing.outCubic,update,complete,signal}={}){
 if(capabilities.reducedMotion){update?.(1);complete?.();return {cancel(){}}}
 let frame=0;let started=null;let cancelled=false;
 const tick=time=>{if(cancelled||signal?.aborted)return;if(started===null)started=time;const raw=Math.min(1,(time-started)/duration);update?.(ease(raw));if(raw<1)frame=requestAnimationFrame(tick);else complete?.()};
 frame=requestAnimationFrame(tick);return {cancel(){cancelled=true;cancelAnimationFrame(frame)}};
}
export function animate(element,keyframes,options={}){
 if(!element||capabilities.reducedMotion)return Promise.resolve();
 if(capabilities.waapi){const animation=element.animate(keyframes,{duration:500,easing:'cubic-bezier(.22,.8,.22,1)',fill:'both',...options});return animation.finished.catch(()=>{}).then(()=>{if(animation.playState==='finished'){for(const [key,value] of Object.entries(keyframes[keyframes.length-1])){try{element.style[key]=String(value)}catch{}}}animation.cancel()})}
 return Promise.resolve();
}
export function createTimeline(){let cancelled=false;const tasks=[];return {add(run,delay=0){tasks.push({run,delay});return this},async play(){cancelled=false;for(const task of tasks){if(cancelled)break;if(task.delay)await new Promise(resolve=>setTimeout(resolve,task.delay));if(cancelled)break;await task.run()}},cancel(){cancelled=true}}}
export function morphPath(element,from,to){
 const a=(from.match(/-?\d+(?:\.\d+)?/g)||[]).map(Number),b=(to.match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);
 if(a.length!==b.length)return {cancel(){}};
 return tween({duration:840,update(t){let i=0;element.setAttribute('d',from.replace(/-?\d+(?:\.\d+)?/g,()=>{const val=(a[i]+(b[i]-a[i])*t).toFixed(1);i++;return val}))}});
}
