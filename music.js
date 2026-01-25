<script>
(function(){
  if (window.__bgmStarted) return;
  window.__bgmStarted = true;

  const music = new Audio('/background.mp3');
  music.loop = true;
  music.volume = 0.7;

  function unlock(){
    music.play().catch(()=>{});
    document.removeEventListener('pointerdown', unlock);
    document.removeEventListener('keydown', unlock);
  }

  // iOS + desktop compatible
  document.addEventListener('pointerdown', unlock, { once:true });
  document.addEventListener('keydown', unlock, { once:true });

  // optional kill switch
  let seq = '';
  document.addEventListener('keydown', e=>{
    if(e.key.length!==1) return;
    seq = (seq + e.key).slice(-3);
    if(seq === 'CRY'){
      music.pause();
      music.currentTime = 0;
      seq = '';
    }
  });
})();
</script>
