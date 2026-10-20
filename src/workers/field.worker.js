// Worker-only math: generates a scalar procedural field with no DOM access.
self.onmessage=({data:{width=36,height=24,time=0,intensity=.5,mode='noise'}})=>{
 const values=new Uint8Array(width*height);let k=0;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const nx=x/width*7,ny=y/height*6;
  const wave=Math.sin(nx*1.8+time*.7)*Math.cos(ny*1.65-time*.55);
  const fine=Math.sin(nx*4.8-ny*3.1+time*.33)*.2;
  const swirl=Math.sin(Math.hypot(nx-3.5,ny-3)*3-time*1.4)*.34;
  const v=(mode==='flow'?wave*.65+swirl:wave*.48+fine+swirl*.6);
  values[k++]=Math.round(Math.min(255,Math.max(0,(v*.5+.5)*255*intensity+48*(1-intensity))));
 }
 self.postMessage({width,height,values},[values.buffer]);
};
