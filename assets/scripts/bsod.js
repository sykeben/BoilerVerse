// He's dead jim!

// Modal state.
let modalUp = false;

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
function randomizeError(checkModal = true) {

    // Skip if modal is up.
    if (checkModal && modalUp) return;

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

    // Get elements.
    const header = document.getElementById("main-header");
    const passModal = document.getElementById("pass-modal");
    const passX = document.getElementById("pass-x");
    const passSecret = document.getElementById("pass-secret");
    const passGenerate = document.getElementById("pass-generate");
    const passOutput = document.getElementById("pass-output");

    // Get a random error code.
    randomizeError(false);

    // Set up header click easter egg.
    header.addEventListener('click', () => {
        if (modalUp) return;
        codeCount--;
        passSecret.value = "";
        passOutput.value = "";
        passModal.classList.remove('d-none');
        modalUp = true;
    });

    // Set up modal close.
    passX.addEventListener('click', () => {
        passModal.classList.add('d-none');
        passSecret.value = "";
        passOutput.value = "";
        modalUp = false;
    });

    // Set up generate click.
    passGenerate.addEventListener('click', () => {
        if (!modalUp) return;
        const result = generatePassword("bsod", "easteregg", passSecret.value);
        passOutput.value = result.startsWith("{bad:") ? "" : result;
    });

    // "Reboot" handler.
    document.addEventListener('keydown', randomizeError);
    document.addEventListener('touchstart', randomizeError);
    document.addEventListener('click', randomizeError);

});
