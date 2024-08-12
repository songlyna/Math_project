// GCD function
function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

// Extended Euclidean Algorithm
function extendedGcd(a, b) {
    if (a === 0) {
        return [b, 0, 1];
    }
    let [gcdVal, x1, y1] = extendedGcd(b % a, a);
    let x = y1 - Math.floor(b / a) * x1;
    let y = x1;
    return [gcdVal, x, y];
}

// Modular inverse
function modInverse(e, phi) {
    let [gcdVal, x, _] = extendedGcd(e, phi);
    if (gcdVal !== 1) {
        throw new Error('Modular inverse does not exist');
    }
    return (x % phi + phi) % phi;
}

// Prime check
function isPrime(num) {
    if (num === 2) return true;
    if (num < 2 || num % 2 === 0) return false;
    for (let n = 3; n <= Math.sqrt(num); n += 2) {
        if (num % n === 0) return false;
    }
    return true;
}

// Generate keypair
function generateKeypair(p, q, e) {
    if (!(isPrime(p) && isPrime(q))) {
        throw new Error('Both numbers must be prime.');
    }
    if (p === q) {
        throw new Error('p and q cannot be equal');
    }

    let n = p * q;
    if (n <= 25) {
        throw new Error('n = p * q must be greater than 25. Please enter larger primes.');
    }

    let phi = (p - 1) * (q - 1);

    if (gcd(e, phi) !== 1) {
        throw new Error('e must be coprime with phi(n).');
    }

    let d = modInverse(e, phi);

    return [[e, n], [d, n]];
}

// Custom mapping
const charToNum = Object.fromEntries([...Array(26)].map((_, i) => [String.fromCharCode(97 + i), i]));
const numToChar = Object.fromEntries(Object.entries(charToNum).map(([k, v]) => [v, k]));

// Encryption function
function encrypt(pk, plaintext) {
    let [key, n] = pk;
    let mappedValues = plaintext.toLowerCase().replace(/[^a-z]/g, '')
        .split('').map(char => charToNum[char].toString().padStart(2, '0')).join('');
    let cipher = [];

    let step;
    if (n <= 25) {
        throw new Error("n should be greater than 25.");
    } else if (n <= 2525) {
        step = 2;
    } else if (n <= 252525) {
        step = 4;
    } else if (n <= 25252525) {
        step = 6;
    } else if (n <= 2525252525) {
        step = 8;
    } else {
        throw new Error("n is out of the supported range.");
    }

    for (let i = 0; i < mappedValues.length; i += step) {
        let segment = parseInt(mappedValues.slice(i, i + step));
        let cipherValue = BigInt(segment) ** BigInt(key) % BigInt(n);
        cipher.push(cipherValue.toString());
    }

    return cipher;
}

// Decryption function
function decrypt(pk, ciphertext) {
    let [key, n] = pk;
    let plain = [];

    let step;
    if (n <= 25) {
        throw new Error("n should be greater than 25.");
    } else if (n <= 2525) {
        step = 2;
    } else if (n <= 252525) {
        step = 4;
    } else if (n <= 25252525) {
        step = 6;
    } else if (n <= 2525252525) {
        step = 8;
    } else {
        throw new Error("n is out of the supported range.");
    }

    for (let cipherValue of ciphertext) {
        let plainValue = BigInt(cipherValue) ** BigInt(key) % BigInt(n);
        let plainStr = plainValue.toString().padStart(step, '0');
        for (let i = 0; i < plainStr.length; i += 2) {
            let num = parseInt(plainStr.slice(i, i + 2));
            if (num in numToChar) {
                plain.push(numToChar[num]);
            }
        }
    }

    return plain.join('');
}

function toggleForms() {
    const encryptForm = document.getElementById('rsa-encrypt-form');
    const decryptForm = document.getElementById('rsa-decrypt-form');
    const toggleButton = document.getElementById('toggle-button');

    if (encryptForm.style.display === "none") {
        encryptForm.style.display = "block";
        decryptForm.style.display = "none";
        toggleButton.textContent = "Switch to Decryption";
    } else {
        encryptForm.style.display = "none";
        decryptForm.style.display = "block";
        toggleButton.textContent = "Switch to Encryption";
    }
}

function encryptRSA() {
    const p = parseInt(document.getElementById('prime-p').value);
    const q = parseInt(document.getElementById('prime-q').value);
    const e = parseInt(document.getElementById('encryption-key').value);
    const message = document.getElementById('rsa-message').value;

    try {
        const [publicKey, privateKey] = generateKeypair(p, q, e);
        const encryptedMessage = encrypt(publicKey, message);

        document.getElementById('rsa-encryption-result').innerHTML = `
            Public Key: (n: ${publicKey[1]}, e: ${publicKey[0]})
            Private Key: (n: ${privateKey[1]}, d: ${privateKey[0]})
            Text to Encrypt: ${message}
            Encrypted Text: ${encryptedMessage.join(', ')}
        `;
    } catch (error) {
        document.getElementById('rsa-encryption-result').innerHTML = `<p class="error">${error.message}</p>`;
    }
}

function decryptRSA() {
    const n = parseInt(document.getElementById('encryption-key-n').value);
    const d = parseInt(document.getElementById('private-key-d').value);
    const encryptedMessage = document.getElementById('decrypted-message').value.split(',').map(x => x.trim());

    try {
        const decryptedMessage = decrypt([d, n], encryptedMessage);

        document.getElementById('rsa-decryption-result').innerHTML = `
            Original Encrypted Message: ${encryptedMessage.join(', ')}
            Decrypted Text: ${decryptedMessage}
            Private Key (n, d): (n: ${n}, d: ${d})
        `;
    } catch (error) {
        document.getElementById('rsa-decryption-result').innerHTML = `<p class="error">${error.message}</p>`;
    }
}
