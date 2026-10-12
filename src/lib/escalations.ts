export type Issue={id:string;opened:string;age:number;customer:string;site:string;platform:string;subsystem:string;title:string;severity:string;stage:string;status:string;owner:string;team:string;blocker:string;release:string;hours:number;repeat:boolean;events:{day:string;text:string;by:string}[]};
export const now=new Date("2026-09-28T12:00:00Z"), day=86400000;
export const customers=["Aster Memory","Northstar Foundry","Helix Semiconductor","Orion Microdevices","Meridian Logic","Summit Storage","Pioneer Silicon","Vela Microsystems"];
export const owners=["Maya Chen","Ravi Narayan","Elena Park","Daniel Ruiz","Priya Menon","Jordan Lee","Sofia Alvarez","Noah Kim","Aisha Rahman","Oliver Brooks","Mei Tan","Arjun Shah"];
export const stages=["Intake","Triage","Engineering","QA","Release","Customer update"];
export const subsystems=["EFEM / wafer handling","Chamber controls","Recipe execution","Factory interface","Endpoint / sensors","Transfer module"];
const titles=["Wafer handoff timeout after cassette change","Pressure stabilization alarm during recipe step","Recipe mismatch after maintenance","Host event sequence missing during recovery","Endpoint signal intermittently drops","Transfer arm retry exceeds cycle-time budget","RF setpoint deviation after controller restart","Load port state not cleared after abort","Wafer map reconciliation fails on resume","Chamber readiness handshake delayed after clean"];
const blockers=["Awaiting customer log bundle","Reproduction environment unavailable","QA regression slot pending","Release window awaiting approval","Root cause review pending","Field validation in progress","Customer sign-off pending","Dependency on controller patch"];
const rand=(n:number)=>{const x=Math.sin(n*127.1+78.233)*43758.5453;return x-Math.floor(x)};
const pick=<T,>(items:T[],seed:number)=>items[Math.floor(rand(seed)*items.length)%items.length];
const iso=(d:Date)=>d.toISOString().slice(0,10);
export const display=(d:string)=>new Date(d+"T12:00:00Z").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric",timeZone:"UTC"});
export const issues:Issue[]=Array.from({length:2700},(_,i)=>{
 const active=i<68,age=active?1+Math.floor(rand(i+811)*72):75+Math.floor(rand(i+170)*1740);
 const opened=iso(new Date(now.getTime()-age*day)),stage=active?pick(stages,i+11):"Closed",severity=pick(["Critical","High","High","Medium","Medium","Medium","Low"],i+22);
 const status=active?(i%4===0||(severity==="Critical"&&i%3===0)?"Blocked":i%3===0?"At risk":"On track"):"Closed";
 const owner=pick(owners,i+16),events=[{day:opened,text:"Customer escalation opened",by:"Field support"},{day:iso(new Date(now.getTime()-Math.max(age-2,0)*day)),text:"Impact and evidence reviewed",by:"Global product support"}];
 if(stage!=="Intake"&&stage!=="Triage")events.push({day:iso(new Date(now.getTime()-Math.max(age-7,0)*day)),text:"Engineering investigation linked",by:owner});
 if(["QA","Release","Customer update","Closed"].includes(stage))events.push({day:iso(new Date(now.getTime()-Math.max(age-12,0)*day)),text:"Fix candidate prepared for validation",by:owner});
 if(!active)events.push({day:iso(new Date(now.getTime()-Math.max(age-23,0)*day)),text:"Validated and customer informed",by:"Release operations"});
 return {id:`ESC-${10000+i}`,opened,age,customer:pick(customers,i+3),site:`${pick(["Fab A","Fab B","Fab C","Fab D"],i+28)} · ${pick(["Taiwan","Korea","US","Singapore","Japan"],i+46)}`,platform:pick(["2300 e4 / Kiyo","2300 e4 / Flex","2300 / Syndion","2300 / Versys"],i+9),subsystem:pick(subsystems,i+45),title:pick(titles,i+40),severity,stage,status,owner,team:pick(["Controls SW","Robotics","Product engineering","Global support","Quality engineering"],i+37),blocker:status==="Blocked"?pick(blockers,i+21):status==="At risk"?"Next milestone due within 48 hours":"—",release:`R${26-Math.floor(age/365)}.${pick(["2","3","4"],i+67)}`,hours:Math.round((severity==="Critical"?11:severity==="High"?5:1)*rand(i+99)*10)/10,repeat:rand(i+71)>.76,events};
});
export const active=issues.filter(x=>x.status!=="Closed");
export const tone=(x:string)=>["Critical","Blocked"].includes(x)?"danger":["High","At risk"].includes(x)?"caution":["Closed","Low"].includes(x)?"quiet":"safe";
export const monthly=Array.from({length:60},(_,j)=>{const year=2021+Math.floor((j+9)/12),month=(j+9)%12,list=issues.filter(x=>{const d=new Date(x.opened);return d.getUTCFullYear()===year&&d.getUTCMonth()===month});return {name:`${String(month+1).padStart(2,"0")}/${String(year).slice(2)}`,opened:list.length,critical:list.filter(x=>x.severity==="Critical").length}});
export const topBlockers=Object.entries(active.filter(x=>x.status==="Blocked").reduce((a,x)=>({...a,[x.blocker]:(a[x.blocker]||0)+1}),{} as Record<string,number>)).sort((a,b)=>b[1]-a[1]).slice(0,5);


export function queryEscalations(q:string){
const v=q.toLowerCase();let pool=active,heading="Current escalation briefing";
 if(/qa|test|regression/.test(v)){pool=pool.filter(x=>x.stage==="QA"||/QA|regression/i.test(x.blocker));heading="QA and regression exposure"}
 if(/red|block|hold|stuck/.test(v)){pool=pool.filter(x=>x.status==="Blocked");heading="Blocked escalations"}
 if(/critical|severe|p0/.test(v)){pool=pool.filter(x=>x.severity==="Critical");heading="Critical escalations"}
 if(/release|patch/.test(v)){pool=pool.filter(x=>x.stage==="Release"||/release|patch/i.test(x.blocker));heading="Release dependencies"}
 if(/repeat|recur/.test(v)){pool=pool.filter(x=>x.repeat);heading="Recurring issues"}
 if(/30 day|aging|old|overdue/.test(v)){pool=pool.filter(x=>x.age>30);heading="Aging escalations"}
 const person=owners.find(o=>v.includes(o.toLowerCase())||v.includes(o.split(" ")[0].toLowerCase()));if(person){pool=pool.filter(x=>x.owner===person);heading=`${person}'s queue`}
 const client=customers.find(o=>v.includes(o.toLowerCase()));if(client){pool=pool.filter(x=>x.customer===client);heading=`${client} exposure`}
 const dominant=Object.entries(pool.filter(x=>x.status==="Blocked").reduce((a,x)=>({...a,[x.blocker]:(a[x.blocker]||0)+1}),{} as Record<string,number>)).sort((a,b)=>b[1]-a[1])[0]?.[0];
 return {heading,body:pool.length?`${pool.length} matching open cases; ${pool.filter(x=>x.status==="Blocked").length} blocked, ${pool.filter(x=>x.severity==="Critical").length} critical. ${pool.reduce((n,x)=>n+x.hours,0).toFixed(1)} reported downtime hours in the synthetic history. Most common hold-up: ${dominant||"none recorded"}.`:"No open cases matched. Try a stage, owner, customer, severity, or blocker.",refs:pool.slice(0,5)};
}

export function filterIssues(view:string,severity:string,stage:string,search:string){
  return issues.filter(x=>(view==='History'||x.status!=='Closed')&&(severity==='All severity'||x.severity===severity)&&(stage==='All stages'||x.stage===stage)&&(!search||`${x.id} ${x.title} ${x.customer} ${x.owner} ${x.subsystem}`.toLowerCase().includes(search.toLowerCase())));
}
export function toCsv(rows:Issue[]){
  const cols=['id','opened','customer','platform','subsystem','severity','stage','status','owner','blocker','release','hours'] as const;
  return [cols.join(','),...rows.map(x=>cols.map(k=>'"'+String(x[k]).replaceAll('"','""')+'"').join(','))].join('\n');
}
