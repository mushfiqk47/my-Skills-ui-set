SCENES.dashboard={label:'Dashboard / exploded stack',title:'Healthcare dashboard',
alt:'Isometric line drawing of four floating dashboard layers: a base grid, patient records, a live heart-rate trace and a vitals card with a medical cross.',
desc:'Patient records, vitals and live ECG in one clear view. Hover to pull the layers apart.',tags:['Dashboards','Web apps','Data viz'],
build(){
 const H=6,sq=rect(-H,-H,H,H),F0=FL(0),F1=FL(4.5),F2=FL(9),F3=FL(13.5),cn=[[-H,-H],[H,-H],[H,H],[-H,H]];
 let L0=plane(sq,0);
 for(let i=-3;i<=3;i+=3)L0+=sshape(F0,[[-H,i],[H,i]],'grid',false)+sshape(F0,[[i,-H],[i,H]],'grid',false);
 L0+=cn.map(([x,y])=>node(x,y,0)).join('');
 let L1=plane(sq,4.5)+cells(F1,-3.6,-3.6,6,6,1.2,3);
 for(let i=0;i<3;i++)L1+=shape(F1,[[4.4,-3.4+i*1.2],[5.5-(i%2)*.8,-3.4+i*1.2]],'s3 ln',false);
 L1+=node(H,-H,4.5)+node(-H,H,4.5);
 const ecg=[[-5,0],[-3,0],[-2.6,-.6],[-2.2,0],[-1.2,0],[-.8,1.2],[-.4,-3.2],[0,2],[.4,0],[1.6,0],[2,-.9],[2.6,0],[5,0]].map(([x,y])=>[x,y-.8]);
 const e=P(5,-.8,9);
 let L2=plane(sq,9)+hatch(F2,-5.5,3,5.5,5.2,.5)+shape(F2,ecg,'trace',false)+`<circle class="node" cx="${f(e[0])}" cy="${f(e[1])}" r="3.2"/>`+node(-H,-H,9)+node(H,H,9);
 const a=.7,b=1.9,cx=-2.2,cy=-.2;
 const cross=[[-a,-b],[a,-b],[a,-a],[b,-a],[b,a],[a,a],[a,b],[-a,b],[-a,a],[-b,a],[-b,-a],[-a,-a]].map(([x,y])=>[x+cx,y+cy]);
 let L3=plane(sq,13.5,'plane hero')+shape(F3,cross,'solid focal')+shape(F3,[[1.2,-1.8],[4.8,-1.8]],'s2 ln',false)+shape(F3,[[1.2,-.7],[3.6,-.7]],'s3 ln',false)+shape(F3,[[1.2,.4],[4.2,.4]],'s3 ln',false)+shape(F3,rect(1.2,2.2,4.8,3.6),'s2 ln')+cn.map(([x,y])=>node(x,y,13.5)).join('');
 const [tx,ty]=P(H,-H,13.5);
 return {zoom:1.0,center:[260,183],layers:[L0,L1,L2,L3],dim:[[-6,8.2,0],[6,8.2,0]],
  ann:`<path class="dots" d="M${f(tx+8)} ${f(ty)}L${f(tx+86)} ${f(ty)}"/><path class="node" d="M${f(tx+89)} ${f(ty-3.2)}L${f(tx+92.2)} ${f(ty)}L${f(tx+89)} ${f(ty+3.2)}L${f(tx+85.8)} ${f(ty)}Z"/>${lbl(f(tx+30),f(ty-9),'72 bpm')}`};
}};
