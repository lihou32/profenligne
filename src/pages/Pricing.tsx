import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "19",
    period: "/mois",
    description: "Parfait pour commencer",
    features: ["5 cours par mois", "AI Tutor (50 messages)", "Support email", "1 matière"],
    popular: false,
  },
  {
    name: "Pro",
    price: "39",
    period: "/mois",
    description: "Le plus populaire",
    features: ["15 cours par mois", "AI Tutor illimité", "LiveConnect illimité", "Support prioritaire", "Toutes les matières", "Rapports détaillés"],
    popular: true,
  },
  {
    name: "Premium",
    price: "69",
    period: "/mois",
    description: "Pour les plus ambitieux",
    features: ["Cours illimités", "AI Tutor illimité", "LiveConnect illimité", "Support 24/7", "Toutes les matières", "Tuteur dédié", "Suivi personnalisé"],
    popular: false,
  },
];

export default function Pricing() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Choisissez votre formule</h1>
        <p className="mt-2 text-muted-foreground">Des tarifs adaptés à tous les besoins</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`glass-card relative transition-all hover:shadow-xl ${plan.popular ? "border-primary ring-2 ring-primary/20" : ""}`}
          >
            {plan.popular && (
              <Badge className="gradient-primary absolute -top-3 left-1/2 -translate-x-1/2 text-primary-foreground">
                Populaire
              </Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle>{plan.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}€</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${plan.popular ? "gradient-primary text-primary-foreground" : ""}`}
                variant={plan.popular ? "default" : "outline"}
              >
                Commencer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
