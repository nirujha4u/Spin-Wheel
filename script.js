let names = [],
    colors = [],
    sliceDeg,
    speed = 0,
    slowDownRand = 0,
    ctx,
    width,
    center,
    deg,
    isStopped = false,
    lock = false,
    winner;
    acceleration = 0.2,   
    deceleration = 0.99;  


const namesContainer = document.getElementById("names");

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const fixedColors = [
    "Red", 
    "Green",
    "Blue",
    "#fc0fc0",
    "ORANGE",
];

const checkTextArea = () => {
    names = namesContainer.value
        .split(",")
        .map(item => item.trim());
    document.getElementById("counter").innerText = `${names.length} names`;
    sliceDeg = 360 / names.length;
};

const fillColors = () => {
    colors = []; 
    while (colors.length < names.length) {
        colors.push(fixedColors[colors.length % fixedColors.length]);
    }
};

const rand = (min, max) => Math.random() * (max - min) + min;

deg = rand(0, 360);

const deg2rad = (deg) => (deg * Math.PI) / 180;

const drawSlice = (deg, color) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(center, center);
    ctx.arc(center, center, width / 2, deg2rad(deg), deg2rad(deg + sliceDeg));
    ctx.lineTo(center, center);
    ctx.fill();
};

const drawText = (deg, text) => {
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(deg2rad(deg));
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px 'Open Sans', sans-serif";
    ctx.fillText(text, center - 20, center / (names.length * 4));
    ctx.restore();
};

const drawImg = () => {
    width = Math.max((names.length + 2) * 30, 280);
    const canvas = document.createElement("canvas");
    document.getElementById("wheel").innerHTML = "";
    document.getElementById("wheel").appendChild(canvas);
    ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = width;
    center = width / 2;
    fillColors();
    ctx.clearRect(0, 0, width, width);
    for (let i = 0; i < names.length; i++) {
        drawSlice(deg, colors[i]);
        drawText(deg + sliceDeg / 2, names[i]);
        deg += sliceDeg;
    }
};

const fram1 = document.querySelector('.frame1');    
const fram2 = document.querySelector('.frame2');
const successMsg = fram2.querySelector('#finalSubmit');
const submitSpinResult = (value) => {

    const form = document.querySelector("#myForm")
    const submitButton = document.querySelector("#formbutton")
    const scriptURL = 'https://script.google.com/macros/s/AKfycbz33kiMl8Kgy-DrblkJM9z2xxOrjaalMskN2xwkglB3khG8-06eyLnSUj8X9qEL00Co/exec';
    // const scriptURL = 'https://script.google.com/macros/s/AKfycbz1KErn54D9fiMlK_o1rzaH8Cz6G8cAhnz71N3ZQD92XR4VSdyP0_3YmntrTMoTpMx5Pw/exec';

    form.addEventListener('submit', e => {
        submitButton.disabled = true
        e.preventDefault()
        let requestBody = new FormData(form)
       // requestBody = new FormData();
        requestBody.append('SpinResult', value);
        fetch(scriptURL, { method: 'POST', body: requestBody})
          .then(response => {
            successMsg.classList.add('msgSubmit');
            // response.text();
            fram2
             submitButton.disabled = false
            })
          .catch(error => {
            submitButton.disabled = false
   
          }
          )
      })   
    // const scriptURL = 'https://script.google.com/macros/s/AKfycbz33kiMl8Kgy-DrblkJM9z2xxOrjaalMskN2xwkglB3khG8-06eyLnSUj8X9qEL00Co/exec';
    // const formData = new FormData();
    // formData.append('SpinResult', value);
    // fetch(scriptURL, { method: 'POST', body: formData })
    //     .then(response => 
    //         response.text()
    //     )
    //     .then(result => 
    //         console.log('Success:', result)
    //     )
    //     .catch(error => 
    //         console.error('Error:', error)
    //     );                                               
 };

 const spinValue = fram1.querySelector('#spinValue');

const spinWheel = () => {
    deg += speed; // Increase the rotation angle by the speed
    deg %= 360; // Ensure deg stays within 0-360 degrees

    if (!isStopped && speed < 10) {
        speed += acceleration;  // Accelerate the wheel
    }

    if (isStopped) {
        speed *= deceleration; // Gradually slow down
        if (speed < 0.05) { // Once the speed is very low, stop the wheel
            speed = 0;
            if (!lock) {
                lock = true;
                const ai = Math.floor(((360 - deg - 90) % 360) / sliceDeg) % names.length;
                winner = (names.length + ai) % names.length;
                spinValue.textContent = `Result: ${names[winner]}`;
                submitSpinResult(names[winner]);
                setTimeout(() => {
                    fram1.style.display = 'none';
                    fram2.style.display = 'block';
                }, 4000);
            }
            return;
        }
    }
    drawImg(); // Redraw the wheel with updated degrees
    window.requestAnimationFrame(spinWheel); // Continue the animation
};

const reset = () => {
    shuffle(names);
    sliceDeg = 360 / names.length;
    drawImg();
};

document.getElementById("spin").addEventListener("mousedown", () => {
    if (speed === 0) { // Ensure it doesn't allow double-click spins
        spinWheel();
        setTimeout(() => {
            isStopped = true;
        }, 3000); // Stop after 3 seconds of spinning
    }
}, false);


namesContainer.addEventListener("input", () => {
    checkTextArea();
    reset();
}, false);

document.getElementById("remove").addEventListener("mousedown", () => {
    names.splice(winner, 1);
    reset();
}, false);

checkTextArea();
drawImg();
