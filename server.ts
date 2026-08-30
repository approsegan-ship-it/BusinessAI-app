import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Fallback models in priority order for resilience when experiencing high demand (503 / 429)
const TEXT_MODELS = [
  "gemini-3.7-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isHighDemandOrUnavailable(error: any): boolean {
  if (!error) return false;
  const status = error.status || error.code || error?.error?.code;
  const msg = (error.message || error?.error?.message || "").toLowerCase();
  return (
    status === 503 ||
    status === 429 ||
    status === "UNAVAILABLE" ||
    msg.includes("503") ||
    msg.includes("high demand") ||
    msg.includes("spikes in demand") ||
    msg.includes("unavailable") ||
    msg.includes("resource_exhausted") ||
    msg.includes("overloaded") ||
    msg.includes("rate limit")
  );
}

function isTransientError(error: any): boolean {
  if (!error) return false;
  const status = error.status || error.code || error?.error?.code;
  const msg = (error.message || error?.error?.message || "").toLowerCase();
  return (
    isHighDemandOrUnavailable(error) ||
    status === 500 ||
    status === 504 ||
    msg.includes("econnreset") ||
    msg.includes("etimedout") ||
    msg.includes("timeout")
  );
}

async function generateWithFallback(
  ai: GoogleGenAI,
  prompt: string,
  systemInstruction?: string,
  temperature?: number
): Promise<{ text: string; modelUsed: string }> {
  let lastError: any = null;

  for (const model of TEXT_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction:
            systemInstruction ||
            "Tu es BusinessAI, un assistant expert en marketing, communication et vente pour les petites et moyennes entreprises francophones. Sois clair, percutant, professionnel et directement actionnable.",
          temperature: typeof temperature === "number" ? temperature : 0.7,
        },
      });

      if (response?.text) {
        return { text: response.text, modelUsed: model };
      }
    } catch (err: any) {
      lastError = err;
      const isOverloaded = isHighDemandOrUnavailable(err);
      console.warn(
        `[Gemini Gen] Modèle ${model} ${isOverloaded ? "en forte affluence (503/429) -> bascule immédiate" : "erreur: " + (err?.message || err)}`
      );

      // If it's a non-high-demand transient error, try a single quick retry before switching
      if (!isOverloaded && isTransientError(err)) {
        try {
          await sleep(300);
          const retryRes = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction:
                systemInstruction ||
                "Tu es BusinessAI, un assistant expert en marketing, communication et vente pour PME.",
              temperature: typeof temperature === "number" ? temperature : 0.7,
            },
          });
          if (retryRes?.text) {
            return { text: retryRes.text, modelUsed: model };
          }
        } catch {
          // Switch to next model
        }
      }
    }
  }

  throw lastError || new Error("Échec de la génération sur tous les modèles disponibles.");
}

async function chatWithFallback(
  ai: GoogleGenAI,
  messages: any[],
  systemInstruction?: string
): Promise<{ text: string; modelUsed: string }> {
  let lastError: any = null;
  const lastMessage = messages[messages.length - 1]?.text || "";
  const historyFormatted = messages.slice(0, -1).map((m: any) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));

  for (const model of TEXT_MODELS) {
    try {
      const chat = ai.chats.create({
        model,
        config: {
          systemInstruction:
            systemInstruction ||
            "Tu es BusinessAI, un assistant business convivial, direct et expert pour les entrepreneurs et PME. Aide l'utilisateur à développer son chiffre d'affaires, soigner ses messages clients et optimiser sa communication.",
        },
        history: historyFormatted,
      });

      const result = await chat.sendMessage({
        message: lastMessage,
      });

      if (result?.text) {
        return { text: result.text, modelUsed: model };
      }
    } catch (err: any) {
      lastError = err;
      const isOverloaded = isHighDemandOrUnavailable(err);
      console.warn(
        `[Gemini Chat] Modèle ${model} ${isOverloaded ? "en forte affluence (503/429) -> bascule immédiate vers le modèle suivant" : "erreur: " + (err?.message || err)}`
      );

      // If not 503 high-demand, try one quick retry
      if (!isOverloaded && isTransientError(err)) {
        try {
          await sleep(300);
          const chatRetry = ai.chats.create({
            model,
            config: {
              systemInstruction:
                systemInstruction ||
                "Tu es BusinessAI, un assistant business convivial, direct et expert pour les entrepreneurs et PME.",
            },
            history: historyFormatted,
          });
          const retryResult = await chatRetry.sendMessage({ message: lastMessage });
          if (retryResult?.text) {
            return { text: retryResult.text, modelUsed: model };
          }
        } catch {
          // Switch to next model
        }
      }
    }
  }

  throw lastError || new Error("Échec de la discussion sur tous les modèles disponibles.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Routes
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      models: TEXT_MODELS,
      time: new Date().toISOString(),
    });
  });

  // Single prompt content generation endpoint
  app.post("/api/gemini/generate", async (req: Request, res: Response) => {
    try {
      const { prompt, systemInstruction, temperature } = req.body;

      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "Le paramètre 'prompt' est requis." });
      }

      const ai = getGenAI();

      if (!ai) {
        // Fallback generator when GEMINI_API_KEY is not provided
        const fallbackResponse = generateSmartFallback(prompt, systemInstruction);
        return res.json({ text: fallbackResponse, isFallback: true });
      }

      const { text, modelUsed } = await generateWithFallback(
        ai,
        prompt,
        systemInstruction,
        temperature
      );

      return res.json({ text, isFallback: false, model: modelUsed });
    } catch (error: any) {
      console.error("Erreur résolue Gemini Generate:", error?.message || error);
      // Return a structured, relevant business response so the user is never blocked
      const fallbackResponse = generateSmartFallback(
        req.body?.prompt || "",
        req.body?.systemInstruction
      );
      return res.json({
        text: fallbackResponse,
        isFallback: true,
        warning: "Réponse générée en mode sécurisé suite à une forte affluence sur les serveurs IA.",
      });
    }
  });

  // Multi-turn Chat endpoint
  app.post("/api/gemini/chat", async (req: Request, res: Response) => {
    try {
      const { messages, systemInstruction } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Le tableau 'messages' est requis." });
      }

      const ai = getGenAI();
      const lastMessage = messages[messages.length - 1]?.text || "";

      if (!ai) {
        const fallback = generateSmartFallback(lastMessage, systemInstruction);
        return res.json({ text: fallback, isFallback: true });
      }

      const { text, modelUsed } = await chatWithFallback(
        ai,
        messages,
        systemInstruction
      );

      return res.json({ text, isFallback: false, model: modelUsed });
    } catch (error: any) {
      console.error("Erreur résolue Gemini Chat:", error?.message || error);
      const lastMessage = req.body?.messages?.slice(-1)[0]?.text || "";
      const fallback = generateSmartFallback(lastMessage, req.body?.systemInstruction);
      return res.json({
        text: fallback,
        isFallback: true,
        warning: "Réponse fournie en mode sécurisé suite à une surcharge temporaire du modèle principal.",
      });
    }
  });

  // Streaming endpoint for real-time word-by-word token generation via SSE
  app.post("/api/gemini/stream", async (req: Request, res: Response) => {
    const { prompt, systemInstruction, temperature } = req.body;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const ai = getGenAI();

    if (!ai) {
      // Stream fallback content progressively
      const fallbackText = generateSmartFallback(prompt || "", systemInstruction);
      const words = fallbackText.split(" ");
      for (const word of words) {
        res.write(`data: ${JSON.stringify({ text: word + " ", isFallback: true })}\n\n`);
        await sleep(30);
      }
      res.write("data: [DONE]\n\n");
      return res.end();
    }

    try {
      let streamSucceeded = false;
      for (const model of TEXT_MODELS) {
        try {
          const responseStream = await ai.models.generateContentStream({
            model,
            contents: prompt || "",
            config: {
              systemInstruction:
                systemInstruction ||
                "Tu es BusinessAI, un assistant expert en marketing, communication et vente pour PME.",
              temperature: typeof temperature === "number" ? temperature : 0.7,
            },
          });

          for await (const chunk of responseStream) {
            if (chunk.text) {
              res.write(`data: ${JSON.stringify({ text: chunk.text, modelUsed: model })}\n\n`);
            }
          }
          streamSucceeded = true;
          break;
        } catch (streamErr) {
          console.warn(`[Gemini Stream] Model ${model} stream error:`, streamErr);
        }
      }

      if (!streamSucceeded) {
        const fallbackText = generateSmartFallback(prompt || "", systemInstruction);
        res.write(`data: ${JSON.stringify({ text: fallbackText, isFallback: true })}\n\n`);
      }

      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error: any) {
      console.error("Erreur générale stream:", error);
      res.write(`data: ${JSON.stringify({ error: "Erreur de streaming" })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BusinessAI server running on http://localhost:${PORT}`);
  });
}

/**
 * Intelligent structured fallback if Gemini key is not configured or in high load
 */
function generateSmartFallback(prompt: string, context?: string): string {
  const p = prompt.toLowerCase();

  if (p.includes("vidéo") || p.includes("video") || p.includes("storyboard") || p.includes("tiktok") || p.includes("reels") || p.includes("scenes")) {
    return JSON.stringify({
      title: "Vidéo Promo Flash Produit",
      hook: "Arrêtez tout ! Voici le secret que tout le monde s'arrache cette semaine !",
      totalDurationSeconds: 30,
      scenes: [
        {
          sceneNumber: 1,
          timeRange: "00:00 - 00:05",
          durationSeconds: 5,
          title: "Accroche Scroll-Stopper",
          visualDescription: "Présentateur montrant le produit à la caméra avec énergie et sourire communicatif",
          cameraDirection: "Plan selfie dynamique rapproché",
          voiceoverText: "Arrêtez de scroller ! Si vous cherchez la meilleure qualité au meilleur prix, regardez attentivement ceci !",
          screenText: "🔥 OFFRE SPÉCIALE EXCLUSIVE !",
          soundEffectOrMusic: "Transition Woosh + Démarrage beat Afrobeats",
          visualThemeColor: "#6366F1"
        },
        {
          sceneNumber: 2,
          timeRange: "00:05 - 00:12",
          durationSeconds: 7,
          title: "Démonstration & Solution",
          visualDescription: "Gros plan sur les finitions et l'utilisation concrète en situation réelle",
          cameraDirection: "Plan macro 45° en lumière naturelle",
          voiceoverText: "Fini les compromis et les mauvaises surprises. Profitez d'une qualité garantie et d'une durabilité maximale.",
          screenText: "✨ 100% Qualité & Garantie",
          soundEffectOrMusic: "Ding de validation",
          visualThemeColor: "#0284C7"
        },
        {
          sceneNumber: 3,
          timeRange: "00:12 - 00:22",
          durationSeconds: 10,
          title: "Bénéfices & Témoignages",
          visualDescription: "Montage rapide de clients satisfaits et livraison de colis prêts à partir",
          cameraDirection: "Enchaînement 2 angles rapides",
          voiceoverText: "Déjà plus de 500 clients conquis ce mois-ci ! Pourquoi pas vous ?",
          screenText: "⭐ Recommandé par +500 clients",
          soundEffectOrMusic: "Effet caisse enregistreuse / Carillon",
          visualThemeColor: "#10B981"
        },
        {
          sceneNumber: 4,
          timeRange: "00:22 - 00:30",
          durationSeconds: 8,
          title: "Appel à l'Action WhatsApp",
          visualDescription: "Affichage du contact WhatsApp et invitation chaleureuse à commander",
          cameraDirection: "Plan moyen avec pointage vers le bas",
          voiceoverText: "Les stocks s'épuisent très vite. Écrivez-nous tout de suite sur WhatsApp pour commander !",
          screenText: "📲 COMMANDEZ SUR WHATSAPP AU 0163638893",
          soundEffectOrMusic: "Pop WhatsApp + Cloche finale",
          visualThemeColor: "#8B5CF6"
        }
      ],
      voiceoverFullScript: "Arrêtez de scroller ! Si vous cherchez la meilleure qualité au meilleur prix, regardez attentivement ceci ! Fini les compromis et les mauvaises surprises. Profitez d'une qualité garantie et d'une durabilité maximale. Déjà plus de 500 clients conquis ce mois-ci ! Pourquoi pas vous ? Les stocks s'épuisent très vite. Écrivez-nous tout de suite sur WhatsApp pour commander !",
      recommendedMusic: {
        genre: "Afrobeats Rhythmique & Énergique",
        mood: "Vendeur, motivant et convivial",
        bpm: "115 BPM",
        searchKeywords: "afro beat trend reels tiktok energetic"
      },
      filmingTips: [
        "Filmez face à une source de lumière naturelle pour un rendu éclatant.",
        "Nettoyez l'objectif de votre caméra avant de tourner.",
        "Parlez avec le sourire, l'énergie passe instantanément dans la voix !"
      ],
      captionAndHashtags: {
        postCaption: "🔥 Découvrez notre sélection coup de cœur ! Commandez vite au 0163638893 sur WhatsApp.",
        hashtags: ["#BusinessAI", "#Vente", "#Nouveauté", "#Promo", "#TikTokBusiness"],
        callToAction: "Écrivez-nous sur WhatsApp au 0163638893 pour commander"
      },
      srtSubtitles: "1\n00:00:00,000 --> 00:00:05,000\nArrêtez de scroller ! Découvrez notre offre exclusive.\n\n2\n00:00:05,000 --> 00:00:12,000\nQualité garantie et satisfaction client.\n\n3\n00:00:12,000 --> 00:00:22,000\nRecommandé par plus de 500 clients satisfaits.\n\n4\n00:00:22,000 --> 00:00:30,000\nCommandez vite sur WhatsApp au 0163638893 !"
    });
  }

  if (p.includes("facebook") || p.includes("instagram") || p.includes("whatsapp") || p.includes("publication")) {
    return `📢 **Proposition de Publication Réseaux Sociaux**

✨ **Accroche :** Découvrez notre sélection exclusive conçue pour vous simplifier la vie et maximiser vos résultats !

🛍️ **Ce que vous allez adorer :**
- Qualité supérieure et service soigné
- Disponibilité immédiate et conseils personnalisés
- Offre spéciale valable cette semaine

👉 **Passez à l'action :** Cliquez sur le lien ou écrivez-nous directement par message privé / WhatsApp pour commander ou réserver !

#Entreprise #Qualite #OffreSpeciale #BusinessAI #SatisfactionClient`;
  }

  if (p.includes("fiche produit") || p.includes("description") || p.includes("caractéristique")) {
    return `🏷️ **Fiche Produit Optimisée Vente**

**Titre :** L'excellence au service de votre quotidien
**Description :** Conçu avec soin pour répondre parfaitement à vos besoins, ce produit allie praticité, durabilité et esthétique. Idéal pour les clients exigeants qui recherchent le meilleur rapport qualité/prix.

✨ **Points forts :**
- Utilisation intuitive et résultat immédiat
- Matériaux fiables et finitions impeccables
- Garantie satisfaction client

🎯 **Conseil de vente :** Proposez-le en pack ou avec une offre de livraison offerte pour maximiser votre panier moyen.`;
  }

  if (p.includes("prix") || p.includes("devis") || p.includes("disponibilité") || p.includes("réponse")) {
    return `Bonjour ! Merci beaucoup pour votre intérêt. 😊

Voici les informations demandées concernant nos prestations et tarifs. Nous sommes à votre entière disposition pour adapter notre proposition selon vos besoins spécifiques.

Souhaitez-vous que nous validions votre commande ou planifiions un court échange ? 

Excellente journée,
L'équipe BusinessAI`;
  }

  return `✨ **Conseil BusinessAI pour votre entreprise :**

Voici une proposition adaptée à votre demande :
1. **Clarifiez votre message principal** : Mettez en avant le bénéfice direct pour le client.
2. **Soignez l'appel à l'action** : Guidez votre prospect vers l'étape suivante (achat, message WhatsApp, réservation).
3. **Restez réactif** : Répondez aux demandes en moins de 15 minutes pour multiplier votre taux de conversion.

N'hésitez pas à me donner plus de précisions si vous souhaitez affiner cette version !`;
}

startServer();

