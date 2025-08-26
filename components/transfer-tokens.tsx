"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Send, Loader2, CheckCircle, AlertCircle, Copy, ExternalLink, Code, ArrowRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface TransferTransaction {
  signature: string
  status: "pending" | "success" | "error"
  timestamp: Date
  amount: string
  tokenMint: string
  sourceAddress: string
  destinationAddress: string
}

export function TransferTokens() {
  const [tokenMint, setTokenMint] = useState("")
  const [sourceAddress, setSourceAddress] = useState("")
  const [destinationAddress, setDestinationAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState<TransferTransaction[]>([])
  const { toast } = useToast()

  const validateAddress = (address: string) => {
    // Basic Solana address validation (base58, 32-44 characters)
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
    return base58Regex.test(address)
  }

  const handleTransfer = async () => {
    // Validation
    if (!tokenMint || !sourceAddress || !destinationAddress || !amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (!validateAddress(tokenMint) || !validateAddress(sourceAddress) || !validateAddress(destinationAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter valid Solana addresses",
        variant: "destructive",
      })
      return
    }

    if (sourceAddress === destinationAddress) {
      toast({
        title: "Invalid Transfer",
        description: "Source and destination addresses cannot be the same",
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

      const newTransaction: TransferTransaction = {
        signature: mockSignature,
        status: "pending",
        timestamp: new Date(),
        amount,
        tokenMint,
        sourceAddress,
        destinationAddress,
      }

      setTransactions((prev) => [newTransaction, ...prev])

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // Simulate success/failure (85% success rate)
      const isSuccess = Math.random() > 0.15

      setTransactions((prev) =>
        prev.map((tx) => (tx.signature === mockSignature ? { ...tx, status: isSuccess ? "success" : "error" } : tx)),
      )

      if (isSuccess) {
        toast({
          title: "Transfer Successful",
          description: `Successfully transferred ${amount} tokens`,
        })
        // Clear form on success
        setAmount("")
      } else {
        toast({
          title: "Transfer Failed",
          description: "Transaction failed. Please check balances and try again.",
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

  const codePreview = `// Transfer SPL Tokens using Solana Web3.js
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { transfer, getAssociatedTokenAddress } from '@solana/spl-token';

const connection = new Connection('https://api.devnet.solana.com');
const tokenMint = new PublicKey('${tokenMint}');
const sourceWallet = new PublicKey('${sourceAddress}');
const destinationWallet = new PublicKey('${destinationAddress}');
const amount = ${amount} * Math.pow(10, 9); // Adjust for token decimals

// Get associated token accounts
const sourceTokenAccount = await getAssociatedTokenAddress(
  tokenMint,
  sourceWallet
);

const destinationTokenAccount = await getAssociatedTokenAddress(
  tokenMint,
  destinationWallet
);

// Transfer tokens
const signature = await transfer(
  connection,
  payer, // Fee payer
  sourceTokenAccount,
  destinationTokenAccount,
  sourceWallet, // Owner of source account
  amount
);

console.log('Transaction signature:', signature);`

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Transfer Tokens</h1>
        <p className="text-muted-foreground">Send SPL tokens from one wallet to another</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transfer Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Transfer Configuration
              </CardTitle>
              <CardDescription>Enter the details for transferring SPL tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="token-mint">Token Mint Address *</Label>
                <Input
                  id="token-mint"
                  placeholder="Enter the token mint address"
                  value={tokenMint}
                  onChange={(e) => setTokenMint(e.target.value)}
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground">The mint address of the token you want to transfer</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="source-address">Source Address *</Label>
                  <Input
                    id="source-address"
                    placeholder="Enter source wallet address"
                    value={sourceAddress}
                    onChange={(e) => setSourceAddress(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-sm text-muted-foreground">The wallet address sending the tokens</p>
                </div>

                <div className="flex items-center justify-center py-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ArrowRight className="h-4 w-4" />
                    <span className="text-sm">Transfer Direction</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination-address">Destination Address *</Label>
                  <Input
                    id="destination-address"
                    placeholder="Enter destination wallet address"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-sm text-muted-foreground">The wallet address receiving the tokens</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount to transfer"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="any"
                />
                <p className="text-sm text-muted-foreground">Number of tokens to transfer</p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Ensure the source address has sufficient token balance and SOL for transaction fees. The destination
                  token account will be created automatically if it doesn't exist.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button onClick={handleTransfer} disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Transferring...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Transfer Tokens
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
                      <DialogDescription>JavaScript code for this transfer operation</DialogDescription>
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
              <CardTitle>Recent Transfers</CardTitle>
              <CardDescription>Your latest transfer operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No transfers yet</p>
                ) : (
                  transactions.slice(0, 5).map((tx) => (
                    <div key={tx.signature} className="space-y-3 p-3 border rounded-lg">
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

                      <div className="space-y-1">
                        <p className="font-medium">{tx.amount} tokens</p>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex items-center gap-1">
                            <span>From:</span>
                            <span className="font-mono">
                              {tx.sourceAddress.slice(0, 6)}...{tx.sourceAddress.slice(-6)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ArrowRight className="h-3 w-3" />
                            <span>To:</span>
                            <span className="font-mono">
                              {tx.destinationAddress.slice(0, 6)}...{tx.destinationAddress.slice(-6)}
                            </span>
                          </div>
                        </div>
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
