// Initialize poster generator logic.
document.addEventListener("DOMContentLoaded", () => {

    // Get control inputs.
    const inputTitle = document.getElementById("input-title");
    const inputSubtitle1 = document.getElementById("input-subtitle1");
    const inputSubtitle2 = document.getElementById("input-subtitle2");
    const inputSubtitle3 = document.getElementById("input-subtitle3");
    const inputQRPage = document.getElementById("input-qrpage");

    // Get control buttons.
    const generateBtn = document.getElementById("generate-btn");
    const printBtn = document.getElementById("print-btn");

    // Get page elements.
    const pageTitle = document.getElementById("page-title");
    const pageSubtitle1 = document.getElementById("page-subtitle1");
    const pageSubtitle2 = document.getElementById("page-subtitle2");
    const pageSubtitle3 = document.getElementById("page-subtitle3");
    const pageQRCode = document.getElementById("page-qrcode");
    const pageQRURL = document.getElementById("page-qrurl");
    const pageQRPage = document.getElementById("page-qrpage");

    // Initialize QR code.
    pageQRCode.innerHTML = "";
    new QRCode(pageQRCode, pageQRURL.innerText);

    // Set up generate button.
    generateBtn.addEventListener("click", () => {

        // Update text.
        pageTitle.textContent = inputTitle.value || "";
        pageSubtitle1.textContent = inputSubtitle1.value || "";
        pageSubtitle2.textContent = inputSubtitle2.value || "";
        pageSubtitle3.textContent = inputSubtitle3.value || "";
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