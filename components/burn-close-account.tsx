"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Flame,
  XCircle,
  Loader2,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Code,
  AlertTriangle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface BurnCloseTransaction {
  signature: string
  status: "pending" | "success" | "error"
  timestamp: Date
  type: "burn" | "close"
  amount?: string
  tokenMint?: string
  tokenAccount: string
  destinationAddress?: string
}

export function BurnCloseAccount() {
  // Burn state
  const [burnTokenMint, setBurnTokenMint] = useState("")
  const [burnTokenAccount, setBurnTokenAccount] = useState("")
  const [burnAmount, setBurnAmount] = useState("")
  const [isBurnLoading, setIsBurnLoading] = useState(false)

  // Close account state
  const [closeTokenAccount, setCloseTokenAccount] = useState("")
  const [closeDestination, setCloseDestination] = useState("")
  const [isCloseLoading, setIsCloseLoading] = useState(false)

  const [transactions, setTransactions] = useState<BurnCloseTransaction[]>([])
  const { toast } = useToast()

  const validateAddress = (address: string) => {
    // Basic Solana address validation (base58, 32-44 characters)
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
    return base58Regex.test(address)
  }

  const handleBurn = async () => {
    // Validation
    if (!burnTokenMint || !burnTokenAccount || !burnAmount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (!validateAddress(burnTokenMint) || !validateAddress(burnTokenAccount)) {
      toast({
        title: "Invalid Address",
        description: "Please enter valid Solana addresses",
        variant: "destructive",
      })
      return
    }

    if (isNaN(Number(burnAmount)) || Number(burnAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      })
      return
    }

    setIsBurnLoading(true)

    try {
      // Simulate transaction
      const mockSignature = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

      const newTransaction: BurnCloseTransaction = {
        signature: mockSignature,
        status: "pending",
        timestamp: new Date(),
        type: "burn",
        amount: burnAmount,
        tokenMint: burnTokenMint,
        tokenAccount: burnTokenAccount,
      }

      setTransactions((prev) => [newTransaction, ...prev])

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1

      setTransactions((prev) =>
        prev.map((tx) => (tx.signature === mockSignature ? { ...tx, status: isSuccess ? "success" : "error" } : tx)),
      )

      if (isSuccess) {
        toast({
          title: "Burn Successful",
          description: `Successfully burned ${burnAmount} tokens`,
        })
        // Clear form on success
        setBurnAmount("")
      } else {
        toast({
          title: "Burn Failed",
          description: "Transaction failed. Please check token balance and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsBurnLoading(false)
    }
  }

  const handleCloseAccount = async () => {
    // Validation
    if (!closeTokenAccount || !closeDestination) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (!validateAddress(closeTokenAccount) || !validateAddress(closeDestination)) {
      toast({
        title: "Invalid Address",
        description: "Please enter valid Solana addresses",
        variant: "destructive",
      })
      return
    }

    setIsCloseLoading(true)

    try {
      // Simulate transaction
      const mockSignature = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

      const newTransaction: BurnCloseTransaction = {
        signature: mockSignature,
        status: "pending",
        timestamp: new Date(),
        type: "close",
        tokenAccount: closeTokenAccount,
        destinationAddress: closeDestination,
      }

      setTransactions((prev) => [newTransaction, ...prev])

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1800))

      // Simulate success/failure (85% success rate)
      const isSuccess = Math.random() > 0.15

      setTransactions((prev) =>
        prev.map((tx) => (tx.signature === mockSignature ? { ...tx, status: isSuccess ? "success" : "error" } : tx)),
      )

      if (isSuccess) {
        toast({
          title: "Account Closed",
          description: "Successfully closed token account and reclaimed SOL",
        })
        // Clear form on success
        setCloseTokenAccount("")
        setCloseDestination("")
      } else {
        toast({
          title: "Close Failed",
          description: "Failed to close account. Ensure the account is empty.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsCloseLoading(false)
    }
  }

  const burnCodePreview = `// Burn SPL Tokens using Solana Web3.js
import { Connection, PublicKey } from '@solana/web3.js';
import { burn, getAssociatedTokenAddress } from '@solana/spl-token';

const connection = new Connection('https://api.devnet.solana.com');
const tokenMint = new PublicKey('${burnTokenMint}');
const tokenAccount = new PublicKey('${burnTokenAccount}');
const amount = ${burnAmount} * Math.pow(10, 9); // Adjust for token decimals

// Burn tokens
const signature = await burn(
  connection,
  payer, // Fee payer
  tokenAccount,
  tokenMint,
  owner, // Token account owner
  amount
);

console.log('Burn transaction signature:', signature);`

  const closeCodePreview = `// Close Token Account using Solana Web3.js
import { Connection, PublicKey } from '@solana/web3.js';
import { closeAccount } from '@solana/spl-token';

const connection = new Connection('https://api.devnet.solana.com');
const tokenAccount = new PublicKey('${closeTokenAccount}');
const destination = new PublicKey('${closeDestination}');

// Close token account (must be empty)
const signature = await closeAccount(
  connection,
  payer, // Fee payer
  tokenAccount,
  destination, // SOL destination
  owner // Token account owner
);

console.log('Close account transaction signature:', signature);`

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Burn & Close Account</h1>
        <p className="text-muted-foreground">Permanently destroy tokens or close empty token accounts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Operations */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="burn" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="burn" className="flex items-center gap-2">
                <Flame className="h-4 w-4" />
                Burn Tokens
              </TabsTrigger>
              <TabsTrigger value="close" className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Close Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="burn">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <Flame className="h-5 w-5" />
                    Burn Tokens
                  </CardTitle>
                  <CardDescription>Permanently destroy SPL tokens from a token account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="burn-mint">Token Mint Address *</Label>
                    <Input
                      id="burn-mint"
                      placeholder="Enter the token mint address"
                      value={burnTokenMint}
                      onChange={(e) => setBurnTokenMint(e.target.value)}
                      className="font-mono"
                    />
                    <p className="text-sm text-muted-foreground">The mint address of the token to burn</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="burn-account">Token Account Address *</Label>
                    <Input
                      id="burn-account"
                      placeholder="Enter the token account address"
                      value={burnTokenAccount}
                      onChange={(e) => setBurnTokenAccount(e.target.value)}
                      className="font-mono"
                    />
                    <p className="text-sm text-muted-foreground">The token account containing tokens to burn</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="burn-amount">Amount to Burn *</Label>
                    <Input
                      id="burn-amount"
                      type="number"
                      placeholder="Enter amount to burn"
                      value={burnAmount}
                      onChange={(e) => setBurnAmount(e.target.value)}
                      min="0"
                      step="any"
                    />
                    <p className="text-sm text-muted-foreground">Number of tokens to permanently destroy</p>
                  </div>

                  <Alert className="border-destructive/50 bg-destructive/10">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-destructive">
                      <strong>Warning:</strong> Burning tokens is irreversible. The tokens will be permanently destroyed
                      and cannot be recovered.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-3">
                    <Button onClick={handleBurn} disabled={isBurnLoading} variant="destructive" className="flex-1">
                      {isBurnLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Burning...
                        </>
                      ) : (
                        <>
                          <Flame className="mr-2 h-4 w-4" />
                          Burn Tokens
                        </>
                      )}
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Code className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Code Preview - Burn Tokens</DialogTitle>
                          <DialogDescription>JavaScript code for this burn operation</DialogDescription>
                        </DialogHeader>
                        <div className="relative">
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{burnCodePreview}</code>
                          </pre>
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2 bg-transparent"
                            onClick={() => navigator.clipboard.writeText(burnCodePreview)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="close">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    Close Token Account
                  </CardTitle>
                  <CardDescription>Close empty token accounts and reclaim SOL rent</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="close-account">Token Account Address *</Label>
                    <Input
                      id="close-account"
                      placeholder="Enter the token account address to close"
                      value={closeTokenAccount}
                      onChange={(e) => setCloseTokenAccount(e.target.value)}
                      className="font-mono"
                    />
                    <p className="text-sm text-muted-foreground">The token account to close (must be empty)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="close-destination">SOL Destination Address *</Label>
                    <Input
                      id="close-destination"
                      placeholder="Enter address to receive reclaimed SOL"
                      value={closeDestination}
                      onChange={(e) => setCloseDestination(e.target.value)}
                      className="font-mono"
                    />
                    <p className="text-sm text-muted-foreground">Wallet address to receive the reclaimed SOL rent</p>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Token accounts must be completely empty (0 balance) before they can be closed. You'll reclaim
                      approximately 0.00203928 SOL in rent.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-3">
                    <Button onClick={handleCloseAccount} disabled={isCloseLoading} className="flex-1">
                      {isCloseLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Closing...
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-2 h-4 w-4" />
                          Close Account
                        </>
                      )}
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Code className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Code Preview - Close Account</DialogTitle>
                          <DialogDescription>JavaScript code for this close account operation</DialogDescription>
                        </DialogHeader>
                        <div className="relative">
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{closeCodePreview}</code>
                          </pre>
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2 bg-transparent"
                            onClick={() => navigator.clipboard.writeText(closeCodePreview)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Transaction History */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Operations</CardTitle>
              <CardDescription>Your latest burn and close operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No operations yet</p>
                ) : (
                  transactions.slice(0, 5).map((tx) => (
                    <div key={tx.signature} className="space-y-3 p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              tx.status === "success" ? "default" : tx.status === "error" ? "destructive" : "secondary"
                            }
                            className={tx.status === "success" ? "bg-primary" : ""}
                          >
                            {tx.status === "pending" && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                            {tx.status === "success" && <CheckCircle className="mr-1 h-3 w-3" />}
                            {tx.status === "error" && <AlertCircle className="mr-1 h-3 w-3" />}
                            {tx.status}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {tx.type === "burn" ? (
                              <Flame className="mr-1 h-3 w-3" />
                            ) : (
                              <XCircle className="mr-1 h-3 w-3" />
                            )}
                            {tx.type}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{tx.timestamp.toLocaleTimeString()}</span>
                      </div>

                      <div className="space-y-1">
                        {tx.type === "burn" && tx.amount && (
                          <p className="font-medium text-destructive">{tx.amount} tokens burned</p>
                        )}
                        {tx.type === "close" && <p className="font-medium">Account closed</p>}
                        <p className="text-xs text-muted-foreground font-mono">
                          Account: {tx.tokenAccount.slice(0, 6)}...{tx.tokenAccount.slice(-6)}
                        </p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(tx.signature)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
