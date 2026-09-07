import test, { before, after } from 'node:test';
import { readFile } from 'node:fs/promises';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc, getDocs, collection, query, where, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
let env;
const config={schemaVersion:2,appId:'shared',ownerUid:'teacher',type:'metaphor_images',active:true,maxSelections:2,allowedImageIds:[1,2],imageIds:['pic'],expiresAt:Timestamp.fromMillis(Date.now()+3600000)};
before(async()=>{
 env=await initializeTestEnvironment({projectId:'demo-life-skills',firestore:{rules:await readFile(new URL('../firestore.rules', import.meta.url),'utf8'),host:'127.0.0.1',port:8080}});
 await env.clearFirestore();
 await env.withSecurityRulesDisabled(async context=>{
 const db=context.firestore();
 await setDoc(doc(db,'teachers','teacher'),{enabled:true});
 await setDoc(doc(db,'sessions','ABCDEF'),config);
 await setDoc(doc(db,'sessions','CLOSED'),{...config,active:false});
 await setDoc(doc(db,'sessions','EXPIRE'),{...config,expiresAt:Timestamp.fromMillis(0)});
 await setDoc(doc(db,'sessions','ABCDEF','images','pic'),{dataUrl:'data:image/png;base64,abc'});
 await setDoc(doc(db,'workspaces','shared','materials','private'),{value:{secret:'names'}});
 await setDoc(doc(db,'artifacts','shared','public','data','custom_metaphor_images','pic'),{dataUrl:'private library'});
 });
});
after(async()=>{await env?.cleanup();});
const dbFor=id=>env.authenticatedContext(id).firestore();
const payload=(uid,extra={})=>({uid,kind:'participant',studentName:'Marco',timestamp:new Date().toISOString(),savedAt:serverTimestamp(),selectedImageIds:[1],...extra});
test('teacher reads library, student and unapproved account cannot',async()=>{
 await assertSucceeds(getDoc(doc(dbFor('teacher'),'workspaces','shared','materials','private')));
 for(const id of ['student','unapproved']) await assertFails(getDoc(doc(dbFor(id),'workspaces','shared','materials','private')));
 await assertFails(setDoc(doc(dbFor('student'),'teachers','student'),{enabled:true}));
});
test('student gets exact session and scoped image, never lists sessions or library',async()=>{
 const db=dbFor('student');
 await assertSucceeds(getDoc(doc(db,'sessions','ABCDEF')));
 await assertFails(getDocs(collection(db,'sessions')));
 await assertSucceeds(getDoc(doc(db,'sessions','ABCDEF','images','pic')));
 await assertFails(getDoc(doc(db,'artifacts','shared','public','data','custom_metaphor_images','pic')));
 await assertFails(updateDoc(doc(db,'sessions','ABCDEF'),{active:false}));
});
test('homonyms are distinct, own query works and other replies are private',async()=>{
 for(const uid of ['one','two']) await assertSucceeds(setDoc(doc(dbFor(uid),'sessions','ABCDEF','answers',uid),payload(uid)));
 await assertSucceeds(getDocs(query(collection(dbFor('one'),'sessions','ABCDEF','answers'),where('uid','==','one'))));
 await assertFails(getDoc(doc(dbFor('one'),'sessions','ABCDEF','answers','two')));
 await assertFails(getDocs(collection(dbFor('one'),'sessions','ABCDEF','answers')));
 await assertSucceeds(getDocs(collection(dbFor('teacher'),'sessions','ABCDEF','answers')));
});
test('forged ids, oversized selections, unknown images, closed and expired writes fail',async()=>{
 const db=dbFor('bad');
 await assertFails(setDoc(doc(db,'sessions','ABCDEF','answers','other'),payload('bad')));
 await assertFails(setDoc(doc(db,'sessions','ABCDEF','answers','bad'),payload('other')));
 for(const selectedImageIds of [[1,2,3],[1,1],[99]]) await assertFails(setDoc(doc(db,'sessions','ABCDEF','answers','bad'),payload('bad',{selectedImageIds})));
 for(const code of ['CLOSED','EXPIRE']) await assertFails(setDoc(doc(db,'sessions',code,'answers','bad'),payload('bad')));
 await assertFails(getDoc(doc(db,'sessions','EXPIRE')));
});
test('blob coordinates and note length validated on server',async()=>{
 const teacher=dbFor('teacher');
 await assertSucceeds(setDoc(doc(teacher,'sessions','BLOBBB'),{...config,type:'metaphor_blob'}));
 const db=dbFor('blob');const marker={id:'m1',x:50,y:50,color:'#FACC15',note:'ok',createdAt:'now'};
 const data={uid:'blob',kind:'participant',studentName:'Marco',timestamp:'now',savedAt:serverTimestamp(),markers:[marker]};
 await assertSucceeds(setDoc(doc(db,'sessions','BLOBBB','answers','blob'),data));
 await assertFails(setDoc(doc(db,'sessions','BLOBBB','answers','blob'),{...data,markers:[{...marker,x:101}]}));
 await assertFails(setDoc(doc(db,'sessions','BLOBBB','answers','blob'),{...data,markers:[{...marker,note:'x'.repeat(1001)}]}));
});
test('single answer cannot be overwritten and moderation cannot be bypassed',async()=>{
 await assertSucceeds(setDoc(doc(dbFor('teacher'),'sessions','QATEST'),{...config,type:'qa',allowMultipleResponses:false,moderationEnabled:true}));
 const db=dbFor('qa');const ref=doc(db,'sessions','QATEST','answers','qa');
 const data={uid:'qa',kind:'response',studentName:'Marco',timestamp:'now',savedAt:serverTimestamp(),text:'hello',status:'pending',visible:false};
 await assertFails(setDoc(ref,{...data,status:'visible',visible:true}));
 await assertSucceeds(setDoc(ref,data));
 await assertFails(setDoc(ref,{...data,text:'overwrite'}));
 await assertSucceeds(updateDoc(doc(dbFor('teacher'),'sessions','QATEST','answers','qa'),{status:'visible',visible:true}));
});
test('five markers remain valid and own participant edits work',async()=>{
 await assertSucceeds(setDoc(doc(dbFor('teacher'),'sessions','FIVEAA'),{...config,type:'metaphor_blob',maxSelections:5}));
 const db=dbFor('five');const marker={id:'m',x:50,y:50,color:'#FACC15',note:'note',createdAt:'now'};
 const data={uid:'five',kind:'participant',studentName:'Marco',timestamp:'now',savedAt:serverTimestamp(),markers:Array.from({length:5},(_,i)=>({...marker,id:String(i)}))};
 const ref=doc(db,'sessions','FIVEAA','answers','five');
 await assertSucceeds(setDoc(ref,data));
 await assertSucceeds(setDoc(ref,{...data,studentName:'Marco Rossi',savedAt:serverTimestamp()}));
});
test('multi-question answers must contain bounded strings, not objects',async()=>{
 await assertSucceeds(setDoc(doc(dbFor('teacher'),'sessions','TEXTAA'),{...config,type:'qa',allowMultipleResponses:true,moderationEnabled:false}));
 const db=dbFor('text'); const data={uid:'text',kind:'response',studentName:'Anna',timestamp:'now',savedAt:serverTimestamp(),text:['a','b'],status:'visible',visible:true};
 await assertSucceeds(setDoc(doc(db,'sessions','TEXTAA','answers','good'),data));
 await assertSucceeds(setDoc(doc(db,'sessions','TEXTAA','answers','thirty'),{...data,text:Array(30).fill('a')}));
 await assertFails(setDoc(doc(db,'sessions','TEXTAA','answers','object'),{...data,text:[{unexpected:'object'}]}));
});
test('material transactions preserve independent concurrent edits',async()=>{
 const {saveMaterials}=await import('../app/src/lib/materialStore.js');
 const db=dbFor('teacher');const initial={sets:[{id:'a',title:'A'},{id:'b',title:'B'}]};
 await saveMaterials(db,'concurrent',initial,initial);
 await Promise.all([
   saveMaterials(db,'concurrent',{sets:[{id:'a',title:'AA'},{id:'b',title:'B'}]},initial),
   saveMaterials(db,'concurrent',{sets:[{id:'a',title:'A'},{id:'b',title:'BB'}]},initial)
 ]);
 const result=(await getDoc(doc(db,'workspaces','concurrent','materials','sets'))).data().value;
 if (result[0].title!=='AA'||result[1].title!=='BB') throw new Error('Concurrent edit lost');
});
