import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Lock, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Mot de passe modifié avec succès !");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du changement de mot de passe");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "SUPPRIMER") return;
    setIsDeletingAccount(true);
    try {
      // Call edge function to delete account server-side
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("delete-account", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.error) throw res.error;
      await signOut();
      toast.success("Votre compte a été supprimé");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression du compte");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display gradient-text flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Paramètres
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Gérez votre compte et vos préférences</p>
      </div>

      {/* Account Info */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Compte</CardTitle>
          <CardDescription>Votre adresse email : <span className="text-foreground font-medium">{user?.email}</span></CardDescription>
        </CardHeader>
      </Card>

      {/* Change Password */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Changer le mot de passe
          </CardTitle>
          <CardDescription>Choisissez un nouveau mot de passe sécurisé</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Nouveau mot de passe
              </Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="h-11 rounded-xl bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Confirmer le mot de passe
              </Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="h-11 rounded-xl bg-secondary/50 border-border/50"
              />
            </div>
            <Button
              type="submit"
              disabled={isChangingPassword}
              className="w-full h-11 rounded-xl gradient-primary text-primary-foreground font-semibold btn-glow"
            >
              {isChangingPassword ? (
                <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Modification...</span>
              ) : (
                "Modifier le mot de passe"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="glass-card border-destructive/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Supprimer le compte
          </CardTitle>
          <CardDescription>
            Cette action est irréversible. Toutes vos données seront définitivement supprimées.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full h-11 rounded-xl font-semibold">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer mon compte
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass-card border-destructive/30">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Êtes-vous absolument sûr ?
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-3">
                  <p>Cette action supprimera définitivement votre compte et toutes les données associées. Cette action est irréversible.</p>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Tapez SUPPRIMER pour confirmer
                    </Label>
                    <Input
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="SUPPRIMER"
                      className="h-11 rounded-xl bg-secondary/50 border-destructive/30"
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl" onClick={() => setDeleteConfirmText("")}>
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== "SUPPRIMER" || isDeletingAccount}
                  className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeletingAccount ? (
                    <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Suppression...</span>
                  ) : (
                    "Supprimer définitivement"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
