import { Action, reducer } from "@/helpers/gameStateReducer";
import React, { createContext, useReducer, useContext } from "react";

export interface IClass {
  name: string;
  description: string;
}

export interface IAbility {
  name: string;
  description: string;
}

export interface IItem {
  name: string;
  description: string;
}

export interface IPlayer {
  name: string;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  class: IClass;
  gold: number;
  stats: {
    [key: string]: number;
  };
  level: number;
  experience: number;
  inventory: IItem[];
}

export interface ICompanion {
  name: string;
  class: string;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  stats: {
    [key: string]: number;
  };
  level: number;
  experience: number;
  inventory: IItem[];
}

export interface ICampaign {
  name: string;
  setting: string;
  description: string;
  additionalInfo: string;
}

export interface IEnemy {
  name: string;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  stats: {
    [key: string]: number;
  };
  abilities: IAbility[];
}
// Define the state structure
export type IState = {
  player: IPlayer;
  party: ICompanion[];
  currentEnemies: IEnemy[];
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
    health: 10,
    maxHealth: 10,
    mana: 0,
    maxMana: 0,
    gold: 100,
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
  currentEnemies: [],
  campaign: {
    name: "",
    setting: "",
    description: "",
    additionalInfo: "",
  },
  isLoading: false,
  error: null,
};

/*
EXAMPLE GM RESPONSE
{
  "responseType": "narration",
  "message": "The ancient door creaks open to reveal a treasure-laden room. You gain experience for your clever lock-picking.",
  "data": {
    "playerUpdate": {
      "type": "UPDATE_PLAYER",
      "payload": {
        "name": "Calix",
        "class": {
          "name": "Rogue",
          "description": "A stealthy character with dexterous abilities."
        },
        "stats": {
          "strength": 10,
          "dexterity": 15,
          "constitution": 12,
          "intelligence": 14,
          "wisdom": 13,
          "charisma": 11
        },
        "level": 2,
        "experience": 250,
        "inventory": ["Thieves' tools", "Dagger", "Gold coins"]
      }
    },
    "partyUpdate": null,
    "enemiesUpdate": null,
    "campaignUpdate": null,
    "isLoading": false,
    "error": null
  }
}
*/

// Create the context
const GameStateContext = createContext<{
  state: IState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

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
