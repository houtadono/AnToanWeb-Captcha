const captchaContainer = document.querySelector('.captchaContainer');
const captchaPopup = document.querySelector('.captchaPopup');
const captchaDisplay = document.querySelector('.captchaDisplay');

const closeCaptchaButton = document.querySelector('.closeCaptcha');
const reloadCaptcha = document.querySelector('.reloadCaptcha');
var checkbox = document.querySelector('input[type="checkbox"]');
const loadCheck = document.querySelector(".spinner");
let audioPlayer = document.getElementById('audioPlayer');

document.querySelectorAll('input[type="radio"]').forEach(radioBtn =>
    radioBtn.addEventListener('click', () => document.querySelector('input[type="checkbox"]').checked = false)
);


// Get Captcha
checkbox.addEventListener('click', async function () {
    captchaPopup.style.display = 'block';
    checkbox.style.display ='none';
    loadCheck.style.display = 'block';
    selectedCaptcha = document.querySelector('input[name="captchaType"]:checked').value;
    checkbox.checked = false;
    fetch('/captcha', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'type_captcha': selectedCaptcha })
    })
    .then(response => response.json())
    .then(data => {
        while (captchaDisplay.firstChild) {
            captchaDisplay.removeChild(captchaDisplay.firstChild);
        }
        captchaDisplay.innerHTML = data.innerElement;
        audioPlayer = document.getElementById('audioPlayer');
        if (audioPlayer)
            audioPlayer.play();
    });
});

function closeCaptchaPopup(){
    checkbox.style.display = 'block';
    captchaPopup.style.display = 'none';
    if (audioPlayer) audioPlayer.pause();
    captchaInput.value = '';
    loadCheck.style.display = 'none';
}

closeCaptchaButton.addEventListener('click', function () {
    closeCaptchaPopup();
});

document.addEventListener('click', function (event) {
    if (event.target !== captchaPopup && !captchaPopup.contains(event.target)) {
        closeCaptchaPopup();
    }
});

captchaContainer.addEventListener('click', function (event) {
    event.stopPropagation();
});
captchaPopup.addEventListener('click', function (event) {
    event.stopPropagation();
});


reloadCaptcha.addEventListener('click', async function () {
    captchaInput.value = '';
    selectedCaptcha = document.querySelector('input[name="captchaType"]:checked').value;
    fetch('/captcha', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'type_captcha': selectedCaptcha })
    })
    .then(response => response.json())
    .then(data => {
        while (captchaDisplay.firstChild) {
            captchaDisplay.removeChild(captchaDisplay.firstChild);
        }
        captchaDisplay.innerHTML = data.innerElement;
        audioPlayer = document.getElementById('audioPlayer');
        if (audioPlayer)
            audioPlayer.play();
    });
});


// submit input
var captchaInput = document.querySelector('input[type="text"]');
var submitButton = document.querySelector('button[type="submit"]');

captchaInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter')
        submitButton.click();
});

submitButton.addEventListener('click', async function() {

    const user_captcha = captchaInput.value;
    fetch('/check_captcha', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({'user_captcha':user_captcha}),
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === true) {
            checkbox.checked = true;
            alert('Captcha is valid');
            closeCaptchaPopup();
        } else {
            captchaInput.value = '';
            checkbox.click();
            alert('Captcha is not valid');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
