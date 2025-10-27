// WOAH WOAH WOAH SUPER SECURE :)
// For you nerds: This isn't a security feature, it's a scrappy way to save progress.
// Remember old NES games that didn't have battery saves? This is the same idea.

// Password sets.
const passwdSets = {
    "bsod": {
        "easteregg": [10, "explore the BSOD"]
    },
    "pmyou": {
        "mentor": [20, "return the mentor's key"]
    }
};

// Player secret retrieval.
function retrieveSecret() {
    return window.localStorage.getItem("bv-secret") || "";
}

// Player secret storage.
function storeSecret(secret = null) {
    if (secret) {
        window.localStorage.setItem("bv-secret", secret);
    } else {
        window.localStorage.removeItem("bv-secret");
    }
}

// Password list retrieval.
function retrievePasswords() {
    return window.localStorage.getItem("bv-passwds")?.split('\n') || [];
}

// Password list storage.
function storeAllPasswords(passwords = null) {
    if (passwords) {
        window.localStorage.setItem("bv-passwds", passwords.join('\n'));
    } else {
        window.localStorage.removeItem("bv-passwds");
    }
}

// Password list append.
function storeNewPassword(password) {
    const passwords = retrievePasswords();
    if (!passwords.includes(password)) {
        passwords.push(password);
        storeAllPasswords(passwords);
    }
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
function generatePassword(gameID, dataTag, secret, updateStoredSecret = true, updateStoredPasswords = true) {

    // Fail maker.
    function makeFail(why) {
        return `{bad:${why}}`;
    }

    // Verify parameters.
    if (!gameID || !passwdSets.hasOwnProperty(gameID)) return makeFail("gid");
    if (!dataTag || !passwdSets[gameID].hasOwnProperty(dataTag)) return makeFail("tag");
    if (!secret || secret.length < 6) return makeFail("usr");

    // Generate hash.
    const hash = customHash(gameID, dataTag, secret);

    // Update stored secret/passwords.
    if (updateStoredSecret) storeSecret(secret);
    if (updateStoredPasswords) storeNewPassword(hash);

    // Return.
    return hash;

}

// Password extractor.
function extractPassword(password, secret, chkGameID = false, chkDataTag = false) {

    // Result maker.
    function makeResult(okay, gameID, dataTag, points, description) {
        return {
            okay: okay,
            gameID: gameID,
            dataTag: dataTag,
            points: points,
            description: description
        };
    }

    // Fail maker.
    function makeFail(why) {
        return makeResult(false, `{bad:${why}}`, `{bad:${why}}`, null, null);
    }

    // Pass maker.
    function makePass(gameID, dataTag, points, description) {
        return makeResult(true, gameID, dataTag, points, description);
    }

    // Verify parameters.
    if (!password || password.length != 15) return makeFail("pwd");
    if (!secret || secret.length < 6) return makeFail("usr");
    if (chkGameID && !passwdSets.hasOwnProperty(chkGameID)) return makeFail("gid");
    if (chkDataTag && !passwdSets[chkGameID].hasOwnProperty(chkDataTag)) return makeFail("tag");
    if (!chkGameID && chkDataTag) return makeFail("gid");

    // Check password.
    if (chkGameID && chkDataTag) {

        // Check from a fully-known set.
        if (customHash(chkGameID, chkDataTag, secret) == password) {
            const [pts, desc] = passwdSets[chkGameID][chkDataTag];
            return makePass(chkGameID, chkDataTag, pts, desc);
        }

    } else if (chkGameID && !chkDataTag) {

        // Check from a semi-known set.
        for (const [tag, [pts, desc]] of Object.entries(passwdSets[chkGameID])) {
            if (customHash(chkGameID, tag, secret) == password) {
                return makePass(chkGameID, tag, pts, desc);
            }
        }

    } else if (!chkGameID && !chkDataTag) {

        // Check from an unknown set.
        for (const [game, tags] of Object.entries(passwdSets)) {
            for (const [tag, [pts, desc]] of Object.entries(tags)) {
                if (customHash(game, tag, secret) == password) {
                    return makePass(game, tag, pts, desc);
                }
            }
        }

    }

    // Fallback.
    return makeFail("neq");

}