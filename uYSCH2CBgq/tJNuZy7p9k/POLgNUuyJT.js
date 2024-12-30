let v = "5.1.5", t_servers = 7, version_hash = versionHash, username, existedCodes = [], servers = {}, __last_msg, afkCheckCounts, currentBiome,
    matrixs = ["Garden", "Desert", "Ocean", "Jungle", "Ant Hell", "Hel", "Sewers"],
    colors = [0x1EA761, 0xD4C6A5, 0x5785BA, 0x3AA049, 0x8E603F, 0x8F3838, 0x666633],
    rolePing = {
        Update: "<@&1197952578634395728>",
        Super: "<@&1197849443135913984>",
        Unique: "<@&1229868858504908982>",
        Craft: "<@&1197869192767078532>",
    },
    uniqueSpawnMsg = {
        "Cactus": "A tower of thorns rises from the sands...",
        "Hel Beetle": "You sense ominous vibrations coming from a different realm...",
        "Jellyfish": "You hear lightning strikes coming from a far distance...",
        "Rock": "Something mountain-like appears in the distance...",
        "Hornet": "A big yellow spot shows up in the distance...",
        "Fly": "A buzzing noise echoes through the sewer tunnels",
        "Firefly": "There's a bright light in the horizon...",
        "Gambler": `You hear someone whisper faintly... "just... one more game..."`
    }
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

let t, a, b, c, d, e, w = 300, z = 5 * 60 * 1000
t = a = b = c = d = e = 0

let url
const nativeWebSocket = unsafeWindow.WebSocket
unsafeWindow.WebSocket = function(...args) {
    const socket = new nativeWebSocket(...args)
    url = socket.url
    return socket
}

const __sk__ = new class {
    __api() {
        const main = ["POST", "https://discord.com/api/webhooks/1317554277559828611/Q_lPvgfmaHBziNXlaVPgbbvNzslGNJ8tVGUfkmX-pesssVIOzKZi9XzBn0da_s-csDOv"],
              logs = ["POST", "https://discord.com/api/webhooks/1205023134223433769/UJBpKmPVwpkbJ-_KdS4Elkf8AHmnz15XgzsLfR6ntaF3ESw30SzxfGprza9cOKDstORK"],
              afk_channel = ["POST", "https://discord.com/api/webhooks/1321056693446115360/tZN31FQp5YJAGq_0HltIom-gy7JUZHr9_em9ReJieSBs5l_vSMTc3nBQAddxCp97qjGP"],
              logs_channel = ["POST", "https://discord.com/api/webhooks/1321726592271122483/cVRVESgrvE8sc8b7gyRfQTvfrn0dvpSYNktlQBYMMYsLO5sYVgrE0JCjgOO6LF8lE3cY"]
        return {main, logs, afk_channel, logs_channel}
    }

    __apiRequest(api, data) {
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

    __getUsername(tx, this_) {
        if (this_.font == "32px Ubuntu" && !username) username = tx
        return
    }

    __afkAlert(tx) {
        if (!JSON.parse(localStorage.__sk__).afk) return
        if (tx == "AFK Check") a = Date.now()
        if (tx == "Are you here?") b = Date.now()
        if (tx == "I'm here") c = Date.now()
        if (tx == "AFK?") d = Date.now()
        if (tx == "You will be kicked for being AFK if you don't move soon.") e = Date.now()
        if ((![a, b, c].map(x => Date.now() - x < w).includes(false) || ![d, e].map(x => Date.now() - x < w).includes(false)) && Date.now() - t > z) {
            if (localStorage.__alertSound != "" || localStorage.__alertSound != null) new Audio(localStorage.__alertSound).play()
            if (!isNaN(Number(localStorage.__discorduserid))) {
                afkCheckCounts[0]++
                this.__apiRequest(this.__api().afk_channel, JSON.stringify({
                    content: `<@${localStorage.__discorduserid}>`,
                    embeds: [{
                        title: `AFK Check ✅`,
                        fields: [
                            { name: "AFK Checks of this session", value: afkCheckCounts[0], inline: true},
                            { name: "Start time of this session", value: `<t:${afkCheckCounts[1]}:R>`, inline: true},
                            { name: "Trigger time", value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: false},
                            { name: "Version", value: version_hash, inline: false},
                        ],
                        color: 0xdbd74b,
                        footer: {text: `${localStorage.__usertoken} | ${v}`}
                    }],
                }))
            }
            this.__apiRequest(this.__api().logs_channel, JSON.stringify({
                username: "afk-alert",
                avatar_url: "https://raw.githubusercontent.com/osso-a/lmrynzfgfr/refs/heads/main/9u7njxxjg8/ymzsuti7z0i.png",
                content: "```js\n" + JSON.stringify({
                    script: {
                        name: "afk-alert",
                        version: v
                    },
                    trigger_time: Math.floor(Date.now() / 1000),
                    user: {
                        username: username,
                        token: localStorage.__usertoken
                    }
                }, null, 4) + "```",
            }))
            t = Date.now()
        }
        return
    }

    __updateServers() {
        for (let i = 0; i < t_servers; i++) {
            fetch(`https://api.n.m28.io/endpoint/florrio-map-${i}-green/findEach/`).then((response) => response.json()).then((data) => {
                if (servers[matrixs[i]] == null) {
                    servers[matrixs[i]] = {
                        NA: {},
                        EU: {},
                        AS: {}
                    }
                }
                servers[matrixs[i]].NA[data.servers["vultr-miami"].id] = Math.floor(Date.now() / 1000)
                servers[matrixs[i]].EU[data.servers["vultr-frankfurt"].id] = Math.floor(Date.now() / 1000)
                servers[matrixs[i]].AS[data.servers["vultr-tokyo"].id] = Math.floor(Date.now() / 1000)
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

    __getServerId(customBiome) {
        let cp6Code = url.match(/wss:\/\/([a-z0-9]*).s.m28n.net\//)[1]
        for (const [biome_temp, serversObj] of Object.entries(servers)) {
            for (const [server, obj] of Object.entries(serversObj)) {
                if (Object.keys(obj).includes(cp6Code)) {
                    let biome = customBiome || biome_temp
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

    __quickSquad(text, color) {
        if (color != "#ff94c9") return
        if (!/^Squad (.+) created.$/.test(text)) return
        let squad = text.match(/^Squad (.+) created.$/)[1]
        let currentLocation = this.__getServerId()
        if (existedCodes.includes(squad)) return
        else existedCodes.push(squad)
        if (!JSON.parse(localStorage.__sk__).quickSquad) return

        this.__updateServers()
        navigator.clipboard.writeText(`/squad-join ${squad}`)
        this.__apiRequest(this.__api().main, JSON.stringify({
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
                footer: {text: `${localStorage.__usertoken} | ${v}`}
            }],
        }))
        return
    }

    __superTracker(text, color, isMeasureText, x, y) {
        if (["#ffffff", "#000000"].includes(color) && !isMeasureText) return
        let rarity, name, type, user, triggerTime = Math.floor(Date.now() / 1000),
            regex = /An? (?<rarity>[A-Za-z]+) (?<name>.+) has (?<type>spawned( somewhere)?|been (defeated|crafted)( by (?<user>.+))?)!/
        if (regex.test(text)) {
            let matches = text.match(regex).groups
            rarity = matches.rarity
            name = matches.name
            type = matches.type
            user = matches.user
        } else if (Object.keys(uniqueSpawnMsg).find(key => uniqueSpawnMsg[key] == text)) {
            if (color == "#555555") rarity = "Unique"
            else if (color == "#2bffa3") rarity = "Super"
            else rarity = "?"
            name = Object.keys(uniqueSpawnMsg).find(key => uniqueSpawnMsg[key] == text)
            type = "spawned"
        }
        else return
        if (isMeasureText) {
            __last_msg = name
            return
        }
        if (name != __last_msg) return
        __last_msg = ""
        color = parseInt(color.slice(1), 16)
        let currentLocation = this.__getServerId()
        if (type.includes("spawned")) {
            if (!type.includes("somewhere") && !Object.keys(uniqueSpawnMsg).find(key => uniqueSpawnMsg[key] == text)) color = 0xdbd74b
            this.__apiRequest(this.__api().main, JSON.stringify({
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
                    thumbnail: { url: `https://raw.githubusercontent.com/Furaken/florr.io/refs/heads/main/image/mob/${rarity}/${name}.png`.replaceAll(" ", "%20") },
                    footer: {text: `${localStorage.__usertoken} | ${v}`}
                }],
            }))
            /*const subCanvas = document.createElement("canvas")
            const region = { x: x, y: y, width: 100, height: 100 }
            subCanvas.width = region.width
            subCanvas.height = region.height

            subCanvas.getContext("2d").putImageData(m.canvas.getContext("2d").getImageData(region.x, region.y, region.width, region.height), 0, 0)
            subCanvas.toBlob((blob) => {
                const a = new FormData()
                a.append("file", blob, "a.png")
                this.__apiRequest(this.__api().main, a)
            }, "image/png")*/
        }
        else if (type.includes("defeated")) {
            this.__apiRequest(this.__api().main, JSON.stringify({
                embeds: [{
                    title: `${currentLocation?.server}: ${text}`,
                    fields: [
                        { name: "Trigger time", value: `<t:${triggerTime}:R>`, inline: true},
                        { name: "Version", value: version_hash, inline: false},
                    ],
                    color: color,
                    footer: {text: `${localStorage.__usertoken} | ${v}`}
                }],
            }))
        }
        else if (type.includes("crafted")) {
            this.__apiRequest(this.__api().main, JSON.stringify({
                content: rolePing.Craft,
                embeds: [{
                    title: `${text}`,
                    fields: [
                        { name: "Trigger time", value: `<t:${triggerTime}:R>`, inline: true},
                        { name: "Version", value: version_hash, inline: false},
                    ],
                    color: color,
                    thumbnail: { url: `https://raw.githubusercontent.com/Furaken/florr.io/refs/heads/main/image/petal/${rarity == "Super" && ["Poker Chip", "Corruption"].includes(name) ? "Super " : ""}${name}.png`.replaceAll(" ", "%20") },
                    footer: {text: `${localStorage.__usertoken} | ${v}`}
                }],
            }))
        }
    }
}

__sk__.__updateServers()

if (version_hash != localStorage.__versionHash) {
    localStorage.__versionHash = version_hash
    alert(`New version\n${version_hash}`)
    __sk__.__apiRequest(__sk__.__api().main, JSON.stringify({
        content: rolePing.Update,
        embeds: [{
            title: `New version`,
            description: `\`${version_hash}\``,
            footer: {text: `${localStorage.__usertoken} | ${v}`}
        }],
    }))
}

for (const {prototype} of [OffscreenCanvasRenderingContext2D, CanvasRenderingContext2D]) {
    if (!prototype.__sk_fll_tx) {
        prototype.__sk_fll_tx = prototype.fillText
        prototype.__sk_stk_tx = prototype.strokeText
        prototype.__sk_msr_tx = prototype.measureText
    }
    else break
    prototype.fillText = function(tx, x, y) {
        __sk__.__quickSquad(tx, this.fillStyle)
        __sk__.__superTracker(tx, this.fillStyle, Boolean(0), x, y)
        return this.__sk_fll_tx(tx, x, y)
    }
    prototype.strokeText = function(tx, x, y) {
        __sk__.__afkAlert(tx)
        return this.__sk_stk_tx(tx, x, y)
    }
    prototype.measureText = function(tx) {
        __sk__.__getUsername(tx, this)
        __sk__.__superTracker(tx, null, Boolean(1))
        return this.__sk_msr_tx(tx)
    }
}

setInterval(() => {
    __sk__.__updateServers()
    __sk__.__getServerId()
}, 1 * 60 * 1000)
