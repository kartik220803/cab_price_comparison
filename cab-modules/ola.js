let link_f ="https://www.taxifarefinder.com/main.php?city=Ola-Sedan-Mathura-India"
let getOla = async (src, dest, browserInstance) => {
  try {
    let detailsArr = [];
      let price = await getItem(browserInstance, link_f, src, dest);
            
        detailsArr.push({
          Type: "Sedan",
          Fare: price,
        });    
        return detailsArr;
  } catch (err) {
    console.log("ERROR CAUGHT IN ola.js>getOla()  \n", err);
  }
};

let getItem = async (browserInstance, link, src, dest) => {
  try {
    let newTab = await browserInstance.newPage();
    await newTab.goto(link, { waitUntil: "load", timeout: 0 });
    await newTab.setDefaultNavigationTimeout(0);
    await newTab.waitForSelector("#fromAddress", { visible: true });
    await newTab.type("#fromAddress", src, { delay: 100 });
    await new Promise((r) => setTimeout(r, 2000));
    await newTab.keyboard.press("Enter");
    await newTab.keyboard.press("Enter");
    await newTab.type("#toAddress", dest, { delay: 100 });
    await new Promise((r) => setTimeout(r, 2000));
    await newTab.keyboard.press("Enter");
    await newTab.keyboard.press("Enter");

    //.form-goButton
    await new Promise((r) => setTimeout(r, 2000));
    await newTab.click(".form-goButton");
    await new Promise((r) => setTimeout(r, 2000));
    await newTab.click(".form-goButton");
    await new Promise((r) => setTimeout(r, 2000));
    await newTab.click(".form-goButton");

    await newTab.waitForSelector(".fareValue");
    //.fareValue
    let consolefn = () => {
      let fare = document.querySelector(".fareValue");
      return fare.innerText.split("₹")[1].split(",").join("");
    };

    return newTab.evaluate(consolefn);
  } catch (err) {
    console.log("ERROR CAUGHT IN ola.js>getItem()  \n", err);
  }
};

module.exports.getOla = getOla;
