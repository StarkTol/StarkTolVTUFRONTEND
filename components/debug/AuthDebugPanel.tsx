"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/authContext'
import { useUserData } from '@/context/UserDataContext'
import { useWalletData } from '@/context/WalletDataContext'
import { realtimeService } from '@/lib/services/realtimeService'
import { validateAuthState, isAuthHealthy } from '@/utils/authHelpers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  ChevronDown,
  User,
  Wallet,
  Activity,
  Database,
  Wifi,
  Settings
} from 'lucide-react'

export default function AuthDebugPanel() {
  const { user, accessToken, refreshToken, isAuthenticated, loading } = useAuth()
  const { profile, transactions, loading: userLoading, error: userError } = useUserData()
  const { balance, recentTransactions, loading: walletLoading } = useWalletData()
  
  const [isOpen, setIsOpen] = useState(false)
  const [authValidation, setAuthValidation] = useState(validateAuthState())
  const [realtimeStatus, setRealtimeStatus] = useState(realtimeService.getSubscriptionStatus())

  // Refresh validation state
  const refreshValidation = () => {
    setAuthValidation(validateAuthState())
    setRealtimeStatus(realtimeService.getSubscriptionStatus())
  }

  useEffect(() => {
    // Auto-refresh every 5 seconds
    const interval = setInterval(refreshValidation, 5000)
    return () => clearInterval(interval)
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const StatusIcon = ({ status, loading: isLoading }: { status: boolean; loading?: boolean }) => {
    if (isLoading) return <RefreshCw className="h-4 w-4 animate-spin text-yellow-500" />
    return status ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-red-500" />
  }

  const getTokenInfo = (token: string | null) => {
    if (!token) return { valid: false, expired: false, expiresAt: null }
    
    try {
      const [, payload] = token.split('.')
      const decoded = JSON.parse(atob(payload))
      const expiresAt = decoded.exp ? new Date(decoded.exp * 1000) : null
      const expired = decoded.exp ? decoded.exp < Math.floor(Date.now() / 1000) : false
      
      return {
        valid: true,
        expired,
        expiresAt,
        issuer: decoded.iss,
        subject: decoded.sub
      }
    } catch {
      return { valid: false, expired: true, expiresAt: null }
    }
  }

  const accessTokenInfo = getTokenInfo(accessToken)
  const refreshTokenInfo = getTokenInfo(refreshToken)

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-lg">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Auth Debug
            <Badge variant={isAuthHealthy() ? "default" : "destructive"}>
              {isAuthHealthy() ? "OK" : "ERROR"}
            </Badge>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-2">
          <Card className="w-full max-h-96 overflow-y-auto">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4" />
                Authentication Debug Panel
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time authentication and data flow monitoring
              </CardDescription>
              <Button size="sm" variant="ghost" onClick={refreshValidation} className="w-fit">
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-4 text-xs">
              <Tabs defaultValue="auth" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="auth" className="text-xs">Auth</TabsTrigger>
                  <TabsTrigger value="user" className="text-xs">User</TabsTrigger>
                  <TabsTrigger value="wallet" className="text-xs">Wallet</TabsTrigger>
                  <TabsTrigger value="realtime" className="text-xs">Realtime</TabsTrigger>
                </TabsList>
                
                <TabsContent value="auth" className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <User className="h-3 w-3" />
                      Authentication State
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <StatusIcon status={isAuthenticated} loading={loading} />
                        <span>Authenticated</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={!!user} />
                        <span>User Loaded</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={!!accessToken} />
                        <span>Access Token</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={!!refreshToken} />
                        <span>Refresh Token</span>
                      </div>
                    </div>

                    {user && (
                      <div className="bg-muted p-2 rounded text-xs">
                        <strong>User:</strong> {user.email} (ID: {user.id})
                      </div>
                    )}

                    {accessToken && (
                      <div className="bg-muted p-2 rounded text-xs">
                        <strong>Access Token:</strong>
                        <br />
                        Valid: {accessTokenInfo.valid ? '✅' : '❌'}
                        <br />
                        Expired: {accessTokenInfo.expired ? '❌' : '✅'}
                        {accessTokenInfo.expiresAt && (
                          <>
                            <br />
                            Expires: {accessTokenInfo.expiresAt.toLocaleString()}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="user" className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Database className="h-3 w-3" />
                      User Data State
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <StatusIcon status={!!profile} loading={userLoading} />
                        <span>Profile Loaded</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={!userError} />
                        <span>No Errors</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={transactions.length > 0} />
                        <span>Transactions ({transactions.length})</span>
                      </div>
                    </div>

                    {profile && (
                      <div className="bg-muted p-2 rounded text-xs">
                        <strong>Profile:</strong>
                        <br />
                        ID: {profile.id}
                        <br />
                        Email: {profile.email}
                        <br />
                        Balance: ₦{profile.wallet_balance?.toLocaleString() || '0'}
                      </div>
                    )}

                    {userError && (
                      <div className="bg-red-50 border border-red-200 p-2 rounded text-xs text-red-700">
                        <strong>Error:</strong> {userError}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="wallet" className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Wallet className="h-3 w-3" />
                      Wallet State
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <StatusIcon status={!!balance} loading={walletLoading} />
                        <span>Balance Loaded</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={recentTransactions.length > 0} />
                        <span>Recent Txns ({recentTransactions.length})</span>
                      </div>
                    </div>

                    {balance && (
                      <div className="bg-muted p-2 rounded text-xs">
                        <strong>Wallet Balance:</strong>
                        <br />
                        Amount: ₦{balance.balance?.toLocaleString() || '0'}
                        <br />
                        Currency: {balance.currency || 'NGN'}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="realtime" className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Wifi className="h-3 w-3" />
                      Real-time Status
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <StatusIcon status={realtimeStatus.isConnected} />
                        <span>Connected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={realtimeStatus.activeSubscriptions.length > 0} />
                        <span>Subscriptions ({realtimeStatus.activeSubscriptions.length})</span>
                      </div>
                    </div>

                    {realtimeStatus.userId && (
                      <div className="bg-muted p-2 rounded text-xs">
                        <strong>User ID:</strong> {realtimeStatus.userId}
                      </div>
                    )}

                    {realtimeStatus.activeSubscriptions.length > 0 && (
                      <div className="bg-muted p-2 rounded text-xs">
                        <strong>Active Subscriptions:</strong>
                        <br />
                        {realtimeStatus.activeSubscriptions.join(', ')}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {authValidation.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 p-2 rounded">
                  <h4 className="font-medium text-red-800 flex items-center gap-1 text-xs">
                    <AlertCircle className="h-3 w-3" />
                    Validation Errors
                  </h4>
                  <ul className="text-xs text-red-700 mt-1 space-y-1">
                    {authValidation.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
