# Phase 1: Interview Guide

Conduct a 5-section interview to gather all business data for the landing page. Each section is administered via `AskUserQuestion` in order.

---

## Section A — Service/Product Identification

**Goal**: Understand what the business offers in precise, specific terms.

### Questions

1. **One-line description**: "How would you describe your service or product in one sentence?"
   - *Probe for specificity*: If they say "we provide marketing services", ask "what kind specifically — SEO, paid ads, content marketing?"

2. **Core keywords**: "What 3-5 keywords should this page rank for?"
   - These inform headings, meta description, and ALT text

3. **Key selling points**: "What are the 3 most important things your service delivers?"
   - *Listen for distinction*: not "high quality" but "48-hour turnaround" or "ISO 9001 certified"

4. **Pricing model**: "How do you charge? (flat fee, hourly, subscription, quote-based)"
   - Informs FAQ and trust signals

### Output Mapping
```
brief.json → service.name, service.keywords, service.sellingPoints, service.pricing
```

---

## Section B — Target Customer

**Goal**: Build a precise customer persona and uncover buyer questions.

### Questions

1. **Customer persona**: "Describe your ideal customer — industry, company size, role/title."
   - Example: "Manufacturing operations managers at 50-500 employee factories"

2. **Primary pain points**: "What specific problems or frustrations does your customer face that you solve?"
   - *Push for specifics*: not "they're inefficient" but "they spend 12 hours/week manually reconciling inventory"

3. **Trigger events**: "What event or realization prompts them to start looking for a solution?"
   - Example: "They fail an audit", "Their boss tells them to cut costs by 20%"

4. **Buyer questions** (6-8 required): "What questions does a buyer ask before making a decision? List 6-8."
   - Examples:
     - "How long does implementation take?"
     - "Do you work with companies our size?"
     - "What ROI can we expect in the first 90 days?"
     - "How is this different from doing it in-house?"
     - "What support do you provide after purchase?"
     - "Is it compatible with our existing systems?"
     - "What certifications do you hold?"
     - "Can we see a demo first?"

### Output Mapping
```
brief.json → audience.persona, audience.painPoints, audience.triggers, audience.buyerQuestions[]
```

---

## Section C — Competitor Analysis

**Goal**: Identify competitors and the unique information advantage.

### Questions

1. **Main competitors**: "Who are your top 2-3 competitors?"

2. **Competitor strengths**: "What does each competitor do well?"

3. **Competitor weaknesses**: "What does each competitor do poorly or fail to address?"

4. **Unique information**: "What information or capability do you have that competitors don't?"
   - This is the core of the page's differentiation. Examples:
     - "We have 15 years of proprietary manufacturing data"
     - "We're the only ones with real-time API integration"
     - "Our team includes 5 PhDs in materials science"

### Output Mapping
```
brief.json → competitors[].name, competitors[].strengths, competitors[].weaknesses
brief.json → uniqueInfo
```

---

## Section D — Key Data & Evidence

**Goal**: Gather verifiable proof points for evidence escalation.

### Questions

1. **Core statistics**: "What specific numbers demonstrate your impact? (years in business, clients served, percentage improvements, etc.)"
   - Examples: "14 years in business", "2,300+ projects completed", "average 34% cost reduction"

2. **Customer results**: "Can you share a specific customer example with measurable outcomes?"
   - Format: "Client X was facing [problem]. We [action]. They got [result]."
   - *If no specific case study*: Ask for a composite/typical outcome

3. **Certifications & credentials**: "What certifications, awards, or credentials do you hold?"
   - Examples: "ISO 9001:2015", "AWS Partner Network", "Inc. 5000 2024"

4. **Notable clients**: "Can you name clients or industries you've served (within confidentiality)?"
   - *Respect NDAs* — industry references are fine if named clients aren't possible

### Output Mapping
```
brief.json → evidence.statistics[], evidence.caseStudies[], evidence.certifications[], evidence.clients[]
```

---

## Section E — Conversion Goals

**Goal**: Define what visitors should do on the page.

### Questions

1. **Primary CTA**: "What is the single most important action you want visitors to take?"
   - Examples: "Book a free consultation", "Get a quote", "Start a free trial"
   - *Note the exact button text* — this goes on the primary CTA

2. **Secondary CTA**: "What's a secondary action for visitors not ready for the primary?"
   - Examples: "Download our whitepaper", "Subscribe to newsletter", "View case studies"

3. **Lead magnet**: "Do you offer a free resource to capture leads? (guide, checklist, assessment, demo)"
   - Format: "Free X that does Y for Z"

4. **Form fields**: "What information do you need in the lead capture form?"
   - Minimum viable: name + email + company

### Output Mapping
```
brief.json → conversion.primaryCTA, conversion.secondaryCTA, conversion.leadMagnet, conversion.formFields[]
```
