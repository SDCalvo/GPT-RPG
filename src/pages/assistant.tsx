import { useEffect } from "react";
import { useAssistant } from "@/contexts/AssistantContext";
import { useGameState } from "@/contexts/GameStateContext";
import {
  addMessageToThread,
  createThread,
  getAssistant,
  getConfig,
  cancelRun,
} from "@/requests/assistantsRequests";
import Chat from "@/components/Chat";
import Ui from "@/components/Ui";
import baseStyles from "@/styles/assistant.module.css";
import useParseAssistantResponse from "@/hooks/useParseAssistantResponse";

const Assistant = () => {
  const { state, dispatch } = useAssistant();
  const { state: gameState } = useGameState();
  const { parseAssistantResponse } = useParseAssistantResponse();

  useEffect(() => {
    fetchConfigAndSetAssistant();
  }, []);

  useEffect(() => {
    if (state.assistantId && !state.threadId) {
      createNewThread();
    }
  }, [state.assistantId, state.threadId]);

  const fetchConfigAndSetAssistant = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const config = await getConfig();
      if (config.ASSISTANT_ID) {
        const assistantDetails = await getAssistant(config.ASSISTANT_ID);
        dispatch({ type: "SET_ASSISTANT", payload: assistantDetails });
        dispatch({ type: "SET_ASSISTANT_ID", payload: config.ASSISTANT_ID });
      } else {
        dispatch({
          type: "SET_ERROR",
          payload: "Assistant ID not found in config",
        });
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to fetch assistant details",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const createNewThread = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const threadDetails = await createThread({
        messages: state.messages,
        fileIds: [],
      });
      dispatch({ type: "SET_THREAD", payload: threadDetails });
      dispatch({ type: "SET_THREAD_ID", payload: threadDetails.id });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to create thread" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    if (!state.assistantInitialized && state.threadId && state.assistantId) {
      console.log("Initializing assistant");
      initializeAssistant();
    }
  }, [state.assistantInitialized, state.threadId, state.assistantId]);

  const constructInitialPrompt = () => {
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

  const initializeAssistant = async () => {
    if (state.threadId && state.assistantId && !state.assistantInitialized) {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const initialPrompt = constructInitialPrompt();
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
  };

  useEffect(() => {
    return () => {
      if (!state.threadId || !state.runId) return;
      const args = {
        threadId: state.threadId,
        runId: state.runId,
      };
      cancelRun(args);
    };
  }, [state.threadId, state.runId]);

  if (state.isLoading || !state.assistantInitialized) {
    return (
      <div className={baseStyles["main-container"]}>
        <div className={baseStyles["bigSpinner"]}></div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className={baseStyles["main-container"]}>
        <p>Error: {state.error}</p>
      </div>
    );
  }

  return (
    <div className={baseStyles["main-container"]}>
      <Chat />
      <Ui />
    </div>
  );
};

export default Assistant;
