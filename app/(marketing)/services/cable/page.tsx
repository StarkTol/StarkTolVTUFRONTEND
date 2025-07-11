import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Tv } from "lucide-react"

export default function CableServicePage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
          <Tv className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Cable TV Subscription</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Renew your cable TV subscriptions instantly with our fast, secure, and reliable service. Support for all major
          cable TV providers in Nigeria.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Instant Activation</CardTitle>
            <CardDescription>Get your subscription activated immediately</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p>
              Our cable TV subscription service ensures that your subscription is activated instantly after payment. No
              delays, no waiting.
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>All Providers Supported</CardTitle>
            <CardDescription>Subscribe to any cable TV provider</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p>We support all major cable TV providers in Nigeria including DSTV, GOTV, StarTimes, and more.</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>All Packages Available</CardTitle>
            <CardDescription>Choose from a wide range of packages</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p>
              Whether you want basic or premium packages, our platform allows you to subscribe to any package offered by
              your provider.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted rounded-xl p-8 mb-16">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Select your cable TV provider</p>
                  <p className="text-muted-foreground">Choose from our comprehensive list of supported providers</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Enter your smart card/IUC number</p>
                  <p className="text-muted-foreground">Provide your decoder number for verification</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Select your preferred package</p>
                  <p className="text-muted-foreground">Choose the subscription package that suits your needs</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Make payment</p>
                  <p className="text-muted-foreground">Complete your payment using any of our secure payment methods</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Instant activation</p>
                  <p className="text-muted-foreground">Your subscription will be activated immediately</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="relative h-[300px] rounded-xl overflow-hidden">
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="Cable TV subscription illustration"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Supported Cable TV Providers</h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[
            { name: "DSTV", packages: "All packages available" },
            { name: "GOTV", packages: "All packages available" },
            { name: "StarTimes", packages: "All packages available" },
            { name: "ShowMax", packages: "All packages available" },
          ].map((provider) => (
            <Card key={provider.name} className="flex flex-col">
              <CardHeader>
                <CardTitle>{provider.name}</CardTitle>
                <CardDescription>{provider.packages}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p>Instant activation after payment. Competitive pricing with no hidden charges.</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/dashboard/cable">Subscribe Now</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Renew Your Cable TV Subscription?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers who trust us for their cable TV subscriptions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard/cable">Subscribe Now</Link>
          </Button>
          <Button variant="outline" size="lg">
            <Link href="/register">Create an Account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
