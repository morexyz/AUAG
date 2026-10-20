import {journeySteps} from './model.js';
import {renderJourney} from './view.js';
export function mountJourney({getLanguage,bus}){
 const tabs=[...document.querySelectorAll('[data-step]')],next=document.getElementById('journey-next'),title=document.getElementById('step-title'),body=document.getElementById('step-body'),counter=document.getElementById('step-counter'),pict=document.getElementById('stage-pictogram');let selected=0;
 function render(){renderJourney({tabs,title,body,counter,pict,selected,steps:journeySteps(getLanguage())})}
 function choose(i){selected=i;render();bus.emit('interaction','step')}
 tabs.forEach((tab,i)=>tab.addEventListener('click',()=>choose(i)));
 next.addEventListener('click',()=>choose((selected+1)%5));const off=bus.on('language',render);render();return off;
}
