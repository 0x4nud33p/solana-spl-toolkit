"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Globe, ChevronDown, Copy } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const networks = [
  { id: "devnet", label: "Devnet", color: "bg-accent" },
  { id: "testnet", label: "Testnet", color: "bg-secondary" },
  { id: "mainnet", label: "Mainnet-Beta", color: "bg-primary" },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0])
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress] = useState("7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU")

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-foreground">Solana SPL Toolkit</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Network Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Globe className="h-4 w-4" />
                <Badge className={`${selectedNetwork.color} text-white`}>{selectedNetwork.label}</Badge>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {networks.map((network) => (
                <DropdownMenuItem key={network.id} onClick={() => setSelectedNetwork(network)}>
                  <Badge className={`${network.color} text-white mr-2`}>{network.label}</Badge>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Wallet Connection */}
          {isWalletConnected ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="text-sm font-mono">
                  {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => navigator.clipboard.writeText(walletAddress)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsWalletConnected(false)}>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsWalletConnected(true)} className="gap-2">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto p-6">{children}</main>
    </div>
  )
}
