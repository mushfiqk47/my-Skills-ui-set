SCENES.engineering={label:'Engineering / thick slab with satellites',title:'Full-stack product engineering',
alt:'Isometric line drawing of a thick hatched slab with an interface on top, linked by dotted connectors to two satellite tiles carrying a hexagon icon and a code icon.',
desc:'From Figma to production: clean integration with your backend and code written by senior developers.',tags:['Next.js','TypeScript','Node.js','React Native','Supabase'],
build(){
 const T=FL(1.4),A=FL(-.8);
 const LA=plane(rect(-10,1.5,-6.2,5.3),-.8)+hexIcon(A,-8.1,3.4,1.2)+node(-10,1.5,-.8)+node(-6.2,5.3,-.8);
 const LB=plane(rect(-1,-10,3,-6),-.8)+codeIcon(A,1,-8,1.1)+node(-1,-10,-.8)+node(3,-6,-.8);
 const LS=block(-5,-3.5,5,3.5,0,1.4,'plane hero',.5)+shape(T,cham(-3.6,-1.2,3.6,2.8,.5),'s2 ln')+shape(T,cham(-2.6,-2.9,2.2,-2,.25),'s2 ln')+shape(T,cham(2.8,-2.9,4.4,-2,.25),'s2 ln')+logo(T,-4,-2.45,.2)+node(-5,3.5,1.4)+node(5,3.5,1.4)+node(5,-3.5,1.4)+node(-5,-3.5,1.4);
 return {zoom:1.5,center:[250,241],layers:[LA,LB,LS],dim:[[-5,6,0],[5,6,0]],dimLabel:'10.0 u',
  ann:S3('dots',[[-5,3.5,0],[-6.2,5.3,-.8]])+S3('dots',[[5,-3.5,0],[3,-6,-.8]])};
}};
