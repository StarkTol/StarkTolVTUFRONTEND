import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Clock, Percent, Zap } from "lucide-react"

export default function DataPage() {
  // Network providers
  const providers = [
    { name: "MTN", logo: "/mtn.logo.jpg?height=60&width=120" },
    { name: "Airtel", logo: "/airtel.logo.jpg?height=60&width=120" },
    { name: "Glo", logo: "/glo.logo.jpg?height=60&width=120" },
    { name: "9mobile", logo: "/etisalate.logo.jpg?height=60&width=120" },
  ]

  // Benefits
  const benefits = [
    {
      title: "Instant Activation",
      description: "Data bundles are activated on the recipient's phone instantly after payment.",
      icon: Clock,
    },
    {
      title: "Best Prices",
      description: "Enjoy the most competitive data bundle prices in Nigeria.",
      icon: Percent,
    },
    {
      title: "Longer Validity",
      description: "Our data plans come with extended validity periods.",
      icon: Zap,
    },
  ]

  // Popular data plans
  const dataPlans = [
    {
      network: "MTN",
      plans: [
        { name: "1GB", validity: "30 Days", price: "₦300" },
        { name: "2GB", validity: "30 Days", price: "₦600" },
        { name: "5GB", validity: "30 Days", price: "₦1,500" },
        { name: "10GB", validity: "30 Days", price: "₦3,000" },
      ],
    },
    {
      network: "Airtel",
      plans: [
        { name: "1GB", validity: "30 Days", price: "₦300" },
        { name: "2GB", validity: "30 Days", price: "₦600" },
        { name: "5GB", validity: "30 Days", price: "₦1,500" },
        { name: "10GB", validity: "30 Days", price: "₦3,000" },
      ],
    },
    {
      network: "Glo",
      plans: [
        { name: "1GB", validity: "30 Days", price: "₦300" },
        { name: "2GB", validity: "30 Days", price: "₦600" },
        { name: "5GB", validity: "30 Days", price: "₦1,500" },
        { name: "10GB", validity: "30 Days", price: "₦3,000" },
      ],
    },
    {
      network: "9mobile",
      plans: [
        { name: "1GB", validity: "30 Days", price: "₦300" },
        { name: "2GB", validity: "30 Days", price: "₦600" },
        { name: "5GB", validity: "30 Days", price: "₦1,500" },
        { name: "10GB", validity: "30 Days", price: "₦3,000" },
      ],
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
      title: "Select Data Plan",
      description: "Choose from our wide range of data plans.",
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
              Data{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Bundles</span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Affordable data plans for all networks with instant activation and longer validity
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
          <h2 className="mb-4 text-3xl font-bold">Why Choose Our Data Service?</h2>
          <p className="mb-12 text-xl text-muted-foreground">
            We offer the best data bundle experience with amazing benefits
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

      {/* Popular Data Plans */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">Popular Data Plans</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {dataPlans.map((network, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="bg-primary p-4 text-primary-foreground">
                  <h3 className="text-xl font-bold">{network.network}</h3>
                </div>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {network.plans.map((plan, planIndex) => (
                      <div key={planIndex} className="flex items-center justify-between p-4">
                        <div>
                          <div className="font-medium">{plan.name}</div>
                          <div className="text-sm text-muted-foreground">{plan.validity}</div>
                        </div>
                        <div className="font-bold text-primary">{plan.price}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4">
                    <Button className="w-full" asChild>
                      <Link href="/register">Buy Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">
                View All Data Plans <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Supported Networks */}
      <section className="container">
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
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-16">
        <div className="container">
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
                "The data plans are so affordable! I get more data for less money compared to buying directly from my
                network provider."
              </p>
              <div className="font-medium">Sarah Johnson</div>
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
                "I love how fast the data gets activated. Within seconds of making payment, I receive the activation
                message."
              </p>
              <div className="font-medium">David Okafor</div>
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
                "As a business owner, I buy data for all my staff monthly. The bulk purchase feature makes this process
                so easy and cost-effective."
              </p>
              <div className="font-medium">Chioma Eze</div>
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
            Join thousands of satisfied customers using Babs VTU for their data needs.
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
              <h3 className="mb-2 text-lg font-medium">How long does it take for data to be activated?</h3>
              <p className="text-muted-foreground">
                Data bundles are activated instantly after successful payment, and you'll receive an SMS confirmation.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-lg font-medium">Do data plans roll over when I renew?</h3>
              <p className="text-muted-foreground">
                Yes, for most networks, unused data will roll over when you renew the same plan before expiration.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-lg font-medium">Can I gift data to someone else?</h3>
              <p className="text-muted-foreground">
                Yes, you can purchase data for any phone number, not just your own.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-lg font-medium">What happens if my data doesn't get activated?</h3>
              <p className="text-muted-foreground">
                In the rare case that your data isn't activated, our customer support team is available 24/7 to resolve
                the issue promptly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
