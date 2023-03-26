import { FeedConfig } from "../model";
const uriBase = process && process.env && process.env.NODE_ENV === `development` ? `http://localhost:3002` : `/config`;
export const updateConfig = async (data: FeedConfig[]) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
  await fetch(`${uriBase}/api/feed`, requestOptions);
}

