function p(e,o){if(!e||e.length===0)return;const t=Object.keys(e[0]),n=e.map(d=>t.map(a=>{const i=d[a];return i==null?"":typeof i=="object"?JSON.stringify(i):String(i).replace(/,/g,";")}).join(",")),c=[t.join(","),...n].join(`
`),s=new Blob(["\uFEFF"+c],{type:"text/csv;charset=utf-8"}),l=URL.createObjectURL(s),r=document.createElement("a");r.href=l,r.download=o+".csv",r.click(),URL.revokeObjectURL(l)}function u(e,o){const t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),n=URL.createObjectURL(t),c=document.createElement("a");c.href=n,c.download=o+".json",c.click(),URL.revokeObjectURL(n)}function b(e,o){const t=document.getElementById(e);if(!t)return;const n=window.open("","_blank");n.document.write(`<html><head><title>${o}</title>
<style>
  body { font-family: sans-serif; padding: 20px; color: #111; }
  table { border-collapse: collapse; width: 100%; }
  td, th { border: 1px solid #ddd; padding: 8px; }
  img { max-width: 120px; }
  @media print { button { display: none; } }
</style>
</head><body>${t.innerHTML}<script>window.print();window.close()<\/script></body></html>`),n.document.close()}export{p as a,u as e,b as p};
