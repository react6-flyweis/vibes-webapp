import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";
import {
  Crown,
  Calendar,
  CreditCard,
  Rocket,
  Star,
  Check,
  ShoppingBag,
  Users,
} from "lucide-react";

export default function VendorMigration() {
  return (
    <div className="">
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 p-1 px-2 bg-gradient-cta">
            <Crown className="mr-2 h-4 w-4" />
            Limited-Time Migration Offer
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Bring Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-cta">
              Etsy, AliExpress, Temu,Amazon
            </span>{" "}
            Store to Vibes
          </h1>

          <p className="mt-4 text-gray-600 text-lg">
            The easiest way to reach new customers, get booked for real-world
            events, and grow your business.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/vendor-onboarding-portal"
              className="inline-flex items-center"
            >
              <Button className="bg-gradient-cta">Start My Migration</Button>
            </Link>

            <Link to="/vendor-dashboard">
              <Button variant="outline" className="bg-transparent">
                View Vendor Dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex justify-center gap-8 text-sm text-gray-500">
            <div>⭐ 4.9/5 Migration Success Rate</div>
            <div>👥 2,847+ Vendors Migrated</div>
            <div>⚡ Average Setup: 15 Minutes</div>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-semibold">Why Switch to Vibes?</h2>
          <p className="mt-2 text-sm text-gray-500">
            Everything you love about your current platform, plus the tools you
            need to scale beyond online sales.
          </p>

          <div className="py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: "import",
                title: "Import your Etsy listings in 1 click",
                icon: <ShoppingBag className="h-6 w-6 text-white" />,
                iconBg: "bg-blue-500",
                description:
                  "Seamlessly transfer all your products, descriptions, photos, and pricing. No manual re-entry required.",
                bullets: [
                  "Automatic product import",
                  "SEO optimization included",
                ],
              },
              {
                id: "bookings",
                title:
                  "Get booked for birthdays, brand launches, weddings, and more",
                icon: <Calendar className="h-6 w-6 text-white" />,
                iconBg: "bg-gradient-cta",
                description:
                  "Connect with customers planning real events. Turn online sales into in-person bookings and experiences.",
                bullets: [
                  "Event marketplace access",
                  "Booking management tools",
                ],
              },
              {
                id: "crm",
                title:
                  "Access a full vendor CRM, order system, and payment tools",
                icon: <CreditCard className="h-6 w-6 text-white" />,
                iconBg: "bg-green-500",
                description:
                  "Professional business tools that grow with you. Manage customers, track orders, and process payments seamlessly.",
                bullets: [
                  "AI-powered CRM system",
                  "Integrated payment processing",
                ],
              },
              {
                id: "crowdfund",
                title: "Run crowdfunding campaigns to launch new ideas",
                icon: <Rocket className="h-6 w-6 text-white" />,
                iconBg: "bg-orange-500",
                description:
                  "Test new products with built-in crowdfunding tools. Gauge demand and secure pre-orders before production.",
                bullets: [
                  "Vibes LaunchFund integration",
                  "Pre-order management",
                ],
              },
              {
                id: "discover",
                title:
                  "Get discovered by customers looking for event-ready creators",
                icon: <Star className="h-6 w-6 text-white" />,
                iconBg: "bg-purple-500",
                description:
                  "Join a marketplace where customers actively search for vendors and creators for their special events.",
                bullets: ["Event-focused discovery", "AI-powered matching"],
              },
              {
                id: "analytics",
                title: "Advanced Analytics & Business Intelligence",
                icon: <Users className="h-6 w-6 text-white" />,
                iconBg: "bg-emerald-500",
                description:
                  "Understand your customers better with detailed analytics, sales forecasting, and market insights.",
                bullets: [
                  "Customer behavior analytics",
                  "Revenue optimization tools",
                ],
              },
            ].map((card) => (
              <Card
                key={card.id}
                className="text-center bg-white border-gray-200"
              >
                <div className="pt-5 w-full flex justify-center">
                  <div
                    className={`h-12 w-12 rounded-md ${card.iconBg} flex items-center justify-center`}
                  >
                    {card.icon}
                  </div>
                </div>
                <CardContent>
                  <h3 className="mt-4  font-semibold">{card.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {card.description}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-gray-700">
                    {card.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-500 mt-1" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-cta text-white rounded-lg">
          <div className="max-w-6xl mx-auto text-center">
            <Badge className="mb-4 p-1 px-3 bg-white/20">
              <Crown className="mr-2 h-4 w-4" /> Exclusive Migration Bonus
            </Badge>

            <h2 className="text-4xl font-bold">Limited-Time Offer</h2>
            <p className="mt-2 text-lg opacity-90">
              Get everything you need to succeed on Vibes, completely free for
              your first 3 months.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg bg-white/10 border border-white/10">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mx-auto">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold">3 months FREE</h3>
                <p className="mt-2 text-sm opacity-90">
                  Full access to our vendor marketplace, event booking system,
                  and business tools.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-white/10 border border-white/10">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mx-auto">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold">$50</h3>
                <p className="mt-2 text-sm opacity-90">
                  in ad credits to boost discoverability.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-white/10 border border-white/10">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mx-auto">
                  <Crown className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold">Early vendor badge</h3>
                <p className="mt-2 text-sm opacity-90">
                  Stand out as a founding member with special badges and
                  priority placement.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Link to="/vibes-fund" className="inline-flex items-center">
                <Button className="bg-white text-black">
                  Start My Migration
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-sm opacity-80">
              No setup fees • No long-term contracts • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      <section className=" bg-slate-100">
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradientc-cta text-black rounded-lg">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Already on Etsy? Let Vibes work for you too.
            </h2>

            <p className="mt-4 text-gray-700 text-lg max-w-3xl mx-auto">
              You don't have to choose. Many vendors keep their Etsy store and
              use Vibes to expand into event bookings and grow their business.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  name: "Sarah's Handmade",
                  title: "Wedding Accessories",
                  quote:
                    '"I kept my Etsy store but added Vibes for wedding bookings. Now 60% of my revenue comes from event clients I found on Vibes."',
                  foot: "Automatic product import",
                },
                {
                  name: "Modern Ceramics Co",
                  title: "Custom Pottery",
                  quote:
                    '"The event marketplace opened up corporate clients I never would have reached. My Etsy sales stayed strong while I doubled my income."',
                  foot: "2x income with dual platforms",
                },
                {
                  name: "Vintage Finds",
                  title: "Event Decor",
                  quote:
                    '"Vibes\' crowdfunding tools helped me test new product lines before investing. Now I use both platforms strategically."',
                  foot: "Zero-risk product launches",
                },
              ].map((t) => (
                <Card key={t.name} className="bg-white border-gray-200">
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700">
                        {t.name
                          .split(" ")
                          .slice(0, 2)
                          .map((n) => n[0])
                          .join("")}
                      </div>

                      <div className="text-left">
                        <div className="font-semibold">{t.name}</div>
                        <div className="text-sm text-gray-500">{t.title}</div>
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-gray-700">{t.quote}</p>

                    <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-400" />
                      <span>{t.foot}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to grow beyond online sales?
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Join thousands of vendors who've successfully expanded their reach
            and revenue with Vibes.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link to="/vibes-fund" className="inline-flex items-center">
              <Button className="bg-gradient-cta">Start My Migration</Button>
            </Link>

            <Link to="/vendor-dashboard">
              <Button variant="outline" className="bg-transparent">
                View Vendor Dashboard
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Questions? Chat with our migration team • Migration takes 15 minutes
            or less
          </p>
        </div>
      </section>
    </div>
  );
}
