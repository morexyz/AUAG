import {ratioWeights} from './model.js';
import {createRatioView} from './view.js';
import {animate} from '../../core/animation.js';
export function mountRatio({t,bus}){
 const v=createRatioView();const render=()=>v.render(ratioWeights(v.range.value));
 const onRange=()=>{render();v.feedback.textContent=t('ratioUpdated','The relative shift changes the illustrative portfolio weights. No transaction occurred.')};
 const onDemo=()=>{v.feedback.textContent=t('ratioBalanced','An illustrative 50 / 50 target—not a trade or a description of AUAG’s proprietary rule.');animate(v.goldBar,[{filter:'brightness(2)'},{filter:'brightness(1)'}],{duration:550});bus.emit('interaction','balance')};
 const onReset=()=>{v.range.value=0;render();v.feedback.textContent=t('ratioDefault','Move the slider to change the illustrative weighting.')};
 const off=bus.on('language',()=>{v.feedback.textContent=t('ratioDefault','Move the slider to change the illustrative weighting.')});
 v.range.addEventListener('input',onRange);v.demo.addEventListener('click',onDemo);v.reset.addEventListener('click',onReset);render();
 return ()=>{off();v.range.removeEventListener('input',onRange);v.demo.removeEventListener('click',onDemo);v.reset.removeEventListener('click',onReset)};
}
