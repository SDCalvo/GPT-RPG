import CardImageTooltip from "./CardImageTooltip";
import { IShowCard } from "./Chat";

export interface IMessagePart {
  type: "text" | "strong" | "linebreak";
  content: string;
}
interface AssistantMessageProps {
  parts: IMessagePart[];
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({ parts }) => {
  // Logic to render message parts based on their type
  const renderMessagePart = (part: IMessagePart, index: number) => {
    switch (part.type) {
      case "text":
        return <span key={index}>{part.content}</span>;
      case "strong":
        return <strong key={index}>{part.content}</strong>;
      case "linebreak":
        // Render a line break
        return <br key={index} />;
      default:
        return null;
    }
  };

  // Render the message by mapping over the parts
  return <>{parts.map(renderMessagePart)}</>;
};

export default AssistantMessage;
