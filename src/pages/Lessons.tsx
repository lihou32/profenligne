import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Calendar, Clock, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { useLessons } from "@/hooks/useData";
import { BookLessonDialog } from "@/components/lessons/BookLessonDialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Tables } from "@/integrations/supabase/types";

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-warning" },
  confirmed: { label: "Confirmé", className: "bg-info" },
  in_progress: { label: "En cours", className: "bg-primary" },
  completed: { label: "Terminé", className: "bg-success" },
  cancelled: { label: "Annulé", className: "bg-muted-foreground" },
};

export default function Lessons() {
  const { data: lessons, isLoading } = useLessons();

  const upcoming = (lessons || []).filter((l) => ["pending", "confirmed", "in_progress"].includes(l.status));
  const completed = (lessons || []).filter((l) => l.status === "completed");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mes Cours</h1>
          <p className="text-muted-foreground">Gérez vos cours et votre planning</p>
        </div>
        <BookLessonDialog />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tous ({(lessons || []).length})</TabsTrigger>
          <TabsTrigger value="upcoming">À venir ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="completed">Terminés ({completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-3">
          {isLoading && <p className="text-center text-muted-foreground py-8">Chargement...</p>}
          {!isLoading && (lessons || []).length === 0 && (
            <Card className="glass-card">
              <CardContent className="flex flex-col items-center gap-3 p-8">
                <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                <p className="text-muted-foreground">Aucun cours pour le moment</p>
                <BookLessonDialog />
              </CardContent>
            </Card>
          )}
          {(lessons || []).map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </TabsContent>
        <TabsContent value="upcoming" className="mt-4 space-y-3">
          {upcoming.length === 0 && <p className="text-center text-muted-foreground py-8">Aucun cours à venir</p>}
          {upcoming.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)}
        </TabsContent>
        <TabsContent value="completed" className="mt-4 space-y-3">
          {completed.length === 0 && <p className="text-center text-muted-foreground py-8">Aucun cours terminé</p>}
          {completed.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LessonCard({ lesson }: { lesson: Tables<"lessons"> }) {
  const status = statusConfig[lesson.status] || statusConfig.pending;
  const durationLabel = lesson.duration_minutes >= 60
    ? `${Math.floor(lesson.duration_minutes / 60)}h${lesson.duration_minutes % 60 ? (lesson.duration_minutes % 60) + "min" : ""}`
    : `${lesson.duration_minutes}min`;

  return (
    <Card className="glass-card transition-all hover:shadow-md">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-xl">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">{lesson.subject}</h3>
            <p className="text-sm text-muted-foreground">{lesson.topic || "—"}</p>
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(lesson.scheduled_at), "dd MMM yyyy", { locale: fr })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {format(new Date(lesson.scheduled_at), "HH:mm")} ({durationLabel})
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={status.className}>{status.label}</Badge>
          {(lesson.status === "confirmed" || lesson.status === "in_progress") && (
            <Button size="sm" variant="outline" asChild>
              <Link to={`/room/${lesson.id}`}>
                <Video className="mr-1 h-3 w-3" />Rejoindre
              </Link>
            </Button>
          )}
          {lesson.status === "completed" && (
            <Button size="sm" variant="ghost" asChild>
              <Link to={`/report/${lesson.id}`}>Rapport</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
