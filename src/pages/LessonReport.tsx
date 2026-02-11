import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, BookOpen, Star, Download } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

export default function LessonReport() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rapport de cours</h1>
        <p className="text-muted-foreground">Session #{id} — Mathématiques avec Dr. Martin</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-xl">
              <Clock className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Durée</p>
              <p className="text-lg font-bold">1h 15min</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-xl">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sujet</p>
              <p className="text-lg font-bold">Intégrales</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-xl">
              <Star className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Évaluation</p>
              <p className="text-lg font-bold">16/20</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Compétences évaluées</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { skill: "Calcul intégral", score: 80 },
            { skill: "Primitives courantes", score: 90 },
            { skill: "Intégration par parties", score: 65 },
            { skill: "Changement de variable", score: 70 },
          ].map((item) => (
            <div key={item.skill} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{item.skill}</span>
                <span className="font-medium">{item.score}%</span>
              </div>
              <Progress value={item.score} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Notes du tuteur</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Bonne session ! L'étudiant maîtrise bien les primitives courantes. 
            Il faut approfondir l'intégration par parties et les changements de variable. 
            Exercices supplémentaires recommandés sur le chapitre 5 du livre.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Télécharger le rapport
        </Button>
      </div>
    </div>
  );
}
