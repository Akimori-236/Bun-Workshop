// get body web element
const body = document.querySelector("body");

// get data from body data-gameid & data-orientation
const gameid = body.dataset.gameid;
const orientation = body.dataset.orientation;

console.info(`gameID: ${gameid}, orientation: ${orientation}`);
