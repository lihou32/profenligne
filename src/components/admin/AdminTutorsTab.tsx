import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Users } from "lucide-react";

interface TutorWithProfile {
  id: string;
  user_id: string;
  status: string;
  hourly_rate: number | null;
  rating: number | null;
  total_reviews: number | null;
  subjects: string[];
  profiles: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
}

function useAdminTutors() {
  return useQuery({
    queryKey: ["admin-tutors"],
    queryFn: async () => {
      const { data: tutors, error } = await supabase
        .from("tutors")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const userIds = [...new Set((tutors || []).map((t) => t.user_id))];
      if (userIds.length === 0) return [] as TutorWithProfile[];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name, avatar_url")
        .in("user_id", userIds);

      const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));
      return (tutors || []).map((t) => ({
        ...t,
        profiles: profileMap.get(t.user_id) || null,
      })) as TutorWithProfile[];
    },
  });
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  online: { label: "En ligne", variant: "default" },
  offline: { label: "Hors ligne", variant: "secondary" },
  busy: { label: "Occupé", variant: "destructive" },
};

export function AdminTutorsTab() {
  const { data: tutors, isLoading } = useAdminTutors();

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!tutors || tutors.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 text-center text-muted-foreground">
          Aucun tuteur enregistré pour le moment
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          Liste des tuteurs
          <Badge variant="secondary" className="ml-1">{tutors.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="p-4">Tuteur</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Tarif / h</th>
                <th className="p-4">Note</th>
                <th className="p-4">Avis</th>
                <th className="p-4">Matières</th>
              </tr>
            </thead>
            <tbody>
              {tutors.map((tutor) => {
                const fullName =
                  [tutor.profiles?.first_name, tutor.profiles?.last_name]
                    .filter(Boolean)
                    .join(" ") || "Nom inconnu";
                const initials = fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);
                const status = statusConfig[tutor.status] ?? { label: tutor.status, variant: "outline" as const };

                return (
                  <tr key={tutor.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={tutor.profiles?.avatar_url ?? undefined} />
                          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{fullName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="p-4 text-sm">
                      {tutor.hourly_rate != null ? `${Number(tutor.hourly_rate).toFixed(0)} €` : "—"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span>{tutor.rating != null ? Number(tutor.rating).toFixed(1) : "—"}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {tutor.total_reviews ?? 0} avis
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {(tutor.subjects || []).slice(0, 3).map((s) => (
                          <Badge key={s} variant="outline" className="text-xs px-1.5 py-0">
                            {s}
                          </Badge>
                        ))}
                        {(tutor.subjects || []).length > 3 && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            +{tutor.subjects.length - 3}
                          </Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
