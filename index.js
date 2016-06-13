
(function(window, document) {
  'use strict';

  var ua = navigator.userAgent,
    MSBrowser = ua.match(/\b(?:MSIE\s*(?:9|10)\.0|Trident\/\d+\.\d+|Edge\/12\.(\d+))\b/i) || [],
    UCBrowser = /UCBrowser/i.test(ua) && /(?:Android|Linux)/i.test(ua);

  // IE9+/Edge 12/Android UC
  if (document.addEventListener && (MSBrowser.length || MSBrowser[1] < 10547) || UCBrowser) {
    var noop = function() {}, // eslint-disable-line no-empty-function
      supportCredentials = 'withCredentials' in XMLHttpRequest.prototype,
      domainRegex = /^(https?:)?\/\/((?:[\da-zA-Z]+\.)?(?:[\da-zA-Z][\da-zA-Z-]+\.)+[a-zA-Z]{2,6})/,
      client = {
        xhr: function(url, options) {
          var xhr = new XMLHttpRequest(),
            onerror = options.error;

          xhr.open(options.method, url, true);
          xhr.setRequestHeader('Content-Type', options.contentType);

          xhr.onload = function() {
            if (this.status >= 200 && this.status < 400) {
              options.success.call(this, this.responseText, this);
            } else {
              onerror.call(this);
            }
          };

          xhr.onerror = onerror;
          xhr.onprogress = options.progress;

          xhr.send();
        },
        xdr: function(url, options) {
          var xdr = new XDomainRequest();

          xdr.open(options.method, url);
          xdr.contentType = options.contentType;

          xdr.onload = function() {
            options.success.call(this, this.responseText, this);
          };

          xdr.onerror = options.error;
          xdr.onprogress = options.progress;

          xdr.send();
        }
      },
      /**
       * 发起一个Ajax请求
       * @param {String} url 请求地址
       * @param {Object} options 请求参数
       * @param {String} options.method 请求类型
       * @param {Function} options.success 请求成功的回调函数
       * @param {Function} options.error 请求失败的回调函数
      */
      request = function(url, options) {
        if (typeof url !== 'string') {
          throw new TypeError('URL must be a string.');
        }

        options = options || {};

        if (typeof options.success !== 'function') {
          options.success = noop;
        }

        if (typeof options.error !== 'function') {
          options.error = noop;
        }

        if (typeof options.progress !== 'function') {
          options.progress = noop;
        }

        options.method = options.method || 'GET';
        options.contentType = 'text/plain';

        var cors = false,
          match = url.match(domainRegex);

        // 检测请求地址是一个域名且非同域的情况下则认为是跨域请求
        if (Array.isArray(match)) {
          var protocol = (match[1] || '').toLowerCase(),
            host = (match[2] || '').toLowerCase();

          cors = protocol !== location.protocol || host !== location.host;
        }

        if (!cors || supportCredentials) {
          client.xhr(url, options);
        } else {
          client.xdr(url, options);
        }
      },
      /**
       * 提取页面中的SVG Symbols
       * @return
       *  {
       *    '/icon-symbols.svg': {
       *      '#backup': '[object SVGUseElement]',
       *      '#battery': '[object SVGUseElement]'
       *    }
       *  }
       */
      extractSymbols = function() {
        var nodeList = document.querySelectorAll('svg > use'),
          ret = {},
          href, url, hash, hashIndex;

        for (var i = 0, node; node = nodeList[i++];) {
          href = node.getAttribute('xlink:href');

          if (href) {
            hashIndex = href.indexOf('#');
            url = href.slice(0, hashIndex);
            hash = href.slice(hashIndex, href.length);

            if (!ret[url]) {
              ret[url] = {};
            }

            if (!ret[url][hash]) {
              ret[url][hash] = node;
            }
          }
        }

        return ret;
      },
      /**
       * 插入SVG文档
       * @param {String} fragment 文本片段
       */
      appendSVGDocument = function(fragment) {
        var body = document.body,
          container = document.createElement('div');

        container.style.cssText = 'position: absolute; left: -999em; top: -999em;';
        container.innerHTML = fragment;
        body.insertBefore(container, body.firstChild);
      };

    // DOM Ready
    document.addEventListener('DOMContentLoaded', function() {
      var symbolsSVGMap = extractSymbols(),
        urls = Object.keys(symbolsSVGMap),
        handler = function(url) {
          return function(fragment) {
            appendSVGDocument(fragment);

            var symbolsMap = symbolsSVGMap[url],
              symbols = Object.keys(symbolsMap),
              node;

            for (var j = 0, symbol; symbol = symbols[j++];) {
              node = symbolsMap[symbol];
              if (node) {
                node.setAttribute('xlink:href', symbol);
              }
            }
          };
        };

      for (var i = 0, url; url = urls[i++];) {
        request(url, {
          success: handler(url)
        });
      }
    });
  }

})(window, document);
