import React, { useState } from "react";
import { useAssistant } from "@/contexts/AssistantContext";
import {
  ICancelRun,
  addMessageToThread,
  cancelRun,
} from "@/requests/assistantsRequests";
import styles from "../styles/chat.module.css";
import AssistantMessage from "./AssistantMessage";
import useInitializeAssistant from "@/hooks/useInitializeAssistant";
import { IGMResponse, useGameState } from "@/contexts/GameStateContext";
import { parseResponseToJSON } from "@/helpers/parseResponseToJSON";

const Chat = () => {
  const { state, dispatch } = useAssistant();
  const { state: gameState, dispatch: gameDispatch } = useGameState();
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Add a new state to track the index of the last user message
  const [lastUserMessageIndex, setLastUserMessageIndex] = useState(-1);

  const { initializeAssistant } = useInitializeAssistant();

  const sendMessage = async () => {
    if (state.threadId && newMessage.trim()) {
      dispatch({ type: "SET_LOADING_MESSAGE", payload: true });
      try {
        // We need to send the entire game state with each message
        const messageWithState = `
          ${newMessage}

          Game state so far:
          ${JSON.stringify(gameState)}
        `;
        // Send the new message to the thread
        const finalResult = await addMessageToThread({
          threadID: state.threadId,
          content: messageWithState,
        });
        // Parse the assistant response
        parseAssistantResponse(finalResult.messages[0].content[0].text.value);
        // Dispatch an action to update messages with the latest including the assistant's response
        dispatch({ type: "ADD_MESSAGES", payload: finalResult.messages });
        // Set the index of the last user message
        setLastUserMessageIndex(finalResult.messages.length - 1);
        // Clear the input field
        setNewMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
      dispatch({ type: "SET_LOADING_MESSAGE", payload: false });
    }
  };

  // Note: Depending on your backend, you might need to adjust the index calculation
  const isNewMessage = (index: number) => index === lastUserMessageIndex;

  //Add event listener to send message when pressing enter
  const handleKeyDown = (event: any) => {
    if (isLoading || !newMessage.trim() || state.loadingMessage) return;
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const parseAssistantResponse = (message: any) => {
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
            gameDispatch(data.playerUpdate);
          }
          if (data.partyUpdate) {
            console.log("update party");
            gameDispatch(data.partyUpdate);
          }
          if (data.enemiesUpdate) {
            console.log("update enemies");
            gameDispatch(data.enemiesUpdate);
          }
          if (data.campaignUpdate) {
            console.log("update campaign");
            gameDispatch(data.campaignUpdate);
          }
          break;
        case "error":
          // Handle errors specifically
          console.error("Assistant Error:", responseMessage);
          gameDispatch({ type: "SET_ERROR", payload: responseMessage });
          break;
        default:
          console.warn("Unhandled responseType:", responseType);
      }
      if (data.error) {
        gameDispatch({ type: "SET_ERROR", payload: data.error });
      }
    } catch (error) {
      console.error("Failed to parse assistant response:", error);
      gameDispatch({
        type: "SET_ERROR",
        payload: "Failed to parse assistant response",
      });
    }
  };

  const tryToCancelRun = async () => {
    try {
      if (!state.threadId || !state.runId) return;
      const arg: ICancelRun = {
        threadId: state.threadId,
        runId: state.runId,
      };

      await cancelRun(arg);
    } catch (error) {
      console.error("Failed to cancel run:", error);
    }
  };

  // Cancel run if unmount component
  React.useEffect(() => {
    return () => {
      tryToCancelRun();
    };
  }, []);

  React.useEffect(() => {
    if (!state.assistantInitialized && state.threadId && state.assistantId) {
      initializeAssistant();
    }
  }, [
    state.assistantInitialized,
    initializeAssistant,
    state.threadId,
    state.assistantId,
  ]);

  React.useEffect(() => {
    console.log("gameState", gameState);
  }, [gameState]);

  React.useEffect(() => {
    console.log("state", state);
  }, [state]);

  return (
    <div className={styles.outerContainer}>
      <div className={styles.chatContainer}>
        <div className={styles.messagesContainer}>
          {state.loadingMessage && <div className={styles.spinner}></div>}
          {state?.messages?.slice(0, -1).map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                isNewMessage(index)
                  ? message.role === "user"
                    ? styles.newestUserMessage
                    : styles.newestAssistantMessage
                  : ""
              }`}
            >
              <div
                className={
                  message.role === "user"
                    ? styles.userMessage
                    : styles.assistantMessage
                }
              >
                {message?.content?.map((content, contentIndex) => {
                  return (
                    <AssistantMessage
                      key={contentIndex}
                      message={content?.text?.value}
                      role={message.role}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.newMessageContainer}>
          <input
            type="text"
            value={newMessage}
            onKeyDown={handleKeyDown}
            onChange={(e) => setNewMessage(e.target.value)}
            className={styles.newMessageInput}
            placeholder="Type your message here..."
            disabled={isLoading || state.loadingMessage}
          />
          <button
            onClick={sendMessage}
            className={styles.sendMessageButton}
            disabled={isLoading || !newMessage.trim() || state.loadingMessage}
          >
            Send
          </button>
          <button onClick={tryToCancelRun} className={styles.sendMessageButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
