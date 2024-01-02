export const parseResponseToJSON = (response: string) => {
  // Regular expression to match content between ```json and ```
  const regex = /```json([^`]*)```/;
  const matches = response.match(regex);

  // If matches are found and there is content between the backticks
  if (matches && matches[1]) {
    const parsedMessage = matches[1]
      .replace(/\n/g, "") // Remove newlines
      .replace(/\t/g, ""); // Remove tabs

    try {
      const msgInJSON = JSON.parse(parsedMessage);
      return msgInJSON;
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      // Handle the error as appropriate
      return null;
    }
  }

  // Return null or an appropriate value if the pattern isn't found
  return null;
};
