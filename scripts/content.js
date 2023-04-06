const TOTAL_DOGS = 2;
const SCAN_INTERVAL_MS = 50;
const SCAN_TIMEOUT_MS = 5_000;

const BIRD_PATH = 'images/bird.png';

var dogsEliminated = 0;
var scanIntervalHandler;
var timeoutHandler;
var birdURL;

const dogLog = (logMessage) => {
    const logHeader = "DOG REMOVER EXTENSION:";
    console.log(`${logHeader} ${logMessage}`);
}

const runSetup = async () => {
    birdURL = await chrome.runtime.getURL(path=BIRD_PATH);
}

const removeDog = async () => {

    const dogMarkup = document.querySelector("pattern > image");

    if(dogMarkup && !dogMarkup.hasAttribute("dogRemoved")) {

        if(!birdURL) {
            birdURL = await chrome.runtime.getURL(path=BIRD_PATH);
        }
        dogMarkup.setAttribute("xlink:href", birdURL);
        dogMarkup.setAttribute("dogRemoved", "true");
        
        dogsEliminated++;
        dogLog(`Dog eliminated. Kill count: ${dogsEliminated}`);
    }
};

const scanForDog = (timeout, interval) => {

    const stopScan = () => {
        if(scanIntervalHandler) {
            window.clearInterval(scanIntervalHandler);
        }
        if(timeoutHandler) {
            window.clearTimeout(timeoutHandler);
        }
    };

    const timeoutScan = () => {
        dogLog(`Timed out at ${SCAN_TIMEOUT_MS} milliseconds. There could be yet more out there.`);
        stopScan();
    }

    const tryRemoveDog = () => {
        removeDog();
        if(dogsEliminated === TOTAL_DOGS) {
            stopScan(scanIntervalHandler);
            dogLog("All dogs eliminated. Entering sleep mode.");
        }
    };

    dogLog("Scanning for dog...");
    scanIntervalHandler = window.setInterval(tryRemoveDog, interval);
    timeoutHandler = window.setTimeout(timeoutScan, timeout);
}

// Main function
runSetup();
scanForDog(SCAN_TIMEOUT_MS, SCAN_INTERVAL_MS);