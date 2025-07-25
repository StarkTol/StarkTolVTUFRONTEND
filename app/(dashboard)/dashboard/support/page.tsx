"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Phone, Mail, HelpCircle, FileText, Search, Loader2, CheckCircle2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("contact")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [ticketData, setTicketData] = useState({
    subject: "",
    message: "",
    category: "general",
  })

  // TODO: Fetch FAQs from real API or static file
  const [faqs, setFaqs] = useState<any[]>([])
  useEffect(() => {
    // Example: fetch('/api/faqs').then(res => res.json()).then(setFaqs)
    // Replace with your real FAQ API or static file fetch
  }, [])

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter((faq) => {
    return (
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTicketData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate processing
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
        setTicketData({
          subject: "",
          message: "",
          category: "general",
        })
      }, 3000)
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contact">
            <MessageSquare className="mr-2 h-4 w-4" /> Contact Us
          </TabsTrigger>
          <TabsTrigger value="faq">
            <HelpCircle className="mr-2 h-4 w-4" /> FAQs
          </TabsTrigger>
          <TabsTrigger value="tickets">
            <FileText className="mr-2 h-4 w-4" /> My Tickets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="mr-2 h-5 w-5" /> Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Call our customer support team:</p>
                <p className="font-medium">+234 801 234 5678</p>
                <p className="mt-2 text-sm text-muted-foreground">Available 8am - 8pm, Monday to Saturday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5" /> Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Send us an email:</p>
                <p className="font-medium">support@babsvtu.com</p>
                <p className="mt-2 text-sm text-muted-foreground">We typically respond within 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" /> Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Chat with our support team:</p>
                <Button className="w-full">Start Live Chat</Button>
                <p className="mt-2 text-sm text-muted-foreground">Available 24/7 for urgent issues</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
              <CardDescription>
                Fill out the form below and our support team will get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold">Ticket Submitted!</h3>
                  <p className="mb-2 text-muted-foreground">
                    Your support ticket has been successfully submitted. We'll get back to you as soon as possible.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ticket Reference: TICKET-{Math.floor(Math.random() * 1000000)}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      name="category"
                      value={ticketData.category}
                      onChange={handleTicketChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="account">Account Issues</option>
                      <option value="service">Service Issues</option>
                      <option value="reseller">Reseller Support</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Brief description of your issue"
                      required
                      value={ticketData.subject}
                      onChange={handleTicketChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Please provide as much detail as possible"
                      required
                      rows={5}
                      value={ticketData.message}
                      onChange={handleTicketChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attachment">Attachment (Optional)</Label>
                    <Input id="attachment" type="file" />
                    <p className="text-xs text-muted-foreground">
                      Max file size: 5MB. Supported formats: JPG, PNG, PDF
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      "Submit Ticket"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about Babs VTU</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search FAQs..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {filteredFaqs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <p>{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <HelpCircle className="mb-2 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No results found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try a different search term or browse the categories below
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Can't find what you're looking for?{" "}
                <Button variant="link" className="h-auto p-0" onClick={() => setActiveTab("contact")}>
                  Contact our support team
                </Button>
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>My Support Tickets</CardTitle>
              <CardDescription>View and manage your support tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Payment Failed for MTN Airtime</div>
                      <div className="text-sm text-muted-foreground">Ticket #123456 • Opened 2 days ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-600">
                      In Progress
                    </span>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Reseller Account Upgrade Request</div>
                      <div className="text-sm text-muted-foreground">Ticket #123455 • Opened 5 days ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                      Resolved
                    </span>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">Account Verification Issue</div>
                      <div className="text-sm text-muted-foreground">Ticket #123454 • Opened 2 weeks ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                      Resolved
                    </span>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("contact")}>
                Create New Ticket
              </Button>
              <Button variant="ghost">View All Tickets</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
