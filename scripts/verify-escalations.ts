import assert from 'node:assert/strict';
import fs from 'node:fs';
import {issues,active,customers,owners,monthly,queryEscalations,filterIssues,toCsv} from '../src/lib/escalations.ts';
let assertions=0;
function check(value:unknown,message:string){assert.ok(value,message);assertions++;}
check(issues.length===2700,'2700 synthetic cases');
check(new Set(issues.map(x=>x.id)).size===2700,'unique case IDs');
check(active.length===68,'68 active cases');
check(active.every(x=>x.status!=='Closed'),'active partition');
check(issues.filter(x=>x.status==='Closed').length+active.length===2700,'partition reconciles');
check(customers.length===8&&owners.length===12,'fixture scope');
check(monthly.length===60,'60 month trend');
check(monthly.reduce((n,m)=>n+m.opened,0)===2700,'history reconciles to case count');
for(const x of issues){
 check(customers.includes(x.customer),'fictional customer');
 check(owners.includes(x.owner),'fictional owner');
 check(x.events[0].day===x.opened,'timeline anchored to opening date');
 check(x.hours>=0&&Number.isFinite(x.hours),'valid synthetic downtime');
}
for(const [question,predicate] of [
 ['blocked cases',(x:typeof active[number])=>x.status==='Blocked'],
 ['critical cases',(x:typeof active[number])=>x.severity==='Critical'],
 ['repeat cases',(x:typeof active[number])=>x.repeat],
 ['aging cases',(x:typeof active[number])=>x.age>30],
 ['QA cases',(x:typeof active[number])=>x.stage==='QA'||/QA|regression/i.test(x.blocker)]
] as const){
 const expected=active.filter(predicate),answer=queryEscalations(question);
 check(answer.refs.every(predicate),'query preserves '+question+' scope');
 check(answer.refs.length===Math.min(expected.length,5),'bounded evidence refs');
 check(expected.length?answer.body.startsWith(expected.length+' matching open cases'):answer.body.startsWith('No open cases'),'query count reconciles');
}
for(const customer of customers)check(queryEscalations(customer).refs.every(x=>x.customer===customer),'customer boundary');
for(const owner of owners)check(queryEscalations(owner).refs.every(x=>x.owner===owner),'owner boundary');
check(filterIssues('Command center','All severity','All stages','').length===68,'default queue');
check(filterIssues('History','All severity','All stages','').length===2700,'history queue');
check(filterIssues('Command center','Critical','QA','').every(x=>x.severity==='Critical'&&x.stage==='QA'),'combined filters');
check(filterIssues('History','All severity','All stages','ESC-10000').length===1,'case search');
check(toCsv(active).split('\n').length===69,'CSV row count');
check(toCsv([{...active[0],customer:'Synthetic "Quoted" Customer'}]).includes('Synthetic ""Quoted"" Customer'),'CSV escaping');
const output={passed:true,assertions,fixture:{cases:issues.length,active:active.length,customers:customers.length,months:monthly.length},scope:'Synthetic fixture integrity, queue filtering, query scope, evidence references, trend reconciliation, CSV escaping. Browser interaction QA not included.'};
fs.writeFileSync('docs/verification/domain-checks.json',JSON.stringify(output,null,2));
console.log(JSON.stringify(output,null,2));
