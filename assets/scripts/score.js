// Set up events.
document.addEventListener("DOMContentLoaded", () => {

    // Get elements.
    const inputSecret = document.getElementById("input-secret");
    const inputPasswds = document.getElementById("input-passwds");
    const updateButton = document.getElementById("update-button");
    const outputStatus = document.getElementById("output-status");
    const outputParts = document.getElementById("output-parts");
    const outputScore = document.getElementById("output-score");

    // Status updater.
    function updateStatus(newStatus = null) {
        outputStatus.innerText = newStatus || "";
    }

    // Parts updater.
    function updateParts(newGame = null, newTag = null, newDesc = null, newValue = null) {
        if (newGame && newTag && newDesc && newValue) {
            let newPart = "";
            newPart += '<tr>\n';
            newPart += `    <td>[${newGame}]</td>\n`;
            newPart += `    <td>{${newTag}}</td>\n`;
            newPart += `    <td>${newDesc}</td>\n`;
            newPart += `    <td>(${newValue >= 0 ? '+' : ''}${newValue})</td>\n`;
            newPart += `</tr>`;
            outputParts.innerHTML += newPart;
        } else {
            outputParts.innerHTML = "";
        }
    }

    // Score updater.
    function updateScore(newScore = null) {
        if (newScore) {
            outputScore.innerText = `Score: ${newScore} Points`;
        } else {
            outputScore.innerText = "";
        }
    }

    // Initialize player secret.
    inputSecret.value = retrieveSecret();

    // Bind update click.
    updateButton.addEventListener("click", () => {

        // Initialize.
        updateStatus("Calculating...");
        updateParts();
        updateScore();

        // Verify secret.
        const secret = inputSecret.value || "";
        if (secret.length < 6) {
            updateStatus("User secret is too short (<6 chars).");
            return;
        }
        if (retrieveSecret() != secret) storeSecret(secret);

        // Verify passwords.
        const passwds = (inputPasswds.value || "").split(/[\n]+/);
        if (passwds.length <= 0 || passwds[0] == "") {
            updateStatus("No passwords provided.");
            return;
        }

        // Extract passwords.
        let score = 0;
        let results = [];
        for (const passwd of passwds) {

            // Extract password information.
            const result = extractPassword(passwd, secret);

            // Check result status.
            if (!result.okay) {
                switch (result.gameID || result.dataTag) {
                    case "{bad:pwd}":
                        updateStatus(`Bad password (not 15 chars): ${passwd}`);
                        return;
                    case "{bad:gid}":
                        updateStatus(`Bad game ID (invalid): ${passwd}`);
                        return;
                    case "{bad:tag}":
                        updateStatus(`Bad data tag (invalid): ${passwd}`);
                        return;
                    case "{bad:usr}":
                        updateStatus(`Bad user secret (<6 chars): ${passwd}`);
                        return;
                }
                updateStatus(`Bad password (invalid): ${passwd}`);
                return;
            }

            // Append.
            results[results.length] = result;
            score += result.points;

        }

        // Finish.
        updateStatus("Done!");
        results.forEach((result) => updateParts(result.gameID, result.dataTag, result.description, result.points));
        updateScore(score);

    });

});