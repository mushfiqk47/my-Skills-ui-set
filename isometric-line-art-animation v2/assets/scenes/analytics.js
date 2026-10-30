SCENES.analytics={label:'Analytics / bars and ring chart',title:'Analytics dashboards',
alt:'Isometric line drawing of a base slab with five rising bars, the tallest solid, and a floating chart plane with a ring chart and a trend line.',
desc:'Metrics that turn into decisions: clean data views, clear hierarchy and charts people actually read.',tags:['Dashboards','Data viz','SaaS','Reporting'],
build(){
 const F=FL(0),Fc=FL(8);
 let L0=plane(rect(-6,-6,6,6),0);
 for(let i=-3;i<=3;i+=3)L0+=sshape(F,[[-6,i],[6,i]],'grid',false)+sshape(F,[[i,-6],[i,6]],'grid',false);
 [2.2,3.6,2.8,6,4.4].forEach((h,i)=>{const x0=-4.6+i*2;L0+=block(x0,.8,x0+1.3,2.1,0,h,i===3?'solid focal':'plane')});
 L0+=tlines(F,-4.6,3.8,8.6,2,.7)+[[-6,-6],[6,-6],[6,6],[-6,6]].map(([x,y])=>node(x,y,0)).join('');
 const arc=Array.from({length:14},(_,i)=>{const t=(-30+i*10)*Math.PI/180;return[1.2+2.2*Math.cos(t),-6+2.2*Math.sin(t)]});
 const L1=plane(rect(-2,-10,6,-2),8)+shape(Fc,circ(1.2,-6,2.2,36),'s2 ln')+shape(Fc,circ(1.2,-6,1.2,28),'s3 ln')+shape(Fc,arc,'trace',false)+tlines(Fc,-1.2,-9.2,3,2,.6)+shape(Fc,[[-1.4,-3],[0,-3.6],[1.4,-3],[2.8,-3.9],[4.2,-3.2],[5.4,-4]],'s2 ln',false)+node(-2,-10,8)+node(6,-2,8);
 return {zoom:1.08,center:[276,210],layers:[L0,L1],dim:[[-6,8,0],[6,8,0]],ann:''};
}};
