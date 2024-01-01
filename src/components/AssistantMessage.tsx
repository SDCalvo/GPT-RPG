interface AssistantMessageProps {
  message: string | undefined;
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({ message }) => {
  if (!message) {
    return null;
  }
  return <div dangerouslySetInnerHTML={{ __html: message }}></div>;
};

export default AssistantMessage;
