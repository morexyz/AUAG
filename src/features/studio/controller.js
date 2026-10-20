import {createFieldRenderer} from './renderer.js';
import {createStudioView} from './view.js';
export function mountStudio({bus,t}){
 const v=createStudioView(),renderer=createFieldRenderer({canvas:v.canvas,stage:v.stage});let stopped=false;
 const onMode=e=>{const mode=e.currentTarget.dataset.mode;v.modeButtons.forEach(b=>b.classList.toggle('is-active',b.dataset.mode===mode));renderer.setMode(mode);bus.emit('interaction','mode')};
 v.modeButtons.forEach(btn=>btn.addEventListener('click',onMode));
 const onIntensity=()=>renderer.setIntensity(Number(v.intensity.value)/100);v.intensity.addEventListener('input',onIntensity);
 const onPause=()=>{stopped=!stopped;renderer.setPaused(stopped);v.pause.textContent=stopped?t('resume','Resume ▶'):t('pause','Pause ⏸')};
 v.pause.addEventListener('click',onPause);
 const onVisibility=()=>{if(document.hidden){renderer.setPaused(true)}else if(!stopped)renderer.setPaused(false)};
 document.addEventListener('visibilitychange',onVisibility);
 const off=bus.on('language',()=>v.pause.textContent=stopped?t('resume','Resume ▶'):t('pause','Pause ⏸'));
 renderer.start();
 return {pause(){renderer.stop()},resume(){if(!stopped)renderer.start()},dispose(){off();renderer.dispose();v.modeButtons.forEach(btn=>btn.removeEventListener('click',onMode));v.intensity.removeEventListener('input',onIntensity);v.pause.removeEventListener('click',onPause);document.removeEventListener('visibilitychange',onVisibility)}};
}
