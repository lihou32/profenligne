import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Eye, EyeOff, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signUp(email, password, { first_name: firstName, last_name: lastName, role });
      toast.success("Compte créé avec succès !");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden mesh-bg">
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-info/10 blur-3xl float" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl float" style={{ animationDelay: '3s' }} />

      <Card className="glass-card relative w-full max-w-md animate-scale-in">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-5 gradient-primary flex h-16 w-16 items-center justify-center rounded-2xl glow animate-bounce-subtle">
            <GraduationCap className="h-9 w-9 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-display gradient-text">Inscription</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Rejoignez <span className="font-semibold gradient-text">Prof en Ligne</span>
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prénom</Label>
                <Input id="firstName" placeholder="Jean" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="h-11 rounded-xl bg-muted/50 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nom</Label>
                <Input id="lastName" placeholder="Dupont" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="h-11 rounded-xl bg-muted/50 border-border/50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
              <Input id="email" type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11 rounded-xl bg-muted/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Je suis</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-11 rounded-xl bg-muted/50 border-border/50">
                  <SelectValue placeholder="Sélectionnez votre rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">🎓 Étudiant</SelectItem>
                  <SelectItem value="tutor">👨‍🏫 Professeur / Tuteur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mot de passe</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11 rounded-xl bg-muted/50 border-border/50 pr-10" />
                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold text-base btn-glow" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Création...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Créer mon compte
                </span>
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Déjà un compte ?{" "}
              <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">Se connecter</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
