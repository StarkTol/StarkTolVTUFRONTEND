import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Zap } from "lucide-react"

export default function ElectricityServicePage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
          <Zap className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Electricity Bill Payment</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Pay your electricity bills instantly with our fast, secure, and reliable service. Support for all major
          electricity distribution companies across Nigeria.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Instant Recharge</CardTitle>
            <CardDescription>Get your meter credited immediately</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p>
              Our electricity bill payment service ensures that your meter is credited instantly after payment. No
              delays, no waiting.
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>All Discos Supported</CardTitle>
            <CardDescription>Pay bills for any distribution company</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p>
              We support all electricity distribution companies in Nigeria including EKEDC, IKEDC, AEDC, PHEDC, BEDC,
              and more.
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Prepaid & Postpaid</CardTitle>
            <CardDescription>Support for all meter types</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p>
              Whether you have a prepaid or postpaid meter, our platform allows you to make payments easily and receive
              your token instantly.
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
                  <p className="font-medium">Select your distribution company</p>
                  <p className="text-muted-foreground">
                    Choose from our comprehensive list of supported electricity providers
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Enter your meter number</p>
                  <p className="text-muted-foreground">Provide your meter number for verification</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Enter amount to pay</p>
                  <p className="text-muted-foreground">Specify how much electricity you want to purchase</p>
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
                  <p className="font-medium">Receive token instantly</p>
                  <p className="text-muted-foreground">
                    Your token will be displayed on screen and sent to your email/phone
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="relative h-[300px] rounded-xl overflow-hidden">
            <Image
              src="/How It Works.jpg?height=600&width=800"
              alt="Electricity bill payment illustration"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Supported Distribution Companies</h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {["EKEDC", "IKEDC", "AEDC", "PHEDC", "BEDC", "JED", "KAEDCO", "KEDCO", "YEDC", "EEDC", "IBEDC"].map(
            (disco) => (
              <div key={disco} className="bg-background rounded-lg border p-4 text-center">
                <p className="font-medium">{disco}</p>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Pay Your Electricity Bill?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers who trust us for their electricity bill payments.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard/electricity">Pay Electricity Bill Now</Link>
          </Button>
          <Button variant="outline" size="lg">
            <Link href="/register">Create an Account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
