"use client";

import { WalletConnectButton } from "@/components/soldevkit-ui/wallet/wallet-connect-button";
import { Wallet } from "lucide-react";

export default function Home() {
  return (
    // aling the two end corners
    <div className="min-h-screen bg-black flex p-4 justify-between">
      <div>
        <h1 className="text-white">Solana SPL Toolkit</h1>
      </div>
      <div>
        <WalletConnectButton
          variant="default"
          size="lg"
          icon={<Wallet className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}
