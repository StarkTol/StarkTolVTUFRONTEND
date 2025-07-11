import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function MarketingFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                StarkTol VTU
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A futuristic, robotic, and fully automated Nigerian VTU platform for all your top-up needs.
            </p>
            <div className="flex gap-4">
              <Link href="https://facebook.com" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://twitter.com" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://instagram.com" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://youtube.com" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services/airtime" className="text-muted-foreground hover:text-primary">
                  Airtime Top-up
                </Link>
              </li>
              <li>
                <Link href="/services/data" className="text-muted-foreground hover:text-primary">
                  Data Bundles
                </Link>
              </li>
              <li>
                <Link href="/services/cable" className="text-muted-foreground hover:text-primary">
                  Cable TV Subscription
                </Link>
              </li>
              <li>
                <Link href="/services/electricity" className="text-muted-foreground hover:text-primary">
                  Electricity Bills
                </Link>
              </li>
              <li>
                <Link href="/services/exam-cards" className="text-muted-foreground hover:text-primary">
                  Exam Cards
                </Link>
              </li>
              <li>
                <Link href="/services/recharge-card" className="text-muted-foreground hover:text-primary">
                  Recharge Card Printing
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Subscribe to our newsletter</h3>
            <p className="text-sm text-muted-foreground">Get the latest updates and offers directly to your inbox.</p>
            <div className="flex flex-col gap-2">
              <Input placeholder="Enter your email" type="email" />
              <Button>Subscribe</Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Contact us:</p>
              <p>WhatsApp/Phone: +234-9155130506</p>
              <p>Email: starktol@outlook.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} StarkTol VTU. All rights reserved.
          </p>
          <p className="text-center text-sm text-muted-foreground">Designed with ❤️ by StarkTol VTU Team</p>
        </div>
      </div>
    </footer>
  )
}
