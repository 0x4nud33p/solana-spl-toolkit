"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Coins, Loader2, CheckCircle, AlertCircle, Copy, ExternalLink, Code } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface MintTransaction {
  signature: string
  status: "pending" | "success" | "error"
  timestamp: Date
  amount: string
  mintAddress: string
  destinationAddress: string
}

export function MintTokens() {
  const [mintAddress, setMintAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [destinationAddress, setDestinationAddress] = useState("")
  const [decimals, setDecimals] = useState("9")
  const [isLoading, setIsLoading] = useState(false)
  const [showCodePreview, setShowCodePreview] = useState(false)
  const [transactions, setTransactions] = useState<MintTransaction[]>([])
  const { toast } = useToast()

  const validateAddress = (address: string) => {
    // Basic Solana address validation (base58, 32-44 characters)
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
    return base58Regex.test(address)
  }

  const handleMint = async () => {
    // Validation
    if (!mintAddress || !amount || !destinationAddress) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (!validateAddress(mintAddress) || !validateAddress(destinationAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter valid Solana addresses",
        variant: "destructive",
      })
      return
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate transaction - in real implementation, this would use Solana Web3.js
      const mockSignature = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

      const newTransaction: MintTransaction = {
        signature: mockSignature,
        status: "pending",
        timestamp: new Date(),
        amount,
        mintAddress,
        destinationAddress,
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
          title: "Mint Successful",
          description: `Successfully minted ${amount} tokens`,
        })
        // Clear form on success
        setAmount("")
        setDestinationAddress("")
      } else {
        toast({
          title: "Mint Failed",
          description: "Transaction failed. Please try again.",
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
      setIsLoading(false)
    }
  }

  const codePreview = `// Mint SPL Tokens using Solana Web3.js
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { mintTo, getAssociatedTokenAddress } from '@solana/spl-token';

const connection = new Connection('https://api.devnet.solana.com');
const mintAddress = new PublicKey('${mintAddress}');
const destinationAddress = new PublicKey('${destinationAddress}');
const amount = ${amount} * Math.pow(10, ${decimals}); // Adjust for decimals

// Get associated token account
const associatedTokenAccount = await getAssociatedTokenAddress(
  mintAddress,
  destinationAddress
);

// Mint tokens
const signature = await mintTo(
  connection,
  payer, // Fee payer
  mintAddress,
  associatedTokenAccount,
  mintAuthority, // Mint authority
  amount
);

console.log('Transaction signature:', signature);`

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Mint Tokens</h1>
        <p className="text-muted-foreground">Create new SPL tokens and mint them to a destination address</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mint Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Mint Configuration
              </CardTitle>
              <CardDescription>Enter the details for minting SPL tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mint-address">Mint Address *</Label>
                <Input
                  id="mint-address"
                  placeholder="Enter the mint address (e.g., 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU)"
                  value={mintAddress}
                  onChange={(e) => setMintAddress(e.target.value)}
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground">The address of the token mint you want to mint from</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="1000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="any"
                  />
                  <p className="text-sm text-muted-foreground">Number of tokens to mint</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decimals">Decimals</Label>
                  <Input
                    id="decimals"
                    type="number"
                    value={decimals}
                    onChange={(e) => setDecimals(e.target.value)}
                    min="0"
                    max="18"
                  />
                  <p className="text-sm text-muted-foreground">Token decimal places</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destination Address *</Label>
                <Input
                  id="destination"
                  placeholder="Enter destination wallet address"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground">The wallet address that will receive the minted tokens</p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Make sure you have mint authority for the specified mint address and sufficient SOL for transaction
                  fees.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button onClick={handleMint} disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Minting...
                    </>
                  ) : (
                    <>
                      <Coins className="mr-2 h-4 w-4" />
                      Mint Tokens
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
                      <DialogTitle>Code Preview</DialogTitle>
                      <DialogDescription>JavaScript code for this mint operation</DialogDescription>
                    </DialogHeader>
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{codePreview}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 bg-transparent"
                        onClick={() => navigator.clipboard.writeText(codePreview)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest mint operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No transactions yet</p>
                ) : (
                  transactions.slice(0, 5).map((tx) => (
                    <div key={tx.signature} className="space-y-2 p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
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
                        <span className="text-sm text-muted-foreground">{tx.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <div>
                        <p className="font-medium">{tx.amount} tokens</p>
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
