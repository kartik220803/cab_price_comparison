// Node modules
let puppeteer = require("puppeteer");
let fs = require("fs");
let process = require("process");

// Self modules
let graphPlot = require("./graphPlot");
let htmlFormat = require("./htmlFormat");
let map = require("./map");
let notify = require("./notifications");

// Cab modules
let uberFetch = require("./cab-modules/uber");
let olaFetch = require("./cab-modules/ola");
let meruFetch = require("./cab-modules/meru");

(async () => {
  try {
    let source = process.argv[2];
    let dest = process.argv[3];
    console.log("Fetching data for cabs\nFROM: " + source + "\nTO: " + dest);
    let browserInstance = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--start-maximized"],
    });

    let data = [];

    console.log("\nFetching prices for:");
    console.log("UBER...");
    let uberArr = await uberFetch.getUber(source, dest, browserInstance);
    console.log("OLA...");
    let olaArr = await olaFetch.getOla(source, dest, browserInstance);
    console.log("MERU...");
    let meruArr = await meruFetch.getMeru(source, dest, browserInstance);

    data.push({
      Service: "Uber",
      Details: uberArr,
    });

    data.push({
      Service: "Ola",
      Details: olaArr,
    });

    data.push({
      Service: "Meru",
      Details: meruArr,
    });

    console.log("\nPrices fetched...\nProcessing data... ");

    fs.writeFileSync("./data/fares.json", JSON.stringify(data));
    
    // PLOTTING GRAPH
    console.log("\nPlotting graph...");
    // await graphPlot.makeGraph(data);
    console.log("\nGraph plotted...");

    browserInstance.close();

    console.log("\nWork finished...");
  } catch (err) {
    console.log("ERROR CAUGHT IN main.js  \n", err);
  }
})();

