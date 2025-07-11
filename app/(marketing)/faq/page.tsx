import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  // FAQ categories and questions
  const faqCategories = [
    {
      id: "general",
      title: "General Questions",
      description: "Basic information about StarkTol VTU",
      faqs: [
        {
          question: "What is StarkTol VTU?",
          answer:
            "StarkTol VTU is a virtual top-up platform that allows you to purchase airtime, data bundles, pay for electricity bills, cable TV subscriptions, and more. We provide fast, reliable, and automated services at competitive prices.",
        },
        {
          question: "How do I create an account?",
          answer:
            "To create an account, click on the 'Register' button on the homepage. Fill in your details including your name, email address, phone number, and create a password. Verify your email address and you're good to go!",
        },
        {
          question: "Is StarkTol VTU secure?",
          answer:
            "Yes, StarkTol VTU employs industry-standard security measures to protect your data and transactions. We use encryption for all sensitive information and implement multiple layers of security to ensure your account is safe.",
        },
        {
          question: "What payment methods are accepted?",
          answer:
            "We accept various payment methods including bank transfers, card payments, and USSD transfers. All payments are processed securely through our payment partners.",
        },
      ],
    },
    {
      id: "services",
      title: "Services",
      description: "Information about our services",
      faqs: [
        {
          question: "What services does StarkTol VTU offer?",
          answer:
            "StarkTol VTU offers a wide range of services including airtime recharge, data bundles, cable TV subscriptions (DSTV, GOTV, Startimes), electricity bill payments, exam cards (WAEC, NECO, JAMB), and recharge card printing.",
        },
        {
          question: "How fast are transactions processed?",
          answer:
            "Most transactions are processed instantly. However, in rare cases, it might take up to 5 minutes due to network issues. If your transaction is not completed after 5 minutes, please contact our support team.",
        },
        {
          question: "Can I schedule recurring payments?",
          answer:
            "Yes, you can set up auto-refill for services like airtime and data. This allows you to schedule recurring payments at intervals of your choice or when your balance reaches a certain threshold.",
        },
        {
          question: "What networks are supported for airtime and data?",
          answer:
            "We support all major networks in Nigeria including MTN, Airtel, Glo, and 9mobile for both airtime and data services.",
        },
      ],
    },
    {
      id: "wallet",
      title: "Wallet & Payments",
      description: "Information about wallet and payment options",
      faqs: [
        {
          question: "How do I fund my wallet?",
          answer:
            "You can fund your wallet through bank transfer, card payment, or USSD. Go to the Wallet page and click on 'Fund Wallet' to see all available options.",
        },
        {
          question: "Is there a minimum funding amount?",
          answer: "Yes, the minimum amount you can fund your wallet with is ₦100.",
        },
        {
          question: "How do I transfer funds to another user?",
          answer:
            "To transfer funds to another Babs VTU user, go to your Wallet page, click on 'Transfer Funds', enter the recipient's username or email, the amount, and an optional description.",
        },
        {
          question: "Are there any transaction fees?",
          answer:
            "Most transactions on Babs VTU are free of charge. However, some payment processors may charge a small fee for wallet funding depending on the method used.",
        },
      ],
    },
    {
      id: "reseller",
      title: "Reseller Program",
      description: "Information about becoming a reseller",
      faqs: [
        {
          question: "How do I become a reseller?",
          answer:
            "To become a reseller, go to your dashboard and click on the 'Reseller' section. Follow the instructions to set up your reseller account. You'll need to provide some basic information and agree to our reseller terms and conditions.",
        },
        {
          question: "What are the benefits of being a reseller?",
          answer:
            "As a reseller, you get access to discounted rates, a customizable website, the ability to set your own prices, detailed sales analytics, and the opportunity to create sub-resellers under your account.",
        },
        {
          question: "Can I customize my reseller website?",
          answer:
            "Yes, you can customize your reseller website by going to the 'Reseller > Website' section. You can change the colors, logo, and content to match your brand.",
        },
        {
          question: "How do I get paid as a reseller?",
          answer:
            "Your profits are automatically added to your wallet balance. You can withdraw your earnings to your bank account at any time from the Wallet page.",
        },
      ],
    },
    {
      id: "referrals",
      title: "Referrals & Rewards",
      description: "Information about our referral program",
      faqs: [
        {
          question: "How does the referral program work?",
          answer:
            "You earn a commission whenever someone signs up using your referral link and makes a transaction. The commission rate depends on your tier level. You can find your referral link on the 'Referrals' page.",
        },
        {
          question: "How much can I earn from referrals?",
          answer:
            "Commission rates start at 5% and can go up to 15% depending on your tier level. The more people you refer, the higher your tier level and commission rate.",
        },
        {
          question: "When and how do I get paid for referrals?",
          answer:
            "Referral earnings are automatically added to your wallet balance. You can withdraw your earnings to your bank account at any time from the Wallet page.",
        },
        {
          question: "Is there a limit to how many people I can refer?",
          answer:
            "No, there is no limit to the number of people you can refer. The more people you refer, the more you earn!",
        },
      ],
    },
  ]

  return (
    <div className="container mx-auto max-w-5xl py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-4xl font-bold">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground">Find answers to common questions about Babs VTU</p>
      </div>

      <div className="space-y-8">
        {faqCategories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.title}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`${category.id}-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="mb-4 text-muted-foreground">Still have questions? We're here to help!</p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/contact"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Contact Us
          </a>
          <a
            href="/support"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Support Center
          </a>
        </div>
      </div>
    </div>
  )
}
