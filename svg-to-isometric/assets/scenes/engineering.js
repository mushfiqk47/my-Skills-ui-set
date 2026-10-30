SCENES.engineering={label:'Engineering / thick slab with satellites',title:'Full-stack product engineering',

alt:'Isometric line drawing of a thick hatched slab carrying a browser interface, a terminal panel and a git branch, linked by dotted connectors with deploy arrows to two satellite tiles carrying a hexagon icon and a code icon.',
build(){
 const T=FL(1.4),A=FL(-.8);
 const LA=plane(rect(-10,1.5,-6.2,5.3),-.8)+hexIcon(A,-8.1,3.4,1.2)+sshape(A,circ(-8.1,3.4,1.85,28),'grid',false)+node(-10,1.5,-.8)+node(-6.2,5.3,-.8);
 const LB=plane(rect(-1,-10,3,-6),-.8)+codeIcon(A,1,-8,1.1)+sshape(A,circ(1,-8,1.7,28),'grid',false)+node(-1,-10,-.8)+node(3,-6,-.8);
 const LS=block(-5,-3.5,5,3.5,0,1.4,'plane hero',.5)
  +shape(T,cham(-3.6,-1.2,3.6,2.8,.5),'s2 ln')
  +[-3.0,-2.4,-1.8].map(u=>shape(T,circ(u,2.45,.14,8),'s3 ln')).join('')
  +shape(T,[[-3.2,2.05],[3.2,2.05]],'s3 ln',false)
  +tlines(T,-3.0,1.75,4.6,3,.55)
  +shape(T,cham(-2.4,-2.95,2.0,-2.05,.2),'s2 ln')
  +shape(T,[[-2.0,-2.72],[-.9,-2.72]],'s3 ln',false)+shape(T,[[-2.0,-2.42],[-1.3,-2.42]],'s3 ln',false)+shape(T,[[-2.28,-2.72],[-2.08,-2.57],[-2.28,-2.42]],'s3 ln',false)
  +shape(T,circ(3.3,-2.6,.22,12),'s2 ln')+shape(T,circ(4.15,-2.35,.22,12),'s2 ln')
  +shape(T,[[3.3,-2.6],[3.7,-2.47],[4.15,-2.35]],'s3 ln',false)+shape(T,[[3.3,-2.6],[3.3,-2.2]],'s3 ln',false)
  +logo(T,-4,-2.45,.2)
  +node(-5,3.5,1.4)+node(5,3.5,1.4)+node(5,-3.5,1.4)+node(-5,-3.5,1.4);
 const tp=[3,-6,-.8],pv=[5,-3.5,0];
 const dv=tp.map((v,i)=>v-pv[i]),n=Math.hypot(...dv),u=dv.map(v=>v/n),pp=[u[1],-u[0],0],b1=tp.map((v,i)=>v-u[i]*.85);
 const head=S3('s3 ln',[tp,b1.map((v,i)=>v+pp[i]*.32)],false)+S3('s3 ln',[tp,b1.map((v,i)=>v-pp[i]*.32)],false);
 const lp=P(4.2,-4.9,-.3);
 return {zoom:1.5,center:[250,241],layers:[LA,LB,LS],dim:[[-5,6,0],[5,6,0]],dimLabel:'10.0 u',
  ann:S3('dots',[[-5,3.5,0],[-6.2,5.3,-.8]])+S3('dots',[[5,-3.5,0],[3,-6,-.8]])+head+lbl(f(lp[0]+6),f(lp[1]+2),'v2.4.1')};
}};
