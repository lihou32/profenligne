import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useUserCredits() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user-credits", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_credits")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useCreditTransactions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["credit-transactions", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("credit_transactions")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAddCredits() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ amount, description }: { amount: number; description?: string }) => {
      if (!user) throw new Error("Not authenticated");

      // Upsert user_credits
      const { data: existing } = await supabase
        .from("user_credits")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("user_credits")
          .update({ balance: existing.balance + amount })
          .eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_credits")
          .insert({ user_id: user.id, balance: amount });
        if (error) throw error;
      }

      // Log transaction
      const { error: txError } = await supabase
        .from("credit_transactions")
        .insert({ user_id: user.id, amount, type: "purchase", description });
      if (txError) throw txError;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user-credits"] });
      qc.invalidateQueries({ queryKey: ["credit-transactions"] });
    },
  });
}
