"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, Send, Flame, XCircle, TrendingUp, Activity, ExternalLink } from "lucide-react"

const quickActions = [
  {
    id: "mint",
    title: "Mint Tokens",
    description: "Create new SPL tokens",
    icon: Coins,
    color: "bg-primary",
  },
  {
    id: "transfer",
    title: "Transfer Tokens",
    description: "Send tokens to another wallet",
    icon: Send,
    color: "bg-secondary",
  },
  {
    id: "burn",
    title: "Burn Tokens",
    description: "Permanently destroy tokens",
    icon: Flame,
    color: "bg-accent",
  },
  {
    id: "close",
    title: "Close Account",
    description: "Close token accounts",
    icon: XCircle,
    color: "bg-destructive",
  },
]

const recentTransactions = [
  {
    id: "1",
    type: "Mint",
    amount: "1,000 USDC",
    signature: "5KJp7z2X9vQ8...",
    status: "Success",
    timestamp: "2 minutes ago",
  },
  {
    id: "2",
    type: "Transfer",
    amount: "500 SOL",
    signature: "3Hm9k1Y4nR2...",
    status: "Success",
    timestamp: "5 minutes ago",
  },
  {
    id: "3",
    type: "Burn",
    amount: "100 BONK",
    signature: "8Qw3r5T7uI9...",
    status: "Pending",
    timestamp: "8 minutes ago",
  },
]

export function HomeDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome to Solana SPL Toolkit</h1>
        <p className="text-muted-foreground">
          Manage your SPL tokens with ease. Mint, transfer, burn, and more - all from one dashboard.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tokens</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+3 new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.2%</div>
            <p className="text-xs text-muted-foreground">+0.1% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common token operations you can perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Card key={action.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4 text-center space-y-3">
                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mx-auto`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest token operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge variant={tx.status === "Success" ? "default" : "secondary"}>{tx.type}</Badge>
                  <div>
                    <p className="font-medium">{tx.amount}</p>
                    <p className="text-sm text-muted-foreground font-mono">{tx.signature}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={tx.status === "Success" ? "default" : "secondary"}
                    className={tx.status === "Success" ? "bg-primary" : ""}
                  >
                    {tx.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">{tx.timestamp}</p>
                </div>
                <Button size="sm" variant="ghost">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
