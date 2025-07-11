"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Layout, ImageIcon, Check, Loader2, ExternalLink } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ResellerWebsitePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [websiteData, setWebsiteData] = useState({
    domain: "myresellersite.babsvtu.com",
    customDomain: "vtuking.com",
    businessName: "VTU King",
    tagline: "Your one-stop shop for all VTU services",
    description:
      "We provide the best and most affordable VTU services in Nigeria. Airtime, data, cable TV, electricity, and more at competitive prices.",
    logo: "/placeholder.svg?height=100&width=100",
    primaryColor: "#7c3aed",
    accentColor: "#a855f7",
    contactEmail: "support@vtuking.com",
    contactPhone: "08012345678",
    whatsapp: "08012345678",
    facebook: "vtuking",
    twitter: "vtuking",
    instagram: "vtuking",
    address: "123 Example Street, Lagos, Nigeria",
    showTestimonials: true,
    showServices: true,
    showPricing: true,
    showBlog: false,
    template: "modern",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setWebsiteData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setWebsiteData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setWebsiteData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setIsLoading(true)

    // Simulate saving
    setTimeout(() => {
      setIsLoading(false)
      setIsSaved(true)

      // Reset saved state after 3 seconds
      setTimeout(() => {
        setIsSaved(false)
      }, 3000)
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Website Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <a href={`https://${websiteData.domain}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" /> Preview Website
            </a>
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : isSaved ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Saved
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="domain">Domain</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Basic information about your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" name="businessName" value={websiteData.businessName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  name="tagline"
                  value={websiteData.tagline}
                  onChange={handleChange}
                  placeholder="A short catchy phrase for your business"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={websiteData.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How customers can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email Address</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={websiteData.contactEmail}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone Number</Label>
                <Input id="contactPhone" name="contactPhone" value={websiteData.contactPhone} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input id="whatsapp" name="whatsapp" value={websiteData.whatsapp} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea id="address" name="address" value={websiteData.address} onChange={handleChange} rows={2} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook Username</Label>
                <Input
                  id="facebook"
                  name="facebook"
                  value={websiteData.facebook}
                  onChange={handleChange}
                  placeholder="yourpage"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter/X Username</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={websiteData.twitter}
                  onChange={handleChange}
                  placeholder="yourusername"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram Username</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  value={websiteData.instagram}
                  onChange={handleChange}
                  placeholder="yourusername"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Logo & Branding</CardTitle>
              <CardDescription>Customize your website's look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 overflow-hidden rounded-md border">
                    <img
                      src={websiteData.logo || "/placeholder.svg"}
                      alt="Business Logo"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <Button variant="outline">Upload New Logo</Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <div
                      className="h-10 w-10 rounded-md border"
                      style={{ backgroundColor: websiteData.primaryColor }}
                    ></div>
                    <Input
                      id="primaryColor"
                      name="primaryColor"
                      value={websiteData.primaryColor}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <div
                      className="h-10 w-10 rounded-md border"
                      style={{ backgroundColor: websiteData.accentColor }}
                    ></div>
                    <Input
                      id="accentColor"
                      name="accentColor"
                      value={websiteData.accentColor}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Website Template</CardTitle>
              <CardDescription>Choose a design template for your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template">Template</Label>
                <Select value={websiteData.template} onValueChange={(value) => handleSelectChange("template", value)}>
                  <SelectTrigger id="template">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="overflow-hidden rounded-md border">
                  <img
                    src="/placeholder.svg?height=200&width=300"
                    alt="Template Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="p-2 text-center text-sm font-medium">Modern Template</div>
                </div>
                <div className="overflow-hidden rounded-md border opacity-50">
                  <img
                    src="/placeholder.svg?height=200&width=300"
                    alt="Template Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="p-2 text-center text-sm font-medium">Classic Template</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Website Sections</CardTitle>
              <CardDescription>Choose which sections to display on your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showServices">Services Section</Label>
                  <p className="text-sm text-muted-foreground">Display your available services</p>
                </div>
                <Switch
                  id="showServices"
                  checked={websiteData.showServices}
                  onCheckedChange={(checked) => handleSwitchChange("showServices", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showPricing">Pricing Section</Label>
                  <p className="text-sm text-muted-foreground">Display your service prices</p>
                </div>
                <Switch
                  id="showPricing"
                  checked={websiteData.showPricing}
                  onCheckedChange={(checked) => handleSwitchChange("showPricing", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showTestimonials">Testimonials Section</Label>
                  <p className="text-sm text-muted-foreground">Display customer testimonials</p>
                </div>
                <Switch
                  id="showTestimonials"
                  checked={websiteData.showTestimonials}
                  onCheckedChange={(checked) => handleSwitchChange("showTestimonials", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showBlog">Blog Section</Label>
                  <p className="text-sm text-muted-foreground">Display blog posts</p>
                </div>
                <Switch
                  id="showBlog"
                  checked={websiteData.showBlog}
                  onCheckedChange={(checked) => handleSwitchChange("showBlog", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Manage your website content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Layout className="mr-2 h-4 w-4" /> Manage Homepage Content
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Palette className="mr-2 h-4 w-4" /> Customize Services Page
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ImageIcon className="mr-2 h-4 w-4" /> Manage Media Gallery
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domain" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Subdomain</CardTitle>
              <CardDescription>Your free Babs VTU subdomain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Subdomain</Label>
                <div className="flex">
                  <Input
                    id="domain"
                    name="domain"
                    value={websiteData.domain.split(".")[0]}
                    onChange={(e) => {
                      const value = e.target.value
                      setWebsiteData((prev) => ({
                        ...prev,
                        domain: `${value}.babsvtu.com`,
                      }))
                    }}
                    className="rounded-r-none"
                  />
                  <div className="flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm text-muted-foreground">
                    .babsvtu.com
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Your website is currently accessible at{" "}
                <a
                  href={`https://${websiteData.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  https://{websiteData.domain}
                </a>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Domain</CardTitle>
              <CardDescription>Connect your own domain to your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customDomain">Custom Domain</Label>
                <Input
                  id="customDomain"
                  name="customDomain"
                  value={websiteData.customDomain}
                  onChange={handleChange}
                  placeholder="yourdomain.com"
                />
              </div>

              <div className="rounded-md border p-4">
                <h3 className="mb-2 font-semibold">DNS Configuration</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  To connect your custom domain, add the following DNS records to your domain provider:
                </p>
                <div className="space-y-2">
                  <div className="rounded-md bg-muted p-2">
                    <p className="font-mono text-xs">Type: CNAME, Name: www, Value: cname.babsvtu.com, TTL: 3600</p>
                  </div>
                  <div className="rounded-md bg-muted p-2">
                    <p className="font-mono text-xs">Type: A, Name: @, Value: 192.168.1.1, TTL: 3600</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-green-600">Domain connected successfully</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Verify Domain
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
