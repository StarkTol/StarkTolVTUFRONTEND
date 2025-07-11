"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Loader2, ArrowRight, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function WalletTransferPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [transferData, setTransferData] = useState({
    username: "",
    amount: "",
    description: "",
  })
  const [recipientFound, setRecipientFound] = useState<null | {
    name: string
    username: string
    email: string
    avatar: string
  }>(null)

  // Mock wallet data
  const walletData = {
    balance: "₦125,000.00",
  }

  const handleTransferChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTransferData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSearchRecipient = () => {
    if (!transferData.username) return

    setIsSearching(true)
    setRecipientFound(null)

    // Simulate searching for recipient
    setTimeout(() => {
      setIsSearching(false)
      // Mock recipient data
      if (
        transferData.username.toLowerCase() === "johndoe" ||
        transferData.username.toLowerCase() === "john@example.com"
      ) {
        setRecipientFound({
          name: "John Doe",
          username: "johndoe",
          email: "john@example.com",
          avatar: "",
        })
      }
    }, 1000)
  }

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate processing
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)

      // Reset after 3 seconds and redirect
      setTimeout(() => {
        setIsSuccess(false)
        setTransferData({
          username: "",
          amount: "",
          description: "",
        })
        router.push("/dashboard/wallet")
      }, 3000)
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transfer Funds</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/wallet")}>
          Back to Wallet
        </Button>
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Transfer Funds</CardTitle>
          <CardDescription>Send money to another Babs VTU user</CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="mb-2 text-2xl font-bold">Transfer Successful!</h3>
              <p className="mb-2 text-muted-foreground">
                You have successfully transferred ₦{transferData.amount} to{" "}
                {recipientFound?.name || transferData.username}.
              </p>
              <p className="text-sm text-muted-foreground">
                Transaction Reference: BVTU{Math.floor(Math.random() * 1000000000)}
              </p>
            </div>
          ) : (
            <form onSubmit={handleTransfer} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Available Balance:</span>
                  <span className="font-bold">{walletData.balance}</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Recipient Username or Email</Label>
                  <div className="flex gap-2">
                    <Input
                      id="username"
                      name="username"
                      placeholder="Enter recipient's username or email"
                      required
                      value={transferData.username}
                      onChange={handleTransferChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSearchRecipient}
                      disabled={!transferData.username || isSearching}
                    >
                      {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {recipientFound && (
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={recipientFound.avatar || "/placeholder.svg"} alt={recipientFound.name} />
                        <AvatarFallback>{recipientFound.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{recipientFound.name}</div>
                        <div className="text-sm text-muted-foreground">{recipientFound.email}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₦)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="Enter amount"
                    required
                    min="100"
                    max="100000"
                    value={transferData.amount}
                    onChange={handleTransferChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Enter transfer description"
                    value={transferData.description}
                    onChange={handleTransferChange}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!transferData.username || !transferData.amount || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Transfer Funds <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>• Minimum transfer amount is ₦100</p>
            <p>• Maximum transfer amount is ₦100,000 per transaction</p>
            <p>• Transfers are processed instantly</p>
            <p>• You can only transfer to registered Babs VTU users</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
