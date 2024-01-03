import { IGMResponse } from "./gameStateReducer";

export const parseResponseToJSON = (response: string): IGMResponse | null => {
  console.log("Parsing response:", response);
  const regex = /```json\n([\s\S]*?)\n```/;

  const matches = response.match(regex);

  if (matches && matches[1]) {
    let formattedMessage = matches[1].trim();

    // Try parsing the JSON
    try {
      console.log("Attempting to parse JSON:", formattedMessage);
      const msgInJSON = JSON.parse(formattedMessage);
      console.log("Successfully parsed JSON:", msgInJSON);
      return msgInJSON as IGMResponse;
    } catch (error) {
      console.error("Failed to parse JSON. Error:", error);
      console.error("Faulty JSON string:", formattedMessage);
    }
  } else {
    console.error("No valid JSON block found in the response.");
  }
  return null;
};
