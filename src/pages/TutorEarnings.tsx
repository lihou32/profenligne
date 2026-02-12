import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, ArrowDownToLine, Clock, Sparkles, Wallet } from "lucide-react";
import { useTutorStats } from "@/hooks/useData";
import { toast } from "sonner";

export default function TutorEarnings() {
  const { data: stats, isLoading } = useTutorStats();

  const handleWithdraw = () => {
    toast.info("La fonctionnalité de retrait sera bientôt disponible via Stripe Connect !");
  };

  const statCards = [
    { label: "Solde disponible", value: `${stats?.monthlyRevenue || 0}€`, icon: Wallet, color: "from-success to-info" },
    { label: "Total gagné", value: `${(stats?.monthlyRevenue || 0) * 3}€`, icon: TrendingUp, color: "from-primary to-accent" },
    { label: "Cours payés", value: String(stats?.monthlyLessons || 0), icon: DollarSign, color: "from-gold to-warning" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" /> Mes Revenus
          </h1>
          <p className="text-muted-foreground">Suivez vos gains et demandez un retrait</p>
        </div>
        <Button className="rounded-xl gradient-primary text-primary-foreground btn-glow" onClick={handleWithdraw}>
          <ArrowDownToLine className="mr-2 h-4 w-4" /> Demander un retrait
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat, i) => (
          <Card key={stat.label} className="stat-card" style={{ animationDelay: `${i * 80}ms` }}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold font-display mt-1">
                    {isLoading ? <span className="shimmer inline-block h-8 w-16 rounded" /> : stat.value}
                  </p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> Historique des retraits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <ArrowDownToLine className="mx-auto mb-3 h-10 w-10 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground">Aucun retrait pour le moment</p>
            <p className="text-xs text-muted-foreground mt-1">L'intégration Stripe Connect sera bientôt disponible</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
