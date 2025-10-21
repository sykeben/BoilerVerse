// Initialize poster generator logic.
document.addEventListener("DOMContentLoaded", () => {

    // Get control inputs.
    const inputTitle = document.getElementById("input-title");
    const inputSubtitle1 = document.getElementById("input-subtitle1");
    const inputSubtitle2 = document.getElementById("input-subtitle2");
    const inputSubtitle3 = document.getElementById("input-subtitle3");
    const inputQRPage = document.getElementById("input-qrpage");
    const inputFooter1 = document.getElementById("input-footer1");
    const inputFooter2 = document.getElementById("input-footer2");
    const inputPosterID = document.getElementById("input-posterid");

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
    const pageFooter1 = document.getElementById("page-footer1");
    const pageFooter2 = document.getElementById("page-footer2");
    const pagePosterID = document.getElementById("page-posterid");

    // Initialize QR code.
    pageQRCode.innerHTML = "";
    new QRCode(pageQRCode, pageQRURL.innerText);

    // Set up generate button.
    generateBtn.addEventListener("click", () => {

        // Update text.
        pageTitle.innerText = inputTitle.value || "";
        pageSubtitle1.innerText = inputSubtitle1.value || "";
        pageSubtitle2.innerText = inputSubtitle2.value || "";
        pageSubtitle3.innerText = inputSubtitle3.value || "";
        pageQRPage.innerText = (inputQRPage.value || "bsod").replace(/\/+/g, "-").replace(/[^a-zA-Z0-9\-]/g, "");
        pageFooter1.innerText = inputFooter1.value || "";
        pageFooter2.innerText = inputFooter2.value || "";
        pagePosterID.innerText = inputPosterID.value || "nul";

        // Update QR code.
        pageQRCode.innerHTML = "";
        new QRCode(pageQRCode, pageQRURL.innerText);

        // Update title.
        document.title = pagePosterID.innerText;

    });

    // Set up print button.
    printBtn.addEventListener("click", () => {
        window.print();
    });

});