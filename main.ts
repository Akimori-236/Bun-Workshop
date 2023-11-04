console.log("Hello via Bun!");

import express from "express";
import morgan from "morgan";
import { engine } from "express-handlebars";
import { v4 as uuidv4 } from "uuid";
import { EventSource } from "express-ts-sse"

const port = process.env.PORT || 3000;

// create instance of SSE
const sse = new EventSource()

const app = express();

// configure render
app.engine("html", engine({ defaultLayout: false })) // if true = layout like angular components
app.set("view engine", "html")

// log incoming requests
app.use(morgan("combined"));


// POST
app.post("/chess", express.urlencoded({ extended: true }), (req, resp) => {
    // Start game
    const gameID = uuidv4().substring(0, 8)
    const orientation = "white"
    // pass info into page
    resp.status(200).render("chess", { gameID, orientation })
})

//GET /chess?gameId=abc123
app.get("/chess", (req, resp) => {
    const gameID = req.query.gameID
    const orientation = "black"
    resp.status(200).render("chess", { gameID, orientation })
})

// PATCH /chess/:gameId
app.patch("/chess/:gameId", express.json(), (req, res) => {
    // Retrieve data from request
    const gameID = req.params.gameId
    const move = req.body
    //
    console.info(`GameID: ${gameID}`, move)
    sse.send({ event: gameID, data: move }) // send SSE message (data is auto-Stringify for this library)

    res.status(201).json({ timestamp: (new Date()).getTime() })

})

// sse.init = Broadcast the SSE to everyone
// GET /chess/stream
app.get("/chess/stream", sse.init)
// ideally need to keep a library of connections and only broadcast to the correct gameID

// serve files from static
app.use(express.static(__dirname + "/static"));

app.listen(port, () => {
    console.log("Bun listening to port: " + port);
});
