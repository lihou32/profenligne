import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, DollarSign, TrendingUp, MoreHorizontal } from "lucide-react";

const stats = [
  { label: "Utilisateurs", value: "1,234", icon: Users, change: "+12%" },
  { label: "Cours ce mois", value: "456", icon: BookOpen, change: "+8%" },
  { label: "Revenus", value: "12,450€", icon: DollarSign, change: "+15%" },
  { label: "Taux de satisfaction", value: "94%", icon: TrendingUp, change: "+2%" },
];

const users = [
  { id: 1, name: "Jean Dupont", email: "jean@email.com", role: "student", status: "active" },
  { id: 2, name: "Dr. Martin", email: "martin@email.com", role: "tutor", status: "active" },
  { id: 3, name: "Marie Curie", email: "marie@email.com", role: "student", status: "inactive" },
  { id: 4, name: "Mr. Smith", email: "smith@email.com", role: "tutor", status: "active" },
];

export default function AdminPanel() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Panel Admin</h1>
        <p className="text-muted-foreground">Gérez votre plateforme</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-success">{stat.change}</p>
                </div>
                <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-xl">
                  <stat.icon className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="tutors">Tuteurs</TabsTrigger>
          <TabsTrigger value="lessons">Cours</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="p-4">Nom</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Rôle</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="p-4 font-medium">{user.name}</td>
                      <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                      <td className="p-4">
                        <Badge variant="secondary">
                          {user.role === "student" ? "Étudiant" : "Tuteur"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={user.status === "active" ? "bg-success" : "bg-muted-foreground"}>
                          {user.status === "active" ? "Actif" : "Inactif"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tutors" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-6 text-center text-muted-foreground">
              Gestion des tuteurs — sera implémenté avec le backend
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lessons" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-6 text-center text-muted-foreground">
              Gestion des cours — sera implémenté avec le backend
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
