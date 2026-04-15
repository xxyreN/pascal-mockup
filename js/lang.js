/* Pascal — language toggle + FOUT fix + hamburger + image fallback */
(function(){
  /* FOUT fix */
  var t=setTimeout(function(){document.body.classList.add('fonts-ready')},800);
  if(document.fonts&&document.fonts.ready){
    document.fonts.ready.then(function(){clearTimeout(t);document.body.classList.add('fonts-ready')});
  }

  /* language */
  var saved=localStorage.getItem('pascal-lang')||'es';
  document.documentElement.classList.remove('lang-es','lang-en');
  document.documentElement.classList.add('lang-'+saved);

  document.querySelectorAll('.lang-toggle button').forEach(function(btn){
    if(btn.dataset.lang===saved) btn.classList.add('active');
    btn.addEventListener('click',function(){
      var lang=this.dataset.lang;
      localStorage.setItem('pascal-lang',lang);
      document.documentElement.classList.remove('lang-es','lang-en');
      document.documentElement.classList.add('lang-'+lang);
      document.querySelectorAll('.lang-toggle button').forEach(function(b){b.classList.remove('active')});
      this.classList.add('active');
    });
  });

  /* image fallback */
  document.querySelectorAll('img[src*="img/"]').forEach(function(img){
    img.addEventListener('error',function(){
      var fn=this.src.split('/').pop();
      var p=this.parentNode;
      this.style.display='none';
      var ph=document.createElement('div');
      ph.style.cssText='position:absolute;inset:0;background:#EAE2D1;display:flex;align-items:center;justify-content:center;font-family:"JetBrains Mono",monospace;font-size:11px;color:#51633F;letter-spacing:0.06em;padding:16px;text-align:center;border:1px dashed rgba(81,99,63,0.3);';
      ph.textContent=fn;
      if(getComputedStyle(p).position==='static') p.style.position='relative';
      p.appendChild(ph);
    });
  });
})();

/* hamburger */
(function(){
  var btn=document.querySelector('.hamburger');
  var menu=document.querySelector('.mobile-menu');
  if(!btn||!menu) return;
  btn.addEventListener('click',function(){
    btn.classList.toggle('active');
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click',function(){
      btn.classList.remove('active');
      menu.classList.remove('open');
    });
  });
})();
