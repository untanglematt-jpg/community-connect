import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const domains = [
  {
    name: "Housing",
    icon: "🏠",
    description: "Shelter, eviction prevention, safe living conditions",
  },
  {
    name: "Nutrition",
    icon: "🥗",
    description: "Food assistance, pantries, meal programs",
  },
  {
    name: "Health",
    icon: "❤️",
    description: "Insurance, clinics, mental health support",
  },
  {
    name: "Education",
    icon: "📚",
    description: "Job training, literacy, school enrollment",
  },
  {
    name: "Safety",
    icon: "🛡️",
    description: "Domestic violence support, crisis resources",
  },
  {
    name: "Work",
    icon: "💼",
    description: "Employment, job search, income support",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="px-4 py-16 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
          Find the help you need, today.
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Answer a few simple questions and we'll connect you with local
          organizations that can help — no account needed, completely free.
        </p>
        <Link href="/intake/housing">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg rounded-xl">
            Get Help
          </Button>
        </Link>
        <p className="text-sm text-muted-foreground mt-4">
          Takes about 5 minutes · Anonymous · Free
        </p>
      </section>

      {/* Domain tiles */}
      <section className="px-4 pb-16 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-center text-foreground mb-6">
          We can help with
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {domains.map((domain) => (
            <Card key={domain.name} className="border border-border bg-card">
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{domain.icon}</div>
                <h3 className="font-semibold text-foreground mb-1">
                  {domain.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {domain.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
