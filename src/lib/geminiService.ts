/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const openAiKey = import.meta.env.VITE_OPENAI_API_KEY || "";
const huggingFaceKey = import.meta.env.VITE_HUGGINGFACE_API_KEY || "";

// Initialize the Gemini API client if the key is available
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

async function askOpenAI(prompt: string): Promise<string> {
  if (!openAiKey) {
    return JSON.stringify({ error: "OpenAI key missing" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 900,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.warn("OpenAI fallback failed:", response.status, errorBody);
      return JSON.stringify({ error: "OpenAI fallback failed" });
    }

    const payload = await response.json();
    return payload.choices?.[0]?.message?.content || JSON.stringify({ error: "OpenAI returned empty content" });
  } catch (error) {
    console.error("OpenAI fallback error:", error);
    return JSON.stringify({ error: "OpenAI fallback error" });
  }
}

async function askHuggingFace(prompt: string): Promise<string> {
  if (!huggingFaceKey) {
    return JSON.stringify({ error: "HuggingFace key missing" });
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${huggingFaceKey}`,
      },
      body: JSON.stringify({ inputs: prompt, options: { use_cache: false, wait_for_model: true } }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.warn("HuggingFace fallback failed:", response.status, errorBody);
      return JSON.stringify({ error: "HuggingFace fallback failed" });
    }

    const payload = await response.json();
    return payload?.generated_text || JSON.stringify({ error: "HuggingFace returned empty response" });
  } catch (error) {
    console.error("HuggingFace fallback error:", error);
    return JSON.stringify({ error: "HuggingFace fallback error" });
  }
}

export async function askGemini(prompt: string, fallbackJson?: any): Promise<string> {
  if (!genAI) {
    console.warn("Gemini API key is not set. Trying OpenAI or HuggingFace fallback.");
    if (openAiKey) return askOpenAI(prompt);
    if (huggingFaceKey) return askHuggingFace(prompt);
    return JSON.stringify(fallbackJson || { error: "API key missing" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (openAiKey) return askOpenAI(prompt);
    if (huggingFaceKey) return askHuggingFace(prompt);
    return JSON.stringify(fallbackJson || { error: "Gemini execution failed" });
  }
}

/**
 * Enterprise Center Analysis generator
 */
export async function generateEnterpriseAnalysis(inputs: {
  name: string;
  industry: string;
  teamSize: string;
  goal: string;
  challenge: string;
  lang: string;
}) {
  const isArabic = inputs.lang === "ar";
  const isFrench = inputs.lang === "fr";

  let responseLang = "English";
  if (isArabic) responseLang = "Arabic (RTL compatible)";
  if (isFrench) responseLang = "French";

  const prompt = `You are a high-level enterprise intelligence consultant. Analyze the following enterprise details:
- Name: ${inputs.name}
- Industry: ${inputs.industry}
- Team Size: ${inputs.teamSize} employees
- Main Goal: ${inputs.goal}
- Current Challenge: ${inputs.challenge}

Generate a comprehensive enterprise analysis report in JSON format. The response MUST be ONLY valid JSON matching this structure exactly (no markdown blocks, no triple backticks):
{
  "executiveSummary": "A concise, powerful executive summary targeting investors",
  "swot": {
    "strengths": ["Strength 1", "Strength 2", "Strength 3"],
    "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
    "opportunities": ["Opportunity 1", "Opportunity 2", "Opportunity 3"],
    "threats": ["Threat 1", "Threat 2", "Threat 3"]
  },
  "teamAnalysis": {
    "structure": "Overview of the optimal team structure for this goal",
    "memberInsights": [
      {"role": "Key Role 1", "importance": "Why they are vital", "hiringCost": "Estimated budget level"},
      {"role": "Key Role 2", "importance": "Why they are vital", "hiringCost": "Estimated budget level"}
    ]
  },
  "revenueOptimizer": {
    "opportunities": ["Opportunity 1", "Opportunity 2"],
    "kpis": ["KPI 1", "KPI 2"],
    "projectedGrowth": [8, 15, 24, 38, 55, 75]
  },
  "businessNames": ["Name 1", "Name 2", "Name 3"],
  "growthIntelligence": "Strategic roadmap to scale and solve the challenge",
  "investorInsights": "How this business can attract capital or boost valuation"
}

The language of the response must be: ${responseLang}. Use professional enterprise vocabulary.`;

  const fallback = {
    executiveSummary: `Analysis of ${inputs.name} shows high potential in the ${inputs.industry} sector. Resolving "${inputs.challenge}" is critical to achieving "${inputs.goal}".`,
    swot: {
      strengths: ["Agile execution capabilities", "Clear sector expertise", "Strategic vision align"],
      weaknesses: ["Scale constraints with team size of " + inputs.teamSize, "Operational bottleneck under current challenge", "Resource allocation overheads"],
      opportunities: ["Leverage AI and modern automation", "Address underserved B2B customer segments", "Optimized subscription revenue models"],
      threats: ["Intensifying market rivalry", "Economic volatility impacting conversion rates", "Accelerated technology displacement"]
    },
    teamAnalysis: {
      structure: `Ideal structure for ${inputs.name} comprises lean cross-functional teams focused on rapid product loops and scalable distribution.`,
      memberInsights: [
        { role: "Lead Solutions Architect", importance: "Saves cloud infrastructure cost and enforces strict security", hiringCost: "Medium-High" },
        { role: "Growth Marketer", importance: "Main driver to bypass growth plateau and lower CAC", hiringCost: "Medium" }
      ]
    },
    revenueOptimizer: {
      opportunities: ["Transition to tiered value-based pricing", "Deploy programmatic white-label partnerships"],
      kpis: ["Customer Lifetime Value (LTV) / CAC Ratio > 3x", "Net Revenue Retention (NRR) > 110%"],
      projectedGrowth: [5, 12, 22, 35, 52, 70]
    },
    businessNames: [`${inputs.name} Prime`, `${inputs.name} Nexus`, `${inputs.name} Lab`],
    growthIntelligence: `Focus on solving the bottleneck of "${inputs.challenge}" by optimizing inbound acquisition pipelines and implementing high-efficiency workflows.`,
    investorInsights: `Valuation can be scaled by 2.4x by shifting transactional services to high-retention annual recurring revenue formats.`
  };

  const raw = await askGemini(prompt, fallback);
  try {
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return fallback;
  }
}

/**
 * Business Name Generator
 */
export async function generateBusinessNames(inputs: {
  industry: string;
  keywords: string;
  style: string;
  lang: string;
}) {
  const isArabic = inputs.lang === "ar";
  const isFrench = inputs.lang === "fr";

  let responseLang = "English";
  if (isArabic) responseLang = "Arabic";
  if (isFrench) responseLang = "French";

  const prompt = `Generate exactly 20 creative, premium, brandable business names in ${responseLang} for:
- Industry: ${inputs.industry}
- Keywords: ${inputs.keywords}
- Style: ${inputs.style}

The response MUST be ONLY valid JSON matching this structure exactly (no markdown blocks, no triple backticks):
{
  "names": [
    { "name": "Name 1", "meaning": "A beautiful description of the name's meaning and branding potential", "score": 95 },
    { "name": "Name 2", "meaning": "A beautiful description of the name's meaning and branding potential", "score": 88 }
  ]
}`;

  const fallbackList = [];
  const words = inputs.keywords.split(/[,\s]+/).filter(Boolean);
  const baseSeed = words[0] || "Nova";
  const suffixList = [
    "Nexus", "Hub", "Lab", "Flow", "Wave", "Core", "Ventures", "Solutions", 
    "Edge", "Sphere", "Shift", "Grid", "Base", "Prime", "Studio", "Forge", 
    "Quest", "Sync", "Link", "Craft"
  ];

  for (let i = 0; i < 20; i++) {
    const suffix = suffixList[i % suffixList.length];
    const generatedName = i % 2 === 0 ? `${baseSeed}${suffix}` : `${suffix}${baseSeed}`;
    fallbackList.push({
      name: generatedName,
      meaning: `A premium brand blend conveying elite operations and strategic ${inputs.style} styling inside the ${inputs.industry} sector.`,
      score: Math.floor(Math.random() * (98 - 78) + 78)
    });
  }

  const fallback = { names: fallbackList };
  const raw = await askGemini(prompt, fallback);
  try {
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return fallback;
  }
}

/**
 * Logo Identity and Slogan suggestions
 */
export async function generateLogoBrandDirection(inputs: {
  name: string;
  industry: string;
  values: string;
  lang: string;
}) {
  const isArabic = inputs.lang === "ar";
  const isFrench = inputs.lang === "fr";

  let responseLang = "English";
  if (isArabic) responseLang = "Arabic";
  if (isFrench) responseLang = "French";

  const prompt = `Design a premium strategic brand logo concept direction in ${responseLang} for:
- Company Name: ${inputs.name}
- Industry: ${inputs.industry}
- Key Brand Values: ${inputs.values}

The response MUST be ONLY valid JSON matching this structure exactly (no markdown blocks, no triple backticks):
{
  "concepts": [
    { "title": "Concept 1", "description": "Logo visual design representation, shapes and forms" },
    { "title": "Concept 2", "description": "Alternative luxury logo direction and layout suggestions" }
  ],
  "palette": [
    { "color": "Neon Aqua", "hex": "#00F0FF", "meaning": "Innovation and trust in digital spaces" },
    { "color": "Dark Graphite", "hex": "#141416", "meaning": "Premium solidity and corporate power" }
  ],
  "typography": {
    "fontFamily": "Outfit / Inter",
    "description": "Modern sans-serif typefaces to support clean aesthetics"
  },
  "slogans": ["Slogan 1", "Slogan 2", "Slogan 3"],
  "identitySuggestions": "Strategic alignment suggestions for print, physical assets, and high-fidelity 3D garment mockups."
}
`;

  const fallback = {
    concepts: [
      { title: "The Modern Portal", description: "A minimalistic geometric monogram icon blending letters into an open portal, representing scale and frictionless growth." },
      { title: "Dynamic Flow Ascent", description: "An elegant, uninterrupted kinetic ribbon icon arching upwards, signifying momentum and technological forwardness." }
    ],
    palette: [
      { color: "Electric Cyan", hex: "#00F0FF", meaning: "Represents absolute digital focus, agility, and modern tech authority." },
      { color: "Luxe Onyx", hex: "#0B0F19", meaning: "Represents luxury, premium quality, stability, and sleek contrast." },
      { color: "Brushed Platinum", hex: "#F3F2EE", meaning: "Represents modern minimalism, cleanliness, and structural balance." }
    ],
    typography: {
      fontFamily: "Outfit / Plus Jakarta Sans",
      description: "A combination of standard geometric grotesque font for heading weights and smooth humanistic typography for subtext."
    },
    slogans: ["Define the Future.", "Momentum, Multiplied.", "Uncompromised Vision."],
    identitySuggestions: "Ideal for embroidery on oversized heavyweight Sage Green hoodies and centered chest screens on Core Black t-shirts. Keep contrast ratios high (at least 7.5:1) for optimal luxury digital presence."
  };

  const raw = await askGemini(prompt, fallback);
  try {
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return fallback;
  }
}

/**
 * Opportunity Finder AI insights
 */
export async function generateOpportunityInsights(inputs: {
  title: string;
  type: string;
  content: string;
}) {
  const prompt = `Analyze this community business proposal:
- Title: ${inputs.title}
- Type: ${inputs.type}
- Detail: ${inputs.content}

Generate expert strategic AI market intelligence analysis. The response MUST be ONLY valid JSON matching this structure exactly (no markdown blocks, no triple backticks):
{
  "score": 85,
  "potential": "High / Medium / Low",
  "risk": "Low / Medium / High",
  "revenue": "Estimated potential TAM / Revenue numbers",
  "monetization": "Two clear monetization channels",
  "growth": "Actionable immediate strategic growth advice"
}
`;

  const fallback = {
    score: 82,
    potential: "High",
    risk: "Medium",
    revenue: "$1.5M - $3M annual local addressable market",
    monetization: "Transactional cut fee combined with tiered SaaS developer API access.",
    growth: "Launch a barebones functional prototype to 10 early adaptors within target local developer communities."
  };

  const raw = await askGemini(prompt, fallback);
  try {
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return fallback;
  }
}
