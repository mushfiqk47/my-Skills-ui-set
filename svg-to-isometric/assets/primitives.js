/* ================= PROJECTION + PRIMITIVES ================= */
const U=10,OX=260,OY=250,C30=Math.cos(Math.PI/6);
const P=(x,y,z=0)=>[OX+(x-y)*C30*U,OY+(x+y)*.5*U-z*U];
const f=n=>n.toFixed(1);
const pt=(x,y,z=0)=>{const p=P(x,y,z);return f(p[0])+' '+f(p[1])};
const poly3=(a,close=true)=>'M'+a.map(([x,y,z=0])=>pt(x,y,z)).join('L')+(close?'Z':'');
// D3 = path that draws on (has pathLength=1). S3 = static path (dashed or fading items; never give these pathLength)
const D3=(c,a,close=true,x='')=>`<path class="${c}" pathLength="1" d="${poly3(a,close)}"${x}/>`;
const S3=(c,a,close=false,x='')=>`<path class="${c}" d="${poly3(a,close)}"${x}/>`;
// mappers turn 2D (u,v) into 3D: FL(z) floor plane, WL(y) upright wall facing front-left, WX(x) upright wall facing front-right
const FL=z=>(u,v)=>[u,v,z],WL=y=>(u,v)=>[u,y,v],WX=x=>(u,v)=>[x,u,v];
const shape=(m,pts,c,close=true,x='')=>D3(c,pts.map(([u,v])=>m(u,v)),close,x);
const sshape=(m,pts,c,close=true,x='')=>S3(c,pts.map(([u,v])=>m(u,v)),close,x);
const rect=(x0,y0,x1,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const cham=(x0,y0,x1,y1,c=.3)=>[[x0+c,y0],[x1-c,y0],[x1,y0+c],[x1,y1-c],[x1-c,y1],[x0+c,y1],[x0,y1-c],[x0,y0+c]];
const circ=(cx,cy,r,n=24)=>Array.from({length:n},(_,i)=>{const a=i/n*Math.PI*2;return[cx+r*Math.cos(a),cy+r*Math.sin(a)]});
const node=(x,y,z=0)=>{const [px,py]=P(x,y,z);return `<path class="node" d="M${f(px)} ${f(py-3.2)}L${f(px+3.2)} ${f(py)}L${f(px)} ${f(py+3.2)}L${f(px-3.2)} ${f(py)}Z"/>`};
const dot=(x,y)=>`<circle class="solid" cx="${x}" cy="${y}" r="4"/>`;
const lbl=(x,y,t,a='')=>`<text class="lbl" x="${x}" y="${y}"${a}>${t}</text>`;
let TH=0; // plane thickness, solid style only
const plane=(a,z,c='plane')=>{
  let s='';
  if(TH){const x0=a[0][0],y0=a[0][1],x1=a[2][0],y1=a[2][1];
    s+=D3('face face-l',[[x0,y1,z],[x1,y1,z],[x1,y1,z-TH],[x0,y1,z-TH]]);
    s+=D3('face face-r',[[x1,y0,z],[x1,y1,z],[x1,y1,z-TH],[x1,y0,z-TH]]);}
  return s+shape(FL(z),a,c);
};
// block: thick box (all styles). hs = optional hatch step on both visible faces
const block=(x0,y0,x1,y1,z0,z1,c='plane',hs=0)=>{
  let s=D3('face face-l',[[x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0]])+D3('face face-r',[[x1,y0,z1],[x1,y1,z1],[x1,y1,z0],[x1,y0,z0]]);
  if(hs){
    for(let x=x0+hs;x<x1-.01;x+=hs)s+=S3('s3 tex',[[x,y1,z0+.15],[x,y1,z1-.15]]);
    for(let y=y0+hs;y<y1-.01;y+=hs)s+=S3('s3 tex',[[x1,y,z0+.15],[x1,y,z1-.15]]);}
  return s+shape(FL(z1),rect(x0,y0,x1,y1),c);
};
// text-like lines along u, stepping in v
const tlines=(m,u,v,w,n=3,gap=1,c='s3 ln')=>{let s='';for(let i=0;i<n;i++){const k=w*[1,.65,.85,.5,.75][i%5];s+=shape(m,[[u,v+i*gap],[u+k,v+i*gap]],c,false)}return s};
// pixel-cell grid (static, fades in)
const cells=(m,u0,v0,cols,rows,sz,seed=3,c='cell')=>{
  const lv=[0,.12,.3,.65,0,.2,.45,0,.12,.8];let k=seed,s='';
  for(let r=0;r<rows;r++)for(let q=0;q<cols;q++){k=(k*7+5)%97;const u=u0+q*sz,v=v0+r*sz;
    s+=sshape(m,rect(u+sz*.08,v+sz*.08,u+sz*.92,v+sz*.92),c,true,` fill-opacity="${lv[k%lv.length]}"`)}
  return s};
// hatch lines across a rectangle; dir 'v' = lines of constant u, 'h' = lines of constant v
const hatch=(m,u0,v0,u1,v1,step,dir='v')=>{let s='';
  if(dir==='v')for(let u=u0+step;u<u1-.01;u+=step)s+=sshape(m,[[u,v0],[u,v1]],'s3 tex',false);
  else for(let v=v0+step;v<v1-.01;v+=step)s+=sshape(m,[[u0,v],[u1,v]],'s3 tex',false);
  return s};
// glyphs: pinwheel logo, hex (cube) icon, code chevrons
const logo=(m,cx,cy,s=1,focal=true)=>{
  const R=[(x,y)=>[x,y],(x,y)=>[-y,x],(x,y)=>[-x,-y],(x,y)=>[y,-x]];
  return R.map(g=>{const p=cham(.15,-1,1.9,-.1,.28).map(([x,y])=>{const [a,b]=g(x,y);return[cx+a*s,cy+b*s]});
    return focal?shape(m,p,'solid focal'):sshape(m,p,'cell',true,' fill-opacity=".35"')}).join('')};
const hexIcon=(m,cx,cy,r)=>{const h=circ(cx,cy,r,6);
  return shape(m,h,'s2 ln')+[0,2,4].map(i=>shape(m,[[cx,cy],h[i]],'s3 ln',false)).join('')};
const codeIcon=(m,cx,cy,s=1)=>
  shape(m,[[cx-.4*s,cy-.9*s],[cx-1.3*s,cy],[cx-.4*s,cy+.9*s]],'s2 ln',false)+
  shape(m,[[cx+.4*s,cy-.9*s],[cx+1.3*s,cy],[cx+.4*s,cy+.9*s]],'s2 ln',false)+
  shape(m,[[cx+.25*s,cy-1*s],[cx-.25*s,cy+1*s]],'s3 ln',false);
