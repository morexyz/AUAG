export function createEventBus(){
 const handlers=new Map();
 return {
  on(event,fn){if(!handlers.has(event))handlers.set(event,new Set());handlers.get(event).add(fn);return()=>handlers.get(event)?.delete(fn)},
  emit(event,payload){for(const fn of [...(handlers.get(event)||[])])fn(payload)},
  clear(){handlers.clear()}
 };
}
