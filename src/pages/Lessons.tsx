import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Calendar, Clock, Video } from "lucide-react";
import { Link } from "react-router-dom";

const lessons = [
  { id: 1, subject: "Mathématiques", tutor: "Dr. Martin", date: "2025-02-11", time: "14:00", duration: "1h", status: "upcoming", topic: "Intégrales et primitives" },
  { id: 2, subject: "Physique", tutor: "Mme. Dupont", date: "2025-02-12", time: "10:00", duration: "1h30", status: "upcoming", topic: "Mécanique quantique" },
  { id: 3, subject: "Anglais", tutor: "Mr. Smith", date: "2025-02-13", time: "16:00", duration: "1h", status: "pending", topic: "Business English" },
  { id: 4, subject: "Mathématiques", tutor: "Dr. Martin", date: "2025-02-08", time: "14:00", duration: "1h", status: "completed", topic: "Suites numériques" },
  { id: 5, subject: "Physique", tutor: "Mme. Dupont", date: "2025-02-06", time: "10:00", duration: "1h30", status: "completed", topic: "Thermodynamique" },
];

const statusConfig = {
  upcoming: { label: "À venir", className: "bg-info" },
  pending: { label: "En attente", className: "bg-warning" },
  completed: { label: "Terminé", className: "bg-success" },
};

export default function Lessons() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mes Cours</h1>
          <p className="text-muted-foreground">Gérez vos cours et votre planning</p>
        </div>
        <Button className="gradient-primary text-primary-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          Réserver un cours
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
          <TabsTrigger value="completed">Terminés</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-3">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </TabsContent>
        <TabsContent value="upcoming" className="mt-4 space-y-3">
          {lessons.filter(l => l.status !== "completed").map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </TabsContent>
        <TabsContent value="completed" className="mt-4 space-y-3">
          {lessons.filter(l => l.status === "completed").map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LessonCard({ lesson }: { lesson: typeof lessons[0] }) {
  const status = statusConfig[lesson.status as keyof typeof statusConfig];

  return (
    <Card className="glass-card transition-all hover:shadow-md">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-xl">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">{lesson.subject}</h3>
            <p className="text-sm text-muted-foreground">{lesson.topic}</p>
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {lesson.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {lesson.time} ({lesson.duration})
              </span>
              <span>avec {lesson.tutor}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={status.className}>{status.label}</Badge>
          {lesson.status === "upcoming" && (
            <Button size="sm" variant="outline" asChild>
              <Link to={`/room/${lesson.id}`}>
                <Video className="mr-1 h-3 w-3" />
                Rejoindre
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
