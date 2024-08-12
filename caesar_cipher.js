function encryptText() {
    const text = document.getElementById('text-input').value;
    const shift = parseInt(document.getElementById('shift-key').value);
    let encryptedText = '';

    for (let i = 0; i < text.length; i++) {
        let char = text.charCodeAt(i);
        if (char >= 65 && char <= 90) {
            encryptedText += String.fromCharCode(((char - 65 + shift) % 26) + 65);
        } else if (char >= 97 && char <= 122) {
            encryptedText += String.fromCharCode(((char - 97 + shift) % 26) + 97);
        } else {
            encryptedText += text[i];
        }
    }

    document.getElementById('encryption-result').innerText = encryptedText;
}

function decryptText() {
    const text = document.getElementById('decrypt-text').value;
    const shift = parseInt(document.getElementById('decrypt-shift-key').value);
    let decryptedText = '';

    for (let i = 0; i < text.length; i++) {
        let char = text.charCodeAt(i);
        if (char >= 65 && char <= 90) {
            decryptedText += String.fromCharCode(((char - 65 - shift + 26) % 26) + 65);
        } else if (char >= 97 && char <= 122) {
            decryptedText += String.fromCharCode(((char - 97 - shift + 26) % 26) + 97);
        } else {
            decryptedText += text[i];
        }
    }

    document.getElementById('decryption-result').innerText = decryptedText;
}


