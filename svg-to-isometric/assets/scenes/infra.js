SCENES.infra={label:'Infrastructure / server stack',title:'Cloud infrastructure',

alt:'Isometric line drawing of four stacked server slabs with slot lines, indicator lights and an uptime bar chart, joined by dotted connectors, the top one carrying a solid power button, with a cloud outline floating above on a dotted link.',
build(){
 const layers=[],y1=2.8,step=3.6;
 for(let i=0;i<4;i++){
  const z0=i*step,z1=z0+1.2,top=i===3;
  let s='';
  if(i>0)s+=S3('dots',[[5,y1,z0],[5,y1,z0-(step-1.2)]])+node(5,y1,z0)+node(5,y1,z0-(step-1.2));
  s+=block(-5,-2.8,5,y1,z0,z1,top?'plane hero':'plane');
  s+=S3('s3 tex',[[-4,y1,z0+.45],[.5,y1,z0+.45]])+S3('s3 tex',[[-4,y1,z0+.8],[-1,y1,z0+.8]])+node(3.6,y1,z0+.6);
  if(top){
   s+=shape(FL(z1),cham(-3.5,-1,.5,1,.4),'solid focal')+shape(FL(z1),[[1.8,-.8],[4,-.8]],'s3 ln',false);
   s+=shape(FL(z1),[[1.8,.35],[4.2,.35]],'s3 ln',false);
   [.35,.55,.45,.7].forEach((k,j)=>s+=S3('s3 ln',[[2.1+j*.5,.35,z1],[2.1+j*.5,.35+k]],false));
  }
  layers.push(s);
 }
 const bp=[[-25,18],[0,25],[25,18]],cb=84,cl=[];
 for(let x=-46;x<=46.01;x+=4){let e=0;bp.forEach(([c,r])=>{const d=r*r-(x-c)*(x-c);if(d>0)e=Math.max(e,Math.sqrt(d))});cl.push(f(260+x)+' '+f(cb-e))}
 const cloud='<path class="s2 ln" pathLength="1" d="M'+cl.join('L')+'Z"/>'
  +'<path class="dots" d="M232 86L232 118"/>'
  +'<path class="node" d="M232 114.8L235.2 118L232 121.2L228.8 118Z"/>';
 layers.push(cloud);
 return {zoom:1.12,center:[260,169],layers,dim:[[-5,4.6,0],[5,4.6,0]],dimLabel:'10.0 u',
  ann:lbl('320','102','99.99%')};
}};
