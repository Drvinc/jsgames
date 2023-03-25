document.getElementById('generate-qr').addEventListener('click', generateQRCode);
document.getElementById('save-qr').addEventListener('click', saveQRCodeAsPNG);

function generateQRCode() {
    const inputText = document.getElementById('input-text').value;
    const qrCodeCanvas = document.getElementById('qr-code');
    const canvasSize = Math.min(window.innerWidth * 0.95, window.innerHeight * 0.95);

    // Clear the canvas before generating a new QR code
    qrCodeCanvas.width = canvasSize;
    qrCodeCanvas.height = canvasSize;
    qrCodeCanvas.getContext('2d').clearRect(0, 0, canvasSize, canvasSize);

    if (inputText.trim() !== '') {
        QRCode.toCanvas(qrCodeCanvas, inputText, {width: canvasSize, height: canvasSize}, function (error) {
            if (error) {
                console.error(error);
            } else {
                displayInputText(inputText);
            }
        });
    }
}

function displayInputText(inputText) {
    const inputDisplay = document.getElementById('input-display');
    inputDisplay.textContent = inputText;
    inputDisplay.style.display = 'block';
    inputDisplay.style.bottom = (qrCodeCanvas.height - inputDisplay.offsetHeight - 1) + 'px';
}

function saveQRCodeAsPNG() {
    const inputText = document.getElementById('input-text').value;
    const pngSize = 800;

    if (inputText.trim() !== '') {
        QRCode.toDataURL(inputText, {width: pngSize, height: pngSize}, function (error, url) {
            if (error) {
                console.error(error);
            } else {
                const link = document.createElement('a');
                link.href = url;
                link.download = 'qr-code.png';
                link.click();
            }
        });
    }
}
