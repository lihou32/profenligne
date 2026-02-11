import { useAuth } from "@/hooks/useAuth";
import { useDashboardStats, useTutors } from "@/hooks/useData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, TrendingUp, Users, Video, Star, CalendarDays, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { BookLessonDialog } from "@/components/lessons/BookLessonDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Dashboard() {
  const { profile } = useAuth();
  const { data: stats, isLoading } = useDashboardStats();
  const { data: tutors } = useTutors();
  const displayName = profile?.first_name || "Étudiant";

  const statCards = [
    { label: "Heures de cours", value: stats?.totalHours || "0", icon: Clock, gradient: "from-primary to-info" },
    { label: "Cours terminés", value: String(stats?.completedLessons || 0), icon: BookOpen, gradient: "from-success to-info" },
    { label: "Moyenne", value: stats?.averageRating || "—", icon: TrendingUp, gradient: "from-warning to-accent" },
    { label: "Cours à venir", value: String(stats?.upcomingLessons?.length || 0), icon: CalendarDays, gradient: "from-accent to-primary" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">
            Bonjour, <span className="gradient-text">{displayName}</span> 👋
          </h1>
          <p className="text-muted-foreground mt-1">Voici un résumé de votre activité</p>
        </div>
        <BookLessonDialog />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card
            key={stat.label}
            className="stat-card group"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold font-display mt-1">
                    {isLoading ? <span className="shimmer inline-block h-8 w-16 rounded" /> : stat.value}
                  </p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Prochains cours */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Prochains cours
            </CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
              <Link to="/lessons" className="flex items-center gap-1">
                Voir tout <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {!stats?.upcomingLessons?.length && (
              <div className="py-8 text-center">
                <CalendarDays className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Aucun cours à venir. Réservez-en un !</p>
              </div>
            )}
            {stats?.upcomingLessons?.slice(0, 3).map((lesson, i) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between rounded-xl border border-border/30 p-4 transition-all hover:bg-muted/30 hover:border-primary/20 group animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="gradient-primary flex h-11 w-11 items-center justify-center rounded-xl shadow-md group-hover:scale-105 transition-transform">
                    <BookOpen className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">{lesson.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {lesson.topic || "—"} · {format(new Date(lesson.scheduled_at), "dd MMM à HH:mm", { locale: fr })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`rounded-full px-3 ${
                      lesson.status === "confirmed"
                        ? "bg-success/15 text-success border-success/30"
                        : "bg-warning/15 text-warning border-warning/30"
                    }`}
                    variant="outline"
                  >
                    {lesson.status === "confirmed" ? "Confirmé" : "En attente"}
                  </Badge>
                  {lesson.status === "confirmed" && (
                    <Button size="sm" className="rounded-xl gradient-primary text-primary-foreground btn-glow" asChild>
                      <Link to={`/room/${lesson.id}`}>
                        <Video className="mr-1 h-3 w-3" />
                        Rejoindre
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tuteurs */}
        <Card className="glass-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Tuteurs disponibles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(!tutors || tutors.length === 0) && (
              <div className="py-8 text-center">
                <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Aucun tuteur inscrit pour le moment</p>
              </div>
            )}
            {(tutors || []).slice(0, 4).map((tutor: any, i: number) => {
              const initial = (tutor.profiles?.first_name?.[0] || tutor.user_id?.[0] || "T").toUpperCase();
              const name = tutor.profiles?.first_name
                ? `${tutor.profiles.first_name} ${tutor.profiles.last_name || ""}`
                : "Tuteur";
              return (
                <div
                  key={tutor.id}
                  className="flex items-center gap-3 rounded-xl border border-border/30 p-3.5 transition-all hover:bg-muted/30 hover:border-primary/20 animate-fade-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="gradient-primary text-primary-foreground text-sm font-bold">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{name}</p>
                    <p className="text-xs text-muted-foreground truncate">{(tutor.subjects || []).join(", ") || "—"}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-warning">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {tutor.rating || "—"}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
