const fs = require('fs'); 
const files = [
  'e:/ihatetools/node_modules/onnxruntime-web/dist/ort.bundle.min.mjs', 
  'e:/ihatetools/node_modules/onnxruntime-web/dist/ort.node.min.mjs', 
  'e:/ihatetools/node_modules/onnxruntime-web/dist/ort.webgpu.bundle.min.mjs'
]; 
for (const file of files) { 
  if (fs.existsSync(file)) { 
    let code = fs.readFileSync(file, 'utf8'); 
    code = code.replace(/import\.meta\.url/g, '""'); 
    fs.writeFileSync(file, code); 
    console.log('patched ' + file);
  } 
}
