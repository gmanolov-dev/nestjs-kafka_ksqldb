import { SubscriptionFilterDto } from "../../../common/dist/dtos/http/subscription-filter-dto";

const webSocketUrl = process && process.env && process.env.NODE_ENV === `development` ? `ws://localhost:3001` : `ws://localhost:8080/message-listener`;

let socket: WebSocket | null = null;
const callbacks: { [event: string]: EventListener[] } = {};

const subscribeToEvent = (eventName: string, payload: any = null) => {
  if (!socket) {
    socket = new WebSocket(webSocketUrl);

    socket.addEventListener("open", (event) => {
      socket?.send(JSON.stringify(
        {
          action: "subscribe",
          topic: eventName,
          ...payload
        }
      ));
    });
    socket.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      callbacks[msg.channel]?.forEach(
        clb => clb({data: JSON.stringify(msg.message)} as MessageEvent)
      )
    });
  } else {
    socket.send(JSON.stringify(
      {
        action: "subscribe",
        topic: eventName,
        ...payload
      }
    ));
  }
}





export const setFilter = (filter: SubscriptionFilterDto[]) => {
  subscribeToEvent("ticker", {filter});
}

export const addEventListener = (eventName: string, callback: EventListener, payload: any = null): Function => {

  if (!callbacks.hasOwnProperty(eventName)) {
    callbacks[eventName] = [callback];
  } else {
    callbacks[eventName].push(callback);
  }

  if(eventName !== 'ticker' || payload !== null) {
    subscribeToEvent(eventName, payload);  
  }
  return () => { removeEventListener(eventName, callback) };
}

export const removeEventListener = (eventName: string, callback: EventListener) => {
  callbacks[eventName].splice(callbacks[eventName].indexOf(callback), 1);
}



