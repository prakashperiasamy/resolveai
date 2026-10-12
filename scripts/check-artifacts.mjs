import fs from 'node:fs';
import assert from 'node:assert/strict';
const results=[];
for(const file of ['demo/index.html','docs/executive-brief.html']){
 const text=fs.readFileSync(file,'utf8');
 assert(text.includes('Prakash Periasamy'),file+': authorship');
 assert(!/<script[^>]+src=["']/i.test(text),file+': offline scripts');
 assert(!/<link[^>]+href=["']https?:/i.test(text),file+': offline styles');
 assert(!/https?:[^"'`<>\s]*chatgpt\.site/.test(text),file+': no hosted prototype dependency');
 results.push({file,offlineScripts:true,offlineStyles:true,authorship:true});
}
fs.writeFileSync('docs/verification/artifact-checks.json',JSON.stringify({passed:true,results},null,2));
console.log('Offline artifacts: '+results.length+' passed');
