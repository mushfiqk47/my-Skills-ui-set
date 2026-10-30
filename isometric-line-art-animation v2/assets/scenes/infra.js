SCENES.infra={label:'Infrastructure / server stack',title:'Cloud infrastructure',
alt:'Isometric line drawing of four stacked server slabs with slot lines and indicator lights, joined by dotted connectors, the top one carrying a solid power button.',
desc:'Reliable, observable infrastructure: deploy pipelines, scaling and monitoring set up once and left running.',tags:['AWS','Docker','Kubernetes','CI/CD','Monitoring'],
build(){
 const layers=[],y1=2.8,step=3.6;
 for(let i=0;i<4;i++){
  const z0=i*step,z1=z0+1.2,top=i===3;
  let s='';
  if(i>0)s+=S3('dots',[[5,y1,z0],[5,y1,z0-(step-1.2)]])+node(5,y1,z0)+node(5,y1,z0-(step-1.2));
  s+=block(-5,-2.8,5,y1,z0,z1,top?'plane hero':'plane');
  s+=S3('s3 tex',[[-4,y1,z0+.45],[.5,y1,z0+.45]])+S3('s3 tex',[[-4,y1,z0+.8],[-1,y1,z0+.8]])+node(3.6,y1,z0+.6);
  if(top)s+=shape(FL(z1),cham(-3.5,-1,.5,1,.4),'solid focal')+shape(FL(z1),[[1.8,-.8],[4,-.8]],'s3 ln',false)+shape(FL(z1),[[1.8,.2],[3.4,.2]],'s3 ln',false);
  layers.push(s);
 }
 return {zoom:1.12,center:[260,190],layers,dim:[[-5,4.6,0],[5,4.6,0]],dimLabel:'10.0 u',ann:''};
}};
