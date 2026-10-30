SCENES.branding={label:'Branding / logo planes and folded page',title:'Branding',
alt:'Isometric line drawing of three stacked planes: a top plane with a solid pinwheel logo, a faded plane behind it and a folded-corner page with hatching, text lines and swatches below.',
desc:'Complete brand identities: logo, color, type and a visual language that stays consistent everywhere.',tags:['Figma','Illustrator','Logo','Brand portal','Typography'],
build(){
 const Fb=FL(3),Fp=(u,v)=>[u+1,v+.5,0],Fh=FL(7);
 const LB=plane(rect(-2,-10,8,-2),3)+logo(Fb,3,-6,.55,false)+sshape(Fb,cham(-1,-3.9,1.4,-3.2,.2),'cell',true,' fill-opacity=".3"')+sshape(Fb,cham(1.8,-3.9,4.2,-3.2,.2),'cell',true,' fill-opacity=".3"')+node(-2,-10,3)+node(8,-2,3);
 const LP=shape(Fp,[[-6,-5],[6,-5],[6,2],[3,5],[-6,5]],'plane')+shape(Fp,[[6,2],[3,5],[3,2]],'s2 ln')+hatch(Fp,-5.5,-4.5,2.5,-1.5,.3,'h')+tlines(Fp,-5.5,.2,5,4,.8)+shape(Fp,rect(3.2,-4.5,4.2,-3.5),'s3 ln')+sshape(Fp,rect(4.4,-4.5,5.4,-3.5),'cell',true,' fill-opacity=".5"')+node(-5,5.5,0)+node(7,-4.5,0);
 const LH=plane(rect(-5,-5,5,5),7,'plane hero')+logo(Fh,0,0,1)+[[-5,-5],[5,-5],[5,5],[-5,5]].map(([x,y])=>node(x,y,7)).join('');
 return {zoom:1.2,center:[291,212],layers:[LB,LP,LH],dim:[[-5,8.2,0],[5,8.2,0]],dimLabel:'10.0 u',ann:''};
}};
