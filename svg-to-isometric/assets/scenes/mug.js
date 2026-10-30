SCENES.mug={
 label:'Mug / isometric cup with rising steam',
 title:'Design Mug',

 
 alt:'Isometric line drawing of a ceramic mug with a curved handle and a label band on its front, a warm drink inside, sitting on a saucer with a spoon beside it, and three rising steam lines on a small square base.',
build(){
  const floor=plane(rect(-7,-7,7,7),0)+
    sshape(FL(0),[[-7,-4],[7,-4]],'grid',false)+
    sshape(FL(0),[[-4,-7],[-4,7]],'grid',false)+
    shape(FL(0),[[5.75,-3.2],[7.0,-2.05]],'s2 ln',false)+
    shape(FL(0),circ(5.5,-3.5,.45,14),'s2 ln');
  const saucer=block(-4.6,-4.1,4.6,4.1,0,.55,'plane');
  const z0=.55,z1=7.4;
  const body=block(-3.2,-2.7,3.2,2.7,z0,z1,'plane hero')+
    shape(WL(2.7),cham(-1.6,3.1,1.6,4.5,.3),'s3 ln')+
    tlines(WL(2.7),-1.15,3.65,2.3,2,.42);
  const top=plane(rect(-3.2,-2.7,3.2,2.7),z1,'plane hero');
  const rim=shape(FL(z1+.05),circ(0,0,2.15,32),'s2 ln')+
    shape(FL(z1+.1),circ(0,0,1.72,32),'s3 ln')+
    shape(FL(z1+.15),circ(0,0,1.48,32),'solid focal');
  const handle=shape(WX(3.2),[...circ(0,4,1.9,24),[0,5.9]],'s2 ln',false)+
    shape(WX(3.2),[[0,5.9],[0,2.1]],'s2 ln',false);
  const steam= S3('trace',[[-1.2,-.4,10.2],[-1.5,-.4,11.2],[-1.2,-.4,12.0],[-1.4,-.4,13.0]])+
    S3('trace',[[0,-.4,10.8],[.3,-.4,11.8],[0,-.4,12.6],[.2,-.4,13.8]])+
    S3('trace',[[1.2,-.4,10.2],[.9,-.4,11.2],[1.2,-.4,12.0],[1.0,-.4,13.0]]);
  return {zoom:1.08,center:[260,204],layers:[floor,saucer+body,top+rim+handle,steam],dim:[[-7,8,0],[7,8,0]],ann:''};
 }
};
