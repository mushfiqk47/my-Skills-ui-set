SCENES.mug={
 label:'Mug / isometric cup with rising steam',
 title:'Design Mug',
 alt:'Isometric line drawing of a ceramic mug with a curved handle, a warm drink, and three rising steam lines on a small square base.',
 desc:'A small study in form, balance and warmth.',
 tags:['Object study','Isometric','Line art'],
 build(){
  const floor=plane(rect(-7,-7,7,7),0)+
    sshape(FL(0),[[-7,-4],[7,-4]],'grid',false)+
    sshape(FL(0),[[-4,-7],[-4,7]],'grid',false);
  const z0=1,z1=7.2;
  const body=block(-3.2,-2.7,3.2,2.7,z0,z1,'plane hero');
  const top=plane(rect(-3.2,-2.7,3.2,2.7),z1,'plane hero');
  const rim=shape(FL(z1+.04),circ(0,0,2.15,32),'s2 ln')+
    shape(FL(z1+.06),circ(0,0,1.72,32),'s3 ln')+
    shape(FL(z1+.08),circ(0,0,1.48,32),'solid focal');
  const handle=shape(WX(3.2),[...circ(0,4.2,1.9,24),[0,6.1]],'s2 ln',false)+
    shape(WX(3.2),[[0,6.1],[0,2.3]],'s2 ln',false);
  const steam= S3('trace',[[-1.2,-.4,10],[-1.5,-.4,10.8],[-1.2,-.4,11.5],[-1.4,-.4,12.2]])+
    S3('trace',[[0,-.4,10],[.3,-.4,10.8],[0,-.4,11.5],[.2,-.4,12.2]])+
    S3('trace',[[1.2,-.4,10],[.9,-.4,10.8],[1.2,-.4,11.5],[1,-.4,12.2]]);
  return {zoom:1.08,center:[260,204],layers:[floor,body,top+rim+handle,steam],dim:[[-7,8,0],[7,8,0]],ann:''};
 }
};
