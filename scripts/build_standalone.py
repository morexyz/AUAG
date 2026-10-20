#!/usr/bin/env python3
"""Creates an optional portable HTML artifact. Runtime project needs no bundling."""
import json,re,posixpath,base64
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
ENTRY='src/app.js'
loaded={};order=[]
pat=re.compile(r"(?:\bfrom\s*|\bimport\s*\(\s*)['\"](\.[^'\"]+)['\"]")
def visit(path):
 if path in loaded:return
 source=(ROOT/path).read_text(encoding='utf8');loaded[path]=source
 for relative in pat.findall(source):
  target=posixpath.normpath(posixpath.join(posixpath.dirname(path),relative))
  if not (ROOT/target).exists():raise ValueError(f'Missing dependency: {target}')
  visit(target)
 order.append(path)
visit(ENTRY)
html=(ROOT/'index.html').read_text(encoding='utf8')
for css in ['tokens.css','layout.css','motion.css','brand.css']:
 rel=f'./assets/css/{css}'
 html=html.replace(f'<link rel="stylesheet" href="{rel}">',f'<style>\n{(ROOT/"assets/css"/css).read_text()}\n</style>')
image_data=base64.b64encode((ROOT/'assets/img/auag-mark.png').read_bytes()).decode('ascii')
html=html.replace('./assets/img/auag-mark.png','data:image/png;base64,'+image_data)
worker=(ROOT/'src/workers/field.worker.js').read_text(encoding='utf8')
loader='''
const sources=SOURCE_DATA;
const order=MODULE_ORDER;
const urls={};
window.__AUAG_WORKER_SOURCE__=WORKER_DATA;
function resolve(parent,relative){const parts=parent.split('/');parts.pop();for(const part of relative.split('/')){if(part==='..')parts.pop();else if(part!=='.')parts.push(part)}return parts.join('/')}
for(const path of order){let source=sources[path];source=source.replace(/(from\\s*|import\\s*\\(\\s*)(['"])(\\.[^'"]+)\\2/g,(match,prefix,quote,relative)=>{
 const dep=resolve(path,relative);
 if(!urls[dep])throw new Error('Unresolved dependency '+dep+' from '+path);
 return prefix+quote+urls[dep]+quote;
 });urls[path]=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));}
await import(urls['src/app.js']);
'''.replace('SOURCE_DATA',json.dumps(loaded,ensure_ascii=False)).replace('MODULE_ORDER',json.dumps(order)).replace('WORKER_DATA',json.dumps(worker,ensure_ascii=False))
html=html.replace('<script type="module" src="./src/app.js"></script>',f'<script type="module">\n{loader}\n</script>')
output=ROOT/'AUAG_Standalone.html';output.write_text(html,encoding='utf8')
print(f'Generated {output} ({output.stat().st_size:,} bytes), {len(loaded)} modules')
