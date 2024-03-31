document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }

    function draw(e) {
        if (!isDrawing) return;

        const x = e.offsetX;
        const y = e.offsetY;

        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';

        if (ctx.beginPath) {
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
        if (ctx.lineTo) {
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }

    function stopDrawing() {
        isDrawing = false;
    }

    document.getElementById('saveButton').addEventListener('click', saveSignature);

    function saveSignature() {
        const dataURL = canvas.toDataURL();
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://768c-37-204-52-76.ngrok-free.app/save-signature', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log('Подпись успешно сохранена');
                } else {
                    console.error('Ошибка сохранения подписи');
                }
            }
        };
        xhr.send(JSON.stringify({ imageData: dataURL }));
    }
});
