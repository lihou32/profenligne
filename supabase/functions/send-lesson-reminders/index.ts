import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    // Find lessons starting in the next 30 minutes that haven't been reminded
    const now = new Date();
    const in30min = new Date(now.getTime() + 30 * 60 * 1000);

    const { data: lessons, error: lessonsError } = await supabaseAdmin
      .from("lessons")
      .select("id, subject, topic, scheduled_at, student_id, tutor_id, status")
      .eq("status", "confirmed")
      .gte("scheduled_at", now.toISOString())
      .lte("scheduled_at", in30min.toISOString());

    if (lessonsError) {
      throw lessonsError;
    }

    if (!lessons || lessons.length === 0) {
      return new Response(
        JSON.stringify({ message: "No upcoming lessons to remind", sent: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let sentCount = 0;

    for (const lesson of lessons) {
      // Get student and tutor profiles with emails
      const userIds = [lesson.student_id, lesson.tutor_id];

      // Get profiles
      const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("user_id, first_name, last_name, notify_lesson_reminder")
        .in("user_id", userIds);

      // Get auth emails
      const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
      if (usersError) {
        console.error("Error fetching users:", usersError);
        continue;
      }

      const relevantUsers = users.filter((u) => userIds.includes(u.id));

      for (const user of relevantUsers) {
        const profile = profiles?.find((p) => p.user_id === user.id);

        // Skip if user disabled lesson reminders
        if (profile && !profile.notify_lesson_reminder) {
          continue;
        }

        if (!user.email) continue;

        const isStudent = user.id === lesson.student_id;
        const roleName = isStudent ? "élève" : "tuteur";
        const partnerProfile = profiles?.find(
          (p) => p.user_id === (isStudent ? lesson.tutor_id : lesson.student_id)
        );
        const partnerName = partnerProfile
          ? `${partnerProfile.first_name || ""} ${partnerProfile.last_name || ""}`.trim()
          : "votre partenaire";

        const scheduledDate = new Date(lesson.scheduled_at);
        const timeStr = scheduledDate.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Paris",
        });

        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "TutorApp <onboarding@resend.dev>",
            to: [user.email],
            subject: `Rappel : cours de ${lesson.subject} à ${timeStr}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Rappel de cours 📚</h2>
                <p>Bonjour ${profile?.first_name || roleName},</p>
                <p>Votre cours de <strong>${lesson.subject}</strong>${lesson.topic ? ` (${lesson.topic})` : ""} commence à <strong>${timeStr}</strong> avec <strong>${partnerName}</strong>.</p>
                <p>Connectez-vous à la plateforme pour rejoindre la salle de cours.</p>
                <br/>
                <p>À bientôt !</p>
              </div>
            `,
          }),
        });

        if (emailRes.ok) {
          sentCount++;
          console.log(`Reminder sent to ${user.email} for lesson ${lesson.id}`);
        } else {
          const errBody = await emailRes.text();
          console.error(`Failed to send to ${user.email}:`, errBody);
        }
      }
    }

    return new Response(
      JSON.stringify({ message: `Reminders sent`, sent: sentCount }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
