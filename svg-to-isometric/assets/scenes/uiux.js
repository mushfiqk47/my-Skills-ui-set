SCENES.uiux={label:'Product UI/UX / exploded vertical layers',title:'Product UI/UX',

alt:'Isometric line drawing of four upright interface layers pulled apart: a back panel with a solid input pill, a cursor and a ring, two pixel-grid panels with a dashed selection marquee, a slider and a toggle, and a front panel with a color-swatch row over hatching.',
build(){
 const u0=-4.5,u1=4.5,v0=1.5,v1=9.5,R=rect(u0,v0,u1,v1);
 let m=WL(-4);
 const W0=shape(m,R,'plane hero')+shape(m,cham(-3.4,7.9,.6,8.7,.25),'solid focal')+shape(m,[[1.0,8.9],[1.0,7.85],[1.45,8.3],[1.8,8.22],[1.3,8.62]],'s2 ln')+shape(m,circ(2,5.4,1.8,28),'s2 ln')+shape(m,circ(2,5.4,.9,20),'s3 ln')+tlines(m,-3.4,6.4,3.4,3,.6)+R.map(([u,v])=>node(u,-4,v)).join('');
 m=WL(-1.5);const W1=shape(m,R,'plane')+cells(m,-3,2.4,5,5,1.2,11)+sshape(m,rect(-1.95,5.85,-.45,7.35),'grid',false)+node(u1,-1.5,v1);
 m=WL(1);const W2=shape(m,R,'plane')+cells(m,-2.4,3,4,4,1.2,41)+shape(m,[[-3.2,8.4],[1.2,8.4]],'s2 ln',false)+shape(m,circ(-1.4,8.4,.28,12),'s2 ln')+shape(m,[[-3.2,8.1],[-3.2,8.7]],'s3 ln',false)+shape(m,[[1.2,8.1],[1.2,8.7]],'s3 ln',false)+shape(m,cham(2.2,8.05,3.9,8.75,.35),'s2 ln')+shape(m,circ(3.35,8.4,.24,10),'s2 ln')+node(u0,1,v1);
 m=WL(3.5);const W3=shape(m,R,'plane')+hatch(m,u0,1.5,u1,6,.28)+[[-3.6],[-2.5],[-1.4]].map(([u],k)=>sshape(m,rect(u,8.3,u+.7,9.0),'cell',true,` fill-opacity="${[.7,.3,.85][k]}"`)).join('')+shape(m,rect(0,8.3,.7,9.0),'s2 ln')+shape(m,rect(1.1,8.3,1.8,9.0),'s2 ln')+sshape(m,rect(-1.55,8.15,-.55,9.15),'grid',false)+node(u0,3.5,v0)+node(u1,3.5,v0);
 const [tx,ty]=P(u1,-4,v1);
 return {zoom:1.25,center:[285,194],layers:[W0,W1,W2,W3],dim:[[-6,8.2,0],[6,8.2,0]],
  ann:`<path class="dots" d="M${f(tx+8)} ${f(ty)}L${f(tx+80)} ${f(ty+34)}"/><path class="node" d="M${f(tx+83)} ${f(ty+31.8)}L${f(tx+86.2)} ${f(ty+35)}L${f(tx+83)} ${f(ty+38.2)}L${f(tx+79.8)} ${f(ty+35)}Z"/>${lbl(f(tx+92),f(ty+44),'px')}<path class="s3 tex" d="M${f(tx+90)} ${f(ty+52)}h18M${f(tx+90)} ${f(ty+57)}h14M${f(tx+90)} ${f(ty+62)}h18"/>`};
}};
