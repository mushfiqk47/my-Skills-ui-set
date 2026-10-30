SCENES.landing={label:'Landing page / curved sheet and bars',title:'Landing pages',

alt:'Isometric line drawing of a page sheet that curves upward from a flat base, with three rising bars standing on it, a logo, a call-to-action button with a cursor on the raised end, and a dotted conversion arrow climbing the left edge to the top.',
build(){
 const h=5,XW=4,sm=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)},zf=y=>h*sm((-y+1)/5);
 const ys=[];for(let y=8;y>=-8;y-=.5)ys.push(y);
 const Lf=ys.map(y=>[-XW,y,zf(y)]),Rt=ys.map(y=>[XW,y,zf(y)]).reverse();
 let s=D3('plane',[...Lf,...Rt]);
 for(let t=-1;t<=4;t+=.25){const y=-t;s+=S3('s3 tex',[[-XW,y,zf(y)],[XW,y,zf(y)]])}
 s+=tlines(FL(0),.4,4.2,3.4,4,.7);
 const F=FL(h);
 s+=shape(F,rect(-3.2,-7.4,3.2,-6.4),'s2 ln')+logo(F,2.3,-6.9,.26)+tlines(F,-3.2,-5.6,4.2,3,.6);
 s+=shape(F,cham(-3.2,-3.9,-.4,-3.3,.2),'s2 ln')+shape(F,[[-2.7,-3.6],[-1.2,-3.6]],'s3 ln',false)+shape(F,[[-1.5,-3.75],[-1.2,-3.6],[-1.5,-3.45]],'s3 ln',false);
 s+=shape(F,[[.1,-3.2],[.1,-4.35],[.5,-3.95],[.85,-4.02],[.35,-3.5]],'s2 ln');
 const route=[[-3.6,6.5,0],[-3.8,2.5,zf(2.5)],[-3.8,-1.5,zf(-1.5)],[-3.7,-5.2,5]];
 s+=S3('dots',route)+route.slice(0,3).map(p=>node(p[0],p[1],p[2])).join('');
 const tp=[-3.7,-5.2,5],pv=[-3.8,-1.5,zf(-1.5)];
 const dv=tp.map((v,i)=>v-pv[i]),n=Math.hypot(...dv),u=dv.map(v=>v/n),pp=[u[1],-u[0],0],b1=tp.map((v,i)=>v-u[i]*.85);
 s+=S3('s3 ln',[tp,b1.map((v,i)=>v+pp[i]*.32)],false)+S3('s3 ln',[tp,b1.map((v,i)=>v-pp[i]*.32)],false);
 s+=[[-XW,8,0],[XW,8,0],[-XW,-8,h],[XW,-8,h]].map(([x,y,z])=>node(x,y,z)).join('');
 let bars=block(-2.4,1,-1.2,2.2,0,6.5,'plane hero')+block(-2.4,2.8,-1.2,4,0,2.8)+block(-2.4,4.6,-1.2,5.8,0,1.8);
 const gp=P(-3.7,-5.2,5);
 return {zoom:1.26,center:[260,225],layers:[s,bars],dim:[[-4,8.8,0],[4,8.8,0]],dimLabel:'8.0 u',
  ann:lbl(f(gp[0]+8),f(gp[1]+16),'+128%')};
}};
