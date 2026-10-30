SCENES.branding={label:'Branding / logo planes and folded page',title:'Branding',

alt:'Isometric line drawing of three stacked planes: a top plane with a solid pinwheel logo on a registration cross and circle, a faded plane with crop marks behind it, and a folded-corner page with hatching, text lines, swatches and a pen-tool curve with anchors below.',
build(){
 const Fb=FL(3),Fp=(u,v)=>[u+1,v+.5,0],Fh=FL(7);
 const cm=(x,y)=>sshape(Fb,[[x-.55,y],[x+.55,y]],'grid',false)+sshape(Fb,[[x,y-.55],[x,y+.55]],'grid',false);
 const LB=plane(rect(-2,-10,8,-2),3)+logo(Fb,3,-6,.55,false)+cm(1.2,-7.4)+cm(4.8,-7.4)+cm(1.2,-4.6)+cm(4.8,-4.6)+sshape(Fb,cham(-1,-3.9,1.4,-3.2,.2),'cell',true,' fill-opacity=".3"')+sshape(Fb,cham(1.8,-3.9,4.2,-3.2,.2),'cell',true,' fill-opacity=".3"')+node(-2,-10,3)+node(8,-2,3);
 const p0=[-5.2,3.6],c1=[-2.6,4.9],c2=[1.4,4.6],p1=[4.6,2.9];
 const bez=[];for(let i=0;i<=16;i++){const t=i/16,it=1-t;
  bez.push([it*it*it*p0[0]+3*it*it*t*c1[0]+3*it*t*t*c2[0]+t*t*t*p1[0],it*it*it*p0[1]+3*it*it*t*c1[1]+3*it*t*t*c2[1]+t*t*t*p1[1]]);}
 const LP=shape(Fp,[[-6,-5],[6,-5],[6,2],[3,5],[-6,5]],'plane')+shape(Fp,[[6,2],[3,5],[3,2]],'s2 ln')+hatch(Fp,-5.5,-4.5,2.5,-1.5,.3,'h')+tlines(Fp,-5.5,.2,5,4,.8)+shape(Fp,rect(3.2,-4.5,4.2,-3.5),'s3 ln')+sshape(Fp,rect(4.4,-4.5,5.4,-3.5),'cell',true,' fill-opacity=".5"')+sshape(Fp,rect(3.2,-3.2,4.2,-2.2),'cell',true,' fill-opacity=".15"')+sshape(Fp,rect(4.4,-3.2,5.4,-2.2),'cell',true,' fill-opacity=".8"')+shape(Fp,bez,'s2 ln',false)+sshape(Fp,[p0,c1],'grid',false)+sshape(Fp,[p1,c2],'grid',false)+node(p0[0]+1,p0[1]+.5,0)+node(p1[0]+1,p1[1]+.5,0)+node(-5,5.5,0)+node(7,-4.5,0);
 const LH=plane(rect(-5,-5,5,5),7,'plane hero')+sshape(Fh,[[-2.3,0],[2.3,0]],'grid',false)+sshape(Fh,[[0,-2.3],[0,2.3]],'grid',false)+sshape(Fh,circ(0,0,2.5,32),'grid',false)+logo(Fh,0,0,1)+[[-5,-5],[5,-5],[5,5],[-5,5]].map(([x,y])=>node(x,y,7)).join('');
 return {zoom:1.2,center:[291,212],layers:[LB,LP,LH],dim:[[-5,8.2,0],[5,8.2,0]],dimLabel:'10.0 u',ann:''};
}};
