
  const mq = document.getElementById('mq');
  if(mq) mq.innerHTML += mq.innerHTML;

  const io = new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.12});
  document.querySelectorAll('.reveal,.stagger,.sec-head').forEach(el=>io.observe(el));

  const prog = document.getElementById('progress');
  const nav = document.getElementById('nav');
  let lastY = 0;
  addEventListener('scroll',()=>{
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (scrollY/max*100)+'%';
    nav.classList.toggle('hidden', scrollY>lastY && scrollY>300);
    lastY = scrollY;
    const logo = document.getElementById('heroLogo');
    if(logo && scrollY < innerHeight) logo.style.transform = `translateY(${scrollY*0.28}px)`;
  },{passive:true});


  const fine = matchMedia('(pointer:fine)').matches;
  if(fine) document.querySelectorAll('.tilt').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r = card.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width, y = (e.clientY-r.top)/r.height;
      card.style.transform = `perspective(800px) rotateY(${(x-.5)*9}deg) rotateX(${(.5-y)*9}deg) translateY(-4px)`;
      card.style.setProperty('--mx',(x*100)+'%');
      card.style.setProperty('--my',(y*100)+'%');
    });
    card.addEventListener('mouseleave',()=>{ card.style.transform=''; });
  });

  if(fine && document.getElementById('heroLogo')){
    const logo = document.getElementById('heroLogo');
    document.querySelector('header').addEventListener('mousemove',e=>{
      const x = e.clientX/innerWidth-.5, y = e.clientY/innerHeight-.5;
      logo.style.transform = `translateY(${Math.min(scrollY,innerHeight)*0.28}px) rotateY(${x*10}deg) rotateX(${-y*8}deg)`;
    });
  }

  // ---- menu hamburger
  const burger = document.getElementById('burger');
  const mmenu = document.getElementById('mobileMenu');
  if(burger && mmenu){
    const chiudi = () => { mmenu.classList.remove('open'); burger.classList.remove('open'); };
    burger.addEventListener('click',()=>{ mmenu.classList.toggle('open'); burger.classList.toggle('open'); });
    mmenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',chiudi));
  }

  // ---- panoramica orizzontale guidata dallo scroll
  const pano = document.getElementById('pano');
  if(pano){
    const track = pano.querySelector('.pano-track');
    const n = track.children.length;
    pano.style.height = (n * 100) + 'vh';
    const mobile = () => matchMedia('(max-width:680px)').matches;
    const move = () => {
      if(mobile()){ pano.style.height = 'auto'; track.style.transform = 'none'; return; }
      pano.style.height = (n * 100) + 'vh';
      const r = pano.getBoundingClientRect();
      const total = pano.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      track.style.transform = 'translateX(' + (-p * (track.scrollWidth - innerWidth)) + 'px)';
    };
    addEventListener('scroll', move, {passive:true});
    addEventListener('resize', move); move();
  }

  // ---- video: partono quando entrano nello schermo, pausa quando escono
  const vids = document.querySelectorAll('.vid-card video');
  if(vids.length){
    const vio = new IntersectionObserver(es => es.forEach(e => {
      if(e.isIntersecting){ e.target.play().catch(()=>{}); } else { e.target.pause(); }
    }), {threshold:.35});
    vids.forEach(v => vio.observe(v));
    document.querySelectorAll('.vid-mute').forEach(btn => {
      const v = btn.parentElement.querySelector('video');
      if(v.dataset.noaudio !== undefined || v.hasAttribute('data-noaudio')) { btn.style.display = 'none'; return; }
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        v.muted = !v.muted; v.volume = 1;
        btn.classList.toggle('suono', !v.muted);
        const on = btn.querySelector('.ico-on');
        if(on) on.style.display = '';
        if(!v.muted) v.play().catch(()=>{});
      });
    });
  }
