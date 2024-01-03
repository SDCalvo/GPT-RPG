import React, { useEffect, useState } from "react";
import { ICampaign, IPlayer, useGameState } from "@/contexts/GameStateContext";
import styles from "../styles/AdventureSetup.module.css";
import { useRouter } from "next/router";

interface StatAllocation {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

const AdventureSetup = () => {
  const router = useRouter();
  const { state, dispatch } = useGameState();
  const [playerName, setPlayerName] = useState("");
  const [playerClass, setPlayerClass] = useState({ name: "", description: "" });
  const [campaign, setCampaign] = useState<ICampaign>({
    name: "",
    setting: "",
    description: "",
    additionalInfo: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statAllocation, setStatAllocation] = useState<StatAllocation>({
    strength: 8,
    dexterity: 8,
    constitution: 8,
    intelligence: 8,
    wisdom: 8,
    charisma: 8,
  });
  const [remainingPoints, setRemainingPoints] = useState(27);

  // Validation function to check if all required fields are filled
  const validateForm = (): boolean => {
    if (!playerName.trim()) {
      setErrorMessage("Please enter the player's name.");
      return false;
    }
    if (!playerClass.name.trim()) {
      setErrorMessage("Please enter the player's class name.");
      return false;
    }
    if (!playerClass.description.trim()) {
      setErrorMessage("Please enter the player's class description.");
      return false;
    }
    if (!campaign.name.trim()) {
      setErrorMessage("Please enter the campaign name.");
      return false;
    }
    if (!campaign.setting.trim()) {
      setErrorMessage("Please enter the campaign setting.");
      return false;
    }
    if (!campaign.description.trim()) {
      setErrorMessage("Please enter the campaign description.");
      return false;
    }
    if (!campaign.additionalInfo.trim()) {
      setErrorMessage("Please enter the campaign additional info.");
      return false;
    }

    const totalPointsUsed = Object.values(statAllocation).reduce(
      (total, stat) => total + stat,
      0
    );
    if (remainingPoints !== 0 || totalPointsUsed > 83) {
      setErrorMessage("Please allocate all stat points appropriately.");
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const handleStatChange = (stat: keyof StatAllocation, delta: number) => {
    // Calculate the new value and cost
    const newValue = statAllocation[stat] + delta;
    let cost = delta;

    if (newValue > 13) {
      // Cost is doubled for 14 and 15
      cost *= 2;
    }

    // Check if the operation is valid
    if (newValue >= 8 && newValue <= 15 && remainingPoints - cost >= 0) {
      setStatAllocation({ ...statAllocation, [stat]: newValue });
      setRemainingPoints(remainingPoints - cost);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updatedPlayer: IPlayer = {
      ...state.player,
      name: playerName,
      class: playerClass,
      stats: {
        strength: statAllocation.strength,
        dexterity: statAllocation.dexterity,
        constitution: statAllocation.constitution,
        intelligence: statAllocation.intelligence,
        wisdom: statAllocation.wisdom,
        charisma: statAllocation.charisma,
      },
    };

    dispatch({
      type: "UPDATE_PLAYER",
      payload: updatedPlayer,
    });
    dispatch({ type: "UPDATE_CAMPAIGN", payload: campaign });
    router.push("/assistant");
  };

  const clearErrorMessage = () => {
    if (errorMessage) setErrorMessage(null);
  };

  return (
    <div className={styles.adventureSetupContainer}>
      <form onSubmit={handleSubmit} className={styles.adventureSetupForm}>
        <h2>Adventure Setup</h2>

        <div>
          <label htmlFor="playerName">Player Name:</label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              clearErrorMessage();
            }}
          />
        </div>

        <div className={styles.statPointsTitle}>
          <h3>Allocate Stats</h3>
          <p>Remaining Points: {remainingPoints}</p>
        </div>
        {Object.keys(statAllocation).map((stat) => (
          <div key={stat} className={styles.statRow}>
            <label className={styles.statLabel}>
              {stat.charAt(0).toUpperCase() + stat.slice(1)}:
            </label>
            <div className={styles.statControl}>
              <button
                type="button"
                className={styles.statButton}
                onClick={() =>
                  handleStatChange(stat as keyof StatAllocation, -1)
                }
              >
                -
              </button>
              <span className={styles.statValue}>
                {statAllocation[stat as keyof StatAllocation]}
              </span>
              <button
                type="button"
                className={styles.statButton}
                onClick={() =>
                  handleStatChange(stat as keyof StatAllocation, 1)
                }
              >
                +
              </button>
            </div>
          </div>
        ))}

        <div>
          <label htmlFor="playerClassName">Class Name:</label>
          <input
            type="text"
            id="playerClassName"
            value={playerClass.name}
            onChange={(e) => {
              setPlayerClass({ ...playerClass, name: e.target.value });
              clearErrorMessage();
            }}
          />
        </div>

        <div>
          <label htmlFor="playerClassDescription">Class Description:</label>
          <textarea
            id="playerClassDescription"
            value={playerClass.description}
            onChange={(e) => {
              setPlayerClass({ ...playerClass, description: e.target.value });
              clearErrorMessage();
            }}
          />
        </div>

        <div>
          <label htmlFor="campaignName">Campaign Name:</label>
          <input
            type="text"
            id="campaignName"
            value={campaign.name}
            onChange={(e) => {
              setCampaign({ ...campaign, name: e.target.value });
              clearErrorMessage();
            }}
          />
        </div>

        <div>
          <label htmlFor="campaignSetting">Setting:</label>
          <input
            type="text"
            id="campaignSetting"
            value={campaign.setting}
            onChange={(e) => {
              setCampaign({ ...campaign, setting: e.target.value });
              clearErrorMessage();
            }}
          />
        </div>

        <div>
          <label htmlFor="campaignDescription">Description:</label>
          <textarea
            id="campaignDescription"
            value={campaign.description}
            onChange={(e) => {
              setCampaign({ ...campaign, description: e.target.value });
              clearErrorMessage();
            }}
          />
        </div>

        <div>
          <label htmlFor="campaignAdditionalInfo">Additional Info:</label>
          <textarea
            id="campaignAdditionalInfo"
            value={campaign.additionalInfo}
            onChange={(e) => {
              setCampaign({ ...campaign, additionalInfo: e.target.value });
              clearErrorMessage();
            }}
          />
        </div>

        <button className={styles.startButton} type="submit">
          Start Adventure
        </button>
      </form>

      <div
        className={styles.errorMessage}
        style={{ opacity: errorMessage ? 1 : 0 }}
      >
        {errorMessage}
      </div>
    </div>
  );
};

export default AdventureSetup;
