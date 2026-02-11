import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  Bot,
  Bell,
  HelpCircle,
  CreditCard,
  LogOut,
  GraduationCap,
  Shield,
  Zap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mainNav = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Mes Cours", icon: BookOpen, path: "/lessons" },
  { title: "LiveConnect", icon: Video, path: "/live" },
  { title: "AI Tutor", icon: Bot, path: "/ai-tutor" },
];

const secondaryNav = [
  { title: "Notifications", icon: Bell, path: "/notifications" },
  { title: "Tarifs", icon: CreditCard, path: "/pricing" },
  { title: "Aide", icon: HelpCircle, path: "/help" },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile, hasRole } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Déconnexion réussie");
      navigate("/login");
    } catch {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const displayName = profile
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Utilisateur"
    : "Utilisateur";

  const initials = profile
    ? `${(profile.first_name?.[0] || "").toUpperCase()}${(profile.last_name?.[0] || "").toUpperCase()}`
    : "U";

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-5">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="gradient-primary flex h-11 w-11 items-center justify-center rounded-xl glow transition-transform group-hover:scale-105">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground font-display">
              PROF EN LIGNE
            </span>
            <span className="text-[10px] font-medium text-sidebar-foreground/40 flex items-center gap-1">
              <Zap className="h-2.5 w-2.5" />
              Plateforme de Tutorat
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-sidebar-foreground/30 px-3">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`rounded-xl mx-1 transition-all duration-200 ${
                        isActive
                          ? "gradient-primary text-primary-foreground glow"
                          : "hover:bg-sidebar-accent/80"
                      }`}
                    >
                      <Link to={item.path}>
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-sidebar-foreground/30 px-3">
            Autres
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`rounded-xl mx-1 transition-all duration-200 ${
                        isActive
                          ? "gradient-primary text-primary-foreground glow"
                          : "hover:bg-sidebar-accent/80"
                      }`}
                    >
                      <Link to={item.path}>
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              {hasRole("admin") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === "/admin"}
                    tooltip="Admin"
                    className={`rounded-xl mx-1 transition-all duration-200 ${
                      location.pathname === "/admin"
                        ? "gradient-primary text-primary-foreground glow"
                        : "hover:bg-sidebar-accent/80"
                    }`}
                  >
                    <Link to="/admin">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Administration</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarSeparator />
        <div className="flex items-center gap-3 rounded-xl p-3 mt-2 bg-sidebar-accent/50">
          <Avatar className="h-9 w-9 gradient-primary text-primary-foreground">
            <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">{displayName}</p>
            <p className="truncate text-[10px] text-sidebar-foreground/40">En ligne</p>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              tooltip="Déconnexion"
              className="rounded-xl mx-1 hover:bg-destructive/20 hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Déconnexion</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
