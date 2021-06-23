import { SubscriptionFilterDto } from "../../../common/dist/dtos/http/subscription-filter-dto";

let listener: EventSource;
const sseUriBase = process && process.env && process.env.NODE_ENV === `development` ? `http://localhost:3001` : `/message-listener`;

const callbacks: {[event: string]: EventListener[]} = {};

const initListener = (filter?: SubscriptionFilterDto[]) => {

  if (listener) {
    Object.keys(callbacks).forEach(event => {
      callbacks[event].forEach(callback => listener.removeEventListener(event, callback));
    });
    listener.close();
  }

  
  
  if (filter) {
    listener = new EventSource(`${sseUriBase}/api/subscribe?filter=${JSON.stringify(filter)}`);
  } else {
    listener = new EventSource(`${sseUriBase}/api/subscribe`);
  }

  Object.keys(callbacks).forEach(event => {
    callbacks[event].forEach(callback => listener.addEventListener(event, callback));
  });
}

export const setFilter = (filter: SubscriptionFilterDto[]) => {
  initListener(filter);
}

export const addEventListener = (eventName: string, callback: EventListener): Function => {
  if (!listener) {
    initListener();
  }
  listener.addEventListener<any>(eventName, callback);
  if (!callbacks.hasOwnProperty(eventName)) {
    callbacks[eventName] = [callback];
  } else {
    callbacks[eventName].push(callback);
  }
  return () => {removeEventListener(eventName, callback)};
}

export const removeEventListener = (eventName: string, callback: EventListener) => {
  listener.removeEventListener<any>(eventName, callback);
  callbacks[eventName].splice( callbacks[eventName].indexOf(callback), 1);
}



