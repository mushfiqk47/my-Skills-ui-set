SCENES.siteops={
 label:'Site operations / browser control',
 title:'Site Operations',
 alt:'Isometric browser window with a globe in the page and a settings gear overlapping its lower-right edge.',
 desc:'A browser frame holds a mapped globe. Its settings gear sits forward, showing the controls behind a managed web presence.',
 tags:['Web Ops','CMS','Site Settings'],
 build(){
  const W=5.5,H=8.5,yBack=-1.4,yFront=-2.1;
  const F=FL(0),back=WL(yBack),front=WL(yFront),gearFace=WL(yFront-.14);
  let floor=plane(rect(-9,-9,9,9),0);
  for(let i=-6;i<=6;i+=3){
   floor+=sshape(F,[[-9,i],[9,i]],'grid',false)+sshape(F,[[i,-9],[i,9]],'grid',false);
  }
  floor+=[[-9,-9],[9,-9],[9,9],[-9,9]].map(([x,y])=>node(x,y,0)).join('');

  let casing=shape(back,cham(-W,0,W,H,.45),'plane');
  casing+=S3('s2 ln',[[-W,yBack,0],[-W,yFront,0]])+
          S3('s2 ln',[[W,yBack,0],[W,yFront,0]])+
          S3('s2 ln',[[-W,yBack,H],[-W,yFront,H]])+
          S3('s2 ln',[[W,yBack,H],[W,yFront,H]]);

  let page=shape(front,cham(-W,0,W,H,.45),'plane hero');
  page+=shape(front,[[-W,7.1],[W,7.1]],'s2 ln',false);
  [-4.65,-4.1,-3.55].forEach(x=>page+=shape(front,circ(x,7.8,.13,10),'s3 ln'));
  page+=shape(front,cham(-2.8,7.55,3.25,8.05,.17),'s2 ln');
  page+=shape(front,[[-2.15,7.8],[2.2,7.8]],'s3 ln',false);
  page+=shape(front,[[3.85,7.35],[4.65,8.15],[4.65,7.45]],'s2 ln',false);
  page+=shape(front,[[3.75,8.15],[4.65,8.15],[4.65,7.25]],'s2 ln',false);

  const gx=-1.35,gy=4.35,gr=1.68;
  const ellipse=(cx,cy,rx,ry,n=28)=>Array.from({length:n},(_,i)=>{
   const a=i/n*Math.PI*2;return[cx+rx*Math.cos(a),cy+ry*Math.sin(a)];
  });
  page+=shape(front,circ(gx,gy,gr,32),'s2 ln');
  page+=shape(front,ellipse(gx,gy,gr*.48,gr),'s3 ln');
  page+=shape(front,ellipse(gx,gy-.53,gr*.83,.38),'s3 ln');
  page+=shape(front,ellipse(gx,gy+.53,gr*.83,.38),'s3 ln');
  page+=tlines(front,2.45,5.55,1.75,3,.62,'s3 ln');
  page+=tlines(front,2.45,2.0,1.25,2,.62,'s3 ln');

  const cx=1.05,cy=3.12,teeth=8,gear=[];
  for(let i=0;i<teeth*4;i++){
   const a=-Math.PI/2+i/(teeth*4)*Math.PI*2;
   const r=(i%4===1||i%4===2)?1.12:.82;
   gear.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);
  }
  const gearLayer=shape(gearFace,gear,'solid focal')+
                  shape(gearFace,circ(cx,cy,.38,24),'plane');
  const dim=[[-9,-10,0],[9,-10,0]];
  return {zoom:1.08,center:[260,230],layers:[floor,casing,page,gearLayer],dim,dimLabel:'18.0 u'};
 }
};
