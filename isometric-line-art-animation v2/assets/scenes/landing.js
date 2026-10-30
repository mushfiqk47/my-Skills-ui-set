SCENES.landing={label:'Landing page / curved sheet and bars',title:'Landing pages',
alt:'Isometric line drawing of a page sheet that curves upward from a flat base, with three rising bars standing on it and a logo and text lines on the raised end.',
desc:'High-converting pages with custom visuals and motion, built to turn visits into signups and booked demos.',tags:['Figma','Framer','Webflow','Next.js','Marketing pages'],
build(){
 const h=5,XW=4,sm=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)},zf=y=>h*sm((-y+1)/5);
 const ys=[];for(let y=8;y>=-8;y-=.5)ys.push(y);
 const Lf=ys.map(y=>[-XW,y,zf(y)]),Rt=ys.map(y=>[XW,y,zf(y)]).reverse();
 let s=D3('plane',[...Lf,...Rt]);
 for(let t=-1;t<=4;t+=.25){const y=-t;s+=S3('s3 tex',[[-XW,y,zf(y)],[XW,y,zf(y)]])}
 s+=tlines(FL(0),.4,4.2,3.4,4,.7);
 const F=FL(h);
 s+=shape(F,rect(-3.2,-7.4,3.2,-6.4),'s2 ln')+logo(F,2.3,-6.9,.26)+tlines(F,-3.2,-5.6,4.2,3,.6)+shape(F,cham(-3.2,-3.9,-.4,-3.3,.2),'s3 ln');
 s+=[[-XW,8,0],[XW,8,0],[-XW,-8,h],[XW,-8,h]].map(([x,y,z])=>node(x,y,z)).join('');
 let bars=block(-2.4,1,-1.2,2.2,0,6.5,'plane hero')+block(-2.4,2.8,-1.2,4,0,2.8)+block(-2.4,4.6,-1.2,5.8,0,1.8);
 return {zoom:1.26,center:[260,225],layers:[s,bars],dim:[[-4,8.8,0],[4,8.8,0]],dimLabel:'8.0 u',ann:''};
}};
