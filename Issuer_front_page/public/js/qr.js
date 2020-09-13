let input = document.querySelector('input');
let button = document.querySelector('button');
let qrcode = new QRCode(document.querySelector('#qrcode'),{

    width: 250,
    height: 250,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H

});

button.addEventListener('click', ()=> {
    let inputValue = input.value;
    qrcode.makeCode(inputValue);
});