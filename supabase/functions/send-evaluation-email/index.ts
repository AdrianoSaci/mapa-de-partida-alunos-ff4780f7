
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EvaluationEmailRequest {
  caregiverEmail: string;
  caregiverName: string;
  childName: string;
  communicationAge: string;
  evaluationDate: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      caregiverEmail, 
      caregiverName, 
      childName, 
      communicationAge, 
      evaluationDate 
    }: EvaluationEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Idade de Fala <onboarding@resend.dev>",
      to: [caregiverEmail],
      subject: `Resultado da Avaliação de Fala - ${childName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb; text-align: center;">Resultado da Avaliação de Fala</h1>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #16a34a; margin-top: 0;">Informações da Avaliação</h2>
            <p><strong>Responsável:</strong> ${caregiverName}</p>
            <p><strong>Criança:</strong> ${childName}</p>
            <p><strong>Data da Avaliação:</strong> ${evaluationDate}</p>
          </div>
          
          <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h2 style="color: #16a34a; margin-top: 0;">Idade de Comunicação</h2>
            <p style="font-size: 24px; font-weight: bold; color: #16a34a; margin: 0;">
              ${communicationAge}
            </p>
          </div>
          
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #856404; margin-top: 0;">Importante:</h3>
            <p style="color: #856404; margin: 0;">
              Este resultado é uma avaliação preliminar. Para um diagnóstico completo e orientações 
              específicas, recomendamos consultar um fonoaudiólogo ou profissional especializado.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 14px;">
              Obrigado por usar a Idade de Fala!<br>
              Em caso de dúvidas, entre em contato conosco.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Evaluation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-evaluation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
