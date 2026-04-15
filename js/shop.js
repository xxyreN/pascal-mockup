/* Pascal — Shop cart (frontend-only mockup) */
(function(){
  var cart=JSON.parse(localStorage.getItem('pascal-cart')||'[]');

  /* DOM refs */
  var overlay=document.querySelector('.cart-overlay');
  var sidebar=document.querySelector('.cart-sidebar');
  var cartBtn=document.querySelectorAll('.nav-cart');
  var closeBtn=document.querySelector('.cart-close');
  var itemsWrap=document.querySelector('.cart-items');
  var totalEl=document.querySelector('.total-price');
  var countEls=document.querySelectorAll('.cart-count');
  var checkoutBtn=document.querySelector('.checkout-btn');

  function openCart(){
    if(overlay) overlay.classList.add('open');
    if(sidebar) sidebar.classList.add('open');
    document.body.style.overflow='hidden';
  }
  function closeCart(){
    if(overlay) overlay.classList.remove('open');
    if(sidebar) sidebar.classList.remove('open');
    document.body.style.overflow='';
  }

  cartBtn.forEach(function(b){b.addEventListener('click',openCart)});
  if(closeBtn) closeBtn.addEventListener('click',closeCart);
  if(overlay) overlay.addEventListener('click',closeCart);

  function save(){localStorage.setItem('pascal-cart',JSON.stringify(cart))}

  function updateCount(){
    var n=cart.reduce(function(s,i){return s+i.qty},0);
    countEls.forEach(function(el){
      el.textContent=n||'';
      el.classList.add('bump');
      setTimeout(function(){el.classList.remove('bump')},200);
    });
  }

  function render(){
    if(!itemsWrap) return;
    if(cart.length===0){
      var lang=document.documentElement.classList.contains('lang-en')?'en':'es';
      itemsWrap.innerHTML='<div class="cart-empty">'+(lang==='en'?'Your cart is empty':'Tu carrito est\u00e1 vac\u00edo')+'</div>';
      if(totalEl) totalEl.textContent='\u20ac0.00';
      updateCount();
      return;
    }
    var html='';
    cart.forEach(function(item,i){
      html+='<div class="cart-item" data-idx="'+i+'">'
        +'<div class="cart-item-img"><img src="'+item.img+'" alt="'+item.name+'"></div>'
        +'<div><div class="cart-item-name">'+item.name+'</div>'
        +'<div class="cart-item-price">\u20ac'+item.price.toFixed(2)+'</div></div>'
        +'<div class="cart-item-qty">'
        +'<button class="qty-btn qty-minus" data-idx="'+i+'">\u2212</button>'
        +'<span class="qty-val">'+item.qty+'</span>'
        +'<button class="qty-btn qty-plus" data-idx="'+i+'">+</button>'
        +'</div></div>';
    });
    itemsWrap.innerHTML=html;

    /* qty buttons */
    itemsWrap.querySelectorAll('.qty-minus').forEach(function(b){
      b.addEventListener('click',function(){
        var idx=parseInt(this.dataset.idx);
        cart[idx].qty--;
        if(cart[idx].qty<=0) cart.splice(idx,1);
        save();render();
      });
    });
    itemsWrap.querySelectorAll('.qty-plus').forEach(function(b){
      b.addEventListener('click',function(){
        var idx=parseInt(this.dataset.idx);
        cart[idx].qty++;
        save();render();
      });
    });

    var total=cart.reduce(function(s,i){return s+i.price*i.qty},0);
    if(totalEl) totalEl.textContent='\u20ac'+total.toFixed(2);
    updateCount();
  }

  /* add to cart buttons */
  document.querySelectorAll('.add-to-cart').forEach(function(btn){
    btn.addEventListener('click',function(){
      var card=this.closest('.product-card')||this.closest('.shop-preview-card');
      if(!card) return;
      var name=card.querySelector('.product-name,.card-name').textContent;
      var priceText=card.querySelector('.product-price,.card-price').textContent;
      var price=parseFloat(priceText.replace(/[^\d.,]/g,'').replace(',','.'));
      var imgEl=card.querySelector('img');
      var img=imgEl?imgEl.src:'';

      var existing=cart.find(function(i){return i.name===name});
      if(existing){existing.qty++}
      else{cart.push({name:name,price:price,img:img,qty:1})}

      save();render();

      /* feedback */
      var orig=this.textContent;
      this.textContent='\u2713';
      this.classList.add('added');
      var self=this;
      setTimeout(function(){self.textContent=orig;self.classList.remove('added')},800);
    });
  });

  /* checkout (mockup) */
  if(checkoutBtn){
    checkoutBtn.addEventListener('click',function(){
      var lang=document.documentElement.classList.contains('lang-en')?'en':'es';
      if(cart.length===0) return;
      alert(lang==='en'
        ?'This is a design concept — checkout would connect to a payment system in the live site.'
        :'Esto es un concepto de dise\u00f1o — el checkout se conectar\u00eda a un sistema de pago en la web final.');
    });
  }

  /* filter buttons (shop page) */
  document.querySelectorAll('.filter-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      document.querySelectorAll('.filter-btn').forEach(function(b){b.classList.remove('active')});
      this.classList.add('active');
      var cat=this.dataset.cat;
      document.querySelectorAll('.product-card').forEach(function(card){
        if(cat==='all'||card.dataset.cat===cat){
          card.style.display='';
        }else{
          card.style.display='none';
        }
      });
    });
  });

  render();
})();
