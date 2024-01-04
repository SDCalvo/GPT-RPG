import React from "react";
import Image from "next/image";
import baseStyles from "@/styles/home.module.css";
import Link from "next/link";

const Index = () => {
  return (
    <div className={baseStyles["main-container"]}>
      <div className={baseStyles["content-container"]}>
        <h1 className={baseStyles["title"]}>GPT RPG</h1>
        <p className={baseStyles["subtitle"]}>
          Welcome to the first ever GPT powered RPG! Create your character and
          start your adventure!
        </p>
        <div className={baseStyles["image-container"]}>
          <Link href="/adventureSetup">
            <Image
              src="/mtgCardBack.png"
              alt="MTG Card Back"
              width={400} // Adjusted size
              height={560} // Adjusted size to maintain aspect ratio
              className={baseStyles["image"]}
              layout="intrinsic"
            />
          </Link>
        </div>
        <p className={baseStyles["description"]}>
          This is a game that uses the latest Assistant API from OpenAI to
          provide an AI Game Master that will guide you through your adventure.
        </p>
      </div>
    </div>
  );
};

export default Index;
