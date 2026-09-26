/**
 * Module de génération vidéo cinématique Google Veo
 * Modèle : veo-3.1-generate-preview
 */

export async function generateVeoVideo(prompt, apiKey = process.env.GEMINI_API_KEY) {
  if (!apiKey) {
    throw new Error("Clé API Gemini / Veo requise (GEMINI_API_KEY).");
  }

  if (!prompt || typeof prompt !== "string") {
    throw new Error("Le prompt de génération vidéo est requis.");
  }

  // 1. Lancer la génération asynchrone
  const start = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt: prompt }],
        parameters: { aspectRatio: "16:9", durationSeconds: 5 }
      })
    }
  );

  if (!start.ok) {
    const errorBody = await start.json().catch(() => ({}));
    throw new Error(
      errorBody.error?.message || `Erreur d'initialisation Veo: code ${start.status}`
    );
  }

  const { name } = await start.json(); // operation name

  if (!name) {
    throw new Error("Impossible de récupérer l'identifiant d'opération Veo.");
  }

  // 2. Attendre la finalisation de la vidéo (Veo traite la vidéo en arrière-plan)
  let videoUrl = null;
  const maxPollAttempts = 30; // 30 * 5s = 150s max
  let attempts = 0;

  while (!videoUrl && attempts < maxPollAttempts) {
    await new Promise((r) => setTimeout(r, 5000)); // attend 5 sec
    attempts++;

    const check = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${name}?key=${apiKey}`
    );

    if (!check.ok) {
      continue;
    }

    const data = await check.json();

    if (data.error) {
      throw new Error(data.error.message || "Erreur pendant le rendu vidéo Veo.");
    }

    if (data.done) {
      videoUrl =
        data.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri ||
        data.response?.generatedVideos?.[0]?.video?.uri;
      break;
    }
  }

  if (!videoUrl) {
    throw new Error("Délai d'attente dépassé pour le rendu de la vidéo Veo.");
  }

  return videoUrl;
}
