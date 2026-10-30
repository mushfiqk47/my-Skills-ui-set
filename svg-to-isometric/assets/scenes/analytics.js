SCENES.analytics={label:'Analytics / bars and ring chart',title:'Analytics dashboards',

alt:'Isometric line drawing of a base slab with five rising bars joined by a dotted trend line, the tallest solid, a floating chart plane with a ring chart, arc and trend line, and a floating KPI card with a sparkline.',
build(){
 const F=FL(0),Fc=FL(8),Fk=FL(11.5);
 let L0=plane(rect(-6,-6,6,6),0);
 for(let i=-3;i<=3;i+=3)L0+=sshape(F,[[-6,i],[6,i]],'grid',false)+sshape(F,[[i,-6],[i,6]],'grid',false);
 const hs=[2.2,3.6,2.8,6,4.4];
 hs.forEach((h,i)=>{const x0=-4.6+i*2;L0+=block(x0,.8,x0+1.3,2.1,0,h,i===3?'solid focal':'plane')});
 L0+=S3('grid',hs.map((h,i)=>[-4.6+i*2+.65,1.45,h]))+hs.map((h,i)=>node(-4.6+i*2+.65,1.45,h)).join('');
 L0+=tlines(F,-4.6,3.8,8.6,2,.7)+[[-6,-6],[6,-6],[6,6],[-6,6]].map(([x,y])=>node(x,y,0)).join('');
 const arc=Array.from({length:14},(_,i)=>{const t=(-30+i*10)*Math.PI/180;return[1.2+2.2*Math.cos(t),-6+2.2*Math.sin(t)]});
 const L1=plane(rect(-2,-10,6,-2),8)+shape(Fc,circ(1.2,-6,2.2,36),'s2 ln')+shape(Fc,circ(1.2,-6,1.2,28),'s3 ln')+shape(Fc,arc,'trace',false)+tlines(Fc,-1.2,-9.2,3,2,.6)+shape(Fc,[[-1.4,-3],[0,-3.6],[1.4,-3],[2.8,-3.9],[4.2,-3.2],[5.4,-4]],'s2 ln',false)+node(-2,-10,8)+node(6,-2,8);
 const L2=plane(rect(-5.6,-.6,-1.2,2.6),11.5)+tlines(Fk,-5.2,1.9,3.2,1,1,'s2 ln')+shape(Fk,[[-5.2,.4],[-4.5,1.05],[-3.8,.65],[-3.0,1.3],[-2.2,.8],[-1.7,1.45]],'s2 ln',false)+node(-1.7,1.45,11.5)+tlines(Fk,-5.2,-.1,3.8,1,1,'s3 ln');
 const ap=P(1.2,-3.8,8);
 return {zoom:1.08,center:[276,210],layers:[L0,L1,L2],dim:[[-6,8,0],[6,8,0]],
  ann:`<path class="dots" d="M${f(ap[0]+4)} ${f(ap[1]-8)}L${f(ap[0]+38)} ${f(ap[1]-30)}"/>${lbl(f(ap[0]+42),f(ap[1]-33),'+128%')}`};
}};
