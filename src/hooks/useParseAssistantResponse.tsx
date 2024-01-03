import { useCallback } from "react";
import { useGameState } from "@/contexts/GameStateContext";
import { parseResponseToJSON } from "@/helpers/parseResponseToJSON";
import { Action, IGMResponse } from "@/helpers/gameStateReducer";
const useParseAssistantResponse = () => {
  const { dispatch } = useGameState();

  const isAction = (object: any): object is Action => {
    return typeof object === "object" && object !== null && "type" in object;
  };

  const parseAssistantResponse = useCallback(
    (message: string) => {
      try {
        const parsedMessage: IGMResponse | null = parseResponseToJSON(message);

        if (parsedMessage) {
          const { data } = parsedMessage;

          // Iterate through each property of the data object
          Object.entries(data).forEach(([key, value]) => {
            if (isAction(value)) {
              // If the value is an action, dispatch it
              dispatch(value);
            }
          });

          // Handle global loading state and errors
          if (data.isLoading !== undefined) {
            dispatch({ type: "SET_LOADING", payload: data.isLoading });
          }
          if (data.error) {
            dispatch({ type: "SET_ERROR", payload: data.error });
          }
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
