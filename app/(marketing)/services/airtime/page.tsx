import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Percent, Users } from "lucide-react"

export default function AirtimePage() {
  // Network providers
  const providers = [
    { name: "MTN", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Airtel", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Glo", logo: "/placeholder.svg?height=60&width=120" },
    { name: "9mobile", logo: "/placeholder.svg?height=60&width=120" },
  ]

  // Benefits
  const benefits = [
    {
      title: "Instant Delivery",
      description: "Airtime is delivered to the recipient's phone instantly after payment.",
      icon: Clock,
    },
    {
      title: "Discounted Rates",
      description: "Enjoy up to 3% discount on all airtime purchases.",
      icon: Percent,
    },
    {
      title: "Bulk Purchase",
      description: "Buy airtime for multiple numbers at once with our bulk purchase feature.",
      icon: Users,
    },
  ]

  // How it works steps
  const steps = [
    {
      title: "Select Network",
      description: "Choose the network provider of the recipient's phone number.",
    },
    {
      title: "Enter Phone Number",
      description: "Input the recipient's phone number correctly.",
    },
    {
      title: "Enter Amount",
      description: "Specify the amount of airtime you want to purchase.",
    },
    {
      title: "Make Payment",
      description: "Complete the transaction using your wallet balance or other payment methods.",
    },
  ]

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Airtime{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Top-up</span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Instantly recharge airtime for all networks in Nigeria at the best rates
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Login to Purchase</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Why Choose Our Airtime Service?</h2>
          <p className="mb-12 text-xl text-muted-foreground">
            We offer the best airtime recharge experience with amazing benefits
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Networks */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">Supported Networks</h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {providers.map((provider, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-4 rounded-lg border bg-card p-6 text-center shadow-sm transition-all hover:shadow-md"
              >
                <img
                  src={provider.logo || "/placeholder.svg"}
                  alt={provider.name}
                  className="h-16 w-auto object-contain"
                />
                <h3 className="text-xl font-semibold">{provider.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          <div className="relative">
            <div className="absolute left-12 top-0 h-full w-0.5 bg-muted md:left-16"></div>
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="relative flex gap-8">
                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground md:h-12 md:w-12">
                    <span className="text-sm font-bold md:text-base">{index + 1}</span>
                  </div>
                  <div className="pt-1">
                    <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Competitive Pricing</h2>
            <p className="mb-8 text-xl text-muted-foreground">
              We offer the best rates for airtime recharge across all networks
            </p>

            <div className="overflow-hidden rounded-lg border bg-card shadow">
              <div className="grid grid-cols-3 border-b bg-muted/50 p-4 font-medium">
                <div>Network</div>
                <div>Regular Price</div>
                <div>Our Price</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-3 items-center p-4">
                  <div>MTN</div>
                  <div>₦100</div>
                  <div className="font-medium text-primary">₦97</div>
                </div>
                <div className="grid grid-cols-3 items-center p-4">
                  <div>Airtel</div>
                  <div>₦100</div>
                  <div className="font-medium text-primary">₦97</div>
                </div>
                <div className="grid grid-cols-3 items-center p-4">
                  <div>Glo</div>
                  <div>₦100</div>
                  <div className="font-medium text-primary">₦97</div>
                </div>
                <div className="grid grid-cols-3 items-center p-4">
                  <div>9mobile</div>
                  <div>₦100</div>
                  <div className="font-medium text-primary">₦97</div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">* Prices may vary based on promotions and discounts</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container">
        <h2 className="mb-12 text-center text-3xl font-bold">What Our Customers Say</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="h-5 w-5 fill-yellow-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 italic text-muted-foreground">
                "I've been using Babs VTU for airtime purchases for over a year now. The service is fast, reliable, and
                the discounts are amazing!"
              </p>
              <div className="font-medium">John Doe</div>
              <div className="text-sm text-muted-foreground">Lagos, Nigeria</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="h-5 w-5 fill-yellow-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 italic text-muted-foreground">
                "The bulk purchase feature is a game-changer for my business. I can recharge all my staff's phones at
                once with just a few clicks."
              </p>
              <div className="font-medium">Jane Smith</div>
              <div className="text-sm text-muted-foreground">Abuja, Nigeria</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="h-5 w-5 fill-yellow-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 italic text-muted-foreground">
                "Customer support is excellent! I had an issue with a transaction, and it was resolved within minutes.
                Highly recommended!"
              </p>
              <div className="font-medium">Michael Johnson</div>
              <div className="text-sm text-muted-foreground">Port Harcourt, Nigeria</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-purple-600 py-16">
        <div className="container text-center text-white">
          <h2 className="mb-6 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg">
            Join thousands of satisfied customers using Babs VTU for their airtime needs.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/register">Create an Account</Link>
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10" size="lg" asChild>
              <Link href="/login">Login to Purchase</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-lg font-medium">How long does it take for airtime to be delivered?</h3>
              <p className="text-muted-foreground">
                Airtime is delivered instantly to the recipient's phone number after successful payment.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-lg font-medium">What is the minimum amount I can purchase?</h3>
              <p className="text-muted-foreground">
                The minimum amount for airtime purchase is ₦50, while the maximum is ₦50,000 per transaction.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-lg font-medium">Can I schedule airtime purchases?</h3>
              <p className="text-muted-foreground">
                Yes, you can schedule recurring airtime purchases using our Auto-Refill feature.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-lg font-medium">What payment methods are accepted?</h3>
              <p className="text-muted-foreground">
                We accept payments through wallet balance, bank transfer, card payments, and USSD.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
