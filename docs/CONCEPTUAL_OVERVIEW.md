# Machrou3i — Conceptual Overview (UML-style)

This document describes the **conceptual architecture** of the Machrou3i platform as a cinematic AI startup studio. It is intended for product thinking, UX alignment, and future conversion into class or system diagrams. It does **not** prescribe implementation details; existing code, APIs, and storage remain the source of truth.

---

## 1. Core Product Vision

Machrou3i is structured around **three main user experiences**:

| Experience | Purpose | User action |
|------------|---------|-------------|
| **Discover** | Explore the platform, value proposition, and startup ideas | Landing, library browse, inspiration |
| **Build** | Turn a spark of an idea into a structured project through narrative scenes | AI-guided story flow (idea → vision → market → monetization → competition → risks → roadmap) |
| **Monitor** | View and evolve the project as a smart dashboard | Project dashboard, roadmap, risks, market context |

Users move from **Discover → Build → Monitor**; the story timeline visualizes how a single idea evolves into a full dashboard.

---

## 2. Main Entities (Conceptual)

### User
- **Role**: Actor who discovers ideas, builds projects via narrative scenes, and monitors dashboards.
- **Relationships**: Creates and owns **Projects**; interacts with **NarrativeScene**s during the Build experience.

### Project
- **Role**: The central artifact—a startup/product idea that has been shaped through the narrative flow and is represented as a dashboard.
- **Attributes (conceptual)**: Identity, creation/update timestamps, and all narrative outputs (vision, audience, market, monetization, competition, risks, roadmap).
- **Relationships**:
  - Belongs to a **User** (ownership).
  - Is built from a sequence of **NarrativeScene**s.
  - Aggregates **IdeaInsight**, **MarketAnalysis**, **RiskIndicator**-like information.
  - Has one **ProjectDashboard** (the Monitor view).

### NarrativeScene
- **Role**: A single “scene” in the creative journey (e.g. “Spark of idea”, “Product vision”, “Target audience”, “Market validation”, “Monetization”, “Competitor landscape”, “Risk signals”, “Future roadmap”).
- **Attributes**: Scene index, title, narrative copy, and the structured data the user provides (e.g. problem, solution, target users).
- **Relationships**: Part of a **Project**’s story; in order they form the **story timeline** that leads to the dashboard.

### IdeaInsight
- **Role**: Refined or expanded interpretation of the user’s idea (e.g. AI-suggested angles, “what if” scenarios like “What if this targets students?” or “What if this becomes a SaaS?”).
- **Relationships**: Associated with a **Project** (or current draft); used to enrich the narrative and suggestions in the Build experience. Purely conceptual in the current app; can later map to AI expansion or static suggestions.

### MarketAnalysis
- **Role**: Structured view of market context: target audience, industry, region, and optionally market signals or validation hints.
- **Relationships**: Derived from **Project** data (e.g. target users, industry, region); can be visualized as **market signal indicators** in the UI.

### RiskIndicator
- **Role**: A visible signal for technical, market, financial, or operational risk (or opportunity).
- **Relationships**: Derived from **Project** data (e.g. risks & challenges scene); displayed on the **ProjectDashboard** and optionally in the Build flow as “risk signals”.

### ProjectDashboard
- **Role**: The Monitor view—a single dashboard per **Project** showing overview, product/market/business summary, risks, and the AI-suggested roadmap.
- **Relationships**: One-to-one with **Project**; consumes the same data (roadmap, steps 1–6) that the user provided through **NarrativeScene**s.

---

## 3. Relationships (Summary)

```
User ──(1:n)──► Project
Project ──(1:n)──► NarrativeScene   (ordered: scene 1 … 8)
Project ──(1:1)──► ProjectDashboard
Project ──(0:n)──► IdeaInsight      (conceptual; suggestions / expansion)
Project ──(0:1)──► MarketAnalysis   (derived from project fields)
Project ──(0:n)──► RiskIndicator    (derived from project risk fields)
```

- **User → Project**: One user can have many projects.
- **Project → NarrativeScene**: A project is built from a fixed sequence of narrative scenes (e.g. 8 steps in the AI creator).
- **Project → ProjectDashboard**: Each project has exactly one dashboard view.
- **Project → IdeaInsight / MarketAnalysis / RiskIndicator**: Conceptual aggregates or derivations from project data; no separate persistence required for the current product.

---

## 4. User Journey (High Level)

1. **Discover**: User lands on the platform or library, sees the three pillars (Discover / Build / Monitor) and can browse existing projects or start a new story.
2. **Build**: User starts with a **spark of idea** (name, description, category), then unlocks in order: **product vision** (problem/solution/uniqueness), **target audience** (users, industry, region), **market validation** (implicit in audience + industry), **monetization models**, **competitor landscape**, **risk signals**, and finally the **future roadmap** (AI-generated). Interactive elements (e.g. scenario cards, idea expansion suggestions) enrich the flow without changing the underlying data model.
3. **Monitor**: User confirms the story and is taken to the **ProjectDashboard**, where the same data is shown as overview, cards, and roadmap; optional **story timeline** and **market signal indicators** visualize how the idea evolved into the dashboard.

---

## 5. Design Principles (UX)

- **Narrative-first**: Each step is framed as a scene in a story, not a form.
- **Progressive disclosure**: Layers (vision, audience, market, monetization, competition, risks, roadmap) unlock in a clear order.
- **Cinematic & minimal**: Glass panels, neon accents, smooth transitions, subtle depth; coherent on desktop and mobile.
- **Lightweight & stable**: All enhancements are UI and documentation only; no changes to backend logic, variable names, routes, or core components.

---

## 6. Conversion Notes for Diagrams

- **Class diagram**: Treat User, Project, NarrativeScene, IdeaInsight, MarketAnalysis, RiskIndicator, ProjectDashboard as classes; attributes and relationships above map to associations and multiplicities.
- **System/context diagram**: User as actor; Discover / Build / Monitor as high-level use cases or subsystems; Project and ProjectDashboard as core system entities.
- **Sequence diagram**: User ↔ Build flow (NarrativeScene 1..8) → Project → ProjectDashboard for the “create project” scenario.

This overview is the single source of truth for **conceptual** product and architecture discussion; implementation continues to follow the existing codebase and storage (e.g. `AiGuidedProject`, `AiProjectDraftState`, localStorage keys).
