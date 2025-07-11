import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, GraduationCap } from "lucide-react"

export default function ExamCardsServicePage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
          <GraduationCap className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Exam Cards & PIN Purchase</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Purchase examination cards and PINs instantly for WAEC, NECO, JAMB, and other educational institutions. Fast,
          secure, and reliable service.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Instant Delivery</CardTitle>
            <CardDescription>Get your exam cards and PINs immediately</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p>
              Our exam card service ensures that your PINs and access codes are delivered instantly after payment. No
              delays, no waiting.
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>All Exam Bodies</CardTitle>
            <CardDescription>Support for all major examination bodies</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p>We support all major examination bodies in Nigeria including WAEC, NECO, JAMB, NABTEB, and more.</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Secure & Reliable</CardTitle>
            <CardDescription>100% genuine cards and PINs</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p>
              All our exam cards and PINs are sourced directly from the official examination bodies, ensuring 100%
              authenticity and reliability.
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
                  <p className="font-medium">Select the examination body</p>
                  <p className="text-muted-foreground">
                    Choose from our comprehensive list of supported examination bodies
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Select the type of card/PIN</p>
                  <p className="text-muted-foreground">Choose the specific card or PIN you need</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Enter quantity</p>
                  <p className="text-muted-foreground">Specify how many cards or PINs you want to purchase</p>
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
                  <p className="font-medium">Receive instantly</p>
                  <p className="text-muted-foreground">
                    Your cards/PINs will be displayed on screen and sent to your email/phone
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="relative h-[300px] rounded-xl overflow-hidden">
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="Exam cards illustration"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Supported Examination Bodies</h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[
            { name: "WAEC", description: "Result Checker, Registration" },
            { name: "NECO", description: "Result Checker, Registration" },
            { name: "JAMB", description: "UTME Registration, DE Registration" },
            { name: "NABTEB", description: "Result Checker, Registration" },
          ].map((exam) => (
            <Card key={exam.name} className="flex flex-col">
              <CardHeader>
                <CardTitle>{exam.name}</CardTitle>
                <CardDescription>{exam.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p>Instant delivery after payment. Competitive pricing with no hidden charges.</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/dashboard/exam-cards">Purchase Now</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Purchase Exam Cards?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers who trust us for their examination cards and PINs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard/exam-cards">Purchase Now</Link>
          </Button>
          <Button variant="outline" size="lg">
            <Link href="/register">Create an Account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
