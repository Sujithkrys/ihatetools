const fs = require('fs');

// Tiny 1x1 transparent PNG
const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

// Tiny 1x1 black JPEG
const jpgBase64 = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";

fs.writeFileSync('test1.png', Buffer.from(pngBase64, 'base64'));
fs.writeFileSync('test1.jpg', Buffer.from(jpgBase64, 'base64'));
console.log("Created test1.png and test1.jpg");
