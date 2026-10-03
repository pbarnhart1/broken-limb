const dialog=document.querySelector('dialog');
const closeButton=document.getElementById('close-photo');
function enlarge(src,alt){const img=document.getElementById('large-photo');img.src=src;img.alt=alt;document.getElementById('photo-title').textContent=alt;dialog.showModal();}
closeButton.addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
fetch('media.json').then(r=>{if(!r.ok)throw Error('Gallery unavailable');return r.json();}).then(data=>{
 document.querySelectorAll('[data-gallery]').forEach(g=>{
  const media=data[g.dataset.gallery];let current=0;
  const stage=g.querySelector('.media-stage'),caption=g.querySelector('.media-caption');
  function show(i){current=(i+media.length)%media.length;const m=media[current];stage.replaceChildren();
   if(m.video){const v=document.createElement('video');v.controls=true;v.playsInline=true;v.preload='none';v.src=m.src;v.poster=m.poster;v.setAttribute('aria-label',m.alt);stage.append(v);}
   else{const b=document.createElement('button');b.type='button';b.className='enlarge';b.setAttribute('aria-label','Enlarge '+m.alt);const img=document.createElement('img');img.src=m.src;img.alt=m.alt;b.append(img);b.addEventListener('click',()=>enlarge(m.src,m.alt));stage.append(b);}
   caption.textContent=m.alt+' · '+(current+1)+' / '+media.length;
   g.querySelectorAll('[data-media]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.media)===current)));
  }
  g.querySelectorAll('[data-media]').forEach(b=>b.addEventListener('click',()=>show(Number(b.dataset.media))));
  g.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>show(current+Number(b.dataset.step))));
  g.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(current+(e.key==='ArrowRight'?1:-1));}});
  show(0);
 });
}).catch(()=>{document.querySelectorAll('.media-caption').forEach(p=>p.textContent='Gallery could not load. Please refresh the page.');});
