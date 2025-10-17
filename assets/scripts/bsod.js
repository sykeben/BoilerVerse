// He's dead jim!

// Randomizes the error code.
function randomizeError() {
    const codeValue = Math.floor(Math.random() * 0xFFFFFF);
    const codeText = codeValue.toString(16).toUpperCase().padStart(6, '0');
    document.getElementById('error-code').innerText = codeText;
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
