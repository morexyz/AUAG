const known=new Set(['top','idea','assets','relationship','philosophy','strategy','journey','ownership','infrastructure','experience','difference','audience','risks','vision','closing']);
export function parseRoute(hash=''){
 if(hash==='#/studio')return {view:'studio'};
 const slug=hash.match(/^#\/story\/([a-z-]+)$/)?.[1]||hash.match(/^#([a-z-]+)$/)?.[1];
 return {view:'story',chapter:known.has(slug)?slug:'top'};
}
export function createRouter({onRoute}){
 let previous=null;
 function change(){const next=parseRoute(location.hash);onRoute(next,previous);previous=next}
 window.addEventListener('hashchange',change);
 return {start:change,dispose(){window.removeEventListener('hashchange',change)},go(path){location.hash=path}};
}
