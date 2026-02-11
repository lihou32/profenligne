import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, BookOpen, Video, Bot, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const notifications = [
  { id: 1, title: "Cours confirmé", message: "Votre cours de Mathématiques avec Dr. Martin est confirmé pour demain à 14:00", icon: BookOpen, time: "Il y a 5 min", read: false },
  { id: 2, title: "Session LiveConnect", message: "Mme. Dupont a démarré une session de Physique", icon: Video, time: "Il y a 30 min", read: false },
  { id: 3, title: "AI Tutor", message: "Votre analyse de devoirs est prête", icon: Bot, time: "Il y a 1h", read: true },
  { id: 4, title: "Cours terminé", message: "Rapport de votre cours d'Anglais disponible", icon: CheckCircle, time: "Hier", read: true },
];

export default function Notifications() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Restez informé de votre activité</p>
        </div>
        <Button variant="outline" size="sm">Tout marquer comme lu</Button>
      </div>

      <Card className="glass-card">
        <CardContent className="divide-y p-0">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-4 p-4 transition-colors hover:bg-muted/50 ${!notif.read ? "bg-primary/5" : ""}`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${!notif.read ? "gradient-primary" : "bg-muted"}`}>
                <notif.icon className={`h-5 w-5 ${!notif.read ? "text-primary-foreground" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium">{notif.title}</h3>
                  {!notif.read && <Badge variant="secondary" className="text-[10px]">Nouveau</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{notif.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">{notif.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
