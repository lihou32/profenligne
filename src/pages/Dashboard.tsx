import { useAuth } from "@/hooks/useAuth";
import { useDashboardStats, useTutors } from "@/hooks/useData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, TrendingUp, Users, Video, Star, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { BookLessonDialog } from "@/components/lessons/BookLessonDialog";

export default function Dashboard() {
  const { profile } = useAuth();
  const { data: stats, isLoading } = useDashboardStats();
  const { data: tutors } = useTutors();
  const displayName = profile?.first_name || "Étudiant";

  const statCards = [
    { label: "Heures de cours", value: stats?.totalHours || "0", icon: Clock },
    { label: "Cours terminés", value: String(stats?.completedLessons || 0), icon: BookOpen },
    { label: "Moyenne", value: stats?.averageRating || "—", icon: TrendingUp },
    { label: "Cours à venir", value: String(stats?.upcomingLessons?.length || 0), icon: CalendarDays },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bonjour, {displayName} 👋</h1>
          <p className="text-muted-foreground">Voici un résumé de votre activité</p>
        </div>
        <BookLessonDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{isLoading ? "…" : stat.value}</p>
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
        {/* Prochains cours */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Prochains cours</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/lessons">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {!stats?.upcomingLessons?.length && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Aucun cours à venir. Réservez-en un !
              </p>
            )}
            {stats?.upcomingLessons?.slice(0, 3).map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-lg">
                    <BookOpen className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{lesson.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {lesson.topic || "—"} · {format(new Date(lesson.scheduled_at), "dd MMM à HH:mm", { locale: fr })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={lesson.status === "confirmed" ? "bg-success" : "bg-warning"}>
                    {lesson.status === "confirmed" ? "Confirmé" : "En attente"}
                  </Badge>
                  {lesson.status === "confirmed" && (
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/room/${lesson.id}`}><Video className="mr-1 h-3 w-3" />Rejoindre</Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tuteurs */}
        <Card className="glass-card">
          <CardHeader><CardTitle className="text-lg">Tuteurs disponibles</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {(!tutors || tutors.length === 0) && (
              <p className="py-4 text-center text-sm text-muted-foreground">Aucun tuteur inscrit pour le moment</p>
            )}
            {(tutors || []).slice(0, 4).map((tutor: any) => (
              <div key={tutor.id} className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50">
                <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-primary-foreground">
                  {(tutor.profiles?.first_name?.[0] || tutor.user_id?.[0] || "T").toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {tutor.profiles?.first_name
                      ? `${tutor.profiles.first_name} ${tutor.profiles.last_name || ""}`
                      : "Tuteur"}
                  </p>
                  <p className="text-xs text-muted-foreground">{(tutor.subjects || []).join(", ") || "—"}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-warning">
                  <Star className="h-3 w-3 fill-current" />{tutor.rating || "—"}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
