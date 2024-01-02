export const parseResponseToJSON = (response: string) => {
  const parsedMessage = response
    .replace("json", "")
    .replace("```", "")
    .replace("```", "")
    .replace(/\n/g, "")
    .replace(/\t/g, "");
  const msgInJSON = JSON.parse(parsedMessage);
  return msgInJSON;
};
