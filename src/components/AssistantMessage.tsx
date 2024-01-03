import { parseResponseToJSON } from "@/helpers/parseResponseToJSON";

interface AssistantMessageProps {
  message: string | undefined;
  role: string;
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({
  message,
  role,
}) => {
  if (!message) {
    return null;
  }
  const removeGameStateFromMessage = (message: string): string => {
    const regex = /^(.*?)Game state so far:/s;
    const match = message.match(regex);
    if (match && match[1]) {
      // Return everything before "Game state so far:"
      return match[1].trim();
    }
    return message;
  };
  if (role === "assistant") {
    const parsedMessage = parseResponseToJSON(message);

    const data = parsedMessage?.data;
    const responseMessage = parsedMessage?.message;
    if (!responseMessage) {
      console.error("Failed to parse assistant response:", parsedMessage);
      return null;
    }
    return <div dangerouslySetInnerHTML={{ __html: responseMessage }} />;
  } else {
    return <div>{removeGameStateFromMessage(message)}</div>;
  }
};

export default AssistantMessage;
