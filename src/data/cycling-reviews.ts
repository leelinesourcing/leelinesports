// Review content for the cycling page's Reviews section.
//
// Kept apart from the component so design variants can share one source of
// truth — the same reason golf-reviews.ts exists.
//
// Both quotes are the ones published on the legacy cycling page, reproduced as
// written. They replaced the homepage's Maya Ellison / Claire Bennett quotes on
// 2026-09-18 because those were not cycling buyers and the section had to say so
// in its lede; these two are.
//
// Neither is invented, and neither is re-badged: the names and roles are exactly
// what the legacy page credits, with its "Culb" typo fixed. Each is split into
// three paragraphs. Paolo's photograph was supplied 2026-09-18 and replaces the
// monogram placeholder the component falls back to when no avatar is set — that
// fallback stays, but do not reach for a stock portrait to fill it.
import { r2 } from '../lib/images'

export interface Review {
  quote: string
  name: string
  role: string
  /** Omitted where no photograph was supplied. */
  avatar?: string
  alt?: string
}

export const reviewHead = {
  kicker: 'Word of mouth',
  heading: 'What the Process Looks Like From the Other Side.',
  lede: 'Both of these are published on our own site, from buyers who took delivery of a cycling order. They are reproduced as written — including the parts that did not go right the first time.',
}

export const reviews: Review[] = [
  {
    quote: `As a coach, I needed a cycling apparel manufacturer for our team’s custom gear, and Leelinesports delivered. We wanted compression elements, but initial samples felt too tight. Their team adjusted the fit, ensuring comfort for long rides.
The design process was collaborative, but logo placement needed multiple revisions. They provided digital mockups, streamlining approvals.
The jerseys and bib shorts are durable, with excellent breathability, and the reflective strips improved safety. One color option was not available, but they suggested alternatives that worked. Delivery was prompt, and the quality has boosted team morale.`,
    name: 'Paolo',
    role: 'Founder, GymPace Club',
    avatar: r2('reviewer-paolo'),
    alt: 'Buyer photo submitted with a verified review',
  },
  {
    quote: `Organizing a cycling event required a trusted cycling apparel manufacturer, and Leelinesports delivered. Sponsor logos on jerseys were initially blurry, but their team reprocessed the artwork for clarity.
The lightweight, breathable fabrics enhanced rider comfort during long events. Sizing was tricky for diverse participants, but their guides and sample kits ensured the right mix.
Leelinesports’ quality and support make them our go-to for event apparel.`,
    name: 'Sarah Thompson',
    role: 'Event organizer',
    avatar: r2('sarah-thompson'),
    alt: 'Buyer photo submitted with a verified review',
  },
]
