// Review content for the cycling page's Reviews section.
//
// Kept apart from the component so design variants can share one source of
// truth — the same reason golf-reviews.ts exists.
//
// Both quotes are the ones already published on the homepage, attributed to the
// same real named buyers. They are reused rather than rewritten for cycling on
// purpose: inventing a cycling buyer, or re-badging these two as cyclists, would
// put a fabricated endorsement on a commercial page. Their roles stay exactly as
// published, and the section's lede says plainly what they are — buyers of the
// same production process, not necessarily of cycling kit.
//
// If real cycling-buyer quotes are ever supplied, they replace these.
import { r2 } from '../lib/images'

export interface Review {
  quote: string
  name: string
  role: string
  avatar: string
  alt?: string
}

export const reviewHead = {
  kicker: 'Word of mouth',
  heading: 'What the Process Looks Like From the Other Side.',
  lede: 'Neither of these buyers rode a bike for us — they came through the same production line, the same QC sheet and the same DDP terms this page describes. Their words are published unedited, and their photographs are theirs.',
}

export const reviews: Review[] = [
  {
    quote: `We sent a napkin sketch on a Tuesday. Ten days later I was holding a sample that looked better than the render. We cut three SKUs from it, and I have never spoken to a factory floor since.
The second run shipped in five weeks and arrived without me touching a single customs form.`,
    name: 'Maya Ellison',
    role: 'Founder, compression-wear label',
    avatar: r2('reviewer-2'),
    alt: 'Buyer photo submitted with a verified review',
  },
  {
    quote: `Our defect rate dropped from 6% to 0.4% in two quarters. That is the difference between a refund wave and a reorder, and it is why we stopped shopping around.
We have added two more styles since, both made to the same tolerances, and neither has needed a change.`,
    name: 'Claire Bennett',
    role: 'Amazon FBA seller, activewear',
    avatar: r2('reviewer-3'),
    alt: 'Buyer photo submitted with a verified review',
  },
]
