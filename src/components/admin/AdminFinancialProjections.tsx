import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { Euro, TrendingUp, Users, Gift } from "lucide-react";

const COLORS = {
  purple: "hsl(265, 80%, 65%)",
  pink: "hsl(330, 85%, 60%)",
  blue: "hsl(220, 80%, 60%)",
  green: "hsl(150, 70%, 50%)",
  orange: "hsl(30, 90%, 55%)",
  teal: "hsl(180, 60%, 50%)",
};

// Revenue 1 — Lessons data
const lessonsRevenue = [
  { duration: 20, lessons: 9500, hours: 3167, price: 15, ca: 142500, commission: 14250 },
  { duration: 30, lessons: 11500, hours: 5750, price: 25, ca: 287500, commission: 28750 },
  { duration: 45, lessons: 8500, hours: 6375, price: 30, ca: 255000, commission: 25500 },
  { duration: 60, lessons: 14500, hours: 14500, price: 35, ca: 507500, commission: 50750 },
  { duration: 90, lessons: 6500, hours: 9750, price: 50, ca: 325000, commission: 32500 },
  { duration: 120, lessons: 2500, hours: 5000, price: 65, ca: 162500, commission: 16250 },
];

const totalLessons = lessonsRevenue.reduce((s, r) => s + r.lessons, 0);
const totalCA = lessonsRevenue.reduce((s, r) => s + r.ca, 0);
const totalCommission = lessonsRevenue.reduce((s, r) => s + r.commission, 0);

// Revenue 2 — Subscriptions
const subscriptionMonthly = 8000 * 9.99;
const subscriptionAnnual = subscriptionMonthly * 12;

// Total
const annualCommission = totalCommission * 12;
const totalAnnual = annualCommission + subscriptionAnnual;

const revenueSplit = [
  { name: "Commissions cours", value: annualCommission },
  { name: "Abonnements", value: subscriptionAnnual },
];

const loyaltyPacks = [
  { pack: "50€", bonus: "5€", total: "55€" },
  { pack: "70€", bonus: "7,50€", total: "77,50€" },
  { pack: "100€", bonus: "15€", total: "115€" },
  { pack: "150€", bonus: "25€", total: "175€" },
];

const barData = lessonsRevenue.map((r) => ({
  name: `${r.duration} min`,
  cours: r.lessons,
  commission: r.commission,
}));

const PIE_COLORS = [COLORS.purple, COLORS.pink];

const fmt = (v: number) => v.toLocaleString("fr-FR") + " €";

function StatMini({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <Card className="glass-card">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="gradient-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminFinancialProjections() {
  return (
    <div className="space-y-4">
      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatMini icon={Euro} label="CA mensuel (1% marché)" value={fmt(totalCA)} />
        <StatMini icon={TrendingUp} label="Revenus annuels totaux" value={fmt(totalAnnual)} />
        <StatMini icon={Users} label="Abonnés projetés" value="8 000" />
        <StatMini icon={Gift} label="Commission (10%)" value={fmt(totalCommission) + "/mois"} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="lessons">Détail cours</TabsTrigger>
          <TabsTrigger value="loyalty">Fidélisation</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-4 grid gap-4 md:grid-cols-2">
          {/* Revenue split pie */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Répartition revenus annuels</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={revenueSplit}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {revenueSplit.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmt(v)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Commission bar by duration */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Commission par durée de cours</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={barData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(270 18% 24%)" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(270 12% 60%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(270 12% 60%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`} />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Bar dataKey="commission" fill={COLORS.purple} radius={[6, 6, 0, 0]} maxBarSize={40} name="Commission" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lessons detail */}
        <TabsContent value="lessons" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Détail des revenus par durée de cours (mensuel)</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="p-3">Durée</th>
                    <th className="p-3 text-right">Cours/mois</th>
                    <th className="p-3 text-right">Heures</th>
                    <th className="p-3 text-right">Prix</th>
                    <th className="p-3 text-right">CA</th>
                    <th className="p-3 text-right">Commission (10%)</th>
                  </tr>
                </thead>
                <tbody>
                  {lessonsRevenue.map((r) => (
                    <tr key={r.duration} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-3 font-medium">{r.duration} min</td>
                      <td className="p-3 text-right">{r.lessons.toLocaleString("fr-FR")}</td>
                      <td className="p-3 text-right">{r.hours.toLocaleString("fr-FR")}</td>
                      <td className="p-3 text-right">{fmt(r.price)}</td>
                      <td className="p-3 text-right">{fmt(r.ca)}</td>
                      <td className="p-3 text-right font-semibold">{fmt(r.commission)}</td>
                    </tr>
                  ))}
                  <tr className="bg-muted/30 font-bold">
                    <td className="p-3">TOTAL</td>
                    <td className="p-3 text-right">{totalLessons.toLocaleString("fr-FR")}</td>
                    <td className="p-3 text-right">44 542</td>
                    <td className="p-3 text-right">—</td>
                    <td className="p-3 text-right">{fmt(totalCA)}</td>
                    <td className="p-3 text-right">{fmt(totalCommission)}</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Loyalty */}
        <TabsContent value="loyalty" className="mt-4 grid gap-4 md:grid-cols-2">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Packs de fidélité</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="p-3">Pack acheté</th>
                    <th className="p-3 text-right">Bonus offert</th>
                    <th className="p-3 text-right">Valeur totale</th>
                  </tr>
                </thead>
                <tbody>
                  {loyaltyPacks.map((p) => (
                    <tr key={p.pack} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-3 font-medium">{p.pack}</td>
                      <td className="p-3 text-right text-accent">{p.bonus}</td>
                      <td className="p-3 text-right font-semibold">{p.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Revenus variables</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between rounded-lg bg-muted/30 p-3">
                <span className="text-sm">Cours après 21h</span>
                <span className="font-semibold">+5,00 €/cours</span>
              </div>
              <div className="flex justify-between rounded-lg bg-muted/30 p-3">
                <span className="text-sm">Option coupe-fil</span>
                <span className="font-semibold">3,00 €</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
