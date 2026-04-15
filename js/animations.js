/* Pascal — Scroll animations + effects */
(function(){

  /* ============ INTERSECTION OBSERVER — REVEAL ON SCROLL ============ */
  var revealEls = document.querySelectorAll('.reveal');
  if(revealEls.length){
    var revealObs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('revealed');
          revealObs.unobserve(entry.target);
        }
      });
    },{threshold:0.15, rootMargin:'0px 0px -60px 0px'});
    revealEls.forEach(function(el){revealObs.observe(el)});
  }

  /* ============ STAGGER CHILDREN ============ */
  /* Parent with .stagger-children > children get sequential delays */
  var staggerParents = document.querySelectorAll('.stagger-children');
  if(staggerParents.length){
    var staggerObs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var children = entry.target.querySelectorAll('.stagger-item');
          children.forEach(function(child, i){
            child.style.transitionDelay = (i * 120) + 'ms';
            child.classList.add('revealed');
          });
          staggerObs.unobserve(entry.target);
        }
      });
    },{threshold:0.1});
    staggerParents.forEach(function(el){staggerObs.observe(el)});
  }

  /* ============ PARALLAX ============ */
  var parallaxEls = document.querySelectorAll('.parallax');
  if(parallaxEls.length){
    var lastScroll = 0;
    var ticking = false;
    function updateParallax(){
      var scrollY = window.pageYOffset;
      parallaxEls.forEach(function(el){
        var rect = el.getBoundingClientRect();
        var speed = parseFloat(el.dataset.speed) || 0.3;
        if(rect.top < window.innerHeight && rect.bottom > 0){
          var offset = (rect.top - window.innerHeight/2) * speed;
          el.style.transform = 'translate3d(0,' + offset + 'px,0)';
        }
      });
      ticking = false;
    }
    window.addEventListener('scroll', function(){
      if(!ticking){requestAnimationFrame(updateParallax);ticking=true}
    });
  }

  /* ============ MAGNETIC BUTTONS ============ */
  document.querySelectorAll('.magnetic').forEach(function(btn){
    btn.addEventListener('mousemove', function(e){
      var rect = this.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width/2;
      var y = e.clientY - rect.top - rect.height/2;
      this.style.transform = 'translate(' + x*0.3 + 'px,' + y*0.3 + 'px)';
    });
    btn.addEventListener('mouseleave', function(){
      this.style.transform = 'translate(0,0)';
      this.style.transition = 'transform 400ms cubic-bezier(.25,.46,.45,.94)';
    });
    btn.addEventListener('mouseenter', function(){
      this.style.transition = 'transform 150ms ease';
    });
  });

  /* ============ TEXT SPLIT REVEAL ============ */
  /* Splits text into lines/words for staggered reveal */
  document.querySelectorAll('.split-reveal').forEach(function(el){
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = '';
    words.forEach(function(word, i){
      var span = document.createElement('span');
      span.className = 'split-word';
      span.style.transitionDelay = (i * 60) + 'ms';
      span.textContent = word + ' ';
      el.appendChild(span);
    });
  });
  /* Observe split-reveal parents */
  var splitEls = document.querySelectorAll('.split-reveal');
  if(splitEls.length){
    var splitObs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('split-visible');
          splitObs.unobserve(entry.target);
        }
      });
    },{threshold:0.2});
    splitEls.forEach(function(el){splitObs.observe(el)});
  }

  /* ============ SMOOTH COUNTER ============ */
  document.querySelectorAll('.count-up').forEach(function(el){
    var target = parseFloat(el.dataset.target) || 0;
    var suffix = el.dataset.suffix || '';
    var prefix = el.dataset.prefix || '';
    var counted = false;
    var countObs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting && !counted){
          counted = true;
          var start = 0;
          var duration = 1800;
          var startTime = null;
          function step(ts){
            if(!startTime) startTime = ts;
            var progress = Math.min((ts - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
            var current = Math.round(start + (target - start) * eased);
            el.textContent = prefix + current.toLocaleString() + suffix;
            if(progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          countObs.unobserve(entry.target);
        }
      });
    },{threshold:0.5});
    countObs.observe(el);
  });

  /* ============ CURSOR FOLLOWER ============ */
  var cursor = document.querySelector('.custom-cursor');
  if(cursor){
    var cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', function(e){tx=e.clientX;ty=e.clientY});
    (function loop(){
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
      requestAnimationFrame(loop);
    })();
    /* Grow on hover over links/buttons */
    document.querySelectorAll('a, button, .sig-card, .product-card').forEach(function(el){
      el.addEventListener('mouseenter', function(){cursor.classList.add('cursor-grow')});
      el.addEventListener('mouseleave', function(){cursor.classList.remove('cursor-grow')});
    });
  }

  /* ============ NAV SCROLL EFFECT ============ */
  var nav = document.querySelector('.nav');
  if(nav){
    var lastY = 0;
    window.addEventListener('scroll', function(){
      var y = window.pageYOffset;
      if(y > 80){
        nav.classList.add('nav-scrolled');
        if(y > lastY && y > 200) nav.classList.add('nav-hidden');
        else nav.classList.remove('nav-hidden');
      } else {
        nav.classList.remove('nav-scrolled');
        nav.classList.remove('nav-hidden');
      }
      lastY = y;
    });
  }

  /* ============ SMOOTH SCROLL PROGRESS BAR ============ */
  var progressBar = document.querySelector('.scroll-progress');
  if(progressBar){
    window.addEventListener('scroll', function(){
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var pct = (window.pageYOffset / h) * 100;
      progressBar.style.width = pct + '%';
    });
  }

  /* ============ TILT EFFECT ON CARDS ============ */
  document.querySelectorAll('.tilt-card').forEach(function(card){
    card.addEventListener('mousemove', function(e){
      var rect = this.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      this.style.transform = 'perspective(800px) rotateY(' + (x*8) + 'deg) rotateX(' + (-y*8) + 'deg) scale(1.02)';
    });
    card.addEventListener('mouseleave', function(){
      this.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
    });
  });

})();
