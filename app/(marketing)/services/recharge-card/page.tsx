import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, CreditCard } from "lucide-react"

export default function RechargeCardServicePage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
          <CreditCard className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Recharge Card Printing</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Generate and print recharge cards for all networks instantly. Perfect for resellers and businesses. Fast,
          secure, and reliable service.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Instant Generation</CardTitle>
            <CardDescription>Get your recharge cards immediately</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p>
              Our recharge card service ensures that your cards are generated instantly after payment. No delays, no
              waiting.
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>All Networks</CardTitle>
            <CardDescription>Support for all major networks</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p>We support all major networks in Nigeria including MTN, Airtel, Glo, and 9mobile.</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Bulk Printing</CardTitle>
            <CardDescription>Generate cards in bulk</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p>
              Generate and print recharge cards in bulk for your business or reselling purposes. Save time and increase
              profits.
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
                  <p className="font-medium">Select the network</p>
                  <p className="text-muted-foreground">Choose from our comprehensive list of supported networks</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Select the denomination</p>
                  <p className="text-muted-foreground">Choose the value of the recharge cards you want to generate</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Enter quantity</p>
                  <p className="text-muted-foreground">Specify how many cards you want to generate</p>
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
                  <p className="font-medium">Generate and print</p>
                  <p className="text-muted-foreground">Your cards will be generated instantly and ready for printing</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="relative h-[300px] rounded-xl overflow-hidden">
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="Recharge card printing illustration"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Available Denominations</h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {["₦100", "₦200", "₦500", "₦1,000", "₦2,000", "₦5,000", "₦10,000", "Custom"].map((amount) => (
            <div key={amount} className="bg-background rounded-lg border p-4 text-center">
              <p className="font-medium">{amount}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Benefits for Resellers</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Increased Profit Margins</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p>
                Enjoy higher profit margins compared to traditional recharge card reselling. Set your own prices and
                maximize your profits.
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>No Inventory Management</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p>Generate cards on-demand. No need to stock physical cards or worry about theft or damage.</p>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Customizable Cards</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p>Add your business name and logo to the recharge cards for brand recognition and customer loyalty.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Generate Recharge Cards?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied resellers who trust us for their recharge card printing needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard/recharge-card">Generate Cards Now</Link>
          </Button>
          <Button variant="outline" size="lg">
            <Link href="/register">Create an Account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
