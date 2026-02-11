import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, TrendingUp, Users, Video, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const stats = [
  { label: "Heures de cours", value: "24.5", icon: Clock, change: "+3.2h cette semaine" },
  { label: "Cours terminés", value: "18", icon: BookOpen, change: "+4 ce mois" },
  { label: "Moyenne générale", value: "16.2", icon: TrendingUp, change: "+0.8 pts" },
  { label: "Tuteurs suivis", value: "3", icon: Users, change: "" },
];

const upcomingLessons = [
  { id: 1, subject: "Mathématiques", tutor: "Dr. Martin", date: "Aujourd'hui", time: "14:00", status: "confirmed" },
  { id: 2, subject: "Physique", tutor: "Mme. Dupont", date: "Demain", time: "10:00", status: "confirmed" },
  { id: 3, subject: "Anglais", tutor: "Mr. Smith", date: "Mer. 12 Fév", time: "16:00", status: "pending" },
];

const featuredTutors = [
  { id: 1, name: "Dr. Martin", subject: "Mathématiques", rating: 4.9, avatar: "M" },
  { id: 2, name: "Mme. Dupont", subject: "Physique-Chimie", rating: 4.8, avatar: "D" },
  { id: 3, name: "Mr. Smith", subject: "Anglais", rating: 4.7, avatar: "S" },
];

export default function Dashboard() {
  const { profile } = useAuth();
  const displayName = profile?.first_name || "Étudiant";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bonjour, {displayName} 👋</h1>
        <p className="text-muted-foreground">Voici un résumé de votre activité</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  {stat.change && <p className="text-xs text-success">{stat.change}</p>}
                </div>
                <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-xl">
                  <stat.icon className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Prochains cours</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/lessons">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingLessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-lg">
                    <BookOpen className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{lesson.subject}</p>
                    <p className="text-sm text-muted-foreground">{lesson.tutor} · {lesson.date} à {lesson.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={lesson.status === "confirmed" ? "default" : "secondary"} className={lesson.status === "confirmed" ? "bg-success" : ""}>
                    {lesson.status === "confirmed" ? "Confirmé" : "En attente"}
                  </Badge>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/room/${lesson.id}`}><Video className="mr-1 h-3 w-3" />Rejoindre</Link>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader><CardTitle className="text-lg">Tuteurs populaires</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {featuredTutors.map((tutor) => (
              <div key={tutor.id} className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50">
                <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-primary-foreground">{tutor.avatar}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{tutor.name}</p>
                  <p className="text-xs text-muted-foreground">{tutor.subject}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-warning">
                  <Star className="h-3 w-3 fill-current" />{tutor.rating}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
