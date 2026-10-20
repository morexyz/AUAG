import fa from '../i18n/fa.js';
export function createI18n(bus){
 const nodes=[...document.querySelectorAll('[data-i18n]')],original=new Map(nodes.map(n=>[n,n.innerHTML]));let lang='en';
 const t=(key,fallback='')=>lang==='fa'?(fa[key]??fallback):fallback;
 function setLanguage(next){if(!['en','fa'].includes(next))return;lang=next;document.documentElement.lang=lang;document.documentElement.dir=lang==='fa'?'rtl':'ltr';document.title=lang==='fa'?'آئواژ — هوشمندی میان طلا و نقره':'AUAG — The Intelligence Between Gold & Silver';for(const node of nodes){if(lang==='fa'&&fa[node.dataset.i18n]!==undefined){node.innerHTML=fa[node.dataset.i18n]}else node.innerHTML=original.get(node)}
  const toggle=document.getElementById('lang-toggle');toggle.innerHTML=lang==='fa'?'EN <span>↗</span>':'فا <span>↗</span>';
  try{localStorage.setItem('auag-language',lang)}catch{};bus.emit('language',lang);
 }
 function start(){let saved;try{saved=localStorage.getItem('auag-language')}catch{};setLanguage(saved==='fa'?'fa':'en');document.getElementById('lang-toggle').addEventListener('click',()=>setLanguage(lang==='fa'?'en':'fa'))}
 return {start,setLanguage,getLanguage:()=>lang,t};
}
