// WOAH WOAH WOAH SUPER SECURE :)
// For you nerds: This isn't a security feature, it's a scrappy way to save progress.
// Remember old NES games that didn't have battery saves? This is the same idea.

// Password sets.
const passwdSets = {
    "bsod": [
        "easteregg"
    ]
};

// Player secret storage.
function storeSecret(secret = null) {
    window.localStorage.setItem("bv-secret", secret || "");
}

// Player secret retrieval.
function retrieveSecret() {
    return window.localStorage.getItem("bv-secret") || "";
}

// Custom hasher.
function customHash(gameID, dataTag, secret) {

    // Define alphabet.
    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~!@#$%^&*_+-=/:.";

    // Generate combo.
    const combo = `<${gameID}:${dataTag}>|${secret}`;

    // Perform simple mixing.
    let seed = combo.split('').reduce((h, c) => c.charCodeAt(0) + (h << 6) + (h << 16) - h, 0);
    for (let i = 0; i < combo.length; i++) {
        seed = (seed * 131 + combo.charCodeAt(i)) % 0xffffffff;
    }

    // Generate a 15-character code.
    let code = "";
    for (let i = 0; i < 15; i++) {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        code += alpha[seed % alpha.length];
    }
    return code;

}

// Password generator.
function generatePassword(gameID, dataTag, secret, updateStoredSecret = true) {

    // Fail maker.
    function makeFail(why) {
        return `{bad:${why}}`;
    }

    // Verify parameters.
    if (!gameID || !passwdSets.hasOwnProperty(gameID)) return makeFail("gid");
    if (!dataTag || !passwdSets[gameID].includes(dataTag)) return makeFail("tag");
    if (!secret || secret.length < 6) return makeFail("usr");

    // Update stored secret.
    if (updateStoredSecret) storeSecret(secret);

    // Generate hash.
    return customHash(gameID, dataTag, secret);

}

// Password extractor.
function extractPassword(password, secret, chkGameID = false, chkDataTag = false) {

    // Result maker.
    function makeResult(okay, gameID, dataTag) {
        return {
            okay: okay,
            gameID: gameID,
            dataTag: dataTag
        };
    }

    // Fail maker.
    function makeFail(why) {
        return makeResult(false, `{bad:${why}}`, `{bad:${why}}`);
    }

    // Pass maker.
    function makePass(gameID, dataTag) {
        return makeResult(true, gameID, dataTag);
    }

    // Verify parameters.
    if (!password || password.length != 15) return makeFail("pwd");
    if (!secret || secret.length < 6) return makeFail("usr");
    if (chkGameID && !passwdSets.hasOwnProperty(chkGameID)) return makeFail("gid");
    if (chkDataTag && !passwdSets[chkGameID].includes(chkDataTag)) return makeFail("tag");
    if (!chkGameID && chkDataTag) return makeFail("gid");

    // Check password.
    if (chkGameID && chkDataTag) {

        // Check from a fully-known set.
        if (customHash(chkGameID, chkDataTag, secret) == password) {
            return makePass(chkGameID, chkDataTag);
        }

    } else if (chkGameID && !chkDataTag) {

        // Check from a semi-known set.
        for (const tag of passwdSets[chkGameID]) {
            if (customHash(chkGameID, tag, secret) == password) {
                return makePass(chkGameID, tag);
            }
        }

    } else if (!chkGameID && !chkDataTag) {

        // Check from an unknown set.
        for (const [game, tags] of Object.entries(passwdSets)) {
            for (const tag of tags) {
                if (customHash(game, tag, secret) == password) {
                    return makePass(game, tag);
                }
            }
        }

    }

    // Fallback.
    return makeFail("neq");

}