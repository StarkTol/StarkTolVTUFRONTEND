"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, CreditCard, Headphones, ChevronRight, Star } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  const handleGetStarted = () => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      router.push("/dashboard")
    } else {
      router.push("/register")
    }
  }

  const serviceProviders = [
    { id: 1, name: "MTN", logo: "/mtn.logo.jpg?height=60&width=120" },
    { id: 2, name: "Airtel", logo: "/airtel.logo.jpg?height=60&width=120" },
    { id: 3, name: "Glo", logo: "/glo.logo.jpg?height=60&width=120" },
    { id: 4, name: "9mobile", logo: "/etisalate.logo.jpg?height=60&width=120" },
    { id: 5, name: "DSTV", logo: "/dstv.logo.jpg?height=60&width=120" },
    { id: 6, name: "GOTV", logo: "/gotv.logo.jpg?height=60&width=120" },
    { id: 7, name: "EKEDC", logo: "/ekedc.logo.jpg?height=60&width=120" },
    { id: 8, name: "IKEDC", logo: "/ie.logo.jpg?height=60&width=120" },
    { id: 9, name: "IBEDC", logo: "/ibedc.logo.jpg?height=60&width=120" },
    { id: 10, name: "STARTIMES", logo: "/startime.logo.jpg?height=60&width=120" },
  ]

  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      comment: "StarkTol VTU has made buying airtime and data so easy. The platform is fast and reliable!",
      rating: 5,
      image: "/John Doe.jpg?height=200&width=300",
    },
    {
      id: 2,
      name: "Jane Smith",
      comment: "I love how I can pay all my bills in one place. The auto-refill feature is a game changer!",
      rating: 5,
      image: "/Jane Smith.jpg?height=200&width=300",
    },
    {
      id: 3,
      name: "David Wilson",
      comment: "The best VTU platform I've used. Their customer service is exceptional and transactions are instant.",
      rating: 5,
      image: "/David Wilson.jpg?height=200&width=300",
    },
  ]

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container grid gap-8 md:grid-cols-2 md:items-center">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Automated. Profitable. Powerful.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Your futuristic, fully automated Nigerian VTU platform for all your top-up needs.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" onClick={handleGetStarted}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-lg shadow-xl">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="StarkTol VTU Platform"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Floating tech elements */}
        <div className="absolute -bottom-4 left-1/4 h-8 w-8 animate-pulse rounded-full bg-primary/30"></div>
        <div className="absolute -right-4 top-1/3 h-12 w-12 animate-pulse rounded-full bg-purple-500/30"></div>
        <div className="absolute bottom-1/4 right-1/4 h-6 w-6 animate-pulse rounded-full bg-blue-500/30"></div>
      </section>

      {/* Features Section */}
      <section className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-3xl font-bold">Why Choose StarkTol VTU?</h2>
          <div className="mx-auto h-1 w-20 bg-primary"></div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature Cards */}
          {[{
            icon: <Clock className="h-8 w-8 text-primary" />,
            title: "Instant Transactions",
            description: "Your airtime, data, and bill payments are processed instantly, every time.",
          }, {
            icon: <CreditCard className="h-8 w-8 text-primary" />,
            title: "Secure Payments",
            description: "Multiple secure payment options with end-to-end encryption for all transactions.",
          }, {
            icon: <Headphones className="h-8 w-8 text-primary" />,
            title: "24/7 Support",
            description: "Our AI-powered support system and human agents are available round the clock.",
          }].map((feature, index) => (
            <Card key={index} className="border-2 border-transparent transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="flex flex-col items-center gap-4 p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-center text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Service Providers Section */}
      <section className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-3xl font-bold">Our Service Providers</h2>
          <div className="mx-auto h-1 w-20 bg-primary"></div>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {serviceProviders.map((provider) => (
            <div key={provider.id} className="flex flex-col items-center gap-2 rounded-lg border p-4 transition-all hover:border-primary hover:shadow-md">
              <img src={provider.logo || "/placeholder.svg"} alt={provider.name} className="h-12 w-auto object-contain" />
              <span className="text-center font-medium">{provider.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-purple-600 py-16">
        <div className="container text-center text-white">
          <h2 className="mb-6 text-3xl font-bold">Get Started Today</h2>
          <p className="mb-8 text-lg">
            Join thousands of satisfied customers using StarkTol VTU for their everyday transactions.
          </p>
          <div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
            <Input type="tel" placeholder="Enter your phone number" className="bg-white/10 text-white placeholder:text-white/70" />
            <Button variant="secondary" size="lg">Sign Up Now</Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-3xl font-bold">Testimonials</h2>
          <div className="mx-auto h-1 w-20 bg-primary"></div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="overflow-hidden">
              <div className="aspect-video w-full">
                <img src={testimonial.image || "/placeholder.svg"} alt="Customer" className="h-full w-full object-cover" />
              </div>
              <CardContent className="p-6">
                <div className="mb-2 flex">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 italic text-muted-foreground">"{testimonial.comment}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="container">
        <div className="grid gap-8 md:grid-cols-2">
          {[
            {
              title: "For Users",
              description: "Access all your VTU needs in one place - airtime, data, cable TV, electricity, and more.",
              links: ["Buy Airtime & Data", "Pay Bills", "Wallet Management"],
              href: "/register",
              button: "Create Account"
            },
            {
              title: "For Resellers",
              description: "Start your own VTU business with our powerful reseller tools and competitive pricing.",
              links: ["Branded Website", "Custom Pricing", "API Access"],
              href: "/reseller",
              button: "Become a Reseller"
            }
          ].map((section, idx) => (
            <Card key={idx}>
              <CardContent className="flex flex-col gap-4 p-6">
                <h3 className="text-2xl font-bold">{section.title}</h3>
                <p className="text-muted-foreground">{section.description}</p>
                <ul className="space-y-2">
                  {section.links.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="mt-2" asChild>
                  <Link href={section.href}>{section.button}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
