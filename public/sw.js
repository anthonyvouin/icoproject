if(!self.define){let e,s={};const a=(a,n)=>(a=new URL(a+".js",n).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(n,t)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let c={};const r=e=>a(e,i),u={module:{uri:i},exports:c,require:r};s[i]=Promise.all(n.map((e=>u[e]||r(e)))).then((e=>(t(...e),c)))}}define(["./workbox-f1770938"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/EMXhHhtARwFBVuyUPwmFj/_buildManifest.js",revision:"f0c6ff089278850fdb8367e6ab705061"},{url:"/_next/static/EMXhHhtARwFBVuyUPwmFj/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/173-18a2140f11a25896.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/455-422d7c00d5a46764.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/4bd1b696-dc53661a9e7a1ea0.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/565-4a703b6c238e886d.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/_not-found/page-3714ba35897ce71d.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/admin/cards/page-f16b4ab0fc6cc612.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/admin/contacts/page-f3265a2fc1517393.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/admin/game-settings/page-eaf700a0c62952ed.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/admin/page-d06ca5646b3f54c0.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/admin/rules/page-381f58d8f47853ed.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/admin/timer/page-470a88c3d6391d88.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/api/admin/cards/%5Bid%5D/route-ffa0d6f812073ca9.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/api/admin/cards/route-fef8cc8dae6668a7.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/api/admin/contacts/route-e02bd7587c7d80e4.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/api/admin/game-settings/route-823b8b085559e87b.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/api/admin/game/route-c8ec1ac3bc3d620b.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/api/admin/rules/route-1577abedff3bbaa7.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/api/admin/timer/route-e6af7204773b09e9.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/api/admin/users/route-3cb50b6d576ec3a2.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/api/contact/route-b131c53c42e93a08.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/api/game/end/route-5df9eb438eec0615.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/api/game/start/route-0617954e79d04a9d.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/api/login/route-874003b15e4d3922.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/api/profile/route-d7aea24ec679c970.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/api/register/route-4fcd5d0a0aef675d.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/api/rules/route-b98d6081995adb72.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/contact/page-0b7597a6e55d4837.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/game/page-8fa489be7a78b902.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/layout-e53f765af16d0c40.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/login/page-d2c88ae2046a3959.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/page-493bd0a99cafa9bd.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/profile/page-a371dc6fb89e853f.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/register/page-0747ba421a03e0b0.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/app/rules/page-a9a27ce77296b7ff.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/framework-6b27c2b7aa38af2d.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/main-af4e9f44c6dc0ec1.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/main-app-eddddfd37668f734.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/pages/_app-a882fb6335932b59.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/pages/_error-0dc8da009ccb362d.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-6136fb8e9ce9ea15.js",revision:"EMXhHhtARwFBVuyUPwmFj"},{url:"/_next/static/css/09ffe34a909495ad.css",revision:"09ffe34a909495ad"},{url:"/_next/static/media/569ce4b8f30dc480-s.p.woff2",revision:"ef6cefb32024deac234e82f932a95cbd"},{url:"/_next/static/media/ba015fad6dcf6784-s.woff2",revision:"8ea4f719af3312a055caf09f34c89a77"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/icons/icon-128x128.png",revision:"d6d11d7d32e8149ea18b4597a7d9ee76"},{url:"/icons/icon-144x144.png",revision:"816b4eca0c547b150efc0b219348eb4b"},{url:"/icons/icon-152x152.png",revision:"352e1e4b4c08c84dfe6be9b68506c52e"},{url:"/icons/icon-192x192.png",revision:"cb47b3aa57fbf47c11a7fc2c1162ca58"},{url:"/icons/icon-384x384.png",revision:"ac05d8a7ec31e7b45dc06aeaf29cb749"},{url:"/icons/icon-512x512.png",revision:"2b816de99a04b003b9ea4414913047f1"},{url:"/icons/icon-72x72.png",revision:"5958ae9d49141769b6f8cc5691cfe111"},{url:"/icons/icon-96x96.png",revision:"60deb46b631cf8c79e6549590ebc70fd"},{url:"/jeu.webp",revision:"046c3afe521b90eb0a6c0b90f6aed35f"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/swe-worker-5c72df51bb1f6ee0.js",revision:"5a47d90db13bb1309b25bdf7b363570e"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:function(e){return _ref.apply(this,arguments)}}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute(/\/_next\/static.+\.js$/i,new e.CacheFirst({cacheName:"next-static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4|webm)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:48,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((function(e){var s=e.sameOrigin,a=e.url.pathname;return!(!s||a.startsWith("/api/auth/callback")||!a.startsWith("/api/"))}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((function(e){var s=e.request,a=e.url.pathname,n=e.sameOrigin;return"1"===s.headers.get("RSC")&&"1"===s.headers.get("Next-Router-Prefetch")&&n&&!a.startsWith("/api/")}),new e.NetworkFirst({cacheName:"pages-rsc-prefetch",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((function(e){var s=e.request,a=e.url.pathname,n=e.sameOrigin;return"1"===s.headers.get("RSC")&&n&&!a.startsWith("/api/")}),new e.NetworkFirst({cacheName:"pages-rsc",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((function(e){var s=e.url.pathname;return e.sameOrigin&&!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"pages",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((function(e){return!e.sameOrigin}),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET"),self.__WB_DISABLE_DEV_LOGS=!0}));