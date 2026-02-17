import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Save, Loader2, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GRADE_LEVELS = [
  { value: "6eme", label: "6ème" },
  { value: "5eme", label: "5ème" },
  { value: "4eme", label: "4ème" },
  { value: "3eme", label: "3ème" },
  { value: "2nde", label: "2nde" },
  { value: "1ere", label: "1ère" },
  { value: "terminale", label: "Terminale" },
  { value: "licence1", label: "Licence 1" },
  { value: "licence2", label: "Licence 2" },
  { value: "licence3", label: "Licence 3" },
  { value: "master1", label: "Master 1" },
  { value: "master2", label: "Master 2" },
  { value: "autre", label: "Autre" },
];

const SUBJECTS = [
  "Mathématiques", "Français", "Anglais", "Physique-Chimie",
  "SVT", "Histoire-Géographie", "Philosophie", "Espagnol",
  "Allemand", "Informatique", "Économie", "SES",
];

const SCHOOL_TYPES = [
  { value: "public", label: "🏫 Public" },
  { value: "prive", label: "🏠 Privé" },
  { value: "prive_sous_contrat", label: "📋 Privé sous contrat" },
  { value: "cned", label: "📧 CNED / À distance" },
  { value: "autre", label: "📌 Autre" },
];

export default function Profile() {
  const { user, profile, hasRole } = useAuth();
  const isStudent = hasRole("student");
  const isTutor = hasRole("tutor");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [schoolType, setSchoolType] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setBio((profile as any).bio || "");
      setGradeLevel((profile as any).grade_level || "");
      setSchoolType((profile as any).school_type || "");
      setAvatarUrl(profile.avatar_url);
    }
    // Load subjects: for tutors from tutors table, for students from user metadata
    if (isTutor && user) {
      supabase
        .from("tutors")
        .select("subjects")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.subjects) setSelectedSubjects(data.subjects);
        });
    } else if (user?.user_metadata?.subjects) {
      setSelectedSubjects(user.user_metadata.subjects.split(","));
    }
  }, [profile, user, isTutor]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 2 Mo");
      return;
    }

    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Add cache buster
      const url = `${publicUrl}?t=${Date.now()}`;
      setAvatarUrl(url);

      await supabase
        .from("profiles")
        .update({ avatar_url: url })
        .eq("user_id", user.id);

      toast.success("Photo de profil mise à jour !");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const updates: Record<string, any> = {
        first_name: firstName,
        last_name: lastName,
        bio,
        updated_at: new Date().toISOString(),
      };

      if (isStudent) {
        updates.grade_level = gradeLevel || null;
        updates.school_type = schoolType || null;
      }

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id);

      if (error) throw error;

      // Update subjects: for tutors save to tutors table, for students to user metadata
      if (isTutor) {
        const { error: tutorError } = await supabase
          .from("tutors")
          .update({ subjects: selectedSubjects })
          .eq("user_id", user.id);
        if (tutorError) throw tutorError;
      } else {
        await supabase.auth.updateUser({
          data: { subjects: selectedSubjects.join(",") },
        });
      }

      toast.success("Profil mis à jour avec succès !");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const initials = `${(firstName?.[0] || "").toUpperCase()}${(lastName?.[0] || "").toUpperCase()}` || "U";

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display gradient-text">Mon Profil</h1>
        <p className="text-sm text-muted-foreground mt-1">Modifiez vos informations personnelles</p>
      </div>

      {/* Avatar Section */}
      <Card className="glass-card">
        <CardContent className="flex items-center gap-6 py-6">
          <div className="relative group">
            <Avatar className="h-20 w-20 border-2 border-primary/30">
              <AvatarImage src={avatarUrl || undefined} alt="Avatar" />
              <AvatarFallback className="gradient-primary text-primary-foreground text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              {isUploading ? (
                <Loader2 className="h-5 w-5 animate-spin text-foreground" />
              ) : (
                <Camera className="h-5 w-5 text-foreground" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
          <div>
            <p className="font-semibold text-lg">{firstName} {lastName}</p>
            <p className="text-sm text-muted-foreground">{isStudent ? "Étudiant" : isTutor ? "Professeur" : "Utilisateur"}</p>
            <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Informations personnelles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prénom</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nom</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-11 rounded-xl bg-secondary/50 border-border/50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bio</Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Parlez-nous de vous..."
              className="min-h-[100px] rounded-xl bg-secondary/50 border-border/50 resize-none"
              maxLength={300}
            />
            <p className="text-xs text-muted-foreground text-right">{bio.length}/300</p>
          </div>

          {isStudent && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Classe / Niveau</Label>
                  <Select value={gradeLevel} onValueChange={setGradeLevel}>
                    <SelectTrigger className="h-11 rounded-xl bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border z-50">
                      {GRADE_LEVELS.map((g) => (
                        <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Établissement</Label>
                  <Select value={schoolType} onValueChange={setSchoolType}>
                    <SelectTrigger className="h-11 rounded-xl bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border z-50">
                      {SCHOOL_TYPES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {isStudent ? "Matières recherchées" : "Matières enseignées"}
            </Label>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-secondary/50 border border-border/50 p-3">
              {SUBJECTS.map((subject) => (
                <label key={subject} className="flex items-center gap-2 cursor-pointer text-sm">
                  <Checkbox
                    checked={selectedSubjects.includes(subject)}
                    onCheckedChange={(checked) => {
                      setSelectedSubjects((prev) =>
                        checked ? [...prev, subject] : prev.filter((s) => s !== subject)
                      );
                    }}
                  />
                  <span className="text-foreground/80">{subject}</span>
                </label>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold btn-glow"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sauvegarde...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Enregistrer les modifications
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
