// ============================================================
// Leitura da YouTube Analytics API (pico de presença ao vivo) e da
// YouTube Data API (duração) pros vídeos da Hermes Week.
// Token: refresh token de longa duração (escopos youtube.readonly,
// yt-analytics.readonly, youtube, youtube.upload), gerado em 10/10/2026.
// ============================================================

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const DATA_API = "https://www.googleapis.com/youtube/v3";
const ANALYTICS_API = "https://youtubeanalytics.googleapis.com/v2/reports";

async function obterAccessToken(): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.YT_CLIENT_ID!,
      client_secret: process.env.YT_CLIENT_SECRET!,
      refresh_token: process.env.YT_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`token YT: ${JSON.stringify(j)}`);
  return j.access_token as string;
}

// Pico de espectadores simultâneos da estreia, no dia em que ela aconteceu.
export async function buscarPicoAoVivo(videoId: string, diaISO: string): Promise<number | null> {
  const token = await obterAccessToken();
  const fim = new Date(new Date(`${diaISO}T00:00:00Z`).getTime() + 2 * 86400000).toISOString().slice(0, 10);
  const url = `${ANALYTICS_API}?ids=channel%3D%3DMINE&startDate=${diaISO}&endDate=${fim}&metrics=peakConcurrentViewers&filters=video%3D%3D${videoId}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  const j = await res.json();
  if (!res.ok) {
    console.error("[YT analytics] erro", videoId, j);
    return null;
  }
  const valor = j?.rows?.[0]?.[0];
  return typeof valor === "number" ? valor : null;
}

// Duração do vídeo, em minutos inteiros.
export async function buscarDuracaoMin(videoId: string): Promise<number | null> {
  const token = await obterAccessToken();
  const res = await fetch(`${DATA_API}/videos?part=contentDetails&id=${videoId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const j = await res.json();
  const iso = j?.items?.[0]?.contentDetails?.duration as string | undefined;
  if (!iso) return null;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return null;
  const h = Number(m[1] || 0), min = Number(m[2] || 0), s = Number(m[3] || 0);
  return Math.round(h * 60 + min + s / 60);
}

// ------------------------------------------------------------
// Descoberta automática dos vídeos de cada ciclo (Red, 21/10/2026).
// Cada ciclo tem a sua playlist, chamada "Hermes Week - DD a DD/MM" (início a fim, ex. "12 a 19/10").
// O início é o D0 do ciclo (segunda da Aula 1). Os vídeos não se misturam entre playlists.
// Título do vídeo: "Aula N ..." (1 a 5) ou "Aula Final" / "Apresentação" (aula 6).
// ------------------------------------------------------------
export type VideoDeAula = { ciclo: string; aula_n: number; video_id: string; playlist: string };

function d0DaPlaylist(titulo: string, agora = new Date()): string | null {
  const m = titulo.match(/^\s*Hermes Week\s*[-–]\s*(\d{1,2})\s*a\s*(\d{1,2})\s*\/\s*(\d{1,2})/i);
  if (!m) return null;
  const ini = Number(m[1]);
  const fim = Number(m[2]);
  const mesFim = Number(m[3]);
  let mes = ini > fim ? mesFim - 1 : mesFim;
  let ano = agora.getUTCFullYear();
  if (mes === 0) {
    mes = 12;
    ano -= 1;
  }
  return `${ano}-${String(mes).padStart(2, "0")}-${String(ini).padStart(2, "0")}`;
}

export async function listarVideosDasAulas(): Promise<VideoDeAula[]> {
  const token = await obterAccessToken();
  const h = { Authorization: `Bearer ${token}` };
  const pls = await fetch(`${DATA_API}/playlists?part=snippet&mine=true&maxResults=50`, { headers: h, cache: "no-store" }).then((r) => r.json());
  const saida: VideoDeAula[] = [];
  for (const p of (pls.items || []) as { id: string; snippet: { title: string } }[]) {
    const ciclo = d0DaPlaylist(p.snippet.title);
    if (!ciclo) continue;
    let pagina = "";
    do {
      const j = await fetch(`${DATA_API}/playlistItems?part=snippet,contentDetails&playlistId=${p.id}&maxResults=50${pagina ? `&pageToken=${pagina}` : ""}`, { headers: h, cache: "no-store" }).then((r) => r.json());
      for (const it of (j.items || []) as { snippet: { title: string }; contentDetails: { videoId: string } }[]) {
        const t = it.snippet.title || "";
        const n = /Aula\s*Final|Apresenta[cç][aã]o/i.test(t) ? 6 : Number(t.match(/Aula\s*(\d)/i)?.[1] || 0);
        if (n >= 1 && n <= 6) saida.push({ ciclo, aula_n: n, video_id: it.contentDetails.videoId, playlist: p.snippet.title });
      }
      pagina = j.nextPageToken || "";
    } while (pagina);
  }
  return saida;
}
