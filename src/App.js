import './App.css';

let Worker;

if (process.env.BUILD_TARGET==='client') {
  Worker = require('./detectFaces.worker');

}
// Scaled (reduced) image resolution for processing.
// Lesser is faster.
const PROCESSING_RESOLUTION_WIDTH = 240;

/*
function updateFps() {
    const now = window.performance.now();
    const interval = now - lastUpdate;
    lastUpdate = now;

    const fps = Math.round(1000 / interval);

    document.querySelector('#fps').textContent = `${fps}FPS`;
}
*/

import React from 'react';

const FramesOverlay = ({ faces, scale }) => {
  return (<div className="framesOverlay">{ faces.map(face=>
    <div className="faceRect" style={{
      top: face.y / scale,
      left: face.x / scale,
      width: face.width / scale,
      height: face.height / scale
    }}></div>)}
  </div>)
}


const DetectFaces = () => {
  const videoRef = React.useRef();
  const canvasRef = React.useRef();
  const [ scale, setScale ] = React.useState(1);
  const [ faces, setFaces ] = React.useState([]);

  const worker = React.useMemo(()=>Worker ? new Worker() : Worker, []);

  const detectFaces = React.useCallback(()=>{
    const ctx = canvasRef.current.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);

    worker.postMessage({ type: 'frame', imageData }, [ imageData.data.buffer ]);
  }, []);


  const workerCallback = React.useCallback(({ data })=>{
    switch (data.type) {
      case 'init':
        console.log('Worker initialization finished. Starting face detection 🚀');
        detectFaces();
        break;
      case 'detect_faces':
        requestAnimationFrame(() => {
          setFaces(data.faces);
        });
        detectFaces();
        break;
      case 'log':
        console.log('worker👷💬', ...data.args);
        break;
    }
  });


  React.useEffect(() => {
    const init = async () => {
    const stream = await navigator.mediaDevices
    .getUserMedia({ video: true, audio: false });
    const settings = stream.getVideoTracks()[0].getSettings();

    const scale = PROCESSING_RESOLUTION_WIDTH / settings.width;
    
    setScale(scale);

    canvasRef.current.setAttribute('width', settings.width * scale);
    canvasRef.current.setAttribute('height', settings.height * scale);
    canvasRef.current.style.display = 'none';

    videoRef.current.setAttribute('width', settings.width);
    videoRef.current.setAttribute('height', settings.height);
    videoRef.current.srcObject = stream;
    await videoRef.current.play();
    };
    init();

    console.log('Initializing the face detection worker');
    worker.addEventListener('message', workerCallback);
    return () => {
      worker.removeEventListener(workerCallback);
    }
}, []);
return (<div className="videoWrapper">
    <video ref={videoRef} />
    <canvas ref={canvasRef} />
    <FramesOverlay faces={faces} scale={scale} />
  </div>)
}

const App = () => <div>Welcome to Razzle.<DetectFaces /></div>;

export default App;
