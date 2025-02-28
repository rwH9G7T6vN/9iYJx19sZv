// ==UserScript==
// @name         florr.io | Combined scripts
// @version      5.0
// @description  Boom
// @author       Furaken
// @match        https://florr.io/
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// ==/UserScript==

let version = '5.1.4.2',
    totalServers = 7,
    username,
    existedSquadCode = [],
    servers = {},
    version_hash = versionHash,
    lastReportMsg,
    afkCheckCounts,
    currentBiome,
    matrixs = ["Garden", "Desert", "Ocean", "Jungle", "Ant Hell", "Hel", "Sewers"],
    colors = [0x1EA761, 0xD4C6A5, 0x5785BA, 0x3AA049, 0x8E603F, 0x8F3838, 0x666633],
    rolePing = {
        Update: "<@&1197952578634395728>",
        Super: "<@&1197849443135913984>",
        Unique: "<@&1229868858504908982>",
        Craft: "<@&1197869192767078532>",
    },
    uniqueSpawn = {
        "Rock": "Something mountain-like appears in the distance...",
        "Cactus": "A tower of thorns rises from the sands...",
        "Hornet": "A big yellow spot shows up in the distance...",
        "Jellyfish": "You hear lightning strikes coming from a far distance...",
        "Firefly": "There's a bright light in the horizon...",
        "Hel": "You sense ominous vibrations coming from a different realm...",
        "Gambler": "You hear someone whisper faintly... \"just... one more game...\""
    },
    rarityColor = [
        "#7eef6d",
        "#ffe65d",
        "#4d52e3",
        "#861fde",
        "#de1f1f",
        "#1fdbde",
        "#ff2b75",
        "#2bffa3",
        "#555555"
    ]

if (!localStorage.__discorduserid) localStorage.__discorduserid = prompt("Discord userid?")
if (!localStorage.__alertSound) localStorage.__alertSound = "https://raw.githubusercontent.com/osso-a/lmrynzfgfr/refs/heads/main/9u7njxxjg8/4nt7dwcs5c.mp3"
if (!localStorage.__usertoken) localStorage.__usertoken = (Math.random() + 1).toString(36).substring(2)
if (!localStorage.__sk__) {
    localStorage.__sk__ = JSON.stringify({
        afk: true,
        quickSquad: false,
        superReport: true
    })
}


let wssUrl
const nativeWebSocket = unsafeWindow.WebSocket
unsafeWindow.WebSocket = function(...args) {
    const socket = new nativeWebSocket(...args)
    wssUrl = socket.url
    return socket
}

const apis = {
    main: ["POST", "https://discord.com/api/webhooks/1317554277559828611/Q_lPvgfmaHBziNXlaVPgbbvNzslGNJ8tVGUfkmX-pesssVIOzKZi9XzBn0da_s-csDOv"],
    super: ["POST", "https://discord.com/api/webhooks/1323686493973254177/5yYlCi8s4pzcBuHCiw-VheIPtJIvr0qZaJU4XxyG5d0k71QdGq6JWyQkpxY7ifvqsT2V"],
    unique: ["POST", "https://discord.com/api/webhooks/1323686537195687947/aTrdW505Bnuspk_u2g_NuD0iyWMCD9YBtNiXdFSJuMnpOTUuGoOADMtaWH17Q7nLYq3j"],
    afk: ["POST", "https://discord.com/api/webhooks/1321056693446115360/tZN31FQp5YJAGq_0HltIom-gy7JUZHr9_em9ReJieSBs5l_vSMTc3nBQAddxCp97qjGP"],
    craft: ["POST", "https://discord.com/api/webhooks/1323686599468253238/q11ZX2qQQ1qKB1kTA0Dk9DlfD6HT74D0CL3nqOQhc3bIS9ODTUrtVssd_ggp561eiNCK"],
    logs: ["POST", "https://discord.com/api/webhooks/1321726592271122483/cVRVESgrvE8sc8b7gyRfQTvfrn0dvpSYNktlQBYMMYsLO5sYVgrE0JCjgOO6LF8lE3cY"]
}

var dataObj = {}

GM_xmlhttpRequest({
    method: "GET",
    url: "https://raw.githubusercontent.com/Matheus28/florrio-i18n-en_US/refs/heads/master/mobs.txt",
    onload: function(response) {
        if (response.status == 200) {
            dataObj.mob = response.responseText
        }
    }
})

function apiReq(api, data) {
    GM_xmlhttpRequest({
        method: api[0],
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
        url: api[1],
        data: data
    })
    return
}

function getUsername(tx, this_) {
    if (this_.font == "32px Ubuntu" && !username) username = tx
    return
}

function updateServers() {
    for (let i = 0; i < totalServers; i++) {
        fetch(`https://api.n.m28.io/endpoint/florrio-map-${i}-green/findEach/`).then((response) => response.json()).then((data) => {
            if (servers[matrixs[i]] == null) {
                servers[matrixs[i]] = {
                    NA: {},
                    EU: {},
                    AS: {}
                }
            }
            if (data?.servers?.["vultr-miami"]?.id) servers[matrixs[i]].NA[data.servers["vultr-miami"].id] = Math.floor(Date.now() / 1000)
            if (data?.servers?.["vultr-frankfurt"]?.id) servers[matrixs[i]].EU[data.servers["vultr-frankfurt"].id] = Math.floor(Date.now() / 1000)
            if (data?.servers?.["vultr-tokyo"]?.id) servers[matrixs[i]].AS[data.servers["vultr-tokyo"].id] = Math.floor(Date.now() / 1000)
        });
    }
    for (const [keyMatrix, valueMatrix] of Object.entries(servers)) {
        for (const [keyServer, valueServer] of Object.entries(valueMatrix)) {
            for (const [keyId, valueId] of Object.entries(valueServer)) {
                if (Math.floor(Date.now() / 1000) - valueId > 5 * 60) delete servers[keyMatrix][keyServer][keyId]
            }
        }
    }
    return
}

function getServerId(c_biome) {
    let cp6Code = wssUrl.match(/wss:\/\/([a-z0-9]*).s.m28n.net\//)[1]
    for (const [biome_temp, serversObj] of Object.entries(servers)) {
        for (const [server, obj] of Object.entries(serversObj)) {
            if (Object.keys(obj).includes(cp6Code)) {
                let biome = c_biome || biome_temp
                if (!biome) biome = ""
                if (currentBiome != biome) {
                    afkCheckCounts = [0, Math.floor(Date.now() / 1000)]
                    currentBiome = biome
                }
                return {server, biome, cp6Code}
            }
        }
    }
    return
}

function quickSquad(text, color) {
    if (color != "#ff94c9") return
    if (!/^Squad (.+) created.$/.test(text)) return
    let squad = text.match(/^Squad (.+) created.$/)[1]
    let currentLocation = getServerId()
    if (existedSquadCode.includes(squad)) return
    else existedSquadCode.push(squad)
    if (!JSON.parse(localStorage.__sk__).quickSquad) return

    updateServers()
    navigator.clipboard.writeText(`/squad-join ${squad}`)
    apiReq(apis.main, JSON.stringify({
        embeds: [{
            title: `${username}'s squad: ${currentLocation?.biome}`,
            description: "```/squad-join " + squad + "```",
            fields: [
                { name: "Send location", value: `${currentLocation?.server} - ${currentLocation?.cp6Code}`, inline: true},
                { name: "Squad code", value: squad, inline: true},
                { name: "Trigger time", value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: false},
                { name: "Version", value: version_hash, inline: false},
            ],
            color: colors[matrixs.indexOf(currentLocation?.biome)],
            footer: {text: `${localStorage.__usertoken} | ${version}`}
        }],
    }))
    return
}

function superTracker(text, color, isMeasureText, x, y) {
    if (["#ffffff", "#000000"].includes(color) && !isMeasureText) return
    let rarity, name, type, user, triggerTime = Math.floor(Date.now() / 1000),
        regex = /An? (?<rarity>[A-Za-z]+) (?<name>.+) has (?<type>spawned( somewhere)?|been (defeated|crafted)( by (?<user>.+))?)!/
    if (regex.test(text)) {
        let matches = text.match(regex).groups
        rarity = matches.rarity
        name = matches.name
        type = matches.type
        user = matches.user
    } else if (Object.entries(uniqueSpawn).find(x => x[1] == text)) {
        if (color == "#555555") rarity = "Unique"
        else if (color == "#2bffa3") rarity = "Super"
        else rarity = "?"
        name = Object.entries(uniqueSpawn).find(x => x[1] == text)[0]
        type = "spawned"
    }
    else return
    if (isMeasureText) {
        lastReportMsg = name
        return
    }
    if (name != lastReportMsg) return
    lastReportMsg = ""
    color = parseInt(color.slice(1), 16)
    let currentLocation = getServerId()
    var thisType = ""
    if (type.includes("spawned")) thisType = "spawn"
    else if (type.includes("defeated")) thisType = "death"
    else if (type.includes("crafted")) thisType = "craft"
    let thisRarity = rarity.toLowerCase()
    if (!["super", "unique"].includes(thisRarity)) thisRarity = "main"
    if (type.includes("spawned")) {
        apiReq(apis[thisRarity], JSON.stringify({
            content: `${currentLocation?.server}: ${name} ${rolePing[rarity]}`,
            embeds: [{
                title: `${currentLocation?.server}: ${rarity} ${name}`,
                description: text,
                fields: [
                    { name: "Send location", value: `${currentLocation?.server} - ${currentLocation?.cp6Code}`, inline: true},
                    { name: "Trigger time", value: `<t:${triggerTime}:R>`, inline: true},
                    { name: "Version", value: version_hash, inline: false},
                ],
                color: color,
                footer: {text: `${localStorage.__usertoken} | ${version}`}
            }],
        }))
    }
    else if (type.includes("defeated")) {
        apiReq(apis[thisRarity], JSON.stringify({
            embeds: [{
                title: `${currentLocation?.server}: ${text}`,
                fields: [
                    { name: "Trigger time", value: `<t:${triggerTime}:R>`, inline: true},
                    { name: "Version", value: version_hash, inline: false},
                ],
                color: color,
                footer: {text: `${localStorage.__usertoken} | ${version}`}
            }],
        }))
    }
    else if (type.includes("crafted")) {
        apiReq(apis.craft, JSON.stringify({
            content: rolePing.Craft,
            embeds: [{
                title: `${text}`,
                fields: [
                    { name: "Trigger time", value: `<t:${triggerTime}:R>`, inline: true},
                    { name: "Version", value: version_hash, inline: false},
                ],
                color: color,
                footer: {text: `${localStorage.__usertoken} | ${version}`}
            }],
        }))
    }
    apiReq(apis.logs, JSON.stringify({
        username: thisType,
        avatar_url: "https://raw.githubusercontent.com/osso-a/lmrynzfgfr/refs/heads/main/9u7njxxjg8/ymzsuti7z0i.png",
        content: "```js\n" + JSON.stringify({
            script: {
                name: thisType,
                version: version,
                rarity: rarity,
                name: name,
                type: type,
                user: user
            },
            location: {
                cp6: currentLocation?.cp6Code,
                server: currentLocation?.server,
                biome: currentLocation?.biome
            },
            trigger_time: Math.floor(Date.now() / 1000),
            user: {
                username: username,
                token: localStorage.__usertoken
            }
        }, null, 4) + "```",
    }))
}

var afkCheckTimer = new Array(3).fill(0),
    lastSendTime = new Array(2).fill(0),
    timeGap = 300,
    timeCd = 5 * 60 * 1000

function afkAlert(tx, x, y, radius, startAngle, endAngle, counterclockwise, color) {
    if (!JSON.parse(localStorage.__sk__).afk) return
    if (tx == "AFK?") afkCheckTimer[0] = Date.now()
    if (tx == "You will be kicked for being AFK if you don't move soon.") afkCheckTimer[1] = Date.now()
    if (tx == "ARC" && rarityColor.includes(color) && 0 <= radius && radius <= 0.06) afkCheckTimer[2] = Date.now()
    if (![afkCheckTimer[0], afkCheckTimer[1]].map(x => Date.now() - x < timeGap).includes(false) && Date.now() - lastSendTime[0] > timeCd || ![afkCheckTimer[2]].map(x => Date.now() - x < timeGap).includes(false) && Date.now() - lastSendTime[1] > timeCd) {
        let type = "?"
        if (![afkCheckTimer[0], afkCheckTimer[1]].map(x => Date.now() - x < timeGap).includes(false)) {
            lastSendTime[0] = Date.now()
            type = "Movement check ✅"
        }
        if (![afkCheckTimer[2]].map(x => Date.now() - x < timeGap).includes(false)) {
            lastSendTime[1] = Date.now()
            type = "AFK check ✅"
        }

        if (localStorage.__alertSound != "" || localStorage.__alertSound != null) new Audio(localStorage.__alertSound).play()
        if (!isNaN(Number(localStorage.__discorduserid))) {
            afkCheckCounts[0]++
            apiReq(apis.afk, JSON.stringify({
                content: `<@${localStorage.__discorduserid}>`,
                embeds: [{
                    title: type,
                    fields: [
                        { name: "AFK Checks of this session", value: afkCheckCounts[0], inline: true},
                        { name: "Start time of this session", value: `<t:${afkCheckCounts[1]}:R>`, inline: true},
                        { name: "Trigger time", value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: false},
                        { name: "Difficulty", value: (1 / radius).toFixed(2) || "1.00", inline: true},
                        { name: "Version", value: version_hash, inline: false},
                    ],
                    color: 0xdbd74b,
                    footer: {text: `${localStorage.__usertoken} | ${version}`}
                }],
            }))
        }
        let currentLocation = getServerId()
        apiReq(apis.logs, JSON.stringify({
            username: "afk-alert",
            avatar_url: "https://raw.githubusercontent.com/osso-a/lmrynzfgfr/refs/heads/main/9u7njxxjg8/ymzsuti7z0i.png",
            content: "```js\n" + JSON.stringify({
                script: {
                    name: "afk-alert",
                    version: version
                },
                location: {
                    cp6: currentLocation?.cp6Code,
                    server: currentLocation?.server,
                    biome: currentLocation?.biome
                },
                trigger_time: Math.floor(Date.now() / 1000),
                user: {
                    username: username,
                    token: localStorage.__usertoken
                }
            }, null, 4) + "```",
        }))
    }
    return
}

for (const {prototype} of [OffscreenCanvasRenderingContext2D, CanvasRenderingContext2D]) {
    if (!prototype.__sk_fll_tx) {
        prototype.__sk_fll_tx = prototype.fillText
        prototype.__sk_stk_tx = prototype.strokeText
        prototype.__sk_msr_tx = prototype.measureText
        prototype.__sk_arc = prototype.arc
    }
    else break
    prototype.fillText = function(tx, x, y) {
        quickSquad(tx, this.fillStyle)
        superTracker(tx, this.fillStyle, Boolean(0), x, y)
        return this.__sk_fll_tx(tx, x, y)
    }
    prototype.strokeText = function(tx, x, y) {
        afkAlert(tx)
        return this.__sk_stk_tx(tx, x, y)
    }
    prototype.measureText = function(tx) {
        getUsername(tx, this)
        superTracker(tx, null, Boolean(1))
        return this.__sk_msr_tx(tx)
    }
    prototype.arc = function(x, y, radius, startAngle, endAngle, counterclockwise) {
        afkAlert("ARC", x, y, radius, startAngle, endAngle, counterclockwise, this.fillStyle)
        return this.__sk_arc(x, y, radius, startAngle, endAngle, counterclockwise)
    }
}

setInterval(() => {
    updateServers()
    getServerId()
}, 1 * 60 * 1000)

/*
var isTriggered = false

setInterval(() => {
    if (!dataObj?.mob) return
    if (isTriggered) return
    isTriggered = true

    let obj = {
        mob: {}
    }

    dataObj.mob.split('\n').forEach(x => {
        let t = x.match(/Mobs\/(.+)\/(.+)=(.+)/)
        if (!t) return
        if (!obj.mob[t[1]]) obj.mob[t[1]] = {}
        obj.mob[t[1]][t[2].toLowerCase()] = t[3]
    })
    dataObj.mob = obj.mob
})*/
