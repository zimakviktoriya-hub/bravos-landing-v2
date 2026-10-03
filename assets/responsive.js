(function(){
  var track=document.querySelector('#support .support-cards');
  if(!track)return;
  var slides=Array.prototype.slice.call(track.querySelectorAll('.support-card'));
  var controls=document.createElement('div');
  controls.className='support-slider-controls';
  controls.innerHTML='<output aria-label="Текущая карточка поддержки">1 / '+slides.length+'</output><button type="button" aria-label="Предыдущая карточка поддержки" title="Предыдущая карточка"><img src="assets/cost-prev.svg" alt=""></button><button type="button" aria-label="Следующая карточка поддержки" title="Следующая карточка"><img src="assets/cost-next.svg" alt=""></button>';
  track.after(controls);
  var counter=controls.querySelector('output');
  var previous=controls.querySelectorAll('button')[0];
  var next=controls.querySelectorAll('button')[1];
  var compact=window.matchMedia('(max-width:1100px)');
  var reducedMotion=window.matchMedia('(prefers-reduced-motion:reduce)');
  function step(){
    return slides[0].getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap);
  }
  function update(){
    var index=Math.min(slides.length-1,Math.round(track.scrollLeft/step()));
    counter.textContent=(index+1)+' / '+slides.length;
    previous.disabled=track.scrollLeft<=1;
    next.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-1;
  }
  function move(direction){
    track.scrollBy({left:direction*step(),behavior:reducedMotion.matches?'auto':'smooth'});
  }
  function configure(){
    if(compact.matches){
      track.tabIndex=0;
      track.setAttribute('role','region');
      track.setAttribute('aria-label','Поддержка на всех этапах');
      track.setAttribute('aria-roledescription','карусель');
      slides.forEach(function(slide,i){slide.setAttribute('role','group');slide.setAttribute('aria-label','Карточка '+(i+1)+' из '+slides.length);});
    }else{
      track.removeAttribute('tabindex');
      track.removeAttribute('role');
      track.removeAttribute('aria-label');
      track.removeAttribute('aria-roledescription');
      slides.forEach(function(slide){slide.removeAttribute('role');slide.removeAttribute('aria-label');});
    }
    update();
  }
  previous.addEventListener('click',function(){move(-1);});
  next.addEventListener('click',function(){move(1);});
  track.addEventListener('scroll',update,{passive:true});
  track.addEventListener('keydown',function(event){
    if(!compact.matches || (event.key!=='ArrowLeft' && event.key!=='ArrowRight'))return;
    event.preventDefault();
    move(event.key==='ArrowRight'?1:-1);
  });
  window.addEventListener('resize',configure);
  compact.addEventListener('change',configure);
  configure();
})();
