
(async () => {
  const video = document.createElement('video');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let handResult;

  // Add the canvas to the body
  document.body.appendChild(canvas);

  // Set up the video stream
  video.width = 640;
  video.height = 480;
  canvas.width = 640;
  canvas.height = 480;

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  video.play();

  const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
  hands.setOptions({
    maxNumHands: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  hands.onResults(onResults);

  video.addEventListener('loadeddata', () => {
    const updateHands = async () => {
      try {
        await hands.send({ image: video });
      } catch (error) {
        console.error('Error:', error);
      }
      requestAnimationFrame(updateHands);
    };
    updateHands();
  });

  function draw() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    requestAnimationFrame(draw);
  }

  draw();
})();

function onResults(results) {
  handResult = results;

  if (handResult && handResult.multiHandLandmarks) {
    for (const landmarks of handResult.multiHandLandmarks) {
      const indexFingerTip = landmarks[8];
      console.log('Index finger tip location:', indexFingerTip.x, indexFingerTip.y);
    }
  }
}
