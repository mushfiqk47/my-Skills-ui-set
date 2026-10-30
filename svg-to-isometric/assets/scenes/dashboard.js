SCENES.dashboard={label:'Dashboard / exploded stack',title:'Healthcare dashboard',

alt:'Isometric line drawing of four floating dashboard layers: a base grid, patient records with a header bar, a live heart-rate trace with a second vitals line, and a vitals card with a medical cross and a capsule pill.',
build(){
 const H=6,sq=rect(-H,-H,H,H),F0=FL(0),F1=FL(4.5),F2=FL(9),F3=FL(13.5),cn=[[-H,-H],[H,-H],[H,H],[-H,H]];
 let L0=plane(sq,0);
 for(let i=-3;i<=3;i+=3)L0+=sshape(F0,[[-H,i],[H,i]],'grid',false)+sshape(F0,[[i,-H],[i,H]],'grid',false);
 L0+=cn.map(([x,y])=>node(x,y,0)).join('');
 let L1=plane(sq,4.5)+shape(F1,cham(-4.6,4.1,4.6,5,.3),'s2 ln')+cells(F1,-3.6,-3.6,6,6,1.2,3);
 [-3.4,-1.6,.2,2].forEach(u=>L1+=shape(F1,[[u,4.3],[u+.9,4.3]],'s3 ln',false));
 for(let i=0;i<3;i++)L1+=shape(F1,[[4.4,-3.4+i*1.2],[5.5-(i%2)*.8,-3.4+i*1.2]],'s3 ln',false);
 L1+=node(H,-H,4.5)+node(-H,H,4.5);
 const ecg=[[-5,0],[-3,0],[-2.6,-.6],[-2.2,0],[-1.2,0],[-.8,1.2],[-.4,-3.2],[0,2],[.4,0],[1.6,0],[2,-.9],[2.6,0],[5,0]].map(([x,y])=>[x,y-.8]);
 const spo=[[-5,2.4],[-2.2,2.4],[-1.6,2.85],[-1,2.4],[2.2,2.4],[2.7,2.7],[3.2,2.4],[5,2.4]];
 const e=P(5,-.8,9),p2=P(5,2.4,9);
 let L2=plane(sq,9)+hatch(F2,-5.5,3,5.5,5.2,.5)+shape(F2,ecg,'trace',false)+shape(F2,spo,'s3 ln',false)+`<circle class="node" cx="${f(e[0])}" cy="${f(e[1])}" r="3.2"/>`+node(-H,-H,9)+node(H,H,9);
 const a=.7,b=1.9,cx=-2.2,cy=-.2;
 const cross=[[-a,-b],[a,-b],[a,-a],[b,-a],[b,a],[a,a],[a,b],[-a,b],[-a,a],[-b,a],[-b,-a],[-a,-a]].map(([x,y])=>[x+cx,y+cy]);
 let L3=plane(sq,13.5,'plane hero')+shape(F3,cross,'solid focal')+shape(F3,cham(1.2,1.1,2.7,1.8,.3),'s2 ln')+shape(F3,[[1.95,1.1],[1.95,1.8]],'s3 ln',false)+shape(F3,[[1.2,-1.8],[4.8,-1.8]],'s2 ln',false)+shape(F3,[[1.2,-.7],[3.6,-.7]],'s3 ln',false)+shape(F3,[[1.2,.4],[4.2,.4]],'s3 ln',false)+shape(F3,rect(1.2,2.2,4.8,3.6),'s2 ln')+cn.map(([x,y])=>node(x,y,13.5)).join('');
 const [tx,ty]=P(H,-H,13.5);
 return {zoom:1.0,center:[260,183],layers:[L0,L1,L2,L3],dim:[[-6,8.2,0],[6,8.2,0]],
  ann:`<path class="dots" d="M${f(tx+8)} ${f(ty)}L${f(tx+86)} ${f(ty)}"/><path class="node" d="M${f(tx+89)} ${f(ty-3.2)}L${f(tx+92.2)} ${f(ty)}L${f(tx+89)} ${f(ty+3.2)}L${f(tx+85.8)} ${f(ty)}Z"/>${lbl(f(tx+30),f(ty-9),'72 bpm')}${lbl(f(p2[0]+6),f(p2[1]-4),'spo2 98')}`};
}};
