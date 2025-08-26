"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Settings,
  Shield,
  Snowflake,
  Loader2,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Code,
  Key,
  UserCheck,
  Lock,
  Unlock,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AuthorityTransaction {
  signature: string
  status: "pending" | "success" | "error"
  timestamp: Date
  type: "set-authority" | "approve" | "revoke" | "freeze" | "thaw"
  address: string
  authorityType?: string
  newAuthority?: string
  delegateAddress?: string
  amount?: string
}

export function AuthorityManagement() {
  // Set Authority state
  const [setAuthorityAddress, setSetAuthorityAddress] = useState("")
  const [authorityType, setAuthorityType] = useState("")
  const [currentAuthority, setCurrentAuthority] = useState("")
  const [newAuthority, setNewAuthority] = useState("")
  const [isSetAuthorityLoading, setIsSetAuthorityLoading] = useState(false)

  // Approve/Revoke state
  const [approveTokenAccount, setApproveTokenAccount] = useState("")
  const [delegateAddress, setDelegateAddress] = useState("")
  const [approveAmount, setApproveAmount] = useState("")
  const [isApproveLoading, setIsApproveLoading] = useState(false)
  const [isRevokeLoading, setIsRevokeLoading] = useState(false)

  // Freeze/Thaw state
  const [freezeTokenAccount, setFreezeTokenAccount] = useState("")
  const [isFreezeLoading, setIsFreezeLoading] = useState(false)
  const [isThawLoading, setIsThawLoading] = useState(false)

  const [transactions, setTransactions] = useState<AuthorityTransaction[]>([])
  const { toast } = useToast()

  const validateAddress = (address: string) => {
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
    return base58Regex.test(address)
  }

  const handleSetAuthority = async () => {
    if (!setAuthorityAddress || !authorityType || !currentAuthority) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (!validateAddress(setAuthorityAddress) || !validateAddress(currentAuthority)) {
      toast({
        title: "Invalid Address",
        description: "Please enter valid Solana addresses",
        variant: "destructive",
      })
      return
    }

    if (newAuthority && !validateAddress(newAuthority)) {
      toast({
        title: "Invalid Address",
        description: "New authority must be a valid Solana address or empty to revoke",
        variant: "destructive",
      })
      return
    }

    setIsSetAuthorityLoading(true)

    try {
      const mockSignature = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

      const newTransaction: AuthorityTransaction = {
        signature: mockSignature,
        status: "pending",
        timestamp: new Date(),
        type: "set-authority",
        address: setAuthorityAddress,
        authorityType,
        newAuthority: newAuthority || "Revoked",
      }

      setTransactions((prev) => [newTransaction, ...prev])

      await new Promise((resolve) => setTimeout(resolve, 2200))
      const isSuccess = Math.random() > 0.1

      setTransactions((prev) =>
        prev.map((tx) => (tx.signature === mockSignature ? { ...tx, status: isSuccess ? "success" : "error" } : tx)),
      )

      if (isSuccess) {
        toast({
          title: "Authority Updated",
          description: `Successfully updated ${authorityType} authority`,
        })
        setNewAuthority("")
      } else {
        toast({
          title: "Authority Update Failed",
          description: "Failed to update authority. Check permissions.",
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
      setIsSetAuthorityLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!approveTokenAccount || !delegateAddress || !approveAmount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (!validateAddress(approveTokenAccount) || !validateAddress(delegateAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter valid Solana addresses",
        variant: "destructive",
      })
      return
    }

    if (isNaN(Number(approveAmount)) || Number(approveAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      })
      return
    }

    setIsApproveLoading(true)

    try {
      const mockSignature = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

      const newTransaction: AuthorityTransaction = {
        signature: mockSignature,
        status: "pending",
        timestamp: new Date(),
        type: "approve",
        address: approveTokenAccount,
        delegateAddress,
        amount: approveAmount,
      }

      setTransactions((prev) => [newTransaction, ...prev])

      await new Promise((resolve) => setTimeout(resolve, 1800))
      const isSuccess = Math.random() > 0.1

      setTransactions((prev) =>
        prev.map((tx) => (tx.signature === mockSignature ? { ...tx, status: isSuccess ? "success" : "error" } : tx)),
      )

      if (isSuccess) {
        toast({
          title: "Approval Successful",
          description: `Successfully approved ${approveAmount} tokens to delegate`,
        })
        setApproveAmount("")
      } else {
        toast({
          title: "Approval Failed",
          description: "Failed to approve delegate",
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
      setIsApproveLoading(false)
    }
  }

  const handleRevoke = async () => {
    if (!approveTokenAccount) {
      toast({
        title: "Validation Error",
        description: "Please enter token account address",
        variant: "destructive",
      })
      return
    }

    if (!validateAddress(approveTokenAccount)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Solana address",
        variant: "destructive",
      })
      return
    }

    setIsRevokeLoading(true)

    try {
      const mockSignature = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

      const newTransaction: AuthorityTransaction = {
        signature: mockSignature,
        status: "pending",
        timestamp: new Date(),
        type: "revoke",
        address: approveTokenAccount,
      }

      setTransactions((prev) => [newTransaction, ...prev])

      await new Promise((resolve) => setTimeout(resolve, 1600))
      const isSuccess = Math.random() > 0.1

      setTransactions((prev) =>
        prev.map((tx) => (tx.signature === mockSignature ? { ...tx, status: isSuccess ? "success" : "error" } : tx)),
      )

      if (isSuccess) {
        toast({
          title: "Revoke Successful",
          description: "Successfully revoked all delegated authority",
        })
      } else {
        toast({
          title: "Revoke Failed",
          description: "Failed to revoke delegate",
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
      setIsRevokeLoading(false)
    }
  }

  const handleFreeze = async () => {
    if (!freezeTokenAccount) {
      toast({
        title: "Validation Error",
        description: "Please enter token account address",
        variant: "destructive",
      })
      return
    }

    if (!validateAddress(freezeTokenAccount)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Solana address",
        variant: "destructive",
      })
      return
    }

    setIsFreezeLoading(true)

    try {
      const mockSignature = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

      const newTransaction: AuthorityTransaction = {
        signature: mockSignature,
        status: "pending",
        timestamp: new Date(),
        type: "freeze",
        address: freezeTokenAccount,
      }

      setTransactions((prev) => [newTransaction, ...prev])

      await new Promise((resolve) => setTimeout(resolve, 1700))
      const isSuccess = Math.random() > 0.1

      setTransactions((prev) =>
        prev.map((tx) => (tx.signature === mockSignature ? { ...tx, status: isSuccess ? "success" : "error" } : tx)),
      )

      if (isSuccess) {
        toast({
          title: "Account Frozen",
          description: "Successfully froze token account",
        })
      } else {
        toast({
          title: "Freeze Failed",
          description: "Failed to freeze account. Check freeze authority.",
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
      setIsFreezeLoading(false)
    }
  }

  const handleThaw = async () => {
    if (!freezeTokenAccount) {
      toast({
        title: "Validation Error",
        description: "Please enter token account address",
        variant: "destructive",
      })
      return
    }

    if (!validateAddress(freezeTokenAccount)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Solana address",
        variant: "destructive",
      })
      return
    }

    setIsThawLoading(true)

    try {
      const mockSignature = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

      const newTransaction: AuthorityTransaction = {
        signature: mockSignature,
        status: "pending",
        timestamp: new Date(),
        type: "thaw",
        address: freezeTokenAccount,
      }

      setTransactions((prev) => [newTransaction, ...prev])

      await new Promise((resolve) => setTimeout(resolve, 1700))
      const isSuccess = Math.random() > 0.1

      setTransactions((prev) =>
        prev.map((tx) => (tx.signature === mockSignature ? { ...tx, status: isSuccess ? "success" : "error" } : tx)),
      )

      if (isSuccess) {
        toast({
          title: "Account Thawed",
          description: "Successfully thawed token account",
        })
      } else {
        toast({
          title: "Thaw Failed",
          description: "Failed to thaw account. Check freeze authority.",
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
      setIsThawLoading(false)
    }
  }

  const setAuthorityCodePreview = `// Set Authority using Solana Web3.js
import { Connection, PublicKey } from '@solana/web3.js';
import { setAuthority, AuthorityType } from '@solana/spl-token';

const connection = new Connection('https://api.devnet.solana.com');
const account = new PublicKey('${setAuthorityAddress}');
const currentAuthority = new PublicKey('${currentAuthority}');
${newAuthority ? `const newAuthority = new PublicKey('${newAuthority}');` : "const newAuthority = null; // Revoke authority"}

// Set authority
const signature = await setAuthority(
  connection,
  payer, // Fee payer
  account,
  currentAuthority,
  AuthorityType.${authorityType === "mint" ? "MintTokens" : authorityType === "freeze" ? "FreezeAccount" : "CloseAccount"},
  newAuthority
);

console.log('Set authority signature:', signature);`

  const approveCodePreview = `// Approve Delegate using Solana Web3.js
import { Connection, PublicKey } from '@solana/web3.js';
import { approve } from '@solana/spl-token';

const connection = new Connection('https://api.devnet.solana.com');
const tokenAccount = new PublicKey('${approveTokenAccount}');
const delegate = new PublicKey('${delegateAddress}');
const amount = ${approveAmount} * Math.pow(10, 9); // Adjust for decimals

// Approve delegate
const signature = await approve(
  connection,
  payer, // Fee payer
  tokenAccount,
  delegate,
  owner, // Token account owner
  amount
);

console.log('Approve signature:', signature);`

  const freezeCodePreview = `// Freeze/Thaw Account using Solana Web3.js
import { Connection, PublicKey } from '@solana/web3.js';
import { freezeAccount, thawAccount } from '@solana/spl-token';

const connection = new Connection('https://api.devnet.solana.com');
const tokenAccount = new PublicKey('${freezeTokenAccount}');

// Freeze account
const signature = await freezeAccount(
  connection,
  payer, // Fee payer
  tokenAccount,
  mint, // Token mint
  freezeAuthority // Freeze authority
);

// Or thaw account
// const signature = await thawAccount(
//   connection,
//   payer,
//   tokenAccount,
//   mint,
//   freezeAuthority
// );

console.log('Freeze/Thaw signature:', signature);`

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Authority Management</h1>
        <p className="text-muted-foreground">Manage token authorities, delegates, and account permissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="authority" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="authority" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Set Authority
              </TabsTrigger>
              <TabsTrigger value="approve" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Approve/Revoke
              </TabsTrigger>
              <TabsTrigger value="freeze" className="flex items-center gap-2">
                <Snowflake className="h-4 w-4" />
                Freeze/Thaw
              </TabsTrigger>
            </TabsList>

            <TabsContent value="authority">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Set Authority
                  </CardTitle>
                  <CardDescription>Change mint, freeze, or close authority for tokens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="authority-address">Token Mint/Account Address *</Label>
                    <Input
                      id="authority-address"
                      placeholder="Enter token mint or account address"
                      value={setAuthorityAddress}
                      onChange={(e) => setSetAuthorityAddress(e.target.value)}
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="authority-type">Authority Type *</Label>
                    <Select value={authorityType} onValueChange={setAuthorityType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select authority type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mint">Mint Authority</SelectItem>
                        <SelectItem value="freeze">Freeze Authority</SelectItem>
                        <SelectItem value="close">Close Authority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="current-authority">Current Authority *</Label>
                    <Input
                      id="current-authority"
                      placeholder="Enter current authority address"
                      value={currentAuthority}
                      onChange={(e) => setCurrentAuthority(e.target.value)}
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-authority">New Authority</Label>
                    <Input
                      id="new-authority"
                      placeholder="Enter new authority address (leave empty to revoke)"
                      value={newAuthority}
                      onChange={(e) => setNewAuthority(e.target.value)}
                      className="font-mono"
                    />
                    <p className="text-sm text-muted-foreground">Leave empty to permanently revoke this authority</p>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleSetAuthority} disabled={isSetAuthorityLoading} className="flex-1">
                      {isSetAuthorityLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Setting...
                        </>
                      ) : (
                        <>
                          <Key className="mr-2 h-4 w-4" />
                          Set Authority
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
                          <DialogTitle>Code Preview - Set Authority</DialogTitle>
                          <DialogDescription>JavaScript code for setting authority</DialogDescription>
                        </DialogHeader>
                        <div className="relative">
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{setAuthorityCodePreview}</code>
                          </pre>
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2 bg-transparent"
                            onClick={() => navigator.clipboard.writeText(setAuthorityCodePreview)}
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

            <TabsContent value="approve">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Approve/Revoke Delegate
                  </CardTitle>
                  <CardDescription>Grant or revoke spending authority to another address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="approve-account">Token Account Address *</Label>
                    <Input
                      id="approve-account"
                      placeholder="Enter token account address"
                      value={approveTokenAccount}
                      onChange={(e) => setApproveTokenAccount(e.target.value)}
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="delegate">Delegate Address</Label>
                    <Input
                      id="delegate"
                      placeholder="Enter delegate address (for approve only)"
                      value={delegateAddress}
                      onChange={(e) => setDelegateAddress(e.target.value)}
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="approve-amount">Amount to Approve</Label>
                    <Input
                      id="approve-amount"
                      type="number"
                      placeholder="Enter amount to approve"
                      value={approveAmount}
                      onChange={(e) => setApproveAmount(e.target.value)}
                      min="0"
                      step="any"
                    />
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Approving a delegate allows them to spend up to the specified amount from your token account.
                      Revoking removes all delegated authority.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-3">
                    <Button onClick={handleApprove} disabled={isApproveLoading} className="flex-1">
                      {isApproveLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Approve
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={handleRevoke}
                      disabled={isRevokeLoading}
                      variant="outline"
                      className="flex-1 bg-transparent"
                    >
                      {isRevokeLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Revoking...
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          Revoke All
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
                          <DialogTitle>Code Preview - Approve Delegate</DialogTitle>
                          <DialogDescription>JavaScript code for approving delegates</DialogDescription>
                        </DialogHeader>
                        <div className="relative">
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{approveCodePreview}</code>
                          </pre>
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2 bg-transparent"
                            onClick={() => navigator.clipboard.writeText(approveCodePreview)}
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

            <TabsContent value="freeze">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Snowflake className="h-5 w-5" />
                    Freeze/Thaw Account
                  </CardTitle>
                  <CardDescription>Freeze or thaw token accounts to prevent/allow transfers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="freeze-account">Token Account Address *</Label>
                    <Input
                      id="freeze-account"
                      placeholder="Enter token account address"
                      value={freezeTokenAccount}
                      onChange={(e) => setFreezeTokenAccount(e.target.value)}
                      className="font-mono"
                    />
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Freezing prevents all transfers from the account. Thawing restores normal functionality. You must
                      have freeze authority for the token mint.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-3">
                    <Button onClick={handleFreeze} disabled={isFreezeLoading} variant="secondary" className="flex-1">
                      {isFreezeLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Freezing...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Freeze Account
                        </>
                      )}
                    </Button>

                    <Button onClick={handleThaw} disabled={isThawLoading} className="flex-1">
                      {isThawLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Thawing...
                        </>
                      ) : (
                        <>
                          <Unlock className="mr-2 h-4 w-4" />
                          Thaw Account
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
                          <DialogTitle>Code Preview - Freeze/Thaw</DialogTitle>
                          <DialogDescription>JavaScript code for freezing/thawing accounts</DialogDescription>
                        </DialogHeader>
                        <div className="relative">
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{freezeCodePreview}</code>
                          </pre>
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2 bg-transparent"
                            onClick={() => navigator.clipboard.writeText(freezeCodePreview)}
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
              <CardTitle>Recent Authority Operations</CardTitle>
              <CardDescription>Your latest authority management actions</CardDescription>
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
                            {tx.type === "set-authority" && <Settings className="mr-1 h-3 w-3" />}
                            {tx.type === "approve" && <UserCheck className="mr-1 h-3 w-3" />}
                            {tx.type === "revoke" && <Shield className="mr-1 h-3 w-3" />}
                            {tx.type === "freeze" && <Lock className="mr-1 h-3 w-3" />}
                            {tx.type === "thaw" && <Unlock className="mr-1 h-3 w-3" />}
                            {tx.type.replace("-", " ")}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{tx.timestamp.toLocaleTimeString()}</span>
                      </div>

                      <div className="space-y-1">
                        {tx.type === "set-authority" && (
                          <p className="font-medium">
                            {tx.authorityType} → {tx.newAuthority}
                          </p>
                        )}
                        {tx.type === "approve" && tx.amount && (
                          <p className="font-medium">{tx.amount} tokens approved</p>
                        )}
                        {(tx.type === "freeze" || tx.type === "thaw") && (
                          <p className="font-medium">Account {tx.type}ed</p>
                        )}
                        {tx.type === "revoke" && <p className="font-medium">All approvals revoked</p>}
                        <p className="text-xs text-muted-foreground font-mono">
                          {tx.address.slice(0, 6)}...{tx.address.slice(-6)}
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
