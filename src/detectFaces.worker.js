import cvLoader from './opencv_js.mjs';
import cvModule from './opencv_js.wasm';
import haarcascade_frontalface_default
  from './opencv_data/haarcascades/haarcascade_frontalface_default.xml';
// Since webpack will change the name and potentially the path of the 
// `.wasm` file, we have to provide a `locateFile()` hook to redirect
// to the appropriate URL.
// More details: https://kripken.github.io/emscripten-site/docs/api_reference/module.html
const cv = cvLoader({
  locateFile(path) {
    if(path.endsWith('.wasm')) {
      return cvModule;
    }
    return path;
  }
});

let classifier = null;

cv.onRuntimeInitialized = async () => {
 console.log('📦OpenCV runtime loaded');
 init();
};

async function createFileFromUrl(path, url) {
    // Small function to make a remote file visible from emscripten module.

    console.log(`⬇️ Downloading additional file from ${url}.`);
    const res = await self.fetch(url);
    if (!res.ok) {
        throw new Error(`Response is not OK (${res.status} ${res.statusText} for ${url})`);
    }
    const buffer = await res.arrayBuffer();
    const data = new Uint8Array(buffer);
    cv.FS_createDataFile('/', path, data, true, true, false);
    console.log(`📦${url} downloaded. Mounted on /${path}`);
}

async function init() {
    await createFileFromUrl('haarcascade_frontalface_default.xml',
                            haarcascade_frontalface_default);

    classifier = new cv.CascadeClassifier();
    classifier.load('haarcascade_frontalface_default.xml');

    // Let the UI that the module finished initialization
    self.postMessage({ type: 'init' });

    self.addEventListener('message', ({ data }) => {
        if (data.type === 'frame') {
            const faces = detectFaces(data.imageData);
            self.postMessage({ type: 'detect_faces', faces: faces });
        }
    });
}

function detectFaces(imageData) {
    const img = cv.matFromImageData(imageData);
    const imgGray = new cv.Mat();

    const rect = [];
    cv.cvtColor(img, imgGray, cv.COLOR_RGBA2GRAY, 0);
    const faces = new cv.RectVector();
    const msize = new cv.Size(0, 0);
    classifier.detectMultiScale(imgGray, faces, 1.1, 3, 0, msize, msize);

    for (let i = 0; i < faces.size(); i++) {
        rect.push(faces.get(i));
    }

    img.delete();
    faces.delete();
    imgGray.delete();

    return rect;
}

function log(args) {
    self.postMessage({ type: 'log', args: Array.from(arguments) });
}