// He's dead jim!

// Random integer getter (min and max included).
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Hex formatter.
function formatHex(value, digits) {
    return value.toString(16).toUpperCase().padStart(digits, '0');
}

// Randomizes the error code.
const codeDesired = getRandom(0xA, 0xF);
let codeCount = -1;
function randomizeError() {

    // Update values.
    codeCount = (codeCount + 1) % (0xF + 1);
    const codeValue = getRandom(0x0000, 0xFFFF);
    const codeTarget = formatHex(codeDesired, 1);
    const codePrefix = formatHex(codeCount, 1);
    const codeSuffix = formatHex(codeValue, 5);
    document.getElementById('error-code').innerText = `${codeTarget}${codePrefix}${codeSuffix}`;

    // Redirect to the patch notes if we're at or past the target.
    if (codeCount >= codeDesired) {
        window.location.href = 'patches.html';
    }

}

// Insert error code into the page & bind events.
document.addEventListener("DOMContentLoaded", () => {

    // Get a random error code.
    randomizeError();

    // "Reboot" handler.
    document.addEventListener('keydown', randomizeError);
    document.addEventListener('touchstart', randomizeError);
    document.addEventListener('click', randomizeError);

});
