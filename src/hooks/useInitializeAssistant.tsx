// useInitializeAssistant.ts
import { useContext, useCallback, useState } from "react";
import { useAssistant } from "@/contexts/AssistantContext";
import { useGameState } from "@/contexts/GameStateContext";
import {
  addMessageToThread,
  createThread,
} from "@/requests/assistantsRequests";
import { IState } from "@/contexts/GameStateContext";
import { parseResponseToJSON } from "@/helpers/parseResponseToJSON";
import useParseAssistantResponse from "./useParseAssistantResponse";

const useInitializeAssistant = () => {
  const { state, dispatch } = useAssistant();
  const { state: gameState, dispatch: gameDispatch } = useGameState();
  const { parseAssistantResponse } = useParseAssistantResponse();

  // A function to construct the initial prompt based on the game state
  const constructInitialPrompt = (gameState: IState): string => {
    // Example prompt creation, you can customize it based on your needs
    const { player, campaign } = gameState;
    return `
        Campaign details:
        Name: ${campaign.name}
        Setting: ${campaign.setting}
        Description: ${campaign.description}
        Additional info: ${campaign.additionalInfo}
        Player details:
        Name: ${player.name}
        Class name: ${player.class.name}
        Class description: ${player.class.description}
        Stats: ${JSON.stringify(player.stats)}
        Level: ${player.level}
        Experience: ${player.experience}
        Inventory: ${JSON.stringify(player.inventory)}
        Party: ${JSON.stringify(gameState.party)}
    `;
  };

  // A function to initialize the assistant with the first prompt
  const initializeAssistant = useCallback(async () => {
    if (state.threadId && state.assistantId && !state.assistantInitialized) {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const initialPrompt = constructInitialPrompt(gameState);
        const response = await addMessageToThread({
          threadID: state.threadId,
          content: initialPrompt,
        });
        parseAssistantResponse(response.messages[0].content[0].text.value);
        dispatch({ type: "ADD_MESSAGES", payload: response.messages });
        dispatch({ type: "SET_ASSISTANT_INITIALIZED", payload: true });
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to initialize the assistant",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }
  }, [state, dispatch, gameState]);

  return { initializeAssistant };
};

export default useInitializeAssistant;
