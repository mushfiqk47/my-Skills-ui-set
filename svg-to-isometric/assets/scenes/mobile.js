SCENES.mobile={label:'Mobile apps / standing phones',title:'Mobile apps',

alt:'Isometric line drawing of three upright phone screens staggered diagonally on a dotted floor, the front one with a tab bar and a floating notification tile above them.',
build(){
 const F=FL(0);
 let L0=plane(rect(-8,-8,8,8),0);
 for(let i=-6;i<=6.1;i+=3)L0+=sshape(F,[[-8,i],[8,i]],'grid',false)+sshape(F,[[i,-8],[i,8]],'grid',false);
 L0+=[[-8,-8],[8,-8],[8,8],[-8,8]].map(([x,y])=>node(x,y,0)).join('');
 const ph=(y,uo,front)=>{
  const m=WL(y),a=uo-2.5,b=uo+2.5,c=front?'s2 ln':'s3 ln';
  let s=shape(m,cham(a,1,b,10,1),front?'plane hero':'plane')+shape(m,cham(uo-.9,8.9,uo+.9,9.3,.15),c)+tlines(m,a+.6,7.7,3,1,1,c)+shape(m,cham(a+.6,5,b-.6,7,.35),c)+tlines(m,a+.6,4,3.2,2,.7,c)+[-1,0,1].map(k=>shape(m,circ(uo+k*1.3,2.1,.28,10),c)).join('');
  if(front){
   s+=shape(m,cham(a+.6,2.9,b-.6,3.6,.3),'solid focal');
   s+=sshape(m,rect(a+1.1,1.2,a+1.6,1.65),'cell',true,' fill-opacity=".7"');
   [a+2.2,a+3.1,a+4.0].forEach(u=>s+=shape(m,rect(u,1.2,u+.5,1.65),'s3 ln'));
  }
  if(!front&&y===0)s+=shape(m,cham(-1.9,7.7,1.9,8.5,.25),'s2 ln')+shape(m,circ(-1.45,8.1,.15,8),'cell')+tlines(m,-1.05,7.95,2.3,1,1,'s3 ln');
  return s;};
 const Fn=FL(12.5);
 const badge=plane(rect(-1,-7.5,4,-4),12.5)+shape(Fn,circ(.3,-5.75,.55,12),'s2 ln')+sshape(Fn,circ(3.3,-4.7,.3,10),'cell',true,' fill-opacity=".9"')+tlines(Fn,1.3,-6.4,2.2,2,.9)+node(-1,-7.5,12.5)+node(4,-4,12.5);
 return {zoom:1.0,center:[260,206],layers:[L0,ph(-3.5,3.5,false),ph(0,0,false),ph(3.5,-3.5,true),badge],dim:[[-8,9,0],[8,9,0]],dimLabel:'16.0 u',ann:''};
}};
