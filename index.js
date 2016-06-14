(function(window, document) {
  'use strict';

  var UA = navigator.userAgent,
    /**
     * Empty function
     * @type {Function}
     */
    noop = function() {},
    /**
     * Regexp object collection
     * @type {Object}
     */
    regex = {
      ms: /\b(?:MSIE\s*(?:9|10)\.0|Trident\/\d+\.\d+|Edge\/12\.(\d+))\b/i,
      android: /Android/i,
      uc: /UCBrowser/i
    },
    /**
     * match IE9+/Edge12 browser
     * @type {Array}
     */
    MSBrowser = UA.match(regex.ms) || [],
    /**
     * Check UC Browser
     * @type {Boolean}
     */
    UCBrowser = regex.uc.test(UA) && regex.android.test(UA),
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

      var onsuccess = options.success,
        onerror = options.error;

      if (typeof onsuccess !== 'function') {
        onsuccess = noop;
      }

      if (typeof onerror !== 'function') {
        onerror = noop;
      }

      options.method = options.method || 'GET';

      var xhr = new XMLHttpRequest();

      xhr.open(options.method, url, true);
      xhr.setRequestHeader('Content-Type', 'text/plain');

      xhr.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          onsuccess.call(this, this.responseText, this);
        } else {
          onerror.call(this);
        }
      };
      xhr.onerror = onerror;

      xhr.send();
    },
    /**
     * 提取页面中的SVG Symbols
     * @param {Element} el
     * @return
     *  {
     *    '/icon-symbols.svg': {
     *      '#backup': '[object SVGUseElement]',
     *      '#battery': '[object SVGUseElement]'
     *    }
     *  }
     */
    extractSymbols = function(el) {
      var nodeList = el.querySelectorAll('svg > use'),
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
     * 在页面中插入SVG文档
     * @param {String} fragment 文本片段
     */
    appendSVGDocument = function(fragment) {
      var body = document.body,
        container = document.createElement('div');

      container.style.cssText = 'position: absolute; left: -999em; top: -999em;';
      container.innerHTML = fragment;
      body.insertBefore(container, body.firstChild);
    },
    /**
     * 扫描当前节点下的SVG Symbols进行处理
     * @param {Element}
     */
    scan = function(el, callback) {
      callback = callback || noop;

      var symbolsSVGMap = extractSymbols(el),
        urls = Object.keys(symbolsSVGMap),
        counter = 0,
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

            if (++counter === urls.length) {
              callback();
            }
          };
        };

      for (var i = 0, url; url = urls[i++];) {
        request(url, {
          success: handler(url)
        });
      }
    };

  // IE9+/Edge 12/Android UC
  if (document.addEventListener && (MSBrowser.length || MSBrowser[1] < 10547) || UCBrowser) {

    // DOM Ready
    document.addEventListener('DOMContentLoaded', function() {
      scan(document.body);
    });

    window.SVGSymbolsPolyfill = {
      scan: scan,
      version: '__VERSION__'
    }
  }

})(window, document);
