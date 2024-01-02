import { useGameState } from "@/contexts/GameStateContext";
import { parseResponseToJSON } from "@/helpers/parseResponseToJSON";
import { useCallback } from "react";

const useParseAssistantResponse = () => {
  const { state, dispatch } = useGameState();
  const parseAssistantResponse = useCallback(
    (message: string) => {
      console.log("message", message);
      try {
        const parsedMessage = parseResponseToJSON(message);
        const { responseType, data, message: responseMessage } = parsedMessage;
        console.log("responseType", responseType);
        console.log("data", data);
        console.log("message", responseMessage);
        // Handle different response types if necessary
        switch (responseType) {
          case "narration":
          case "action":
          case "update":
            // Dispatch updates based on the data object
            if (data.playerUpdate) {
              console.log("update player");
              dispatch(data.playerUpdate);
            }
            if (data.partyUpdate) {
              console.log("update party");
              dispatch(data.partyUpdate);
            }
            if (data.enemiesUpdate) {
              console.log("update enemies");
              dispatch(data.enemiesUpdate);
            }
            if (data.campaignUpdate) {
              console.log("update campaign");
              dispatch(data.campaignUpdate);
            }
            break;
          case "error":
            // Handle errors specifically
            console.error("Assistant Error:", responseMessage);
            dispatch({ type: "SET_ERROR", payload: responseMessage });
            break;
          default:
            console.warn("Unhandled responseType:", responseType);
        }
        if (data.error) {
          dispatch({ type: "SET_ERROR", payload: data.error });
        }
      } catch (error) {
        console.error("Failed to parse assistant response:", error);
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to parse assistant response",
        });
      }
    },
    [dispatch]
  );

  return { parseAssistantResponse };
};

export default useParseAssistantResponse;
