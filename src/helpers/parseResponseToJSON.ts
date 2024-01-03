import { IGMResponse } from "./gameStateReducer";

export const parseResponseToJSON = (response: string): IGMResponse | null => {
  const regex = /```json([^`]*)```/;
  const matches = response.match(regex);

  if (matches && matches[1]) {
    const parsedMessage = matches[1].replace(/\n/g, "").replace(/\t/g, "");
    try {
      const msgInJSON = JSON.parse(parsedMessage);
      console.log("Parsed JSON:", msgInJSON);
      return msgInJSON as IGMResponse; // Cast the parsed object to IGMResponse
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return null;
    }
  }
  return null;
};
