var EventSource = require('eventsource');

let counter = 0;
let errors = 0;

createListener = (j) => {
  const events = new EventSource(`http://ticker_web-interface_1/message-listener/api/subscribe?filter=%5B%7B"exchange"%3A"Coinbase%20Pro"%2C"pairs"%3A%5B"BTC-USD"%5D%7D%5D`);
  events.onmessage = (event) => {
    // console.log(JSON.parse(event.data)); 
  };

  events.onerror = (event)  => {
    console.log(event);
  }

  events.addEventListener("ticker", (event) => {
    counter ++;
  })
}


setInterval(() => { console.log(counter); counter = 0;}, 10000);
for (let j=1; j<=3; j ++) {
  for (let i=0; i<1000; i++) {
    setTimeout(() => createListener(j.toString()), 2 * 1000 * (j-1));
  }
  console.log(j);
}