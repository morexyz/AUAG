export const config = Object.freeze({
  defaultLanguage:'en',
  hashRouting:true,
  features:Object.freeze({studio:true,worker:true,audio:true,pointer:true,svgMorph:true,scrollMotion:true}),
  performance:Object.freeze({maxCanvasDpr:1.65,maxParticles:220,studioFps:50,workerIntervalMs:130})
});
export const capabilities = Object.freeze({
  waapi:typeof Element!=='undefined'&&!!Element.prototype.animate,
  worker:typeof Worker!=='undefined',
  canvas:typeof HTMLCanvasElement!=='undefined',
  audio:typeof window!=='undefined'&&!!(window.AudioContext||window.webkitAudioContext),
  reducedMotion:typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches,
  pointer:typeof PointerEvent!=='undefined',
  scrollTimeline:typeof CSS!=='undefined'&&CSS.supports?.('animation-timeline: view()')===true
});
