// Review content for the golf page's Reviews section.
//
// Kept apart from the component so design variants can share one source of
// truth. Duplicating customer quotes across files is how a page ends up showing
// two different versions of the same person's words.
//
// The quotes are rewrites supplied by the user on 2026-09-17, attributed to real
// named customers. Paragraph breaks are single newlines, not blank lines —
// renderers split on `\n` so each paragraph gets its own first-line indent.
import { r2 } from '../lib/images'

export interface Review {
  quote: string
  name: string
  role: string
  avatar: string
  alt?: string
}

export const reviewHead = {
  kicker: 'Reviews',
  heading: 'What Buyers Say.',
  lede: 'Reviews are collected from buyers who have taken delivery of a bulk order. The photographs are theirs — unretouched, ungraded, cropped only to fit the frame.',
}

export const reviews: Review[] = [
  {
    quote: `Preparing for our annual charity tournament, I was struggling to find reliable, high-quality golf apparel manufacturers until I connected with Jack from LeelineSports in China.
The custom polos exceeded every expectation. Their premium moisture-wicking fabric kept players cool, and the precision-embroidered logos stayed sharp wash after wash. What truly set them apart was their exceptional flexibility—delivering urgent last-minute additions seamlessly without stretching our budget.
The results were immediate: participants loved the gear, club prestige soared, and tournament merchandise sales jumped by 30% year-over-year. Beyond standard production, LeelineSports proved to be a dedicated, long-term manufacturing partner.
For any brand or club seeking elite craftsmanship, competitive factory pricing, and dependable OEM service, LeelineSports is the definitive choice to elevate your game.`,
    name: 'Sarah Thompson',
    role: 'Club charity tournament · repeat order',
    avatar: r2('sarah-thompson'),
    alt: 'Buyer photo submitted with a verified review',
  },
  {
    quote: `After three different suppliers ghosted me in a single year, I completely stopped trusting any overseas partner who couldn’t put an actual name on the factory floor. Finding a dedicated on-site representative changed everything for our supply chain.
Their designated man-in-plant has actively managed our production orders for 18 straight months, and we haven’t faced a single customs hold or clearance delay since. True reliability isn’t about expecting zero issues—it’s about having immediate eyes and ears on the ground when deviations happen.
Case in point: when an active dye lot recently came back two shades off spec, I didn’t have to wait days for excuses. I had high-resolution inspection photos of the run and a confirmed re-cut schedule delivered directly to my inbox that same afternoon.
That level of accountability turns standard vendor transactions into a rock-solid, risk-free manufacturing partnership.`,
    name: 'Daniel Kessler',
    role: 'Ops lead, outdoor swim brand',
    avatar: r2('reviewer-1'),
  },
]
