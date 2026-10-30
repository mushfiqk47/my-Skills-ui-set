SCENES.windows={label:'Websites / standing windows',title:'Full websites',
alt:'Isometric line drawing of five upright browser windows standing in a row on a dotted floor, the front one showing window controls, an address pill and a logo.',
desc:'Custom websites built from scratch for your brand: every animation, visual and interaction designed and coded to fit.',tags:['Figma','Framer','Webflow','Next.js','CMS websites'],
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
  if(i===3||i===2)s+=logo(m,3.8,3.2,.4,false);
  if(front)s+=logo(m,0,3.4,.9)+shape(m,cham(-1.4,1,1.4,1.5,.2),'s2 ln')+shape(m,circ(-3.6,4.2,.5,14),'s3 ln')+tlines(m,2,4.6,2.4,3,.5)+node(-W,y,7)+node(W,y,7);
  layers.push(s);
 });
 return {zoom:1.15,center:[260,227],layers,dim:[[-7,8,0],[7,8,0]],dimLabel:'14.0 u',ann:''};
}};
