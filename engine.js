export const FRUITS = ['딸기','바나나','라임','자두'];
export function deck(random=Math.random){const cards=[];[5,3,3,2,1].forEach((copies,i)=>{for(let f=0;f<4;f++)for(let j=0;j<copies;j++)cards.push({fruit:f,count:i+1});});for(let i=cards.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]];}return cards;}
export function five(piles){const sums=[0,0,0,0];for(const p of piles){const c=p.at(-1);if(c)sums[c.fruit]+=c.count;}return sums.includes(5);}
export class Game{
 constructor(cards=deck()){this.hands=[cards.slice(0,28),cards.slice(28)];this.piles=[[],[]];this.turn=0;this.over=false;this.winner=null;}
 finish(winner){this.over=true;this.winner=winner;}
 checkEmpty(){const empty=this.hands.map(h=>h.length===0);if(empty.some(Boolean)){this.finish(empty.every(Boolean)?-1:empty[0]?1:0);return true;}return false;}
 // The final exposed card remains eligible until the next scheduled flip.
 flip(){if(this.over||this.checkEmpty())return;const p=this.turn;this.piles[p].push(this.hands[p].shift());this.turn=1-p;return p;}
 ring(p){if(this.over||!this.piles.some(a=>a.length))return null;const correct=five(this.piles);const winner=correct?p:1-p;let won=0;
 if(correct){won=this.piles.flat().length;this.hands[winner].push(...this.piles[0],...this.piles[1]);this.piles=[[],[]];this.turn=winner;this.checkEmpty();}
 else {if(this.hands[p].length)this.hands[1-p].push(this.hands[p].shift());this.checkEmpty();}
 return {correct,winner,won};}
}
