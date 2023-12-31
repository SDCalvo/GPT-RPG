export type FunctionHandler = (args: any) => Promise<any>;

// Function handler for fetching MTG cards
async function someFunc(args: any) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: "some data" });
    }, 1000);
  });
}

const FunctionHandlers: Record<string, FunctionHandler> = {
  someFunc,
};

export default FunctionHandlers;
