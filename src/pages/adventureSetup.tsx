import React, { useEffect, useState } from "react";
import { ICampaign, useGameState } from "@/contexts/GameStateContext";
import styles from "../styles/AdventureSetup.module.css";
import { useRouter } from "next/router";

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

    setErrorMessage(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch({
      type: "UPDATE_PLAYER",
      payload: { ...state.player, name: playerName, class: playerClass },
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

        <button type="submit">Start Adventure</button>
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
