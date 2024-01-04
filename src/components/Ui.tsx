import { IItem, useGameState } from "@/contexts/GameStateContext";
import React from "react";
import styles from "@/styles/ui.module.css";

const Ui = () => {
  const { state } = useGameState();

  const renderInventory = (inventory: IItem[]) => (
    <ul className={styles.inventoryList}>
      <p className={styles.text}>Inventory</p>
      {inventory?.length > 0 &&
        inventory.map((item, index) => (
          <li key={index}>
            <strong>{item?.name}:</strong> {item?.description}
          </li>
        ))}
    </ul>
  );

  const getHealthColor = (currentHealth: number, maxHealth: number) => {
    const ratio = currentHealth / maxHealth;
    if (ratio > 0.5) return "green";
    if (ratio > 0.1) return "yellow";
    return "red";
  };

  const renderHealth = (currentHealth: number, maxHealth: number) => {
    const healthColor = getHealthColor(currentHealth, maxHealth);
    return (
      <p className={styles.text}>
        <strong>Health:</strong>
        <span style={{ color: healthColor }}>
          {" "}
          {currentHealth}/{maxHealth}
        </span>
      </p>
    );
  };

  return (
    <div className={styles.uiContainer}>
      <section className={styles.section}>
        <h2 className={styles.heading}>Player information</h2>
        <p className={styles.text}>
          <strong>Name:</strong> {state.player.name}
        </p>
        <p className={styles.text}>
          <strong>Class:</strong> {state.player.class.name} -{" "}
          {state.player.class.description}
        </p>
        <p className={styles.text}>
          <strong>Level:</strong> {state.player.level}
        </p>
        <p className={styles.text}>
          <strong>Experience:</strong> {state.player.experience}
        </p>
        <p className={styles.text}>
          {renderHealth(state.player.health, state.player.maxHealth)}
        </p>
        <p className={styles.text}>
          <strong>Mana:</strong> {state.player.mana}/{state.player.maxMana}
        </p>
        <p className={styles.text}>
          <strong>Gold:</strong> {state.player.gold}
        </p>
        {renderInventory(state.player.inventory)}
        <div>
          <h3 className={styles.subheading}>Stats</h3>
          <ul className={styles.statsList}>
            {Object.entries(state.player.stats).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Party Members</h2>
        {state.party.length > 0 ? (
          <ul className={styles.partyList}>
            {state.party.map((member, index) => (
              <li key={index}>
                <h3>{member.name}</h3>
                <p className={styles.text}>
                  <strong>Class:</strong> {member.class}
                </p>
                <p className={styles.text}>
                  <strong>Health:</strong> {member.health}/{member.maxHealth}
                </p>
                <p className={styles.text}>
                  <strong>Mana:</strong> {member.mana}/{member.maxMana}
                </p>

                {renderInventory(member.inventory)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No party members yet</p>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Current Enemies</h2>
        {state.currentEnemies.length > 0 ? (
          <ul className={styles.enemiesList}>
            {state.currentEnemies.map((enemy, index) => (
              <li key={index}>
                <h3>{enemy.name}</h3>
                <p className={styles.text}>
                  <strong>Health:</strong> {enemy.health}/{enemy.maxHealth}
                </p>
                <p className={styles.text}>
                  <strong>Mana:</strong> {enemy.mana}/{enemy.maxMana}
                </p>
                <ul className={styles.statsList}>
                  {Object.entries(enemy.stats).map(([stat, value]) => (
                    <li key={stat}>
                      <strong>{stat}:</strong> {value}
                    </li>
                  ))}
                </ul>
                <div>
                  <h4 className={styles.subheading}>Abilities</h4>
                  <ul className={styles.abilitiesList}>
                    {enemy.abilities.map((ability, abilityIndex) => (
                      <li key={abilityIndex}>
                        <strong>{ability.name}:</strong> {ability.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No current enemies</p>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Campaign Details</h2>
        <p className={styles.text}>
          <strong>Name:</strong> {state.campaign.name}
        </p>
        <p className={styles.text}>
          <strong>Setting:</strong> {state.campaign.setting}
        </p>
        <p className={styles.text}>
          <strong>Description:</strong> {state.campaign.description}
        </p>
        <p className={styles.text}>
          <strong>Additional Info:</strong> {state.campaign.additionalInfo}
        </p>
      </section>

      {state.isLoading && <div className={styles.loading}>Loading...</div>}
      {state.error && <div className={styles.error}>Error: {state.error}</div>}
    </div>
  );
};

export default Ui;
