/* ===== menú móvil ===== */
(function(){
  const b=document.getElementById('burgerBtn'),m=document.getElementById('mobileMenu'),o=document.getElementById('mobileOverlay');
  if(!b) return;
  const open=()=>{b.classList.add('open');m.classList.add('open');o.classList.add('open');document.body.classList.add('locked');};
  const close=()=>{b.classList.remove('open');m.classList.remove('open');o.classList.remove('open');document.body.classList.remove('locked');};
  b.addEventListener('click',()=>m.classList.contains('open')?close():open());
  o.addEventListener('click',close);
})();

/* ===== barra de progreso de scroll ===== */
(function(){
  const bar=document.getElementById('progress');
  if(!bar) return;
  const upd=()=>{
    const h=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.width=(h>0?(window.scrollY/h)*100:0)+'%';
  };
  window.addEventListener('scroll',upd,{passive:true});
  window.addEventListener('resize',upd);
  upd();
})();

/* ===== header: fondo al bajar + ocultar al bajar rápido ===== */
(function(){
  const h=document.getElementById('siteHeader');
  if(!h) return;
  let last=0;
  window.addEventListener('scroll',()=>{
    const y=window.scrollY;
    if(y>60) h.classList.add('scrolled'); else h.classList.remove('scrolled');
    if(y>last && y>360) h.classList.add('hide'); else h.classList.remove('hide');
    last=y;
  },{passive:true});
})();

/* ===== reveals al entrar en viewport ===== */
(function(){
  const els=document.querySelectorAll('.reveal');
  if(!els.length) return;
  if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'));return;}
  const io=new IntersectionObserver((ents)=>{
    ents.forEach((e,i)=>{
      if(e.isIntersecting){
        setTimeout(()=>e.target.classList.add('in'), Math.min(i*70,320));
        io.unobserve(e.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  els.forEach(e=>io.observe(e));
})();

/* ===== parallax suave (hero y split) ===== */
(function(){
  const els=[...document.querySelectorAll('[data-parallax]')];
  if(!els.length) return;
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  let tick=false;
  const run=()=>{
    els.forEach(el=>{
      const sp=parseFloat(el.dataset.parallax)||.2;
      const r=el.getBoundingClientRect();
      if(r.bottom<0||r.top>window.innerHeight) return;
      const off=(r.top-window.innerHeight/2)*-sp;
      el.style.transform=`translate3d(0,${off.toFixed(1)}px,0)`;
    });
    tick=false;
  };
  window.addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(run);}},{passive:true});
  run();
})();

/* ===== spotlight del hero ===== */
(function(){
  const hero=document.querySelector('.hero'),s=document.getElementById('spotlight');
  if(!hero||!s) return;
  hero.addEventListener('mousemove',e=>{
    const r=hero.getBoundingClientRect();
    s.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
    s.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
  });
})();

/* ===== contadores animados ===== */
(function(){
  const cs=document.querySelectorAll('.count');
  if(!cs.length) return;
  const io=new IntersectionObserver(ents=>{
    ents.forEach(e=>{
      if(!e.isIntersecting) return;
      const el=e.target, target=parseInt(el.dataset.target,10), dur=1500, t0=performance.now();
      const step=(now)=>{
        const p=Math.min((now-t0)/dur,1);
        const eased=1-Math.pow(1-p,3);
        el.textContent=Math.floor(target*eased).toLocaleString('es-CO');
        if(p<1) requestAnimationFrame(step); else el.textContent=target.toLocaleString('es-CO');
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  },{threshold:.5});
  cs.forEach(c=>io.observe(c));
})();

/* ===== tabs de líneas de negocio ===== */
(function(){
  const tabs=document.querySelectorAll('.ltab');
  if(!tabs.length) return;
  tabs.forEach(t=>t.addEventListener('click',()=>{
    document.querySelectorAll('.ltab').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.lpanel').forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    const p=document.querySelector('.lpanel[data-panel="'+t.dataset.tab+'"]');
    if(p) p.classList.add('active');
  }));
})();

/* ===== filtros de clientes (funcional) ===== */
(function(){
  const btns=document.querySelectorAll('.fbtn');
  const chips=document.querySelectorAll('.chip[data-cat]');
  if(!btns.length) return;
  btns.forEach(b=>b.addEventListener('click',()=>{
    btns.forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    const cat=b.dataset.cat;
    chips.forEach(chip=>{
      const show = cat==='Todos' || chip.dataset.cat===cat;
      chip.style.display = show ? '' : 'none';
    });
  }));
})();

/* ═══════════════ V3 · INTERACCIÓN ═══════════════ */
const RM = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
const FINE = window.matchMedia('(pointer:fine)').matches;

/* ---------- cursor personalizado + magnético ---------- */
(function(){
  if(!FINE) return;
  const dot=document.getElementById('cursorDot'), ring=document.getElementById('cursorRing');
  if(!dot||!ring) return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    dot.style.transform=`translate(${mx}px,${my}px)`;
    document.body.classList.add('has-cursor');
  });
  (function loop(){
    rx+=(mx-rx)*.16; ry+=(my-ry)*.16;
    ring.style.transform=`translate(${rx}px,${ry}px)`;
    requestAnimationFrame(loop);
  })();
  const grow=()=>document.body.classList.add('cursor-lg');
  const shrink=()=>document.body.classList.remove('cursor-lg');
  document.querySelectorAll('a,button,.opt,.node,.hcard,.tcard').forEach(el=>{
    el.addEventListener('mouseenter',grow); el.addEventListener('mouseleave',shrink);
  });
  // botones magnéticos
  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect();
      const x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
      el.style.transform=`translate(${x*.22}px,${y*.3}px)`;
    });
    el.addEventListener('mouseleave',()=>{el.style.transform='';});
  });
})();

/* ---------- red de nodos animada en el hero ---------- */
(function(){
  const cv=document.getElementById('netCanvas');
  if(!cv) return;
  const ctx=cv.getContext('2d');
  let w,h,pts=[],mouse={x:-999,y:-999};
  const DENSITY=13000, MAXD=150;
  function resize(){
    const r=cv.getBoundingClientRect();
    w=cv.width=r.width*devicePixelRatio; h=cv.height=r.height*devicePixelRatio;
    ctx.scale(devicePixelRatio,devicePixelRatio);
    const n=Math.min(Math.round((r.width*r.height)/DENSITY),110);
    pts=Array.from({length:n},()=>({
      x:Math.random()*r.width, y:Math.random()*r.height,
      vx:(Math.random()-.5)*.28, vy:(Math.random()-.5)*.28,
      r:Math.random()*1.6+.8
    }));
  }
  function draw(){
    const r=cv.getBoundingClientRect();
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
    ctx.clearRect(0,0,r.width,r.height);
    pts.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>r.width) p.vx*=-1;
      if(p.y<0||p.y>r.height) p.vy*=-1;
    });
    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const a=pts[i],b=pts[j];
        const d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<MAXD){
          ctx.strokeStyle=`rgba(79,195,240,${(1-d/MAXD)*.22})`;
          ctx.lineWidth=.7;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
      const p=pts[i];
      const dm=Math.hypot(p.x-mouse.x,p.y-mouse.y);
      const near=dm<170;
      if(near){
        ctx.strokeStyle=`rgba(79,195,240,${(1-dm/170)*.5})`;
        ctx.lineWidth=.8;
        ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(mouse.x,mouse.y); ctx.stroke();
      }
      ctx.fillStyle=near?'rgba(255,255,255,.9)':'rgba(79,195,240,.62)';
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  const hero=document.querySelector('.hero-v3');
  hero.addEventListener('mousemove',e=>{
    const r=cv.getBoundingClientRect();
    mouse.x=e.clientX-r.left; mouse.y=e.clientY-r.top;
  });
  hero.addEventListener('mouseleave',()=>{mouse.x=mouse.y=-999;});
  window.addEventListener('resize',resize);
  resize();
  if(!RM) draw();
})();

/* ---------- rotador de palabras ---------- */
(function(){
  const el=document.getElementById('rotator');
  if(!el) return;
  const words=['no puede caerse','sostiene al ciudadano','opera 24/7','no admite excusas','mueve al país'];
  let i=0,c=words[0].length,dir=-1;
  function tick(){
    const word=words[i];
    c+=dir;
    el.textContent=word.slice(0,c);
    if(dir<0 && c<=0){ dir=1; i=(i+1)%words.length; setTimeout(tick,220); return; }
    if(dir>0 && c>=word.length){ dir=-1; setTimeout(tick,2400); return; }
    setTimeout(tick, dir>0?62:32);
  }
  setTimeout(tick,2600);
})();

/* ---------- consola NOC en vivo ---------- */
(function(){
  const up=document.getElementById('mUptime'), nd=document.getElementById('mNodes'),
        tk=document.getElementById('mTickets'), lt=document.getElementById('mLat'),
        spark=document.getElementById('sparkline'), log=document.getElementById('clog');
  if(!up) return;
  let tickets=412, nodes=1284, hist=Array.from({length:30},()=>35+Math.random()*22);

  function paintSpark(){
    const pts=hist.map((v,i)=>`${(i/(hist.length-1)*300).toFixed(1)},${(70-v).toFixed(1)}`).join(' ');
    spark.setAttribute('points',pts);
  }
  paintSpark();

  setInterval(()=>{
    const u=(99.93+Math.random()*.06).toFixed(2);
    up.textContent=u+'%';
    nodes+=Math.round((Math.random()-.45)*4); nd.textContent=nodes.toLocaleString('es-CO');
    if(Math.random()>.55){ tickets++; tk.textContent=tickets.toLocaleString('es-CO'); }
    lt.textContent=Math.round(14+Math.random()*9)+' ms';
    hist.push(32+Math.random()*26); hist.shift(); paintSpark();
  },1800);

  const CITIES=['Bogotá','Medellín','Cali','Barranquilla','Bucaramanga','Villavicencio','Pereira','Cartagena','Neiva','Pasto'];
  const EVENTS=[
    ()=>`<u>[NOC]</u> Nodo ${CITIES[~~(Math.random()*CITIES.length)]} — enlace estable <b>OK</b>`,
    ()=>`<u>[SOC]</u> Escaneo perimetral completado <b>sin hallazgos</b>`,
    ()=>`<u>[MESA]</u> Ticket #${~~(10000+Math.random()*89999)} resuelto en ${~~(2+Math.random()*13)} min`,
    ()=>`<u>[DC]</u> Respaldo incremental finalizado <b>OK</b>`,
    ()=>`<u>[INFRA]</u> UPS ${CITIES[~~(Math.random()*CITIES.length)]} — carga ${~~(30+Math.random()*40)}% <b>nominal</b>`,
    ()=>`<u>[SOC]</u> Parche de seguridad aplicado a ${~~(3+Math.random()*40)} equipos`,
    ()=>`<u>[NOC]</u> Failover probado en ${CITIES[~~(Math.random()*CITIES.length)]} <b>exitoso</b>`,
  ];
  function push(){
    const d=document.createElement('div');
    const t=new Date();
    const hh=String(t.getHours()).padStart(2,'0'), mm=String(t.getMinutes()).padStart(2,'0'), ss=String(t.getSeconds()).padStart(2,'0');
    d.innerHTML=`${hh}:${mm}:${ss} ${EVENTS[~~(Math.random()*EVENTS.length)]()}`;
    log.prepend(d);
    while(log.children.length>5) log.lastChild.remove();
  }
  push(); push(); push();
  setInterval(push, 2600);
})();

/* ---------- texto que se ilumina palabra por palabra ---------- */
(function(){
  const el=document.getElementById('litText');
  if(!el) return;
  const HL=['integración','TI,','altamente','calificado','crecimiento','táctico','estratégico'];
  const words=el.textContent.trim().split(/\s+/);
  el.innerHTML=words.map(w=>`<span class="${HL.includes(w)?'hl':''}">${w} </span>`).join('');
  const spans=[...el.querySelectorAll('span')];
  function upd(){
    const r=el.getBoundingClientRect();
    const start=window.innerHeight*.86, end=window.innerHeight*.26;
    let p=(start-r.top)/(start-end);
    p=Math.max(0,Math.min(1,p));
    const n=Math.round(p*spans.length);
    spans.forEach((s,i)=>s.classList.toggle('lit',i<n));
  }
  window.addEventListener('scroll',upd,{passive:true});
  window.addEventListener('resize',upd);
  upd();
})();

/* ---------- CONFIGURADOR ---------- */
(function(){
  const cfg=document.getElementById('cfg');
  if(!cfg) return;
  const steps=[...cfg.querySelectorAll('.cfg-step')];
  const rail=document.getElementById('cfgRail');
  const ans={};

  const MAP={
    infra:{t:'Infraestructura y plataformas',
      d:'Su prioridad es la capa física y lógica: energía, enfriamiento, redes y equipos que soporten la carga sin degradarse.',
      c:['Gestión de energía y enfriamiento','Redes y comunicaciones','Equipos de cómputo','Cableado estructurado'],
      esp:'un especialista de Infraestructura'},
    soporte:{t:'Tercerización de servicios TIC',
      d:'Su prioridad es descargar la operación diaria: mesa de servicio automatizada, gestión de infraestructura y monitoreo NOC-SOC continuo.',
      c:['Automated Service Desk','Gestión de infraestructura TIC','NOC – SOC','Recursos de impresión'],
      esp:'un especialista de Tercerización'},
    datos:{t:'Datos y analítica',
      d:'Su prioridad es convertir el dato en decisión: analítica, inteligencia artificial y canales de autogestión para el usuario final.',
      c:['Analítica de datos','Inteligencia artificial','Autogestión y atención al ciudadano','Validación de identidad'],
      esp:'un especialista de Datos y Analítica'},
    equipo:{t:'Consultoría e Ingeniería',
      d:'Su prioridad es capacidad técnica: personal especializado que se integre a su equipo para enfrentar la transformación digital.',
      c:['Ingeniería especializada','Software como servicio','Inteligencia artificial','Acompañamiento estratégico'],
      esp:'un consultor senior'}
  };
  const PROOF={
    infra:'<b>Caso comparable:</b> Acueducto de Bogotá — EAAB. 32 meses operando la plataforma de cómputo para 2.800 usuarios.',
    soporte:'<b>Caso comparable:</b> Secretaría de Educación del Distrito. 25 meses de data centers y mesa de TI para 776 instituciones.',
    datos:'<b>Caso comparable:</b> Alcaldía Mayor de Bogotá — Proyecto Chatico. 7 plataformas integradas y 18 flujos de comunicación.',
    equipo:'<b>Respaldo:</b> más de 1.300 colaboradores directos y 19 años integrando bienes y servicios de TI.'
  };

  function go(n){
    steps.forEach(s=>s.classList.toggle('active', +s.dataset.step===n));
    rail.style.width=(n/4*100)+'%';
    const r=cfg.getBoundingClientRect();
    if(r.top<0) cfg.scrollIntoView({behavior:'smooth',block:'center'});
  }

  cfg.querySelectorAll('.opt').forEach(b=>{
    b.addEventListener('click',()=>{
      ans[b.dataset.k]=b.dataset.v;
      b.parentElement.querySelectorAll('.opt').forEach(x=>x.classList.remove('picked'));
      b.classList.add('picked');
      const cur=+b.closest('.cfg-step').dataset.step;
      setTimeout(()=>{ cur<3 ? go(cur+1) : result(); }, 260);
    });
  });

  function result(){
    go(4);
    const scan=document.getElementById('resScan'), body=document.getElementById('resBody');
    scan.classList.remove('done'); body.classList.remove('show');
    const m=MAP[ans.reto]||MAP.infra;
    setTimeout(()=>{
      document.getElementById('resTitle').textContent='Empiece por: '+m.t;
      document.getElementById('resText').textContent=
        `Para una operación de ${ans.sector||'su organización'} con ${ans.tam||'ese volumen'} de usuarios, ${m.d}`;
      document.getElementById('resChips').innerHTML=m.c.map(x=>`<span>${x}</span>`).join('');
      document.getElementById('resProof').innerHTML=PROOF[ans.reto]||PROOF.infra;
      const link=document.getElementById('resLink');
      link.textContent='Hablar con '+m.esp;
      link.href='contacto.html?linea='+encodeURIComponent(m.t)+'&sector='+encodeURIComponent(ans.sector||'');
      scan.classList.add('done'); body.classList.add('show');
    },1250);
  }

  document.getElementById('cfgReset').addEventListener('click',()=>{
    for(const k in ans) delete ans[k];
    cfg.querySelectorAll('.opt').forEach(x=>x.classList.remove('picked'));
    go(1);
  });
  rail.style.width='25%';
})();

/* ---------- SCROLL HORIZONTAL DE LÍNEAS ---------- */
(function(){
  const sec=document.getElementById('lineas'), track=document.getElementById('hsTrack'),
        bar=document.getElementById('hsBar');
  if(!sec||!track) return;
  if(window.innerWidth<=760) return;
  function upd(){
    const r=sec.getBoundingClientRect();
    const total=sec.offsetHeight-window.innerHeight;
    let p=(-r.top)/total;
    p=Math.max(0,Math.min(1,p));
    const dist=track.scrollWidth-window.innerWidth+60;
    track.style.transform=`translate3d(${-p*dist}px,0,0)`;
    if(bar) bar.style.width=(p*100)+'%';
  }
  window.addEventListener('scroll',upd,{passive:true});
  window.addEventListener('resize',upd);
  upd();
})();

/* ---------- relleno del timeline ---------- */
(function(){
  const rail=document.getElementById('tlineFill'), tl=document.querySelector('.tline');
  if(!rail||!tl) return;
  function upd(){
    const r=tl.getBoundingClientRect();
    const start=window.innerHeight*.8, end=window.innerHeight*.3;
    let p=(start-r.top)/(r.height+start-end);
    p=Math.max(0,Math.min(1,p));
    rail.style.height=(p*100)+'%';
  }
  window.addEventListener('scroll',upd,{passive:true});
  window.addEventListener('resize',upd);
  upd();
})();

/* ---------- MAPA INTERACTIVO DE COLOMBIA ---------- */
(function(){
  const svg=document.getElementById('coMap');
  if(!svg) return;
  const gN=document.getElementById('nodes'), gL=document.getElementById('links');
  const NS='http://www.w3.org/2000/svg';

  const CITIES=[
    {n:'Bogotá D.C.',x:315.6,y:324.8,hq:1,t:'Sede principal',d:'Centro de operaciones y oficinas administrativas. Calle 99 # 49-53, Piso 4.',a:'24/7',b:'NOC-SOC',c:'99.9%'},
    {n:'Medellín',x:254.1,y:261.4,t:'Centro regional',d:'Atención a Antioquia y el eje noroccidental, con soporte en sitio.',a:'24/7',b:'Mesa + campo',c:'99.8%'},
    {n:'Cali',x:214.1,y:376.7,t:'Centro regional',d:'Cobertura del suroccidente y corredor del Pacífico.',a:'24/7',b:'Mesa + campo',c:'99.8%'},
    {n:'Barranquilla',x:286.4,y:67.1,t:'Centro Caribe',d:'Nodo de la costa atlántica y operación portuaria.',a:'24/7',b:'Mesa + campo',c:'99.7%'},
    {n:'Cartagena',x:256.1,y:90.7,t:'Centro Caribe',d:'Soporte a entidades y operación logística del Caribe.',a:'L-S',b:'Campo',c:'99.7%'},
    {n:'Santa Marta',x:310.4,y:55.6,t:'Centro Caribe',d:'Atención al Magdalena y corredor turístico.',a:'L-S',b:'Campo',c:'99.6%'},
    {n:'Riohacha',x:363.7,y:43.1,t:'Centro Caribe',d:'Cobertura de La Guajira y zona fronteriza norte.',a:'L-V',b:'Campo',c:'99.5%'},
    {n:'Valledupar',x:349.4,y:87.7,t:'Centro Caribe',d:'Soporte al Cesar y corredor minero.',a:'L-V',b:'Campo',c:'99.5%'},
    {n:'Montería',x:241.0,y:158.4,t:'Centro Caribe',d:'Atención a Córdoba y Sinú.',a:'L-V',b:'Campo',c:'99.5%'},
    {n:'Cúcuta',x:380.2,y:193.6,t:'Centro oriente',d:'Nodo fronterizo con atención a Norte de Santander.',a:'L-S',b:'Campo',c:'99.6%'},
    {n:'Bucaramanga',x:354.9,y:225.5,t:'Centro oriente',d:'Cobertura de Santander y área metropolitana.',a:'24/7',b:'Mesa + campo',c:'99.8%'},
    {n:'Tunja',x:344.7,y:290.8,t:'Centro andino',d:'Atención a Boyacá y entidades departamentales.',a:'L-V',b:'Campo',c:'99.6%'},
    {n:'Villavicencio',x:334.0,y:348.3,t:'Centro Orinoquía',d:'Nodo de los Llanos y operación del Meta.',a:'24/7',b:'Mesa + campo',c:'99.7%'},
    {n:'Neiva',x:265.7,y:398.3,t:'Centro andino',d:'Cobertura del Huila y corredor sur.',a:'L-V',b:'Campo',c:'99.5%'},
    {n:'Pereira',x:248.7,y:320.8,t:'Eje cafetero',d:'Atención a Risaralda y el eje cafetero.',a:'L-S',b:'Campo',c:'99.6%'},
    {n:'Armenia',x:249.2,y:332.1,t:'Eje cafetero',d:'Soporte al Quindío y zona cafetera.',a:'L-V',b:'Campo',c:'99.5%'},
    {n:'Popayán',x:209.6,y:418.2,t:'Centro sur',d:'Cobertura del Cauca y zona andina sur.',a:'L-V',b:'Campo',c:'99.5%'},
    {n:'Pasto',x:183.2,y:469.0,t:'Centro sur',d:'Nodo fronterizo sur con atención a Nariño.',a:'L-V',b:'Campo',c:'99.4%'},
  ];

  const hq=CITIES[0];
  CITIES.slice(1).forEach(c=>{
    const l=document.createElementNS(NS,'line');
    l.setAttribute('x1',hq.x); l.setAttribute('y1',hq.y);
    l.setAttribute('x2',c.x);  l.setAttribute('y2',c.y);
    gL.appendChild(l);
  });

  const P={tag:document.getElementById('npTag'),city:document.getElementById('npCity'),
    desc:document.getElementById('npDesc'),a:document.getElementById('npA'),
    b:document.getElementById('npB'),c:document.getElementById('npC')};

  CITIES.forEach((c,i)=>{
    const g=document.createElementNS(NS,'g');
    g.setAttribute('class','node'+(c.hq?' hq':'')+(i===0?' on':''));
    g.setAttribute('transform',`translate(${c.x},${c.y})`);

    const halo=document.createElementNS(NS,'circle');
    halo.setAttribute('class','halo'); halo.setAttribute('r',15);

    const ping=document.createElementNS(NS,'circle');
    ping.setAttribute('class','ping'); ping.setAttribute('r',5);
    ping.style.animation=`ping 3s ease-out ${(i*.22).toFixed(2)}s infinite`;

    const core=document.createElementNS(NS,'circle');
    core.setAttribute('class','core'); core.setAttribute('r',c.hq?5.5:4);

    const lbl=document.createElementNS(NS,'text');
    lbl.setAttribute('class','lbl');
    lbl.setAttribute('x', c.x>300?-10:10);
    lbl.setAttribute('y',-9);
    if(c.x>300) lbl.setAttribute('text-anchor','end');
    lbl.textContent=c.n;

    g.append(halo,ping,core,lbl);
    const show=()=>{
      gN.querySelectorAll('.node').forEach(n=>n.classList.remove('on'));
      g.classList.add('on');
      P.tag.textContent=c.t; P.city.textContent=c.n; P.desc.textContent=c.d;
      P.a.textContent=c.a; P.b.textContent=c.b; P.c.textContent=c.c;
    };
    g.addEventListener('mouseenter',show);
    g.addEventListener('click',show);
    g.addEventListener('focus',show);
    g.setAttribute('tabindex','0');
    gN.appendChild(g);
  });

  const st=document.createElementNS(NS,'style');
  st.textContent='@keyframes ping{0%{r:5;opacity:.85;}100%{r:20;opacity:0;}}';
  svg.appendChild(st);
})();

/* ---------- marquee de clientes (construido en JS) ---------- */
(function(){
  const t1=document.querySelector('#mq1 .mtrack'), t2=document.querySelector('#mq2 .mtrack');
  if(!t1) return;
  const B='https://pearsolutions.com.co/wp-content/uploads/2022/06/';
  const L=['DIAN.png','ICBF.png','MINSALUD.png','ACUEDUCTO.png','SED.png','TELEFONICA.png',
  'ALCALDIA-BOGOTA.jpg','CCE.png','SUPERSOLIDARIA.png','BANCO-AGRARIO.jpg','COLPENSIONES.gif',
  'COMPUTADORES-PARA-EDUCAR.png','CSJ.jpg','CUN.png','ERT.png','FNA.png','HOSPITAL-LA-MARIA.png',
  'HOSPITAL-MEDELLIN.png','INDUMIL.png','JUSTICIA-PENAL-MILITAR.png','MINAGRICULTURA.png',
  'SENA.png','SNR.png','GOBERNACION-META.png','INDER-ENVIGADO.jpeg','PCSMART.png','TM.png'];
  const half=Math.ceil(L.length/2);
  const build=(arr)=>arr.concat(arr).map(f=>`<div class="chip"><img src="${B}${f}" alt="" loading="lazy"></div>`).join('');
  t1.innerHTML=build(L.slice(0,half));
  if(t2) t2.innerHTML=build(L.slice(half));
})();

/* ---------- prefill del formulario desde el diagnóstico ---------- */
(function(){
  const p=new URLSearchParams(location.search);
  const linea=p.get('linea'), sector=p.get('sector');
  if(!linea) return;
  const sel=document.querySelector('.formcard select');
  if(sel){
    [...sel.options].forEach(o=>{ if(o.textContent.trim()===linea.trim()) o.selected=true; });
  }
  const ta=document.querySelector('.formcard textarea');
  if(ta && !ta.value){
    ta.value=`Hola, hice el diagnóstico en el sitio. Mi sector es ${sector||'—'} y la línea sugerida fue: ${linea}.`;
  }
  const card=document.querySelector('.formcard');
  if(card){
    const n=document.createElement('div');
    n.className='prefill-note';
    n.textContent='Prellenamos su consulta con el resultado del diagnóstico. Puede editarla.';
    card.prepend(n);
  }
})();
