import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Wifi, Tv, Zap, CreditCard, BookOpen, RefreshCw, Gift, Headphones } from "lucide-react"

export default function ServicesPage() {
  // Services data
  const mainServices = [
    {
      title: "Airtime Top-up",
      description: "Instant airtime recharge for all networks - MTN, Airtel, Glo, 9mobile, and more.",
      icon: Phone,
      color: "bg-blue-500",
    },
    {
      title: "Data Bundles",
      description: "Affordable data plans for all networks with instant activation and longer validity.",
      icon: Wifi,
      color: "bg-green-500",
    },
    {
      title: "Cable TV",
      description: "Pay for DSTV, GOTV, Startimes, and other entertainment subscriptions at competitive rates.",
      icon: Tv,
      color: "bg-purple-500",
    },
    {
      title: "Electricity Bills",
      description: "Pay electricity bills for all distribution companies across Nigeria with instant token delivery.",
      icon: Zap,
      color: "bg-yellow-500",
    },
    {
      title: "Recharge Card Printing",
      description: "Generate and print recharge cards for reselling with customizable designs and denominations.",
      icon: CreditCard,
      color: "bg-red-500",
    },
    {
      title: "Exam Cards",
      description: "Purchase exam scratch cards for WAEC, NECO, JAMB, and other educational institutions.",
      icon: BookOpen,
      color: "bg-indigo-500",
    },
  ]

  const additionalServices = [
    {
      title: "Auto Refill",
      description: "Schedule automatic recharges for airtime and data based on time or balance thresholds.",
      icon: RefreshCw,
    },
    {
      title: "Referral Program",
      description: "Earn commissions by referring friends and family to use our platform.",
      icon: Gift,
    },
    {
      title: "24/7 Customer Support",
      description: "Get help anytime with our dedicated customer support team and AI chat assistant.",
      icon: Headphones,
    },
  ]

  // Service providers
  const serviceProviders = [
    { name: "MTN", category: "Telecom", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Airtel", category: "Telecom", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Glo", category: "Telecom", logo: "/placeholder.svg?height=60&width=120" },
    { name: "9mobile", category: "Telecom", logo: "/placeholder.svg?height=60&width=120" },
    { name: "DSTV", category: "Cable TV", logo: "/placeholder.svg?height=60&width=120" },
    { name: "GOTV", category: "Cable TV", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Startimes", category: "Cable TV", logo: "/placeholder.svg?height=60&width=120" },
    { name: "EKEDC", category: "Electricity", logo: "/placeholder.svg?height=60&width=120" },
    { name: "IKEDC", category: "Electricity", logo: "/placeholder.svg?height=60&width=120" },
    { name: "AEDC", category: "Electricity", logo: "/placeholder.svg?height=60&width=120" },
    { name: "WAEC", category: "Education", logo: "/placeholder.svg?height=60&width=120" },
    { name: "JAMB", category: "Education", logo: "/placeholder.svg?height=60&width=120" },
  ]

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Our{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Comprehensive VTU services designed to make your digital life easier, faster, and more affordable.
            </p>
            <Button size="lg" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="container">
        <h2 className="mb-12 text-center text-3xl font-bold">Core Services</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {mainServices.map((service, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className={`flex items-center gap-4 p-6 ${service.color} text-white`}>
                  <service.icon className="h-8 w-8" />
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </div>
                <div className="p-6">
                  <p className="mb-4 text-muted-foreground">{service.description}</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/register">Try Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Additional Services */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">Additional Features</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {additionalServices.map((service, index) => (
              <Card key={index}>
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <service.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Providers */}
      <section className="container">
        <h2 className="mb-12 text-center text-3xl font-bold">Our Service Providers</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {serviceProviders.map((provider, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 rounded-lg border p-4 transition-all hover:border-primary hover:shadow-md"
            >
              <img
                src={provider.logo || "/placeholder.svg"}
                alt={provider.name}
                className="h-12 w-auto object-contain"
              />
              <span className="text-center font-medium">{provider.name}</span>
              <span className="text-xs text-muted-foreground">{provider.category}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Reseller Services */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold">Reseller Services</h2>
              <p className="mb-6 text-muted-foreground">
                Start your own VTU business with our comprehensive reseller platform. We provide all the tools you need
                to succeed.
              </p>
              <ul className="mb-8 space-y-4">
                <li className="flex items-start gap-2">
                  <div className="mt-1 rounded-full bg-primary/20 p-1">
                    <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>Branded website with your own domain</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 rounded-full bg-primary/20 p-1">
                    <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>Customizable pricing for all services</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 rounded-full bg-primary/20 p-1">
                    <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>API access for integration with your existing systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 rounded-full bg-primary/20 p-1">
                    <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>Sub-reseller management tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 rounded-full bg-primary/20 p-1">
                    <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>Comprehensive transaction reports and analytics</span>
                </li>
              </ul>
              <Button asChild>
                <Link href="/reseller">Become a Reseller</Link>
              </Button>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg md:aspect-auto">
              <img
                src="/placeholder.svg?height=600&width=600"
                alt="Reseller Dashboard"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-purple-600 py-16">
        <div className="container text-center text-white">
          <h2 className="mb-6 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg">
            Join thousands of satisfied customers using Babs VTU for their everyday digital services.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/register">Create an Account</Link>
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10" size="lg" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
