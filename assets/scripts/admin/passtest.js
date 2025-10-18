// Initialize password tester logic.
document.addEventListener("DOMContentLoaded", () => {

    // Encoder elements.
    const encodeGameID = document.getElementById('encode-gameid');
    const encodeDataTag = document.getElementById('encode-datatag');
    const encodeUserSecret = document.getElementById('encode-usersecret');
    const encodePassword = document.getElementById('encode-password');
    const encodeUpdate = document.getElementById('encode-update');
    const encodeResult = document.getElementById('encode-result');

    // Prepare encoder selectors.
    encodeGameID.innerHTML = "";
    encodeDataTag.innerHTML = "";
    for (const [game, tags] of Object.entries(passwdSets)) {
        encodeGameID.innerHTML += `<option value="${game}">${game}</option>`;
        for (const tag of tags) {
            encodeDataTag.innerHTML += `<option value="${game}/${tag}" disabled="true">${tag}</option>`;
        }
    }

    // Configure encoder cascade.
    function cascadeEncoder() {
        const selectedGame = encodeGameID.value;
        for (const item of Array.from(encodeDataTag.children)) {
            if (item.value.split("/")[0] == selectedGame) {
                item.removeAttribute("disabled");
            } else {
                item.setAttribute("disabled", "true");
            }
        }
        encodeDataTag.value = `${selectedGame}/${passwdSets[selectedGame][0]}`;
    }
    encodeGameID.addEventListener('change', cascadeEncoder);
    cascadeEncoder();

    // Configure encode update.
    encodeUpdate.addEventListener('click', () => {

        // Get parameters.
        const gameID = encodeGameID.value || null;
        const dataTag = encodeDataTag.value.split("/")[1] || null;
        const secret = encodeUserSecret.value || null;

        // Prepare UI.
        encodePassword.value = "";
        encodeResult.innerText = "Encoding...";

        // Generate password.
        const password = generatePassword(gameID, dataTag, secret);
        switch (password) {
            case "{bad:gid}":
                encodeResult.innerText = "Bad game ID (invalid)!";
                break;
            case "{bad:tag}":
                encodeResult.innerText = "Bad data tag (invalid)!";
                break;
            case "{bad:usr}":
                encodeResult.innerText = "Bad user secret (<6 chars)!";
                break;
            default:
                encodePassword.value = password;
                encodeResult.innerText = "Encoded.";
        }

    });

    // Decoder elements.
    const decodePassword = document.getElementById('decode-password');
    const decodeUserSecret = document.getElementById('decode-usersecret');
    const decodeGameID = document.getElementById('decode-gameid');
    const decodeDataTag = document.getElementById('decode-datatag');
    const decodeUpdate = document.getElementById('decode-update');
    const decodeResult = document.getElementById('decode-result');

    // Configure decode update.
    decodeUpdate.addEventListener('click', () => {

        // Get parameters.
        const password = decodePassword.value || null;
        const secret = decodeUserSecret.value || null;

        // Prepare UI.
        decodeGameID.value = "";
        decodeDataTag.value = "";
        decodeResult.innerText = "Decoding...";

        // Extract password.
        const result = extractPassword(password, secret);
        if (result.okay) {

            // Finished OK.
            decodeGameID.value = result.gameID;
            decodeDataTag.value = result.dataTag;
            decodeResult.innerText = "Decoded.";

        } else {

            // Something is wrong.
            switch (result.gameID || result.dataTag) {
                case "{bad:pwd}":
                    decodeResult.innerText = "Bad password (not 15 chars)!";
                    break;
                case "{bad:gid}":
                    decodeResult.innerText = "Bad game ID (invalid)!";
                    break;
                case "{bad:tag}":
                    decodeResult.innerText = "Bad data tag (invalid)!";
                    break;
                case "{bad:usr}":
                    decodeResult.innerText = "Bad user secret (<6 chars)!";
                    break;
                default:
                    decodeGameID.value = result.gameID;
                    decodeDataTag.value = result.dataTag;
                    decodeResult.innerText = "Something went wrong.";
            }

        }

    });

});