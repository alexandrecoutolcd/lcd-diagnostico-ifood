import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation";

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { name, email, phone, faturamento, funcao } = parsed.data;

  // Estes não vêm do formulário - são capturados automaticamente da URL
  // (link da página e parâmetros de campanha) e apenas repassados aqui.
  const link = asString((body as any)?.link);
  const utmSource = asString((body as any)?.utm_source);
  const utmCampaign = asString((body as any)?.utm_campaign);
  const utmMedium = asString((body as any)?.utm_medium);
  const utmContent = asString((body as any)?.utm_content);

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    console.error("GOOGLE_SCRIPT_URL não configurada no servidor.");
    return NextResponse.json(
      { error: "Integração com o Google Sheets não está configurada no servidor." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // O Apps Script Web App faz redirect internamente; "follow" garante que
      // a resposta final (200 com o JSON) seja lida corretamente.
      redirect: "follow",
      body: JSON.stringify({
        data: new Date().toISOString(),
        name,
        email,
        phone,
        faturamento,
        funcao,
        link,
        utm_source: utmSource,
        utm_campaign: utmCampaign,
        utm_medium: utmMedium,
        utm_content: utmContent,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Apps Script respondeu com erro:", res.status, text);
      throw new Error("Falha ao gravar na planilha.");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao enviar lead para o Google Apps Script:", error);
    return NextResponse.json(
      { error: "Não foi possível salvar seus dados agora. Tente novamente." },
      { status: 502 }
    );
  }
}
