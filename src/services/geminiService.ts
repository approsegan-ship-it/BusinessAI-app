import { CompanyProfile } from '../types';

export function buildCompanySystemContext(company: CompanyProfile): string {
  return `Tu es BusinessAI, la plateforme et assistant IA d'élite en stratégie commerciale, marketing et communication d'entreprise.
Tu travailles spécifiquement pour l'entreprise suivante avec accès à ses informations autorisées :
- Nom de l'entreprise : "${company.name || 'Mon Entreprise'}"
- Secteur d'activité : ${company.sector}
- Description & Activité : ${company.description || 'Commerce et services'}
- Téléphone : ${company.phone || 'Non renseigné'}
- Numéro WhatsApp direct : ${company.whatsapp || 'Non renseigné'}
- Adresse physique / Localisation : ${company.address || 'Non renseignée'}
- Horaires d'ouverture : ${company.hours || 'Non renseignés'}
- Devise utilisée pour les tarifs : ${company.currency || 'FCFA'}
- Ton de communication de la marque : ${company.defaultTone}
${company.knowledgeBase ? `- Base de connaissances & directives autorisées : "${company.knowledgeBase}"` : ''}
${company.targetAudienceDefault ? `- Clientèle cible prioritaire : "${company.targetAudienceDefault}"` : ''}

Consignes impératives :
1. Rédige en français impeccable, professionnel, dynamique, percutant et directement prêt à l'emploi.
2. Utilise fidèlement le contexte de l'entreprise (nom, devise ${company.currency || 'FCFA'}, coordonnées WhatsApp, directives et ton) pour enrichir et personnaliser tes réponses de manière naturelle.
3. Mets toujours en valeur les bénéfices pour le client et termine par un appel à l'action clair et engageant.
4. Structure les textes longs avec des puces claires et des émojis pertinents si adapté aux réseaux sociaux ou messages clients.`;
}

export async function generateAIContent(
  prompt: string,
  company: CompanyProfile,
  temperature = 0.7
): Promise<{ text: string; isFallback: boolean }> {
  try {
    const systemInstruction = buildCompanySystemContext(company);

    const response = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        systemInstruction,
        temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur serveur HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      text: data.text || 'Aucune réponse générée.',
      isFallback: Boolean(data.isFallback),
    };
  } catch (error: any) {
    console.error('Erreur API Gemini Client:', error);
    // Fallback generation locally if backend is unreachable
    return {
      text: `[BusinessAI Mode Local] Voici une proposition pour ${company.name || 'votre entreprise'} :
${prompt.slice(0, 100)}...

👉 **Action recommandée :** Contactez-nous au ${company.phone || company.whatsapp || 'notre service client'} pour en savoir plus !`,
      isFallback: true,
    };
  }
}

export async function chatWithAI(
  messages: { role: 'user' | 'assistant'; text: string }[],
  company: CompanyProfile
): Promise<{ text: string; isFallback: boolean }> {
  try {
    const systemInstruction = buildCompanySystemContext(company);

    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        systemInstruction,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      text: data.text || 'Je suis à votre écoute.',
      isFallback: Boolean(data.isFallback),
    };
  } catch (error: any) {
    console.error('Erreur Chat Client:', error);
    return {
      text: `Bonjour ! Je suis l'assistant BusinessAI de **${company.name || 'votre entreprise'}**. Comment puis-je vous aider aujourd'hui à développer vos ventes ou communiquer avec vos clients ?`,
      isFallback: true,
    };
  }
}

export async function streamAIContent(
  prompt: string,
  company: CompanyProfile,
  onChunk: (chunk: string) => void,
  temperature = 0.7
): Promise<{ fullText: string; isFallback: boolean }> {
  const systemInstruction = buildCompanySystemContext(company);
  let fullText = '';
  let isFallback = false;

  try {
    const response = await fetch('/api/gemini/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        systemInstruction,
        temperature,
      }),
    });

    if (!response.body) {
      throw new Error('ReadableStream non supporté par la réponse');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;

      if (value) {
        const decoded = decoder.decode(value, { stream: true });
        const lines = decoded.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') break;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                fullText += parsed.text;
                onChunk(parsed.text);
              }
              if (parsed.isFallback) {
                isFallback = true;
              }
            } catch {
              // Ignore partial stream line chunks
            }
          }
        }
      }
    }

    return { fullText, isFallback };
  } catch (error) {
    console.error('Erreur Streaming Client:', error);
    const fallback = await generateAIContent(prompt, company, temperature);
    onChunk(fallback.text);
    return { fullText: fallback.text, isFallback: true };
  }
}

