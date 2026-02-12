import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

// ─── Lessons ────────────────────────────────────────────

export function useLessons() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["lessons", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .order("scheduled_at", { ascending: true });
      if (error) throw error;
      return data as Tables<"lessons">[];
    },
  });
}

export function useCreateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lesson: TablesInsert<"lessons">) => {
      const { data, error } = await supabase.from("lessons").insert(lesson).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lessons"] }),
  });
}

export function useUpdateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Tables<"lessons">>) => {
      const { data, error } = await supabase.from("lessons").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lessons"] }),
  });
}

// ─── Tutors ─────────────────────────────────────────────

export function useTutors() {
  return useQuery({
    queryKey: ["tutors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tutors")
        .select("*, profiles!tutors_user_id_fkey(first_name, last_name, avatar_url)");
      if (error) {
        // Fallback without join if FK name doesn't match
        const { data: fallback, error: err2 } = await supabase.from("tutors").select("*");
        if (err2) throw err2;
        return fallback;
      }
      return data;
    },
  });
}

// ─── Notifications ──────────────────────────────────────

export function useNotifications() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Tables<"notifications">[];
    },
  });
}

export function useMarkNotificationsRead() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

// ─── Tutor Reviews ──────────────────────────────────────

export function useTutorReviews() {
  return useQuery({
    queryKey: ["tutor-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tutor_reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (review: { tutor_id: string; student_id: string; rating: number; comment: string | null }) => {
      const { data, error } = await supabase.from("tutor_reviews").insert(review).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tutor-reviews"] }),
  });
}

// ─── Dashboard Stats ────────────────────────────────────

export function useDashboardStats() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["dashboard-stats", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: lessons, error } = await supabase
        .from("lessons")
        .select("*");
      if (error) throw error;

      const completed = (lessons || []).filter((l) => l.status === "completed");
      const totalMinutes = completed.reduce((s, l) => s + (l.duration_minutes || 0), 0);
      const avgRating = completed.filter((l) => l.rating != null).length
        ? completed.reduce((s, l) => s + (l.rating || 0), 0) /
          completed.filter((l) => l.rating != null).length
        : 0;

      return {
        totalHours: (totalMinutes / 60).toFixed(1),
        completedLessons: completed.length,
        averageRating: avgRating.toFixed(1),
        upcomingLessons: (lessons || []).filter(
          (l) => l.status === "confirmed" || l.status === "pending"
        ),
      };
    },
  });
}
