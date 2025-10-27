// Peeking is bad for the game...

// Number formatter.
function formatNum(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

// Overlay animator.
function animateOverlay(prefix, newText, useGeneric = true, doHide = false) {

    // Update text.
    const text = document.getElementById(`${prefix}-text`);
    text.innerText = newText;

    // Animate overlay.
    const overlay = document.getElementById(`${prefix}-overlay`);
    const overlayAnim = `${useGeneric ? 'overlay' : prefix}-change-anim`;
    overlay.classList.remove(overlayAnim);
    if (doHide) overlay.classList.remove("d-none");
    void overlay.offsetWidth; // (force reflow to restart animation)
    overlay.classList.add(overlayAnim);
    overlay.addEventListener("animationend", () => {
        if (doHide) overlay.classList.add("d-none");
        overlay.classList.remove(overlayAnim);
    }, { once: true });

}

// Item templates.
// const[itemId:s] = {id:s(ITEMID), ico:s(ICON), txt:s(TITLE), flt:[s,...,s]}
const itemTemplates = {
    nul_money: { id: "nul_money", ico: "money", txt: "P\u20EB$", flt: [] }, // fake money template
    nul_passwd: { id: "nul_passwd", ico: "password", txt: "Password", flt: ["shimmer"] }, // fake password template
    candy_std: { id: "candy_std", ico: "candy", txt: "Candy", flt: [] },
    candy_wow: { id: "candy_wow", ico: "candy", txt: "CANDY!", flt: ["hue-anim"] },
    controller: { id: "controller", ico: "controller", txt: "Controller", flt: [] },
    bowl_ball: { id: "bowl_ball", ico: "bowl_ball", txt: "Bowling Ball", flt: [] },
    bowl_pins: { id: "bowl_pins", ico: "bowl_pins", txt: "Bowling Pins", flt: [] },
    key_dorm: { id: "key_dorm", ico: "key", txt: "Dorm Key", flt: [] },
    key_club: { id: "key_club", ico: "key", txt: "Club Key", flt: ["hue-90"] }
};

// NPC templates.
// const[npcType:s][npcNum:i][tradeNum:i] = ...
//     { dir:s(LITERAL~b|s|x|sp|xp), ok:bool, a:s(ITEMID)|i(SCORE), b:s(ITEMID)|i(SCORE) }
// dir = (b)uy from user       -> [A]=>$B$ buy item (a) from user for score (b)
// dir = (s)ell to user        -> $A$=>[B] sell item (b) to user for score (a)
// dir = (x)chge with user     -> [A]=>[B] exchange item (b) for user's item (a)
// dir = (s)ell (p)wd to user  -> $A$=>[B] sell password (b) to user for score (a)
// dir = (x)chge (p)wd to user -> [A]=>[B] exchange password (b) for user's item (a)
const npcTemplates = {

    // Club area.
    club: [
        [
            { dir: "x", ok: false, a: "key_dorm", b: "key_club" }
        ],
        [
            { dir: "s", ok: false, a: 5, b: "candy_std" }
        ]
    ],

    // Game Mine.
    game: [
        [
            { dir: "x", ok: false, a: "candy_std", b: "candy_wow" },
            { dir: "b", ok: false, a: "controller", b: 5 }
        ],
        [
            { dir: "x", ok: false, a: "bowl_ball", b: "key_dorm" }
        ]
    ],

    // Rack & Roll.
    bowl: [
        [
            { dir: "b", ok: false, a: "bowl_pins", b: 5 }
        ],
        [
            { dir: "b", ok: false, a: "candy_wow", b: 10 }
        ],
        [
            { dir: "b", ok: false, a: "candy_std", b: 5 }
        ]
    ],

    // Ground Floor Customers.
    cust: [
        [
            { dir: "xp", ok: false, a: "key_club", b: "mentor" }
        ]
    ]

};

// Drop templates.
// const[dropType:s][dropNum:i] = {typ:s(LITEAL~i|m), ok:bool, v:s(ITEMID)|i(SCORE)}
// type = (i)tem  -> give user item (v)
// type = (m)oney -> give user money P$(v)
const dropTemplates = {

    // Club area.
    club: [
    ],

    // Game Mine.
    game: [
        { typ: "i", ok: false, v: "controller" }
    ],

    // Rack & Roll.
    bowl: [
        { typ: "i", ok: false, v: "bowl_ball" },
        { typ: "i", ok: false, v: "bowl_pins" }
    ],

    // Ground Floor Customers.
    cust: [
        { typ: "m", ok: false, v: 5 }
    ]

};

// Map manager.
let maps = [];
function updateMaps() {

    // Get floor names.
    let floorNames = [];
    const floorElems = document.getElementsByClassName('pmu-map');
    [...floorElems].forEach((elem) => {
        const num = elem.getAttribute('data-num');
        const txt = elem.getAttribute('data-txt');
        floorNames[num] = txt;
    });

    // Prepare maps.
    maps = [];
    const mapElems = document.getElementsByClassName('pmu-map');
    [...mapElems].forEach((elem) => {

        // Get attributes.
        const flrNum = elem.getAttribute('data-num');
        const flrTxt = elem.getAttribute('data-txt');

        // Prepare stairs.
        let stairs = [];
        const stairElems = elem.getElementsByClassName('pmu-stair');
        [...stairElems].forEach((subElem) => {

            // Get attributes.
            const num = subElem.getAttribute('data-num');
            const txt = floorNames[num];

            // Prepare interactivity.
            subElem.setAttribute("data-bs-toggle", "tooltip");
            subElem.setAttribute("data-bs-title", txt);
            subElem.setAttribute("data-bs-custom-class", "pmu-i-tooltip");
            subElem.setAttribute("onclick", `switchFloor('${num}', this);`);

            // Store information.
            stairs.push({ num: num, txt: txt, img: subElem });

        });

        // Prepare NPCs.
        let npcs = [];
        const npcElems = elem.getElementsByClassName('pmu-npc');
        [...npcElems].forEach((subElem) => {

            // Get attributes.
            const npc = subElem.getAttribute("data-npc");
            const num = Number(subElem.getAttribute("data-num"));

            // Prepare interactivity.
            subElem.setAttribute("onclick", `openDialog('trade', ['${flrNum}', '${npc}-${num}']);`);

            // Store information.
            npcs[`${npc}-${num}`] = { npc: npc, num: num, img: subElem, trd: npcTemplates[npc][num] };

        });

        // Prepare drops.
        let drops = [];
        const dropElems = elem.getElementsByClassName('pmu-drp');
        [...dropElems].forEach((subElem) => {

            // Get attributes.
            const drp = subElem.getAttribute("data-drp");
            const num = Number(subElem.getAttribute("data-num"));

            // Prepare interactivity.
            subElem.setAttribute("onclick", `pickUpDrop(this, ['${flrNum}', '${drp}-${num}']);`);

            // Store information.
            drops[`${drp}-${num}`] = { drp: drp, num: num, img: subElem, itm: dropTemplates[drp][num] };

        });

        // Store information.
        maps[flrNum] = {
            num: flrNum, txt: flrTxt, svg: elem,
            stair: stairs, npc: npcs, drop: drops
        };

    });

}

// Floor switcher.
let currentFloor = null;
function switchFloor(newFloor, over = null, first = false) {

    // Identify floors.
    const oldMap = currentFloor;
    const newMap = maps[newFloor];
    if (!newMap) return;
    if (!oldMap) {

        // Handle no previous floor (first load).
        const svg = newMap.svg;
        svg.classList.remove("d-none", "fade-out");
        void svg.offsetWidth; // (ensure transition start)
        svg.classList.add("fade-in");
        void svg.offsetWidth; // (ensure transition start)
        currentFloor = newMap;

        // On first load, show overlay once for player orientation.
        if (first) {
            animateOverlay("level", newMap.num);
            animateOverlay("area", newMap.txt, false, true);
        }

    } else {

        // Hide toolip.
        if (over) {
            const tip = bootstrap.Tooltip.getInstance(over);
            tip.hide();
        }

        // Fade out old floor.
        const oldSvg = oldMap.svg;
        oldSvg.classList.remove("fade-in");
        void oldSvg.offsetWidth; // (reset)
        oldSvg.classList.add("fade-out");
        void oldSvg.offsetWidth; // (reset)

        // When old floor finishes fading out...
        oldSvg.addEventListener("transitionend", () => {

            // Hide it.
            oldSvg.classList.remove("fade-out");
            void oldSvg.offsetWidth; // (reset)
            oldSvg.classList.add("d-none");
            void oldSvg.offsetWidth; // (reset)

            // Then fade in the new floor.
            const newSvg = newMap.svg;
            newSvg.classList.remove("d-none", "fade-out");
            void newSvg.offsetWidth; // (force reflow to restart)
            newSvg.classList.add("fade-in");
            void newSvg.offsetWidth; // (force reflow to restart)
            currentFloor = newMap;

            // Update overlays.
            animateOverlay("level", newMap.num);
            animateOverlay("area", newMap.txt, false, true);

        }, { once: true });
    }

}

// Score changer.
let currentScore = 0;
function changeScore(newScore) {
    const newText = formatNum(newScore);
    animateOverlay("score", newText);
    ["pocket", "trade"].forEach((prefix) => {
        document.getElementById(`${prefix}-score`).innerText = newText;
    });
    currentScore = newScore;
}

// Inventory item generator.
function generateInventoryItem(item, prefix) {

    // Create icon.
    const img = document.createElement("img");
    img.src = `../../assets/graphics/maps/pmyou/i_${item.ico}.png`;
    img.classList.add("img-responsive", "inventory-icon");
    item.flt.forEach((s) => { img.classList.add(`f-${s}`); });

    // Create title.
    const title = document.createElement("div");
    title.innerText = `[${item.txt}]`;
    title.classList.add("inventory-title");

    // Create column.
    const col = document.createElement("div");
    col.appendChild(img);
    col.appendChild(title);
    col.setAttribute("data-id", item.id);
    col.id = `${prefix}-item-${item.id}`;
    col.classList.add("col", "inventory-item");
    return col;

}

// Inventory manager.
let inventory = [];
function initInventory(prefix, elemCallback = null) {

    // Get elements.
    const inv = document.getElementById(`${prefix}-inventory`);

    // Initialize display.
    inv.innerHTML = "";
    if (inventory.length > 0) {

        // Display items.
        inventory.forEach((item) => {
            const col = generateInventoryItem(item, prefix);
            if (elemCallback) elemCallback(col, prefix);
            inv.appendChild(col);
        });

    } else {

        // Display placeholder.
        const col = document.createElement("div");
        col.innerText = "(Empty)";
        col.classList.add("col", "custom-placeholder", "py-3");
        inv.appendChild(col);

    }

}

// Bartering manager.
function initBartering(prefix, dialogData, elemCallback = null) {

    // Get elements.
    const bar = document.getElementById(`${prefix}-bartering`);

    // Get data.
    const data = maps[dialogData[0]].npc[dialogData[1]].trd;

    // Initialize display.
    bar.innerHTML = "";
    if (data.filter((trade) => !trade.ok).length > 0) {

        // Display trades.
        data.forEach((trade, index) => {

            // Skip if already done.
            if (trade.ok) return;

            // Get item info.
            const lItem = itemTemplates[trade.dir.startsWith("s") ? "nul_money" : trade.a];
            const rItem = itemTemplates[
                trade.dir.endsWith("p") ? "nul_passwd" :
                    trade.dir.startsWith("b") ? "nul_money" : trade.b
            ];

            // Create left icon.
            const lImg = document.createElement("img");
            lImg.src = `../../assets/graphics/maps/pmyou/i_${lItem.ico}.png`;
            lImg.classList.add("img-responsive", "inventory-icon", "ico-left");
            lItem.flt.forEach((s) => { lImg.classList.add(`f-${s}`); });

            // Create left title.
            const lTitle = document.createElement("div");
            lTitle.innerText = `[${lItem.txt}${trade.dir.startsWith("s") ? trade.a : ''}]`;
            lTitle.classList.add("inventory-title");

            // Create left column.
            const lCol = document.createElement("div");
            lCol.classList.add("col-5", "col-md-4");
            lCol.appendChild(lImg);
            lCol.appendChild(lTitle);

            // Create right icon.
            const rImg = document.createElement("img");
            rImg.src = `../../assets/graphics/maps/pmyou/i_${rItem.ico}.png`;
            rImg.classList.add("img-responsive", "inventory-icon", "ico-right");
            rItem.flt.forEach((s) => { rImg.classList.add(`f-${s}`); });

            // Create right title.
            const rTitle = document.createElement("div");
            rTitle.innerText = `[${rItem.txt}${trade.dir.startsWith("b") ? trade.b : ''}]`;
            rTitle.classList.add("inventory-title");

            // Create right column.
            const rCol = document.createElement("div");
            rCol.classList.add("col-5", "col-md-4");
            rCol.appendChild(rImg);
            rCol.appendChild(rTitle);

            // Create middle column.
            const mCol = document.createElement("div");
            mCol.innerText = "=>";
            mCol.classList.add("col-2", "col-md-4", "display-5", "inventory-exchange", "mt-3");

            // Create row.
            const row = document.createElement("div");
            row.setAttribute("data-flr", dialogData[0]);
            row.setAttribute("data-npc", dialogData[1]);
            row.setAttribute("data-id", index);
            row.classList.add("row", "clickable", "inventory-trade", "px-2", "py-1");
            row.appendChild(lCol);
            row.appendChild(mCol);
            row.appendChild(rCol);

            // Finish up.
            if (elemCallback) elemCallback(row, prefix);
            bar.appendChild(row);

        });

    } else {

        // Display placeholder.
        const row = document.createElement("div");
        const col = document.createElement("div");
        col.innerText = "(Empty)";
        row.classList.add(
            "row", "gx-3", "gy-2",
            "row-cols-2", "row-cols-sm-3", "row-cols-md-4", "row-cols-lg-5", "row-cols-xl-6",
            "custom-placeholder"
        );
        col.classList.add("col", "py-3");
        row.appendChild(col);
        bar.appendChild(row);

    }

}

// Dialog initializer.
let dlgOpen = false;
let dialogs = [];
function initDialog(prefix, preOpen = null, preClose = null) {

    // Get elements.
    const root = document.getElementById(`${prefix}-dialog`);
    const xBtn = document.getElementById(`${prefix}-x`);
    const cont = document.getElementById(`${prefix}-content`);

    // Store information.
    dialogs[prefix] = {
        prefix: prefix, open: false,
        root: root, xBtn: xBtn, cont: cont,
        preOpen: preOpen, preClose: preClose,
    };

    // Set up close button.
    xBtn.addEventListener("click", () => {
        closeDialog(prefix);
    });

}

// Dialog closer.
function closeDialog(prefix) {

    // Get instance.
    const me = dialogs[prefix];
    if (!(dlgOpen && me.open)) return;

    // Get elements.
    const flrs = document.getElementById("floors");
    const over = document.getElementsByClassName("overlay");

    // Hide dialog.
    me.root.classList.add("d-none");
    if (me.preClose) me.preClose(me);
    me.open = false;
    dlgOpen = false;

    // Undim background.
    flrs.classList.remove("dim");
    [...over].forEach((elem) => elem.classList.remove("dim"));

}

// Dialog opener.
function openDialog(prefix, data = null) {

    // Get instance.
    const me = dialogs[prefix];
    if (dlgOpen || me.open) return;

    // Get elements.
    const flrs = document.getElementById("floors");
    const over = document.getElementsByClassName("overlay");

    // Show dialog.
    if (me.preOpen) me.preOpen(me, data);
    me.root.classList.remove("d-none");
    me.open = true;
    dlgOpen = true;

    // Dim background.
    flrs.classList.add("dim");
    [...over].forEach((elem) => elem.classList.add("dim"));

}

// Trade initializer.
function initTrade(row, prefix) {

    // Set up click event.
    row.addEventListener("click", () => {

        // Get data.
        const flr = row.getAttribute("data-flr");
        const npc = row.getAttribute("data-npc");
        const id = row.getAttribute("data-id");
        const trds = maps[flr].npc[npc].trd;
        const data = trds[id];
        if (data.ok) return; // Stop if trade already done.

        // Item checker.
        function checkItem(id) {
            return Boolean(inventory.find((i) => i.id == id));
        }

        // Icon animator.
        function animateIcon(icon) {
            icon.classList.remove('inventory-icon-pulse');
            void icon.offsetWidth; // (force reflow to restart animation)
            icon.classList.add('inventory-icon-pulse');
            icon.addEventListener("animationend", () => {
                icon.classList.remove('inventory-icon-pulse');
            }, { once: true });
        }

        // Item taker.
        function takeItem(id) {

            // Remove from display.
            document.getElementById(`${prefix}-item-${id}`).remove();
            if (inventory.length <= 1) {
                const inv = document.getElementById(`${prefix}-inventory`);
                inv.innerHTML = "";
                const col = document.createElement("div");
                col.innerText = "(Empty)";
                col.classList.add("col", "custom-placeholder", "py-3");
                inv.appendChild(col);
            }

            // Remove from state.
            const index = inventory.findIndex((i) => i.id == id);
            inventory.splice(index, 1);

        }

        // Item giver.
        function giveItem(id) {

            // Get new item.
            const newItem = itemTemplates[id];

            // Add to display.
            const col = generateInventoryItem(newItem, prefix);
            const inv = document.getElementById(`${prefix}-inventory`);
            if (inventory.length <= 0) inv.innerHTML = "";
            inv.appendChild(col);
            animateIcon(col.getElementsByClassName("inventory-icon")[0].parentElement);

            // Add to state.
            inventory.push(newItem);

        }

        // Password giver.
        function givePass(key) {

            // Close this dialog.
            closeDialog(prefix);

            // Open password dialog.
            openDialog("pass", key);

        }

        // Trade denyer.
        function denyTrade() {
            animateIcon(row.getElementsByClassName("ico-left")[0].parentElement);
        }

        // Trade acceptor.
        function acceptTrade(animateScore = false) {

            // Remove from display.
            row.remove();
            if (trds.filter((trd) => !trd.ok).length <= 1) {
                const bar = document.getElementById(`${prefix}-bartering`);
                bar.innerHTML = "";
                const sRow = document.createElement("div");
                const col = document.createElement("div");
                col.innerText = "(Empty)";
                sRow.classList.add(
                    "row", "gx-3", "gy-2",
                    "row-cols-2", "row-cols-sm-3", "row-cols-md-4", "row-cols-lg-5", "row-cols-xl-6",
                    "custom-placeholder"
                );
                col.classList.add("col", "py-3");
                sRow.appendChild(col);
                bar.appendChild(sRow);
            }

            // Remove from state.
            data.ok = true;

            // Animate score.
            if (animateScore) animateIcon(document.getElementById(`${prefix}-score`));

        }

        // Handle trade.
        if (data.dir.startsWith("b")) {

            // Get info.
            const item = data.a;
            const price = data.b;

            // Check if user has item to be bought.
            if (!checkItem(item)) {
                denyTrade();
                return;
            }

            // Perform trade.
            takeItem(item);
            changeScore(currentScore + price);
            acceptTrade(true);

        } else if (data.dir.startsWith("s")) {

            // Get info.
            const item = data.b;
            const price = data.a;

            // Check if user has money to buy item.
            if (currentScore - price < 0) {
                denyTrade();
                return;
            }

            // Perform trade.
            changeScore(currentScore - price);
            if (data.dir.endsWith("p")) {
                givePass(item);
            } else {
                giveItem(item);
            }
            acceptTrade();

        } else if (data.dir.startsWith("x")) {

            // Get info.
            const itemA = data.a;
            const itemB = data.b;

            // Check if user has item to exchange.
            if (!checkItem(itemA)) {
                denyTrade();
                return;
            }

            // Perform trade.
            takeItem(itemA);
            if (data.dir.endsWith("p")) {
                givePass(itemB);
            } else {
                giveItem(itemB);
            }
            acceptTrade();

        }

    });

}

// Password initializer.
function initPassword(me, dialogData) {

    // Get elements.
    const passSecret = document.getElementById("pass-secret");
    const passGenerate = document.getElementById("pass-generate");
    const passOutput = document.getElementById("pass-output");

    // Initialize values.
    passSecret.value = retrieveSecret();
    passOutput.value = "";

    // Set up generate click.
    passGenerate.onclick = () => {
        const result = generatePassword("pmyou", dialogData, passSecret.value);
        passOutput.value = result.startsWith("{bad:") ? "" : result;
    };

}

// Drop handler.
function pickUpDrop(me, iconData) {

    // Get data.
    const data = maps[iconData[0]].drop[iconData[1]].itm;

    // Skip if already picked up.
    if (data.ok) return;

    // Perform pick up.
    if (data.typ == "i") {

        // Pick up item.
        const newItem = itemTemplates[data.v];
        inventory.push(newItem);
        document.getElementById("drop-icon").src = `../../assets/graphics/maps/pmyou/i_${newItem.ico}.png`;
        animateOverlay("drop", newItem.txt, false, true);
        changeScore(currentScore);

    } else if (data.typ == "m") {

        // Pick up money.
        const newItem = itemTemplates["nul_money"];
        changeScore(currentScore + data.v);
        document.getElementById("drop-icon").src = `../../assets/graphics/maps/pmyou/i_${newItem.ico}.png`;
        animateOverlay("drop", `${newItem.txt}${formatNum(data.v)}`, false, true);

    }

    // Remove from map.
    me.remove();
    data.ok = true;

}

// Document initialization.
document.addEventListener("DOMContentLoaded", () => {

    // Initialize RPG.
    updateMaps();
    switchFloor("1", null, true);
    changeScore(10);

    // Initialize pocket dialog.
    initDialog("pocket", (me, _) => {
        initInventory(me.prefix);
    });

    // Initialize trade dialog.
    initDialog("trade", (me, data) => {
        initInventory(me.prefix);
        initBartering(me.prefix, data, initTrade);
    });

    // Initialize password dialog.
    initDialog("pass", (me, data) => {
        initPassword(me, data);
    });

    // Initialize pocket button.
    document.getElementById("score-overlay").addEventListener("click", () => {
        openDialog("pocket");
    });

    // Enable tooltips.
    const ttTrigList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...ttTrigList].forEach(elem => new bootstrap.Tooltip(elem));

});

// Reload prompt.
window.addEventListener("beforeunload", (e) => {
    e.preventDefault();
    e.returnValue = '';
});
