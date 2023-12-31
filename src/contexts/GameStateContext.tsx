import React, { createContext, useReducer, useContext } from "react";

export interface IClass {
  name: string;
  description: string;
}

export interface IPlayer {
  name: string;
  class: IClass;
  stats: {
    [key: string]: number;
  };
  level: number;
  experience: number;
  inventory: string[];
}

export interface ICompanion {
  name: string;
  class: string;
  stats: {
    [key: string]: number;
  };
  level: number;
  experience: number;
  inventory: string[];
}

export interface ICampaign {
  name: string;
  setting: string;
  description: string;
  additionalInfo: string;
}

// Define the state structure
export type IState = {
  player: IPlayer;
  party: ICompanion[];
  campaign: ICampaign;
  isLoading: boolean;
  error: string | null;
};

const initialState: IState = {
  player: {
    name: "",
    class: {
      name: "",
      description: "",
    },
    stats: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    level: 1,
    experience: 0,
    inventory: [],
  },
  party: [],
  campaign: {
    name: "",
    setting: "",
    description: "",
    additionalInfo: "",
  },
  isLoading: false,
  error: null,
};

// Define action types
type Action =
  | { type: "UPDATE_PLAYER"; payload: IPlayer }
  | { type: "UPDATE_PARTY"; payload: ICompanion[] }
  | { type: "UPDATE_CAMPAIGN"; payload: ICampaign }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

// Create the context
const GameStateContext = createContext<{
  state: IState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Reducer function
const reducer = (state: IState, action: Action): IState => {
  switch (action.type) {
    case "UPDATE_PLAYER":
      return { ...state, player: action.payload };
    case "UPDATE_PARTY":
      return { ...state, party: action.payload };
    case "UPDATE_CAMPAIGN":
      return { ...state, campaign: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Context Provider component
type GameStateProviderProps = {
  children: React.ReactNode;
};

export const GameStateProvider = ({ children }: GameStateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
};

// Custom hook to use the assistant context
export const useGameState = () => useContext(GameStateContext);

export default GameStateProvider;
