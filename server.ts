import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const PORT = 3000;

// Lazy initialization for Google GenAI SDK
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. Gemini API calls will return fallback tactical analytics.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes First
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Natural Language Query -> Cypher & Tactical Intelligence
  app.post('/api/gemini/nl-query', async (req, res) => {
    try {
      const { query, activeFilter, graphContext } = req.body;

      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query parameter is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback intelligent response if no API key
        return res.json({
          cypherQuery: `MATCH (p:Person)-[r:ASSOCIATED_WITH|USES|OWNS]->(target)\nWHERE p.name CONTAINS "${query.replace(/['"\\]/g, '')}" OR target.name CONTAINS "${query.replace(/['"\\]/g, '')}"\nRETURN p, r, target LIMIT 25;`,
          explanation: `Identified relevant POLE entities and associations matching investigation query: "${query}".`,
          tacticalSummary: `Based on current network topology: Tariq "Falcon" Merchant (Kingpin, UAE) coordinates with Vikram Malhotra (Broker, Mumbai) across coastal landing points at Mandwa and Nhava Sheva. Financial flows route through Chandni Chowk bullion operators with 38 sub-₹50k smurfing deposits.`,
          recommendedActions: [
            'Deploy surveillance at Mandwa Creek Landing Point during 02:00-04:00 window',
            'Issue Sec 91 CrPC notice for Axis Bank account #9190204910291 smurfing trail',
            'Subpoena cell tower CDR dump for Tower TWR-MUM-402'
          ],
          highlightedNodeIds: ['p-01', 'p-02', 'p-03', 'ph-03', 'loc-04', 'evt-01']
        });
      }

      const ai = getAiClient();
      const systemInstruction = `You are the AI Intelligence Co-Pilot for a high-level Law Enforcement Criminal Network Analysis System (POLE ontology: People, Objects, Locations, Events).
Your task is to analyze investigator questions, translate them into optimized Neo4j Cypher queries, synthesize tactical intelligence findings, and output structured JSON.

Return strictly valid JSON with this schema:
{
  "cypherQuery": "string containing valid Cypher query with MATCH, WHERE, RETURN clauses",
  "explanation": "concise explanation of how the query extracts the target entities",
  "tacticalSummary": "2-3 sentences of actionable intelligence insight based on the criminal syndicate data (Tariq Merchant, Vikram Malhotra, Ramesh Soni, Farooq Qureshi, Hawala rings, CDR bursts)",
  "recommendedActions": ["array of 2-4 tactical next steps for law enforcement investigators"],
  "highlightedNodeIds": ["array of matching node ids like p-01, p-02, ph-03, acc-01, loc-02, evt-01"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `Investigator Query: "${query}"\nActive Context: POLE graph with 8 suspects, 4 burner/executive phones, 4 bank accounts with structuring, 6 safehouses/ports, and 3 major FIR/seizure events.`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text || '{}';
      try {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      } catch (parseError) {
        return res.json({
          cypherQuery: `MATCH (n) WHERE n.name CONTAINS "${query}" RETURN n LIMIT 10;`,
          explanation: responseText,
          tacticalSummary: responseText.slice(0, 200),
          recommendedActions: ['Review highlighted entity nodes in the Force Graph', 'Examine cross-border money trail in GeoMap'],
          highlightedNodeIds: ['p-01', 'p-02']
        });
      }
    } catch (err: any) {
      console.error('Error handling /api/gemini/nl-query:', err);
      res.status(500).json({
        error: 'Failed to process intelligence query',
        details: err?.message || 'Unknown error'
      });
    }
  });

  // Suspect Dossier AI Summarization
  app.post('/api/gemini/summarize-dossier', async (req, res) => {
    try {
      const { entity } = req.body;
      if (!entity) {
        return res.status(400).json({ error: 'Entity data is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          dossierSummary: `TARGET DOSSIER: ${entity.name || entity.label} (Role: ${entity.role || entity.type})\nRisk Score: ${entity.risk_score}/100 [${entity.risk_level}].\nKey Finding: Integral node in syndicate operations with betweenness centrality of ${entity.betweenness_centrality || '0.85'} and GAE anomaly index of ${entity.gae_anomaly_score || '0.42'}. Direct links established to maritime logistics and Hawala clearing networks.`,
          threatAssessment: 'High operational flight risk. Linked to cross-border communications and structured banking transactions under surveillance.'
        });
      }

      const ai = getAiClient();
      const prompt = `Generate a concise, court-ready tactical intelligence summary and threat assessment for this entity:
Entity Data: ${JSON.stringify(entity)}

Output JSON:
{
  "dossierSummary": "3-4 sentences summarizing criminal role, network influence, and verified intelligence links",
  "threatAssessment": "1-2 sentences on flight risk, weapon/violence potential, and immediate surveillance recommendation"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        }
      });

      const responseText = response.text || '{}';
      res.json(JSON.parse(responseText));
    } catch (err: any) {
      console.error('Error handling /api/gemini/summarize-dossier:', err);
      res.status(500).json({ error: 'Failed to generate dossier summary' });
    }
  });

  // Vite middleware in dev mode vs static files in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Criminal Network Analysis System backend listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
