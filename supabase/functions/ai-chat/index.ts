import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { mode } = body;

    // ─── Quiz mode ──────────────────────────────────────
    if (mode === "quiz") {
      const { subject, topic } = body;
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `Tu es un générateur de QCM pédagogique. Génère exactement 5 questions à choix multiples sur le sujet donné. Réponds UNIQUEMENT avec un JSON valide, sans markdown, sans backticks. Format: {"questions":[{"question":"...","options":["A","B","C","D"],"correct":0}]} où correct est l'index (0-3) de la bonne réponse.`,
            },
            {
              role: "user",
              content: `Matière: ${subject}. Sujet: ${topic}. Génère 5 questions QCM.`,
            },
          ],
        }),
      });

      if (!res.ok) {
        const t = await res.text();
        console.error("Quiz AI error:", res.status, t);
        return new Response(JSON.stringify({ questions: [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "";
      try {
        const parsed = JSON.parse(content.replace(/```json\n?|```/g, "").trim());
        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        console.error("Quiz parse error:", content);
        return new Response(JSON.stringify({ questions: [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ─── Mindmap mode ───────────────────────────────────
    if (mode === "mindmap") {
      const { subject, topic } = body;
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `Tu es un générateur de cartes mentales pédagogiques. Crée une carte mentale structurée sur le sujet donné. Réponds UNIQUEMENT avec un JSON valide, sans markdown, sans backticks. Format: {"mindmap":{"label":"Sujet principal","children":[{"label":"Concept 1","children":[{"label":"Sous-concept"}]}]}}`,
            },
            {
              role: "user",
              content: `Matière: ${subject}. Sujet: ${topic}. Génère une carte mentale avec 4-6 branches principales et 2-3 sous-branches.`,
            },
          ],
        }),
      });

      if (!res.ok) {
        const t = await res.text();
        console.error("Mindmap AI error:", res.status, t);
        return new Response(JSON.stringify({ mindmap: null }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "";
      try {
        const parsed = JSON.parse(content.replace(/```json\n?|```/g, "").trim());
        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        console.error("Mindmap parse error:", content);
        return new Response(JSON.stringify({ mindmap: null }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ─── Default chat mode ──────────────────────────────
    const { messages } = body;
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Tu es un tuteur IA bienveillant et pédagogue pour des élèves francophones (collège, lycée, université). 
Tu aides avec les devoirs, expliques des concepts, résous des exercices étape par étape.
Tu utilises le markdown pour structurer tes réponses (titres, listes, formules, code).
Si l'élève envoie une image de devoir, analyse-la attentivement et aide-le.
Sois encourageant et patient. Réponds toujours en français.`,
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Trop de requêtes, réessayez dans un moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits IA épuisés." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Erreur du service IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
