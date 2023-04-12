let video;
let handPose;
let handResult;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  handPose = new Hands({locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
  handPose.setOptions({
    maxNumHands: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });
  handPose.onResults(onResults);

  const camera = new Camera(video.elt, {
    onFrame: async () => {
      await handPose.send({image: video.elt});
    },
    width: width,
    height: height
  });
  camera.start();
}

function onResults(results) {
  handResult = results;
}

function draw() {
  image(video, 0, 0, width, height);

  if (handResult && handResult.multiHandLandmarks) {
    for (const landmarks of handResult.multiHandLandmarks) {
      const indexFingerTip = landmarks[8];
      const thumbTip = landmarks[4];

      fill(255, 0, 0);
      noStroke();
      ellipse(indexFingerTip.x * width, indexFingerTip.y * height, 15, 15);
      ellipse(thumbTip.x * width, thumbTip.y * height, 15, 15);
    }
  }
}
