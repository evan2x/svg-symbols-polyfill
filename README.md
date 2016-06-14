# SVG Symbols Polyfill

用于处理在 `IE9+/Edge12/Android UC` 浏览器中SVG `<use>` 无法使用外部SVG Symbols文件的问题。

## Methods

### SVGSymbolsPolyfill.scan(node)

扫描指定节点下的 SVG `<use>` 元素，修正无法使用外部资源的问题。

**在 `DOM Ready` 后会自动调用一次**
