import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Users, Clock, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const activeSessions = [
  { id: 1, subject: "Mathématiques - Algèbre", tutor: "Dr. Martin", participants: 3, startedAt: "Il y a 15 min" },
  { id: 2, subject: "Physique - Optique", tutor: "Mme. Dupont", participants: 2, startedAt: "Il y a 30 min" },
];

const availableTutors = [
  { id: 1, name: "Dr. Martin", subject: "Mathématiques", status: "online", avatar: "M" },
  { id: 2, name: "Mme. Dupont", subject: "Physique-Chimie", status: "online", avatar: "D" },
  { id: 3, name: "Mr. Smith", subject: "Anglais", status: "busy", avatar: "S" },
  { id: 4, name: "Mme. Laurent", subject: "Français", status: "offline", avatar: "L" },
];

const statusColors = {
  online: "bg-success",
  busy: "bg-warning",
  offline: "bg-muted-foreground",
};

export default function LiveConnect() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">LiveConnect</h1>
          <p className="text-muted-foreground">Rejoignez un cours en direct ou démarrez une session</p>
        </div>
        <Button className="gradient-primary text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle session
        </Button>
      </div>

      {/* Sessions en cours */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Video className="h-5 w-5 text-accent" />
            Sessions en cours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-xl">
                    <Video className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="absolute -right-1 -top-1 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{session.subject}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{session.tutor}</span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {session.participants}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {session.startedAt}
                    </span>
                  </div>
                </div>
              </div>
              <Button asChild>
                <Link to={`/room/${session.id}`}>Rejoindre</Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tuteurs disponibles */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Tuteurs disponibles</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher un tuteur..." className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {availableTutors.map((tutor) => (
              <div
                key={tutor.id}
                className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-primary-foreground">
                      {tutor.avatar}
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${statusColors[tutor.status as keyof typeof statusColors]}`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tutor.name}</p>
                    <p className="text-xs text-muted-foreground">{tutor.subject}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={tutor.status === "online" ? "default" : "secondary"}
                  disabled={tutor.status === "offline"}
                >
                  {tutor.status === "online" ? "Appeler" : tutor.status === "busy" ? "Occupé" : "Hors ligne"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
