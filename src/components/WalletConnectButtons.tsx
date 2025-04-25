"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const WalletConnectButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        size="lg"
        className="bg-white text-black hover:bg-gray-200"
        onClick={() => alert("Braavos wallet connection mocked!")}
      >
        <Image
          src="/bravos.webp"
          alt="Braavos Logo"
          width={18}
          height={18}
          className="mr-2 rounded-full"
        />
        Connect with Braavos
      </Button>
      <Button
        size="lg"
        className="bg-white text-black hover:bg-gray-200"
        onClick={() => alert("Argent wallet connection mocked!")}
      >
        <Image
          src="/argent.png"
          alt="Argent Logo"
          width={18}
          height={18}
          className="mr-2 rounded-full"
        />
        Connect with Argent
      </Button>
    </div>
  );
};

export default WalletConnectButtons;