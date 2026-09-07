import test from 'node:test';
import assert from 'node:assert/strict';
import { clusterMarkers, photoReport } from '../app/src/lib/reportData.js';
import { mergeChanges } from '../app/src/lib/materialStore.js';

test('nearby markers group, distant markers and chain endpoints stay separate', () => {
 const groups=clusterMarkers([{x:10,y:10},{x:12,y:10},{x:14,y:10},{x:90,y:90}],1000,1000,25);
 assert.deepEqual(groups.map(g=>g.members.length),[2,1,1]);
 assert.equal(groups.flatMap(g=>g.members).length,4);
});
test('aspect ratio controls physical distance and invalid points are excluded',()=>{
 assert.equal(clusterMarkers([{x:10,y:10},{x:10,y:12}],1000,2000,30).length,2);
 assert.equal(clusterMarkers([{x:NaN,y:10},{x:-1,y:5},{x:0,y:0},{x:100,y:100}],1000,1000).length,2);
});
test('photo report keeps homonyms and real image number and title',()=>{
 const report=photoReport({images:[{id:'img-uuid',number:7,title:'Mare'}],participants:{a:{studentName:'Marco',selectedImageIds:['img-uuid']},b:{studentName:'Marco',selectedImageIds:['img-uuid']}}});
 assert.equal(report.rows.length,2);assert.equal(report.rows[0]['Numero immagine'],7);
 assert.match(report.byImage[0].Studenti,/Marco \(#1\), Marco \(#2\)/);
});
test('anonymous photo export never includes real names',()=>{
 assert.ok(!JSON.stringify(photoReport({participants:{a:{studentName:'Segreto',selectedImageIds:[1]}}},false)).includes('Segreto'));
});
test('independent concurrent set edits merge and conflicts throw',()=>{
 const base={sets:[{id:'a',title:'A'},{id:'b',title:'B'}]};
 const local={sets:[{id:'a',title:'AA'},{id:'b',title:'B'}]};
 const remote={sets:[{id:'a',title:'A'},{id:'b',title:'BB'}]};
 assert.deepEqual(mergeChanges(base,local,remote),{sets:[{id:'a',title:'AA'},{id:'b',title:'BB'}]});
 assert.throws(()=>mergeChanges({x:'a'},{x:'b'},{x:'c'}),/contemporanea/);
});
test('deleted entities stay deleted and concurrent edits to deletion conflict',()=>{
 assert.deepEqual(mergeChanges({a:1,b:2},{b:2},{a:1,b:3}),{b:3});
 assert.throws(()=>mergeChanges({a:{x:1}},{},{a:{x:2}}));
});

test('number badges do not overlap even when group centroids are close',async()=>{
 const {placeBadges}=await import('../app/src/lib/reportData.js');
 const result=placeBadges([{x:0,y:0},{x:0,y:0},{x:15,y:12}],1400,900);
 for(let i=0;i<result.length;i++) for(let j=0;j<i;j++) assert.ok(Math.hypot(result[i].x-result[j].x,result[i].y-result[j].y)>=51);
});
