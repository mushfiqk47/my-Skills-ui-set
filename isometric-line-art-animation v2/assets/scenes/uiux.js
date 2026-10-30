SCENES.uiux={label:'Product UI/UX / exploded vertical layers',title:'Product UI/UX',
alt:'Isometric line drawing of four upright interface layers pulled apart: a hatched panel, two pixel-grid panels and a back panel with a solid input pill and a circle.',
desc:'From research and flows to pixel-perfect screens: simple for users and easy for engineers to build.',tags:['Figma','Web apps','Mobile apps','Design systems','Dashboards'],
build(){
 const u0=-4.5,u1=4.5,v0=1.5,v1=9.5,R=rect(u0,v0,u1,v1);
 let m=WL(-4);
 const W0=shape(m,R,'plane hero')+shape(m,cham(-3.4,7.9,.6,8.7,.25),'solid focal')+shape(m,circ(2,5.4,1.8,28),'s2 ln')+shape(m,circ(2,5.4,.9,20),'s3 ln')+tlines(m,-3.4,6.4,3.4,3,.6)+R.map(([u,v])=>node(u,-4,v)).join('');
 m=WL(-1.5);const W1=shape(m,R,'plane')+cells(m,-3,2.4,5,5,1.2,11)+node(u1,-1.5,v1);
 m=WL(1);const W2=shape(m,R,'plane')+cells(m,-2.4,3,4,4,1.2,41)+node(u0,1,v1);
 m=WL(3.5);const W3=shape(m,R,'plane')+hatch(m,u0,v0,u1,v1,.28)+[[-1.2,5.4],[.6,3.6],[2.4,6.6]].map(([u,v])=>sshape(m,rect(u,v,u+1.2,v+1.2),'cell',true,' fill-opacity=".85"')).join('')+node(u0,3.5,v0)+node(u1,3.5,v0);
 const [tx,ty]=P(u1,-4,v1);
 return {zoom:1.25,center:[285,194],layers:[W0,W1,W2,W3],dim:[[-6,8.2,0],[6,8.2,0]],
  ann:`<path class="dots" d="M${f(tx+8)} ${f(ty)}L${f(tx+80)} ${f(ty+34)}"/><path class="node" d="M${f(tx+83)} ${f(ty+31.8)}L${f(tx+86.2)} ${f(ty+35)}L${f(tx+83)} ${f(ty+38.2)}L${f(tx+79.8)} ${f(ty+35)}Z"/>${lbl(f(tx+92),f(ty+44),'px')}<path class="s3 tex" d="M${f(tx+90)} ${f(ty+52)}h18M${f(tx+90)} ${f(ty+57)}h14M${f(tx+90)} ${f(ty+62)}h18"/>`};
}};
