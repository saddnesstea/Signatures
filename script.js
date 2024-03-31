document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Добавляем обработчики событий для касания
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);

    // Добавляем обработчики событий для мыши (поддержка для компьютеров)
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    function startDrawing(e) {
        e.preventDefault(); // Предотвращаем действия по умолчанию (например, прокрутку страницы)
        isDrawing = true;
        [lastX, lastY] = [e.type.includes('mouse') ? e.offsetX : e.touches[0].clientX - canvas.getBoundingClientRect().left,
                          e.type.includes('mouse') ? e.offsetY : e.touches[0].clientY - canvas.getBoundingClientRect().top];
    }

    function draw(e) {
        e.preventDefault();
        if (!isDrawing) return;

        const x = e.type.includes('mouse') ? e.offsetX : e.touches[0].clientX - canvas.getBoundingClientRect().left;
        const y = e.type.includes('mouse') ? e.offsetY : e.touches[0].clientY - canvas.getBoundingClientRect().top;

        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        [lastX, lastY] = [x, y];
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
