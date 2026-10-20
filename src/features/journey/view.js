import {animate} from '../../core/animation.js';
export function renderJourney({tabs,title,body,counter,pict,selected,steps}){
 const [heading,description]=steps[selected];
 title.textContent=heading;body.textContent=description;counter.textContent=`0${selected+1} / 05`;
 tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===selected));tab.tabIndex=i===selected?0:-1});
 animate(pict,[{transform:'rotate(-9deg) scale(.92)',opacity:.4},{transform:'rotate(0) scale(1)',opacity:1}],{duration:480});
}
