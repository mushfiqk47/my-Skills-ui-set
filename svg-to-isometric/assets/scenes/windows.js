SCENES.windows={label:'Websites / standing windows',title:'Full websites',

alt:'Isometric line drawing of five upright browser windows standing in a row on a dotted floor, the front one showing window controls, an address pill, nav links, a hero image placeholder, headline lines and a call-to-action button.',
build(){
 const F=FL(0),H=7,W=5;
 let L0=plane(rect(-H,-H,H,H),0);
 for(let i=-5.25;i<=5.26;i+=1.75)L0+=sshape(F,[[-H,i],[H,i]],'grid',false)+sshape(F,[[i,-H],[i,H]],'grid',false);
 L0+=[[-H,-H],[H,-H],[H,H],[-H,H]].map(([x,y])=>node(x,y,0)).join('');
 const layers=[L0];
 [-5,-2.5,0,2.5,5].forEach((y,i)=>{
  const m=WL(y),front=i===4,c=front?'s2 ln':'s3 ln';
  let s=shape(m,rect(-W,0,W,7),front?'plane hero':'plane');
  if(!front)s+=hatch(m,2.4,0,W,5.6,.4);
  s+=[-4.3,-3.8,-3.3].map(u=>shape(m,circ(u,6.35,.2,10),c)).join('')+shape(m,cham(-2.4,6,2.8,6.7,.25),c);
  if(front)s+=tlines(m,-1.9,6.24,2.4,1,1,'s3 ln');
  [3.5,4.05,4.6].forEach(u=>s+=shape(m,[[u,6.3],[u+.3,6.3]],'s3 ln',false));
  if(i===3||i===2)s+=logo(m,3.8,3.2,.4,false);
  if(front){
   s+=shape(m,rect(-4.3,2.6,-1.5,5.5),'s2 ln');
   s+=shape(m,[[-4.0,2.95],[-3.2,4.1],[-2.6,3.55],[-1.8,4.75]],'s3 ln',false)+shape(m,circ(-1.95,5.05,.22,10),'s3 ln');
   s+=tlines(m,-.9,5.2,4.4,2,.6,'s2 ln');
   s+=tlines(m,-.9,3.7,3.4,2,.5);
   s+=shape(m,cham(-.9,2.5,1.3,3.2,.25),'s2 ln');
   s+=shape(m,[[-.4,2.85],[.5,2.85]],'s3 ln',false)+shape(m,[[.3,2.7],[.5,2.85],[.3,3.0]],'s3 ln',false);
   s+=logo(m,3.3,1.7,.42);
   s+=shape(m,[[-4.3,.6],[4.3,.6]],'s3 ln',false);
   s+=node(-W,y,7)+node(W,y,7);
  }
  layers.push(s);
 });
 return {zoom:1.15,center:[260,227],layers,dim:[[-7,8,0],[7,8,0]],dimLabel:'14.0 u',ann:''};
}};
