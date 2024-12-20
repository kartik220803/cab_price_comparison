let getUber = async (src, dest, browserInstance) => {
  try {
    let newTab = await browserInstance.newPage();
    await newTab.goto("https://ride.guru/")
    await newTab.waitForSelector('input[placeholder="Enter start location"]', { visible: true })
    await newTab.mouse.wheel({
      deltaY: 200,
    });
    await newTab.click('input[placeholder="Enter start location"]')
    await newTab.type('input[placeholder="Enter start location"]', src, {delay:10});
    await newTab.click('input[placeholder="Enter end location"]')
    await newTab.type('input[placeholder="Enter end location"]', dest, {delay:10});
    await newTab.click('#get-fare-button')
    await newTab.waitForSelector('#results')

    let consoleFn = () => {
      
      let detailsArr = [];
      const h5Elements = document.querySelectorAll('h5');
      const targetElement = Array.from(h5Elements).find(element => element.innerText === 'Uber Go');
      let parent1 = targetElement.parentElement
      let parent2 = parent1.parentElement
      let parent3 = parent2.parentElement
      let parent4 = parent3.parentElement
      let finalh4= parent4.querySelector('h4')
      let u_fare = finalh4.innerText
      let uber_fare = u_fare.split("₹")[1]

      detailsArr.push({
            Type: "Sedan",
            Fare: uber_fare
          });

      return detailsArr;
    };

    return newTab.evaluate(consoleFn);
  } catch (err) {
    console.log("ERROR CAUGHT IN main.js> pdfconverter()  \n", err);
  }
};

module.exports.getUber = getUber;
