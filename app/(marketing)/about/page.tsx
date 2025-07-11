import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Clock, Shield, Users } from "lucide-react"

export default function AboutPage() {
  // Team members data
  const teamMembers = [
    {
      name: "Babatope Olaniyi",
      role: "Founder & CEO",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Visionary entrepreneur with over 10 years of experience in the telecom and fintech industry.",
    },
    {
      name: "Sarah Johnson",
      role: "Chief Technology Officer",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Tech expert with a passion for building scalable and secure financial systems.",
    },
    {
      name: "Michael Adeyemi",
      role: "Head of Operations",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Operations specialist ensuring smooth service delivery and customer satisfaction.",
    },
    {
      name: "Chioma Okafor",
      role: "Customer Success Manager",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Dedicated to providing exceptional support and ensuring client satisfaction.",
    },
  ]

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              About{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                StarkTol VTU
              </span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              We're on a mission to revolutionize how Nigerians access digital services through our automated,
              profitable, and powerful VTU platform.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="container">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="mb-6 text-3xl font-bold">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                StarkTol VTU was founded in 2020 with a simple yet powerful vision: to create a fully automated VTU platform
                that makes digital services accessible to all Nigerians.
              </p>
              <p>
                What started as a small operation serving a few hundred customers has grown into a robust platform
                processing thousands of transactions daily across Nigeria.
              </p>
              <p>
                Our journey has been marked by continuous innovation, listening to our customers, and adapting to the
                ever-changing digital landscape. Today, we're proud to be one of Nigeria's most reliable VTU service
                providers.
              </p>
              <p>
                As we look to the future, we remain committed to our core values of reliability, innovation, and
                customer satisfaction, while expanding our services to reach more Nigerians.
              </p>
            </div>
            <Button className="mt-6" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <img
              src="/our.jpg?height=600&width=600"
              alt="StarkTol VTU Team"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">Our Core Values</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Reliability</h3>
                <p className="text-muted-foreground">
                  We pride ourselves on providing consistent, dependable service that our customers can count on 24/7.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Security</h3>
                <p className="text-muted-foreground">
                  We implement the highest security standards to protect our customers' data and financial transactions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Excellence</h3>
                <p className="text-muted-foreground">
                  We strive for excellence in everything we do, from customer service to platform performance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Community</h3>
                <p className="text-muted-foreground">
                  We believe in building a community of users and resellers who grow together and support each other.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="container">
        <h2 className="mb-12 text-center text-3xl font-bold">Meet Our Team</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <Card key={index}>
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="mb-1 text-xl font-semibold">{member.name}</h3>
                <p className="mb-4 text-sm text-primary">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-purple-600 py-16">
        <div className="container text-center text-white">
          <h2 className="mb-6 text-3xl font-bold">Join Our Growing Community</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg">
            Whether you're a customer looking for reliable VTU services or a reseller wanting to start your own
            business, we have the perfect solution for you.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/register">Create an Account</Link>
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10" size="lg" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
