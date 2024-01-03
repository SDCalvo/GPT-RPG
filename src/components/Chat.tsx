import React, { useState } from "react";
import { useAssistant } from "@/contexts/AssistantContext";
import {
  ICancelRun,
  addMessageToThread,
  cancelRun,
} from "@/requests/assistantsRequests";
import styles from "../styles/chat.module.css";
import AssistantMessage from "./AssistantMessage";
import { useGameState } from "@/contexts/GameStateContext";
import useParseAssistantResponse from "@/hooks/useParseAssistantResponse";

const Chat = () => {
  const { state, dispatch } = useAssistant();
  const { state: gameState, dispatch: gameDispatch } = useGameState();
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { parseAssistantResponse } = useParseAssistantResponse();
  // Add a new state to track the index of the last user message
  const [lastUserMessageIndex, setLastUserMessageIndex] = useState(-1);

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
        console.log(
          "response sent to parse",
          finalResult.messages[0].content[0].text.value
        );
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

  // React.useEffect(() => {
  //   console.log("gameState", gameState);
  // }, [gameState]);

  // React.useEffect(() => {
  //   console.log("state", state);
  // }, [state]);

  return (
    <div className={styles.outerContainer}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>{gameState.campaign.name}</h1>
      </div>
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
