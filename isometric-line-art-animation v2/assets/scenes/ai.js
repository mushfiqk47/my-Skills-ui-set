SCENES.ai={label:'AI / chip with circuit traces',title:'AI products',
alt:'Isometric line drawing of a processor chip with pins on all sides and a solid core, connected by right-angle traces to nodes on a dotted circuit board.',
desc:'Models wired into real products: inference, evaluation and interfaces designed so the intelligence feels useful.',tags:['LLMs','RAG','Agents','Evals','APIs'],
build(){
 const F=FL(0),H=8,C=3.8;
 let L0=plane(rect(-H,-H,H,H),0);
 for(let i=-6;i<=6.1;i+=3)L0+=sshape(F,[[-H,i],[H,i]],'grid',false)+sshape(F,[[i,-H],[i,H]],'grid',false);
 [-2.8,0,2.8].forEach((p,k)=>{const w=6+.4*k,d=k%2?1:-1;
  L0+=shape(F,[[C+1.3,p],[w,p],[w,p+d*.9]],'s3 ln',false)+node(w,p+d*.9,0)+shape(F,[[p,C+1.3],[p,w],[p+d*.9,w]],'s3 ln',false)+node(p+d*.9,w,0);});
 let chip='';
 for(let k=0;k<5;k++){const p=-2.8+k*1.4;
  chip+=S3('s3 tex',[[-C-1.3,p,1.1],[-C,p,1.1]])+S3('s3 tex',[[C,p,1.1],[C+1.3,p,1.1]])+S3('s3 tex',[[p,-C-1.3,1.1],[p,-C,1.1]])+S3('s3 tex',[[p,C,1.1],[p,C+1.3,1.1]]);}
 const T=FL(2.2);
 chip+=block(-C,-C,C,C,0,2.2,'plane hero')+shape(T,rect(-2.2,-2.2,2.2,2.2),'s2 ln')+shape(T,cham(-1.1,-1.1,1.1,1.1,.35),'solid focal')+[[-C,-C],[C,-C],[C,C],[-C,C]].map(([x,y])=>node(x,y,2.2)).join('');
 return {zoom:1.39,center:[260,250],layers:[L0,chip],dim:[[-H,9,0],[H,9,0]],dimLabel:'16.0 u',ann:''};
}};
