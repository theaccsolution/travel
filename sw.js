const C="hk-v1";
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.add("/")).catch(()=>{}));self.skipWaiting()});
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
 if(u.pathname.startsWith("/api/"))return;if(u.hostname.endsWith("open-meteo.com"))return;
 if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put("/",cp));return res}).catch(()=>caches.match("/")));return}
 e.respondWith(caches.match(r,{ignoreVary:true}).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==="opaque"){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})))});
self.addEventListener("message",e=>{const d=e.data;if(!d||!d.urls)return;e.waitUntil((async()=>{const c=await caches.open(C);let ok=0;
 for(const x of d.urls){try{const same=x.startsWith("/");const res=await fetch(x,same?{cache:"reload"}:{mode:"no-cors"});await c.put(same?x:new Request(x,{mode:"no-cors"}),res);ok++}catch(_){}}
 if(e.source)e.source.postMessage({done:ok,total:d.urls.length})})())});
