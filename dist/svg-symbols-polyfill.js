!function(t,e){"use strict";var n=navigator.userAgent,s=function(){},o={ms:/\b(?:MSIE\s*(?:9|10)\.0|Trident\/\d+\.\d+|Edge\/12\.(\d+))\b/i,android:/Android/i,uc:/UCBrowser/i},r=n.match(o.ms)||[],i=o.uc.test(n)&&o.android.test(n),c=function(t,e){if("string"!=typeof t)throw new TypeError("URL must be a string.");e=e||{};var n=e.success,o=e.error;"function"!=typeof n&&(n=s),"function"!=typeof o&&(o=s),e.method=e.method||"GET";var r=new XMLHttpRequest;r.open(e.method,t,!0),r.setRequestHeader("Content-Type","text/plain"),r.onload=function(){this.status>=200&&this.status<400?n.call(this,this.responseText,this):o.call(this)},r.onerror=o,r.send()},u=function(t){for(var e,n,s,o,r,i=t.querySelectorAll("svg > use"),c={},u=0;r=i[u++];)e=r.getAttribute("xlink:href"),e&&(o=e.indexOf("#"),n=e.slice(0,o),s=e.slice(o,e.length),c[n]||(c[n]={}),c[n][s]||(c[n][s]=r));return c},d=function(t){var n=e.body,s=e.createElement("div");s.style.cssText="position: absolute; left: -999em; top: -999em;",s.innerHTML=t,n.insertBefore(s,n.firstChild)},a=function(t,e){e=e||s;for(var n,o=u(t),r=Object.keys(o),i=0,a=function(t){return function(n){d(n);for(var s,c,u=o[t],a=Object.keys(u),f=0;c=a[f++];)s=u[c],s&&s.setAttribute("xlink:href",c);++i===r.length&&e()}},f=0;n=r[f++];)c(n,{success:a(n)})};(e.addEventListener&&(r.length||r[1]<10547)||i)&&(e.addEventListener("DOMContentLoaded",function(){a(e.body)}),t.SVGSymbolsPolyfill={scan:a,version:"0.2.0"})}(window,document);