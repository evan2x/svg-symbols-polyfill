!function(window,document){"use strict";var ua=navigator.userAgent,MSBrowser=ua.match(/\b(?:MSIE\s*(?:9|10)\.0|Trident\/\d+\.\d+|Edge\/12\.(\d+))\b/i)||[],UCBrowser=/UCBrowser/i.test(ua)&&/(?:Android|Linux)/i.test(ua);if(document.addEventListener&&(MSBrowser.length||MSBrowser[1]<10547)||UCBrowser){var noop=function(){},supportCredentials="withCredentials"in XMLHttpRequest.prototype,domainRegex=/^(https?:)?\/\/((?:[\da-zA-Z]+\.)?(?:[\da-zA-Z][\da-zA-Z-]+\.)+[a-zA-Z]{2,6})/,client={xhr:function(url,options){var xhr=new XMLHttpRequest,onerror=options.error;xhr.open(options.method,url,!0),xhr.setRequestHeader("Content-Type",options.contentType),xhr.onload=function(){this.status>=200&&this.status<400?options.success.call(this,this.responseText,this):onerror.call(this)},xhr.onerror=onerror,xhr.onprogress=options.progress,xhr.send()},xdr:function(url,options){var xdr=new XDomainRequest;xdr.open(options.method,url),xdr.contentType=options.contentType,xdr.onload=function(){options.success.call(this,this.responseText,this)},xdr.onerror=options.error,xdr.onprogress=options.progress,xdr.send()}},request=function(url,options){if("string"!=typeof url)throw new TypeError("URL must be a string.");options=options||{},"function"!=typeof options.success&&(options.success=noop),"function"!=typeof options.error&&(options.error=noop),"function"!=typeof options.progress&&(options.progress=noop),options.method=options.method||"GET",options.contentType="text/plain";var cors=!1,match=url.match(domainRegex);if(Array.isArray(match)){var protocol=(match[1]||"").toLowerCase(),host=(match[2]||"").toLowerCase();cors=protocol!==location.protocol||host!==location.host}!cors||supportCredentials?client.xhr(url,options):client.xdr(url,options)},extractSymbols=function(){for(var href,url,hash,hashIndex,node,nodeList=document.querySelectorAll("svg > use"),ret={},i=0;node=nodeList[i++];)href=node.getAttribute("xlink:href"),href&&(hashIndex=href.indexOf("#"),url=href.slice(0,hashIndex),hash=href.slice(hashIndex,href.length),ret[url]||(ret[url]={}),ret[url][hash]||(ret[url][hash]=node));return ret},appendSVGDocument=function(fragment){var body=document.body,container=document.createElement("div");container.style.cssText="position: absolute; left: -999em; top: -999em;",container.innerHTML=fragment,body.insertBefore(container,body.firstChild)};document.addEventListener("DOMContentLoaded",function(){for(var url,symbolsSVGMap=extractSymbols(),urls=Object.keys(symbolsSVGMap),handler=function(url){return function(fragment){appendSVGDocument(fragment);for(var node,symbol,symbolsMap=symbolsSVGMap[url],symbols=Object.keys(symbolsMap),j=0;symbol=symbols[j++];)node=symbolsMap[symbol],node&&node.setAttribute("xlink:href",symbol)}},i=0;url=urls[i++];)request(url,{success:handler(url)})})}}(window,document);