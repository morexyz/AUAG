import {content,panelTexts} from './model.js';
import {renderNetwork} from './view.js';
export function mountNetwork({getLanguage,bus}){
 const nodes=[...document.querySelectorAll('[data-node]')],desc=document.getElementById('network-description'),tabs=[...document.querySelectorAll('[data-panel]')],panel=document.getElementById('mock-panel');let active='wallet',activeTab='holdings';
 function render(){renderNetwork({nodes,desc,tabs,panel,language:getLanguage(),active,activeTab,content,panelTexts})}
 nodes.forEach(node=>node.addEventListener('click',()=>{active=node.dataset.node;render();bus.emit('interaction','network')}));tabs.forEach(tab=>tab.addEventListener('click',()=>{activeTab=tab.dataset.panel;render();bus.emit('interaction','panel')}));const off=bus.on('language',render);render();return off;
}
