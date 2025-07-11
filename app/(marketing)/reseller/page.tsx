import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Users, ArrowRight, BarChart3, Globe, Tag } from "lucide-react"

export default function ResellerProgramPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
          <Users className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Become a Reseller</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Join our reseller program and start your own VTU business. Earn substantial commissions on every transaction
          with our reliable and easy-to-use platform.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>High Commission Rates</CardTitle>
            <CardDescription>Earn more with every transaction</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p>
              Enjoy competitive commission rates on all services. The more you sell, the higher your commission rate
              becomes.
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>White Label Solution</CardTitle>
            <CardDescription>Build your own brand</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p>Get your own branded website and mobile app. Customize it with your logo, colors, and domain name.</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>API Access</CardTitle>
            <CardDescription>Integrate with your existing systems</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p>
              Access our robust API to integrate our services with your existing systems or build custom applications.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted rounded-xl p-8 mb-16">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Why Become a Reseller?</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Low startup cost</p>
                  <p className="text-muted-foreground">Start your VTU business with minimal investment</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Passive income</p>
                  <p className="text-muted-foreground">Earn money 24/7, even while you sleep</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Flexible working hours</p>
                  <p className="text-muted-foreground">Work from anywhere, anytime</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Comprehensive support</p>
                  <p className="text-muted-foreground">Get technical and marketing support to grow your business</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Scalable business model</p>
                  <p className="text-muted-foreground">Grow your business by recruiting sub-resellers</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="relative h-[300px] rounded-xl overflow-hidden">
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="Reseller program illustration"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Reseller Tiers</h2>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Bronze</CardTitle>
              <CardDescription>For new resellers</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="text-3xl font-bold">5% Commission</div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Basic reseller dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Email support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Access to all services</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/register?type=reseller">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col border-primary">
            <CardHeader>
              <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full w-fit mb-2">
                Most Popular
              </div>
              <CardTitle>Silver</CardTitle>
              <CardDescription>For growing resellers</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="text-3xl font-bold">10% Commission</div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Advanced reseller dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Custom branded website</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Sub-reseller management</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/register?type=reseller&tier=silver">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Gold</CardTitle>
              <CardDescription>For established resellers</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="text-3xl font-bold">15% Commission</div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Premium reseller dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>24/7 dedicated support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Custom branded website & app</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Advanced API access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Multi-level sub-resellers</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/register?type=reseller&tier=gold">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">How to Get Started</h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">1. Register</h3>
            <p className="text-muted-foreground">Create a reseller account and choose your tier</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <Tag className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">2. Fund Wallet</h3>
            <p className="text-muted-foreground">Add funds to your reseller wallet</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <Globe className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">3. Setup</h3>
            <p className="text-muted-foreground">Configure your website and services</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">4. Start Selling</h3>
            <p className="text-muted-foreground">Begin selling services and earning commissions</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your VTU Business?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of successful resellers who are making money with our platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/register?type=reseller">
              Become a Reseller <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg">
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
