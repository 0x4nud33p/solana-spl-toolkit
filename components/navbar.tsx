"use client";

import { useState } from "react";
import { WalletConnectButton } from "@/components/soldevkit-ui/wallet/wallet-connect-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Globe, Wallet } from "lucide-react";

const networks = [
  { id: "devnet", label: "Devnet", color: "bg-yellow-500" },
  { id: "testnet", label: "Testnet", color: "bg-blue-500" },
  { id: "mainnet", label: "Mainnet-Beta", color: "bg-green-500" },
];

export default function Navbar() {
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);

  return (
    <nav className="w-full bg-black px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-bold text-white">Solana SPL Toolkit</h1>
      </div>

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 bg-transparent text-white border border-gray-900"
            >
              <Globe className="h-4 w-4" />
              <Badge className={`${selectedNetwork.color} text-white`}>
                {selectedNetwork.label}
              </Badge>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-black rounded-md shadow-md"
          >
            {networks.map((network) => (
              <DropdownMenuItem
                key={network.id}
                onClick={() => setSelectedNetwork(network)}
                className="cursor-pointer flex items-center gap-2 px-2 py-1 text-white hover:bg-gray-900"
              >
                <Badge className={`${network.color} text-white`}>
                  {network.label}
                </Badge>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <WalletConnectButton
          variant="default"
          size="lg"
          icon={<Wallet className="h-4 w-4" />}
        />
      </div>
    </nav>
  );
}
