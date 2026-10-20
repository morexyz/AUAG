import {config,capabilities} from '../../config.js';
const GOLD=[226,184,112],SILVER=[176,213,227];
export function createFieldRenderer({canvas,stage}){
 const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)return {start(){},stop(){},dispose(){},setMode(){},setIntensity(){},setPaused(){},get paused(){return true}};
 let width=0,height=0,dpr=1,frame=0,active=false,paused=false,last=0,mode='particles',intensity=.55,time=0,grid=null,worker=null,awaiting=false,lastWorker=0;
 const pointers=new Map(),particles=[],off=[];
 function resize(){const b=stage.getBoundingClientRect();dpr=Math.min(config.performance.maxCanvasDpr,devicePixelRatio||1);width=Math.max(2,b.width);height=Math.max(2,b.height);canvas.width=Math.floor(width*dpr);canvas.height=Math.floor(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);initParticles()}
 function rand(i,n=1){return (Math.sin(i*127.31*n)*43758.5453)%1}
 function initParticles(){particles.length=0;const count=Math.min(config.performance.maxParticles,Math.max(95,Math.floor(width*height/2100)));for(let i=0;i<count;i++)particles.push({x:Math.abs(rand(i+1,1))*width,y:Math.abs(rand(i+3,4))*height,vx:0,vy:0,r:1.1+Math.abs(rand(i+5,8))*2.8,phase:Math.abs(rand(i+7,12))*6.3,s:i%2})}
 function makeWorker(){if(!config.features.worker||!capabilities.worker)return;
 try{if(window.__AUAG_WORKER_SOURCE__){const url=URL.createObjectURL(new Blob([window.__AUAG_WORKER_SOURCE__],{type:'text/javascript'}));worker=new Worker(url);URL.revokeObjectURL(url)}else worker=new Worker(new URL('../../workers/field.worker.js',import.meta.url),{type:'module'});
 worker.onmessage=({data})=>{grid=data;awaiting=false};worker.onerror=()=>{worker?.terminate();worker=null;awaiting=false};}catch{worker=null}
 }
 function onPointer(e){const bounds=stage.getBoundingClientRect();pointers.set(e.pointerId,{x:e.clientX-bounds.left,y:e.clientY-bounds.top,pressure:e.pressure||.45,tiltX:e.tiltX||0,tiltY:e.tiltY||0});}
 function down(e){stage.setPointerCapture?.(e.pointerId);onPointer(e)}function up(e){pointers.delete(e.pointerId)}
 function attach(){const events=[['pointerdown',down],['pointermove',onPointer],['pointerup',up],['pointercancel',up],['pointerleave',up]];events.forEach(([name,fn])=>{stage.addEventListener(name,fn,{passive:true});off.push(()=>stage.removeEventListener(name,fn))})}
 function fieldValue(x,y){const dx=x/width*6.6,dy=y/height*6.6;return Math.sin(dx*1.9+time*.75)*Math.cos(dy*1.7-time*.63)+Math.sin(dx*3.3-dy*2.5+time*.38)*.24}
 function drawBackdrop(){ctx.fillStyle='#091117';ctx.fillRect(0,0,width,height);const grad=ctx.createRadialGradient(width*.5,height*.45,10,width*.5,height*.48,Math.max(width,height)*.65);grad.addColorStop(0,'#1b2a31');grad.addColorStop(.6,'#101a21');grad.addColorStop(1,'#081116');ctx.fillStyle=grad;ctx.fillRect(0,0,width,height)}
 function drawGrid(){ctx.lineWidth=.6;ctx.strokeStyle='rgba(174,194,201,.11)';const step=Math.max(42,Math.min(75,width/17));ctx.beginPath();for(let x=0;x<width;x+=step){ctx.moveTo(x,0);ctx.lineTo(x,height)}for(let y=0;y<height;y+=step){ctx.moveTo(0,y);ctx.lineTo(width,y)}ctx.stroke()}
 function drawParticleMode(dt){ctx.globalCompositeOperation='lighter';for(const p of particles){const influence=[...pointers.values()];let ax=Math.sin(p.y*.006+time*.45+p.phase)*.045,ay=Math.cos(p.x*.008-time*.4+p.phase)*.055;
 for(const q of influence){const dx=q.x-p.x,dy=q.y-p.y,dist=Math.sqrt(dx*dx+dy*dy)+.01;const radius=140+Math.abs(q.tiltX)*1.3+Math.abs(q.tiltY)*.7;if(dist<radius){const power=(1-dist/radius)*(q.pressure+.35)*.7;ax+=dx/dist*power;ay+=dy/dist*power}}
 if(pointers.size>1){ax+=(width/2-p.x)*.00009;ay+=(height/2-p.y)*.00009}
 p.vx=(p.vx+ax*dt)*.955;p.vy=(p.vy+ay*dt)*.955;p.x+=p.vx*dt;p.y+=p.vy*dt;
 if(p.x<0)p.x=width;if(p.x>width)p.x=0;if(p.y<0)p.y=height;if(p.y>height)p.y=0;
 const c=p.s?SILVER:GOLD;ctx.fillStyle=`rgba(${c.join(',')},${.28+intensity*.55})`;ctx.beginPath();ctx.arc(p.x,p.y,p.r*(.85+intensity*.6),0,Math.PI*2);ctx.fill();
 }
 ctx.globalCompositeOperation='source-over';for(const q of pointers.values()){const glow=ctx.createRadialGradient(q.x,q.y,0,q.x,q.y,160);glow.addColorStop(0,'rgba(234,207,153,.24)');glow.addColorStop(1,'rgba(234,207,153,0)');ctx.fillStyle=glow;ctx.fillRect(q.x-160,q.y-160,320,320)}
 }
 function drawFlowMode(){ctx.lineWidth=1;const spacing=19,n=Math.floor(width/spacing);for(let j=0;j<Math.floor(height/spacing);j++)for(let i=0;i<n;i++){
 const x=i*spacing+9,y=j*spacing+10;const wave=fieldValue(x,y);const angle=wave*2.8;const length=(5+intensity*13)*(1+Math.abs(wave)*.3);const isGold=wave>0;ctx.strokeStyle=isGold?`rgba(229,183,110,${.12+Math.abs(wave)*.47})`:`rgba(160,211,225,${.12+Math.abs(wave)*.47})`;ctx.beginPath();ctx.moveTo(x-Math.cos(angle)*length*.5,y-Math.sin(angle)*length*.5);ctx.lineTo(x+Math.cos(angle)*length*.5,y+Math.sin(angle)*length*.5);ctx.stroke();}
 drawPointerHalos()}
 function drawNoiseMode(){if(grid){const gx=grid.width,gy=grid.height,cw=width/gx,ch=height/gy;let k=0;for(let y=0;y<gy;y++)for(let x=0;x<gx;x++){const v=grid.values[k++]/255;const c=v>.48?GOLD:SILVER;const alpha=.1+Math.abs(v-.5)*intensity*.75;ctx.fillStyle=`rgba(${c.join(',')},${alpha})`;ctx.fillRect(x*cw+.8,y*ch+.8,cw-1.6,ch-1.6)}}else{for(let y=0;y<height;y+=17)for(let x=0;x<width;x+=17){const v=fieldValue(x,y);ctx.fillStyle=v>0?'rgba(222,184,113,.27)':'rgba(166,205,222,.2)';ctx.fillRect(x,y,15,15)}}drawPointerHalos()}
 function drawPointerHalos(){for(const q of pointers.values()){ctx.beginPath();ctx.strokeStyle='rgba(250,221,163,.72)';ctx.lineWidth=1.2;ctx.arc(q.x,q.y,35+Math.abs(q.tiltX)+q.pressure*55,0,Math.PI*2);ctx.stroke()}}
 function tick(now){if(!active||paused)return;frame=requestAnimationFrame(tick);if(now-last<1000/config.performance.studioFps)return;
 const dt=Math.min(2.1,Math.max(.4,(now-last)/16.6||1));last=now;time+=dt*.016;drawBackdrop();drawGrid();if(mode==='particles')drawParticleMode(dt);else if(mode==='flow')drawFlowMode();else drawNoiseMode();
 if(worker&&mode==='noise'&&!awaiting&&now-lastWorker>config.performance.workerIntervalMs){lastWorker=now;awaiting=true;worker.postMessage({width:40,height:26,time,intensity,mode})}
 }
 resize();attach();makeWorker();const observer=new ResizeObserver(()=>resize());observer.observe(stage);
 return {start(){if(active&&!paused)return;active=true;paused=false;last=0;frame=requestAnimationFrame(tick)},stop(){active=false;cancelAnimationFrame(frame)},setPaused(v){paused=v;cancelAnimationFrame(frame);if(!v&&active){last=0;frame=requestAnimationFrame(tick)}},get paused(){return paused},setMode(v){mode=v;grid=null;},setIntensity(v){intensity=Math.max(.1,Math.min(1,v))},dispose(){active=false;cancelAnimationFrame(frame);worker?.terminate();observer.disconnect();off.forEach(f=>f());pointers.clear()}}
}
