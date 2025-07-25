"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, CheckCircle2, Facebook, Twitter, Mail, Share2 } from "lucide-react"

/**
 * Props for the ShareBox component
 */
interface ShareBoxProps {
  /** The referral URL to share */
  referralUrl: string
  /** Optional title for the card */
  title?: string
  /** Optional description for the card */
  description?: string
}

/**
 * A component for sharing referral links across different platforms
 * 
 * @param props - The component props
 * @returns A card with referral link sharing options
 * 
 * @example
 * ```tsx
 * <ShareBox
 *   referralUrl="https://example.com/ref/123"
 *   title="Share Your Referral Link"
 *   description="Share your unique referral link with friends and earn commissions on their transactions."
 * />
 * ```
 */
export function ShareBox({ 
  referralUrl, 
  title = "Share Your Referral Link",
  description = "Share your unique referral link with friends and earn commissions on their transactions."
}: ShareBoxProps): React.ReactElement {
  const [isCopied, setIsCopied] = useState(false)

  /**
   * Copies the referral link to clipboard
   */
  const copyReferralLink = async (): Promise<void> => {
    if (referralUrl) {
      try {
        await navigator.clipboard.writeText(referralUrl)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (err) {
        // Fallback for browsers that don't support clipboard API
        console.error('Failed to copy: ', err)
      }
    }
  }

  /**
   * Opens Facebook share dialog
   */
  const shareOnFacebook = (): void => {
    if (referralUrl) {
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  /**
   * Opens Twitter share dialog
   */
  const shareOnTwitter = (): void => {
    if (referralUrl) {
      const text = 'Join me on this amazing platform!'
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralUrl)}`
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  /**
   * Opens email client with referral link
   */
  const shareViaEmail = (): void => {
    if (referralUrl) {
      const subject = 'Join me on this amazing platform!'
      const body = `Hi! I'd like to invite you to join this great platform. Use my referral link: ${referralUrl}`
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      window.open(mailtoUrl)
    }
  }

  /**
   * Uses native share API or falls back to copy
   */
  const shareGeneric = (): void => {
    if (referralUrl) {
      if (navigator.share) {
        navigator.share({
          title: 'Join me on this platform!',
          text: 'Check out this amazing platform',
          url: referralUrl,
        })
      } else {
        copyReferralLink()
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            readOnly
            value={referralUrl || ''}
            className="flex-1"
            placeholder="Loading referral link..."
          />
          <Button onClick={copyReferralLink} variant="outline" size="icon">
            {isCopied ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={shareOnFacebook} variant="outline" size="sm">
            <Facebook className="h-4 w-4 mr-2" />
            Facebook
          </Button>
          <Button onClick={shareOnTwitter} variant="outline" size="sm">
            <Twitter className="h-4 w-4 mr-2" />
            Twitter
          </Button>
          <Button onClick={shareViaEmail} variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button onClick={shareGeneric} variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
