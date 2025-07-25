"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, Wifi, Tv, Zap } from "lucide-react"
import AirtimeTab from "@/components/vtu/AirtimeTab"
import DataTab from "@/components/vtu/DataTab"
import CableTab from "@/components/vtu/CableTab"
import ElectricityTab from "@/components/vtu/ElectricityTab"
import { useUserData } from "@/context/UserDataContext"
import { useWalletData } from "@/context/WalletDataContext"

export default function VTUPage() {
  const { profile } = useUserData()
  const { balance } = useWalletData()
  const [activeTab, setActiveTab] = useState("airtime")

  const tabs = [
    {
      id: "airtime",
      label: "Airtime",
      icon: Phone,
      description: "Buy airtime for any network",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: "data",
      label: "Data",
      icon: Wifi,
      description: "Purchase data bundles",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      id: "cable",
      label: "Cable TV",
      icon: Tv,
      description: "Pay for cable TV subscriptions",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      id: "electricity",
      label: "Electricity",
      icon: Zap,
      description: "Buy electricity tokens",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    }
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">VTU Services</h1>
          <p className="text-muted-foreground">
            Airtime, Data, Cable TV & Electricity - All in one place
          </p>
        </div>
        <Card className="bg-primary/5">
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Wallet Balance</div>
            <div className="text-2xl font-bold">
              {balance ? `₦${balance.balance.toLocaleString()}` : '₦0.00'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex flex-col gap-2 p-4 h-auto data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <div className={`p-2 rounded-full ${activeTab === tab.id ? tab.bgColor : 'bg-muted'}`}>
                  <Icon className={`h-5 w-5 ${activeTab === tab.id ? tab.color : 'text-muted-foreground'}`} />
                </div>
                <div className="text-center">
                  <div className="font-medium">{tab.label}</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    {tab.description}
                  </div>
                </div>
              </TabsTrigger>
            )
          })}
        </TabsList>

        <div className="mt-8">
          <TabsContent value="airtime" className="space-y-6">
            <AirtimeTab />
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <DataTab />
          </TabsContent>

          <TabsContent value="cable" className="space-y-6">
            <CableTab />
          </TabsContent>

          <TabsContent value="electricity" className="space-y-6">
            <ElectricityTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
