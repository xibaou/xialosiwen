/*
   * by balzz
   * dont delete my wm
   * follow more instagram: @iqstore78
*/

const express = require("express")
const axios = require("axios")
const session = require("express-session")
const path = require("path")
const bodyParser = require('body-parser')
const { limit, checkBanned } = require("../declaration/rateLimit.jsx")
const isAuthenticated = require("../declaration/autentikasi.jsx")


// Aktifkan trust proxy


// Middleware dan rute lainnya
const app = express()
app.use(checkBanned)
app.set('trust proxy', true);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: 'komtolllll',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } 
}))

// function isAuthenticated(req, res, next) {
//     if (req.session && req.session.email) {
//         next()
//     } else {
//         res.redirect("/login")
//     }
// }

/* !=== PAGE ===! */
app.get("/", limit, (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/404.html"))
})

app.get("/login", limit, (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/login.html"))
})

app.get("/profile", limit, isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/profile.html"))
})

/* = ENDPOINT FITURE = */
app.post('/register', (req, res) => {
    require("../declaration/register.jsx")(req, res)
})

app.post('/login', (req, res) => {
    require("../declaration/login.jsx")(req, res)
})

app.get("/logout", (req, res) => {
    require("../declaration/logout.jsx")(req, res)
})

app.get("/prof", isAuthenticated, (req, res) => {
    require("../declaration/profile.jsx")(req, res)
})

app.get("/blekbok", limit, async (req, res) => {
    require("../pages/fitures/blackbox.js")(req, res)
})
app.get("/ssweb", limit, async (req, res) => {
    require("../pages/fitures/ssweb.js")(req, res)
})
app.get("/pindl", limit, async (req, res) => {
    require("../pages/fitures/pindl.js")(req, res)
})
app.get("/txtimg", limit, async (req, res) => {
    require("../pages/fitures/dela.js")(req, res)
})
app.get("/descriptimage", limit, async (req, res) => {
    require("../pages/fitures/desc.js")(req, res)
})
app.get("/playstore", limit, async (req, res) => {
    require("../pages/fitures/play.js")(req, res)
})
app.get("/terabox", limit, async (req, res) => {
    require("../pages/fitures/terabox.js")(req, res)
})
app.get("/ttp", limit, async (req, res) => {
    require("../pages/fitures/ttp.js")(req, res)
})
app.get("/riasai", limit, async (req, res) => {
    require("../pages/fitures/riasai.js")(req, res)
})
app.get("/anosai", limit, async (req, res) => {
    require("../pages/fitures/anosai.js")(req, res)
})
app.get("/sfilesearch", limit, async (req, res) => {
    require("../pages/fitures/sfilesearch.js")(req, res)
})
app.get("/nhentaidl", limit, async (req, res) => {
    require("../pages/fitures/nhentaidl.js")(req, res)
})
app.get("/roastinggh", limit, async (req, res) => {
    require("../pages/fitures/roastinggh.js")(req, res)
})
app.get("/iplookup", limit, async (req, res) => {
    require("../pages/fitures/ip.js")(req, res)
})
app.get("/cuaca", limit, async (req, res) => {
    require("../pages/fitures/cuaca.js")(req, res)
})
app.get("/halodoc", limit, async (req, res) => {
    require("../pages/fitures/halodoc.js")(req, res)
})
app.get("/pasdl", limit, async (req, res) => {
    require("../pages/fitures/pasdl.js")(req, res)
})
app.get("/google", limit, async (req, res) => {
    require("../pages/fitures/gol.js")(req, res)
})
app.get("/pinterest", limit, async (req, res) => {
    require("../pages/fitures/pinter.js")(req, res)
})
app.get("/wallpaper", limit, async (req, res) => {
    require("../pages/fitures/wal.js")(req, res)
})
app.get("/videy", limit, async (req, res) => {
    require("../pages/fitures/videy.js")(req, res)
})
app.get("/cord", limit, async (req, res) => {
    require("../pages/fitures/cord.js")(req, res)
})
app.get("/itch", limit, async (req, res) => {
    require("../pages/fitures/itch.js")(req, res)
})
app.get("/cekresi", limit, async (req, res) => {
    require("../pages/fitures/cekresi.js")(req, res)
})
app.get("/duckduckgo", limit, async (req, res) => {
    require("../pages/fitures/duck.js")(req, res)
})
app.get("/gsmsearch", limit, async (req, res) => {
    require("../pages/fitures/gsmsearch.js")(req, res)
})
app.get("/ytmp3", limit, async (req, res) => {
    require("../pages/fitures/ytmp3.js")(req, res)
})
app.get("/ebay", limit, async (req, res) => {
    require("../pages/fitures/ebay.js")(req, res)
})
app.get("/fdroid", limit, async (req, res) => {
    require("../pages/fitures/fdroid.js")(req, res)
})
app.get("/mediafire", limit, async (req, res) => {
    require("../pages/fitures/mediafire.js")(req, res)
})
app.get("/googleimage", limit, async (req, res) => {
    require("../pages/fitures/img.js")(req, res)
})
app.get("/bing", limit, async (req, res) => {
    require("../pages/fitures/bing.js")(req, res)
})
app.get("/ytmp4v2", limit, async (req, res) => {
    require("../pages/fitures/ytmp4.js")(req, res)
})
app.get("/stalkig", limit, async (req, res) => {
    require("../pages/fitures/stalkig.js")(req, res)
})
app.get("/transcriptyt", limit, async (req, res) => {
    require("../pages/fitures/yttr.js")(req, res)
})
app.get("/cineplex", limit, async (req, res) => {
    require("../pages/fitures/cineplex.js")(req, res)
})
app.get("/text2promt", limit, async (req, res) => {
    require("../pages/fitures/text2.js")(req, res)
})
app.get("/crypto", limit, async (req, res) => {
    require("../pages/fitures/cripto.js")(req, res)
})
app.get("/tiktokDL", limit, async (req, res) => {
    require("../pages/fitures/tiktok.js")(req, res)
})
app.get("/shorturl", limit, async (req, res) => {
    require("../pages/fitures/short.js")(req, res)
})
app.get("/ytmp4", limit, async (req, res) => {
    require("../pages/fitures/yt.js")(req, res)
})
app.get("/halosehat", limit, async (req, res) => {
    require("../pages/fitures/halosehat.js")(req, res)
})
app.get("/steam", limit, async (req, res) => {
    require("../pages/fitures/steam.js")(req, res)
})
app.get("/wikipedia", limit, async (req, res) => {
    require("../pages/fitures/wiki.js")(req, res)
})
app.get("/gooreads", limit, async (req, res) => {
    require("../pages/fitures/gooreads.js")(req, res)
})
app.get("/style", limit, async (req, res) => {
    require("../pages/fitures/sty.js")(req, res)
})
app.get("/tsunami", limit, async (req, res) => {
    require("../pages/fitures/tsunami.js")(req, res)
})
app.get("/anime", limit, async (req, res) => {
    require("../pages/fitures/anime.js")(req, res)
})
app.get("/gsmdetail", limit, async (req, res) => {
    require("../pages/fitures/gsmdetail.js")(req, res)
})
app.get("/instagramDL", limit, async (req, res) => {
    require("../pages/fitures/instagram.js")(req, res)
})
app.get("/xnxxsearch", limit, async (req, res) => {
    require("../pages/fitures/xsearch.js")(req, res)
})
app.get("/xnxxdl", limit, async (req, res) => {
    require("../pages/fitures/xxnxdl.js")(req, res)
})
app.get("/bingdata", limit, async (req, res) => {
    require("../pages/fitures/bingdata.js")(req, res)
})
app.get("/xvideosdl", limit, async (req, res) => {
    require("../pages/fitures/xvideosdl.js")(req, res)
})
app.get("/xvideossearch", limit, async (req, res) => {
    require("../pages/fitures/xvsearch.js")(req, res)
})
app.get("/seegore", limit, async (req, res) => {
    require("../pages/fitures/seegore.js")(req, res)
})
app.get("/spotifysearch", limit, async (req, res) => {
    require("../pages/fitures/spotifysearch.js")(req, res)
})
app.get("/gsmmix", limit, async (req, res) => {
    require("../pages/fitures/gsmmix.js")(req, res)
})
app.get("/nhentaisearch", limit, async (req, res) => {
    require("../pages/fitures/psearch.js")(req, res)
})
app.get("/soundcloud", limit, async (req, res) => {
    require("../pages/fitures/scs.js")(req, res)
})
app.get("/to-audio", limit, async (req, res) => {
    require("../pages/fitures/toaudio.js")(req, res)
})
app.get("/Facebook", limit, async (req, res) => {
    require("../pages/fitures/fb.js")(req, res)
})

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "../pages/404.html"))
})

module.exports = app
