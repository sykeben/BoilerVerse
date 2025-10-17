// Initialize poster generator logic.
document.addEventListener("DOMContentLoaded", () => {

    // Get control inputs.
    const inputTitle = document.getElementById("input-title");
    const inputSubtitle = document.getElementById("input-subtitle");
    const inputQRPage = document.getElementById("input-qrpage");

    // Get control buttons.
    const generateBtn = document.getElementById("generate-btn");
    const printBtn = document.getElementById("print-btn");

    // Get page elements.
    const pageTitle = document.getElementById("page-title");
    const pageSubtitle = document.getElementById("page-subtitle");
    const pageQRCode = document.getElementById("page-qrcode");
    const pageQRURL = document.getElementById("page-qrurl");
    const pageQRPage = document.getElementById("page-qrpage");

    // Initialize QR code.
    pageQRCode.innerHTML = "";
    new QRCode(pageQRCode, pageQRURL.innerText);

    // Set up generate button.
    generateBtn.addEventListener("click", () => {

        // Update text.
        pageTitle.textContent = inputTitle.value || "???";
        pageSubtitle.textContent = inputSubtitle.value || "?";
        pageQRPage.textContent = inputQRPage.value || "bsod";

        // Update QR code.
        pageQRCode.innerHTML = "";
        new QRCode(pageQRCode, pageQRURL.innerText);

    });

    // Set up print button.
    printBtn.addEventListener("click", () => {
        window.print();
    });

});