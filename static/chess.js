// get body web element
const body = document.querySelector("body");

// get data from body data-gameid & data-orientation
const gameid = body.dataset.gameid;
const orientation = body.dataset.orientation;

console.info(`gameID: ${gameid}, orientation: ${orientation}`);

//Handle onDrop function
const onDrop = (src, dst, piece) => {
    console.info(`src=${src}, dst=${dst}, piece=${piece}`);

    // construct Move object
    const move = { src, dst, piece };

    // Send move to server
    // PATCH /chess/:gameId
    fetch(`/chess/${gameid}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(move),
    })
        .then((result) => console.info("Response: ", result))
        .catch((err) => console.error("ERROR:", err));
};

// Create Chess Config
const config = {
    draggable: true,
    position: "start",
    orientation,
    onDrop,
};

// Create instance of chess game with config
const chess = Chessboard("chess", config);

// Create an SSE connection - to receive pushes from server
const sse = new EventSource("/chess/stream")
