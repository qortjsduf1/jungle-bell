import {GameAudio} from './audio.js?v=9';
const gameAudio=new GameAudio();
import {Game,five,FRUITS} from './engine.js';
const $=id=>document.getElementById(id);
const rivals=[{icon:'🐔',name:'꼬꼬',animal:'닭',title:'느긋한 아침형',delay:1250,hello:'꼬끼오! 손 풀고 왔지?',taunts:['꼬끼오! 아직 꿈나라야?','내 날개보다 느리다니!']},{icon:'🐱',name:'나비',animal:'고양이',title:'날렵한 앞발',delay:900,hello:'내 앞발을 이길 수 있냥?',taunts:['냐옹~ 이 정도는 식은 츄르지.','집사야, 반응이 조금 느리다냥!']},{icon:'🐐',name:'메에',animal:'염소',title:'산비탈의 승부사',delay:650,hello:'메에~ 정상에서 기다릴게!',taunts:['메에~ 종까지 내가 먼저 올라왔지!','풀 뜯다가 쳐도 내가 빠르네!']},{icon:'🐴',name:'히힝',animal:'말',title:'질주하는 반사신경',delay:450,hello:'출발선에 섰어? 히히힝!',taunts:['히히힝! 벌써 결승선이네!','종까지 전력 질주! 따라와 봐!']},{icon:'🐘',name:'코코',animal:'코끼리',title:'정글의 최종 보스',delay:280,hello:'큰 몸집에 속지 마. 준비됐지?',taunts:['뿌우! 코보다 손이 짧았나 봐?','이 속도, 절대 잊지 못할걸!']}];
const fruitSVG=[`<path d="M14 14C0 12 4 37 23 44C42 35 46 12 32 14Z" fill="#e15b50"/><path d="m12 14 11-8 11 8-11 4Z" fill="#4a8654"/><path d="m15 23 2 2m13-2 2 2m-10 7 2 2m-9-2 2 2" stroke="#ffe5a1" stroke-width="2.8"/>`,`<path d="M7 13C8 33 29 33 39 13C42 42 10 49 4 24Z" fill="#efc94e" stroke="#d5a737" stroke-width="1.5"/><path d="m7 13-1-5m33 5 2-4" stroke="#697348" stroke-width="3"/>`,`<ellipse cx="23" cy="25" rx="17" ry="19" transform="rotate(30 23 25)" fill="#86ab4a"/><path d="M12 22c0-7 5-11 9-12" fill="none" stroke="#c6da81" stroke-width="4" stroke-linecap="round"/><path d="m28 7 6-4" stroke="#52733b" stroke-width="3"/>`,`<path d="M23 13C1 5 1 42 22 45C45 44 45 5 23 13Z" fill="#815889"/><path d="M23 15Q20 35 23 42" fill="none" stroke="#674173" stroke-width="2"/><path d="M24 12Q23 3 30 2" fill="none" stroke="#725534" stroke-width="3"/><path d="M25 8Q35-1 39 6Q34 15 25 8" fill="#66945b"/>`];
let stage=0,game=null,active=false,paused=false,lockUntil=0,nextFlip=0,aiAt=Infinity,matchSince=0,best=null,sound=true;
const reactions=[
 {win:'chicken-win.png',lose:'chicken-lose.jpg',sad:'꼬… 꼬끼오… 이번엔 너가 이겼어.',taunt:'꼬끼오ㅋㅋ 아직도 자는 거야?'},
 {win:'cat-win.png',lose:'cat-lose.png',sad:'냐아악! 이번엔 너가 이겼어!',taunt:'풉. 집사야, 그게 최선이냥?'},
 {win:'goat-win.jpg',lose:'goat-lose.jpg',sad:'메에… 이번엔 너가 이겼어…',taunt:'메헤헤~ 풀 뜯으면서 해도 이기네?'},
 {win:'horse-win.jpg',lose:'horse-lose.png',sad:'히잉… 이번엔 너가 이겼어…',taunt:'히히히힝! 손이 걸어오는 중이야?'},
 {win:'elephant-win.jpg',lose:'elephant-lose.jpeg',sad:'이번엔 너가 이겼어… 나 숨을래.',taunt:'뿌우~ 코로 쳐도 너보다 빠르지롱!'}
];
let reactionTimer,returnTimer;
for(const r of reactions)for(const mood of ['win','lose']){const img=new Image();img.src='assets/reactions/'+r[mood];}
function hideReaction(){clearTimeout(reactionTimer);clearTimeout(returnTimer);$('reactionPopup').hidden=true;document.querySelector('.table-scene').classList.remove('morphing','returning');}
function returnToSeat(){const scene=document.querySelector('.table-scene');scene.classList.add('returning');$('reactionPopup').classList.add('returning');returnTimer=setTimeout(hideReaction,550);}
function showReaction(result){
 hideReaction();const enemyWon=result.winner===1;const r=reactions[stage],popup=$('reactionPopup'),img=$('reactionImage');
 popup.className='reaction-popup '+(enemyWon?'taunting':'disappointed');popup.dataset.animal=String(stage);
 $('reactionBadge').textContent=enemyWon?'상대 승리 · 킹받지?':'내가 먼저! · 상대 시무룩';
 $('reactionCaption').textContent=enemyWon?r.taunt:r.sad;
 $('reactionDetail').textContent=result.correct?`공개 카드 ${result.won}장 획득 · 잠시 후 계속!`:'잘못 울린 종! 카드 1장 벌칙 · 잠시 후 계속!';
 img.alt=`${rivals[stage].animal} ${enemyWon?'약 올리는 승리':'아쉬워하는 패배'} 짤`;
 img.hidden=false;$('reactionFallback').hidden=true;
 img.onerror=()=>{img.hidden=true;$('reactionFallback').hidden=false;$('reactionFallback').textContent=rivals[stage].icon+(enemyWon?' 😏':' 🥺');};
 img.src='assets/reactions/'+r[enemyWon?'win':'lose'];
 $('speech').textContent=enemyWon?r.taunt:r.sad;$('morphAnimal').src=$('animal').querySelector('img').src;document.querySelector('.table-scene').classList.add('morphing');popup.hidden=false;
 reactionTimer=setTimeout(returnToSeat,1650);
}
function soundBell(correct=true){gameAudio.bell(correct);}

function card(el,c){el.className='card'+(c?'':' back');el.removeAttribute('data-count');if(!c){el.innerHTML='<span>✳</span>';el.setAttribute('aria-label','아직 공개되지 않은 카드');return;}el.dataset.count=c.count;el.setAttribute('aria-label',`${FRUITS[c.fruit]} ${c.count}개`);el.innerHTML=`<span class="corner">${c.count}</span>`+Array.from({length:c.count},()=>`<svg class="fruit" viewBox="0 0 46 48" aria-hidden="true">${fruitSVG[c.fruit]}</svg>`).join('');el.classList.add('pop');}
function render(){if(!game)return;card($('myCard'),game.piles[0].at(-1));card($('enemyCard'),game.piles[1].at(-1));$('myCount').textContent=`남은 카드 ${game.hands[0].length}장`;$('opponentCount').textContent=`남은 카드 ${game.hands[1].length}장`;$('myPile').textContent=`공개 ${game.piles[0].length}장`;$('enemyPile').textContent=`공개 ${game.piles[1].length}장`;}
function selectStage(i){quit();stage=i;$('animal').innerHTML=`<img src="assets/characters/${['chicken','cat','goat','horse','elephant'][i]}.svg" alt="맞은편 의자에 앉은 ${rivals[i].animal}">`;$('opponentName').textContent=rivals[i].name;$('speech').textContent=rivals[i].hello;$('stageLabel').textContent=`STAGE 0${i+1} · ${rivals[i].animal}`;document.querySelectorAll('.stage').forEach((b,j)=>{b.classList.toggle('selected',j===i);b.setAttribute('aria-pressed',j===i);});$('nextBtn').hidden=true;}
$('stages').innerHTML=rivals.map((r,i)=>`<button class="stage ${i===0?'selected':''}" aria-pressed="${i===0}" data-stage="${i}"><span class="stage-icon">${r.icon}</span><span><strong>${r.animal} · ${r.name}</strong><small>${r.title}</small></span><span class="level">0${i+1}</span></button>`).join('');document.querySelectorAll('.stage').forEach(b=>b.onclick=()=>selectStage(Number(b.dataset.stage)));
function enableSettings(enabled){document.querySelectorAll('select').forEach(el=>el.disabled=!enabled);}
function quit(){
 active=false;paused=false;game=null;aiAt=Infinity;matchSince=0;lockUntil=0;nextFlip=0;
 hideReaction();gameAudio.stopAll();enableSettings(true);
 $('quitBtn').hidden=true;$('nextBtn').hidden=true;$('bell').disabled=true;
 $('pauseBtn').disabled=true;$('pauseBtn').textContent='일시정지';
 $('gameState').textContent='대결 준비';$('startBtn').textContent='대결 시작 →';
 $('notice').textContent='원하는 동물을 고르고 언제든 다시 시작하세요.';
 $('turnText').textContent='단계는 게임 중에도 자유롭게 바꿀 수 있어요';
 $('timerBar').style.width='0%';card($('myCard'),null);card($('enemyCard'),null);
 $('myCount').textContent='남은 카드 28장';$('opponentCount').textContent='남은 카드 28장';
 $('myPile').textContent='공개 0장';$('enemyPile').textContent='공개 0장';$('speech').textContent=rivals[stage].hello;
 if(cameraRunning){stopCamera();$('cameraStatus').textContent='게임을 나가 카메라도 껐어요. 다시 켜서 사용할 수 있습니다.';}
}
function start(){gameAudio.stopAll();hideReaction();game=new Game();active=true;paused=false;lockUntil=0;aiAt=Infinity;matchSince=0;nextFlip=performance.now()+600;$('startBtn').textContent='처음부터 다시 시작 ↻';$('nextBtn').hidden=true;$('quitBtn').hidden=false;$('bell').disabled=false;$('pauseBtn').disabled=false;$('pauseBtn').textContent='일시정지';$('gameState').textContent='대결 중';$('turnText').textContent='곧 첫 카드가 공개됩니다';$('notice').textContent='같은 과일이 정확히 5개일 때, 딩!';$('speech').textContent=rivals[stage].hello;enableSettings(false);render();soundBell();}
function end(){active=false;$('quitBtn').hidden=true;enableSettings(true);$('bell').disabled=true;$('pauseBtn').disabled=true;$('gameState').textContent=game.winner===0?'승리!':game.winner===1?'다시 도전!':'무승부';$('notice').textContent=`${game.winner===0?'내가 이겼어요!':game.winner===1?'상대가 이겼어요!':'무승부예요!'} 보유 카드 ${game.hands[0].length+game.piles[0].length} : ${game.hands[1].length+game.piles[1].length}`;$('turnText').textContent='다른 동물을 고르거나 다시 도전하세요';$('startBtn').textContent='한 번 더 대결 →';$('nextBtn').hidden=!(game.winner===0&&stage<4);$('timerBar').style.width='0%';}
function scheduleAI(now){if(five(game.piles)){matchSince=now;aiAt=now+rivals[stage].delay+Math.random()*220;}else{aiAt=Infinity;matchSince=0;}}
function ring(p=0){const now=performance.now();if(!active||paused||now<lockUntil)return;const reaction=matchSince?Math.round(now-matchSince):null;const result=game.ring(p);if(!result)return;soundBell(result.correct);gameAudio.animalReaction(stage,result.winner===1);$('bell').classList.remove('flash');void $('bell').offsetWidth;$('bell').classList.add('flash');if(result.correct&&p===0&&reaction!==null){best=best===null?reaction:Math.min(best,reaction);$('reaction').textContent=`최고 반응 ${best}ms`;}$('speech').textContent=result.winner===0?'이번엔 너가 이겼어!':rivals[stage].taunts[Math.floor(Math.random()*2)];$('notice').textContent=result.correct?`${p===0?'내가':rivals[stage].name+'가'} 먼저! 공개 카드 ${result.won}장 획득`:'앗, 다섯이 아니에요! 상대에게 카드 1장.';showReaction(result);lockUntil=now+2300;nextFlip=lockUntil;aiAt=Infinity;render();if(game.over)end();}
function tick(now){if(active&&!paused&&now>=lockUntil){if(now>=aiAt)ring(1);if(active&&now>=nextFlip){const flipped=game.flip();if(flipped!==undefined)gameAudio.flip();render();if(game.over)end();else{$('turnText').textContent=`${flipped===0?'내':'상대'} 카드 공개 · 다음은 ${game.turn===0?'내':'상대'} 차례`;nextFlip=now+Number($('speed').value);scheduleAI(now);}}if(active)$('timerBar').style.width=`${Math.max(0,Math.min(100,(1-(nextFlip-now)/Number($('speed').value))*100))}%`;}requestAnimationFrame(tick);}requestAnimationFrame(tick);
$('quitBtn').onclick=quit;$('startBtn').onclick=start;$('nextBtn').onclick=()=>{selectStage(stage+1);start();};$('bell').onclick=()=>ring();let pausedAt=0;
function pause(){if(!active)return;if(!paused){paused=true;pausedAt=performance.now();$('gameState').textContent='일시정지';$('pauseBtn').textContent='계속하기';}else{const delta=performance.now()-pausedAt;nextFlip+=delta;aiAt+=delta;lockUntil+=delta;if(matchSince)matchSince+=delta;paused=false;$('gameState').textContent='대결 중';$('pauseBtn').textContent='일시정지';}$('bell').disabled=paused;}
$('pauseBtn').onclick=pause;document.addEventListener('visibilitychange',()=>{if(document.hidden&&active&&!paused)pause();});document.addEventListener('keydown',e=>{if(e.code==='Space'&&!e.repeat&&!$('rules').open&&!['SELECT','INPUT','TEXTAREA'].includes(e.target.tagName)){e.preventDefault();ring();}});document.querySelector('.play-area').addEventListener('contextmenu',e=>{e.preventDefault();ring();});$('soundBtn').onclick=()=>{sound=!sound;gameAudio.setEnabled(sound);$('soundBtn').textContent=sound?'소리 켜짐':'소리 꺼짐';$('soundBtn').setAttribute('aria-pressed',sound);};$('rulesBtn').onclick=()=>{if(active&&!paused)pause();$('rules').showModal();};$('closeRules').onclick=()=>$('rules').close();
let stream=null,tracker=null,cameraRunning=false,frameId=0,lastVideo=-1,lastInference=0,armed=false,raisedFrames=0,loweredFrames=0;
function stopCamera(){cameraRunning=false;cancelAnimationFrame(frameId);stream?.getTracks().forEach(t=>t.stop());stream=null;$('video').srcObject=null;tracker?.close();tracker=null;armed=false;raisedFrames=0;loweredFrames=0;lastVideo=-1;$('cameraBox').hidden=true;$('cameraBtn').textContent='켜기';}
$('cameraBtn').onclick=async()=>{if(cameraRunning){stopCamera();$('cameraStatus').textContent='카메라를 껐어요. 다른 입력으로 계속 플레이하세요.';return;}if(active&&!paused)pause();$('cameraBtn').disabled=true;$('cameraStatus').textContent='손 인식 모델을 불러오는 중…';try{if(!navigator.mediaDevices?.getUserMedia)throw Error('HTTPS 또는 localhost에서 카메라를 사용할 수 있어요.');const {HandLandmarker,FilesetResolver}=await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/vision_bundle.mjs');const vision=await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm');tracker=await HandLandmarker.createFromOptions(vision,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'},runningMode:'VIDEO',numHands:1,minHandDetectionConfidence:.65,minTrackingConfidence:.65});stream=await navigator.mediaDevices.getUserMedia({video:{width:480,height:360,facingMode:'user'},audio:false});$('video').srcObject=stream;await $('video').play();cameraRunning=true;$('cameraBox').hidden=false;$('cameraBtn').textContent='끄기';$('cameraStatus').textContent='손목을 화면 아래쪽에 두어 준비하세요. 게임은 계속하기를 눌러 재개하세요.';frameId=requestAnimationFrame(track);}catch(e){stopCamera();$('cameraStatus').textContent=e.name==='NotAllowedError'?'카메라 권한이 거부되었어요. 브라우저 설정에서 허용한 뒤 다시 켜주세요.':`카메라를 시작하지 못했어요. ${e.message} 스페이스바로 플레이할 수 있어요.`;}finally{$('cameraBtn').disabled=false;}};
function track(now){if(!cameraRunning)return;try{const v=$('video');if(v.readyState>=2&&v.currentTime!==lastVideo&&now-lastInference>80){lastVideo=v.currentTime;lastInference=now;const hand=tracker.detectForVideo(v,now).landmarks[0];if(hand){const y=hand[0].y;loweredFrames=y>.62?loweredFrames+1:0;raisedFrames=y<.38?raisedFrames+1:0;if(loweredFrames>=2){armed=true;$('cameraStatus').textContent='준비 완료! 손목을 노란 선 위로 올리세요.';}if(armed&&raisedFrames>=2){armed=false;ring();$('cameraStatus').textContent='손 올리기 감지! 다시 아래로 내려 준비하세요.';}}else{armed=false;raisedFrames=0;loweredFrames=0;$('cameraStatus').textContent='손이 보이지 않아요. 손바닥과 손목을 화면에 보여주세요.';}}frameId=requestAnimationFrame(track);}catch{stopCamera();$('cameraStatus').textContent='손 인식이 중단되었어요. 카메라를 다시 켜거나 키보드를 사용하세요.';}}
window.addEventListener('pagehide',stopCamera);

// One intentional table tap rings once; scrolling and controls never ring.
const touchTable=document.querySelector('.table-scene');
let tableTouch=null;
touchTable.addEventListener('pointerdown',e=>{
 if(!e.isPrimary||e.button!==0||e.target.closest('button,a,input,select,textarea'))return;
 tableTouch={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};
});
touchTable.addEventListener('pointermove',e=>{
 if(tableTouch?.id===e.pointerId&&Math.hypot(e.clientX-tableTouch.x,e.clientY-tableTouch.y)>12)tableTouch.moved=true;
});
touchTable.addEventListener('pointerup',e=>{
 const t=tableTouch;tableTouch=null;
 if(t?.id===e.pointerId&&!t.moved&&Math.hypot(e.clientX-t.x,e.clientY-t.y)<=12&&!e.target.closest('button,a,input,select,textarea'))ring();
});
touchTable.addEventListener('pointercancel',()=>{tableTouch=null;});
touchTable.addEventListener('pointerleave',()=>{tableTouch=null;});
