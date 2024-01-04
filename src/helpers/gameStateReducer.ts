import {
  ICampaign,
  IClass,
  ICompanion,
  IEnemy,
  IItem,
  IPlayer,
  IState,
} from "@/contexts/GameStateContext";

export interface IGMResponse {
  message: string;
  data: {
    playerUpdate: null | { type: "UPDATE_PLAYER"; payload: IPlayer };
    partyUpdate: null | { type: "UPDATE_PARTY"; payload: ICompanion[] };
    enemiesUpdate: null | { type: "UPDATE_CURRENT_ENEMIES"; payload: IEnemy[] };
    campaignUpdate: null | { type: "UPDATE_CAMPAIGN"; payload: ICampaign };
    playerSetName: null | { type: "SET_PLAYER_NAME"; payload: string };
    playerSetGold: null | { type: "SET_PLAYER_GOLD"; payload: number };
    playerSetHealth: null | { type: "SET_PLAYER_HEALTH"; payload: number };
    playerSetMaxHealth: null | {
      type: "SET_PLAYER_MAX_HEALTH";
      payload: number;
    };
    playerSetMana: null | { type: "SET_PLAYER_MANA"; payload: number };
    playerSetMaxMana: null | { type: "SET_PLAYER_MAX_MANA"; payload: number };
    playerSetClass: null | { type: "SET_PLAYER_CLASS"; payload: IClass };
    playerSetStats: null | {
      type: "SET_PLAYER_STATS";
      payload: { [key: string]: number };
    };
    playerSetLevel: null | { type: "SET_PLAYER_LEVEL"; payload: number };
    playerSetExperience: null | {
      type: "SET_PLAYER_EXPERIENCE";
      payload: number;
    };
    playerAddItemToInventory: null | {
      type: "ADD_ITEM_TO_PLAYER_INVENTORY";
      payload: IItem;
    };
    playerRemoveItemFromInventory: null | {
      type: "REMOVE_ITEM_FROM_PLAYER_INVENTORY";
      payload: string;
    };
    partyAddCompanion: null | { type: "ADD_COMPANION"; payload: ICompanion };
    partyRemoveCompanion: null | {
      type: "REMOVE_COMPANION";
      payload: string;
    };
    partyUpdateCompanion: null | {
      type: "UPDATE_COMPANION";
      payload: { index: number; companion: ICompanion };
    };
    campaignSetName: null | { type: "SET_CAMPAIGN_NAME"; payload: string };
    campaignSetSetting: null | {
      type: "SET_CAMPAIGN_SETTING";
      payload: string;
    };
    campaignSetDescription: null | {
      type: "SET_CAMPAIGN_DESCRIPTION";
      payload: string;
    };
    campaignSetAdditionalInfo: null | {
      type: "SET_CAMPAIGN_ADDITIONAL_INFO";
      payload: string;
    };
    enemiesAddEnemy: null | { type: "ADD_ENEMY"; payload: IEnemy };
    enemiesRemoveEnemy: null | { type: "REMOVE_ENEMY"; payload: string };
    enemiesUpdateEnemy: null | {
      type: "UPDATE_ENEMY";
      payload: { index: number; enemy: IEnemy };
    };
    isLoading: false;
    error: null | string;
  };
}

// Define action types
export type Action =
  | { type: "UPDATE_PLAYER"; payload: IPlayer }
  | { type: "UPDATE_PARTY"; payload: ICompanion[] }
  | { type: "UPDATE_CURRENT_ENEMIES"; payload: IEnemy[] }
  | { type: "UPDATE_CAMPAIGN"; payload: ICampaign }
  | { type: "SET_PLAYER_NAME"; payload: string }
  | { type: "SET_PLAYER_GOLD"; payload: number }
  | { type: "SET_PLAYER_HEALTH"; payload: number }
  | { type: "SET_PLAYER_MAX_HEALTH"; payload: number }
  | { type: "SET_PLAYER_MANA"; payload: number }
  | { type: "SET_PLAYER_MAX_MANA"; payload: number }
  | { type: "SET_PLAYER_CLASS"; payload: IClass }
  | { type: "SET_PLAYER_STATS"; payload: { [key: string]: number } }
  | { type: "SET_PLAYER_LEVEL"; payload: number }
  | { type: "SET_PLAYER_EXPERIENCE"; payload: number }
  | { type: "ADD_ITEM_TO_PLAYER_INVENTORY"; payload: IItem }
  | { type: "REMOVE_ITEM_FROM_PLAYER_INVENTORY"; payload: string }
  | { type: "ADD_COMPANION"; payload: ICompanion }
  | { type: "REMOVE_COMPANION"; payload: string }
  | {
      type: "UPDATE_COMPANION";
      payload: { index: number; companion: ICompanion };
    }
  | { type: "SET_CAMPAIGN_NAME"; payload: string }
  | { type: "SET_CAMPAIGN_SETTING"; payload: string }
  | { type: "SET_CAMPAIGN_DESCRIPTION"; payload: string }
  | { type: "SET_CAMPAIGN_ADDITIONAL_INFO"; payload: string }
  | { type: "ADD_ENEMY"; payload: IEnemy }
  | { type: "REMOVE_ENEMY"; payload: string }
  | { type: "UPDATE_ENEMY"; payload: { index: number; enemy: IEnemy } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };
// ... other specific updates

// Reducer function
export const reducer = (state: IState, action: Action): IState => {
  switch (action.type) {
    case "UPDATE_PLAYER": {
      return {
        ...state,
        player: action.payload,
      };
    }
    case "UPDATE_PARTY": {
      return {
        ...state,
        party: action.payload,
      };
    }
    case "UPDATE_CURRENT_ENEMIES": {
      return {
        ...state,
        currentEnemies: action.payload,
      };
    }
    case "UPDATE_CAMPAIGN": {
      return {
        ...state,
        campaign: action.payload,
      };
    }
    case "SET_PLAYER_NAME": {
      return {
        ...state,
        player: { ...state.player, name: action.payload },
      };
    }
    case "SET_PLAYER_GOLD": {
      return {
        ...state,
        player: { ...state.player, gold: action.payload },
      };
    }
    case "SET_PLAYER_HEALTH": {
      return {
        ...state,
        player: { ...state.player, health: action.payload },
      };
    }
    case "SET_PLAYER_MAX_HEALTH": {
      return {
        ...state,
        player: { ...state.player, maxHealth: action.payload },
      };
    }
    case "SET_PLAYER_MANA": {
      return {
        ...state,
        player: { ...state.player, mana: action.payload },
      };
    }
    case "SET_PLAYER_MAX_MANA": {
      return {
        ...state,
        player: { ...state.player, maxMana: action.payload },
      };
    }
    case "SET_PLAYER_CLASS": {
      return {
        ...state,
        player: { ...state.player, class: action.payload },
      };
    }
    case "SET_PLAYER_STATS": {
      return {
        ...state,
        player: { ...state.player, stats: action.payload },
      };
    }
    case "SET_PLAYER_LEVEL": {
      return {
        ...state,
        player: { ...state.player, level: action.payload },
      };
    }
    case "SET_PLAYER_EXPERIENCE": {
      return {
        ...state,
        player: { ...state.player, experience: action.payload },
      };
    }
    case "ADD_ITEM_TO_PLAYER_INVENTORY": {
      return {
        ...state,
        player: {
          ...state.player,
          inventory: [...state.player.inventory, action.payload],
        },
      };
    }
    case "REMOVE_ITEM_FROM_PLAYER_INVENTORY": {
      return {
        ...state,
        player: {
          ...state.player,
          inventory: state.player.inventory.filter(
            (item: IItem) => item.name !== action.payload
          ),
        },
      };
    }
    case "ADD_COMPANION": {
      // Add the new companion to the party
      const updatedParty = [...state.party, action.payload];

      // Remove duplicates, preserving the last occurrence (the newly added companion)
      const uniqueParty = updatedParty
        .reduceRight((acc: ICompanion[], companion: ICompanion) => {
          if (!acc.some((comp) => comp.name === companion.name)) {
            acc.push(companion);
          }
          return acc;
        }, [])
        .reverse();

      return {
        ...state,
        party: uniqueParty,
      };
    }

    case "REMOVE_COMPANION": {
      return {
        ...state,
        party: state.party.filter(
          (companion: ICompanion) => companion.name !== action.payload
        ),
      };
    }
    case "UPDATE_COMPANION": {
      const { index, companion } = action.payload;
      const updatedParty = [...state.party];
      updatedParty[index] = companion;
      return {
        ...state,
        party: updatedParty,
      };
    }
    case "SET_CAMPAIGN_NAME": {
      return {
        ...state,
        campaign: { ...state.campaign, name: action.payload },
      };
    }
    case "SET_CAMPAIGN_SETTING": {
      return {
        ...state,
        campaign: { ...state.campaign, setting: action.payload },
      };
    }
    case "SET_CAMPAIGN_DESCRIPTION": {
      return {
        ...state,
        campaign: { ...state.campaign, description: action.payload },
      };
    }
    case "SET_CAMPAIGN_ADDITIONAL_INFO": {
      return {
        ...state,
        campaign: { ...state.campaign, additionalInfo: action.payload },
      };
    }
    case "ADD_ENEMY": {
      return {
        ...state,
        currentEnemies: [...state.currentEnemies, action.payload],
      };
    }
    case "REMOVE_ENEMY": {
      return {
        ...state,
        currentEnemies: state.currentEnemies.filter(
          (enemy) => enemy.name !== action.payload
        ),
      };
    }
    case "UPDATE_ENEMY": {
      const { index, enemy } = action.payload;
      const updatedEnemies = [...state.currentEnemies];
      updatedEnemies[index] = enemy;
      return {
        ...state,
        currentEnemies: updatedEnemies,
      };
    }
    case "SET_LOADING": {
      return {
        ...state,
        isLoading: action.payload,
      };
    }
    case "SET_ERROR": {
      return {
        ...state,
        error: action.payload,
      };
    }
    default:
      return state;
  }
};
