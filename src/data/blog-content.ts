import { BlogPost } from './blog-posts';

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'what-does-silicone-coating-do',
    title: 'What does the silicone coating on your paraglider actually do?',
    metaTitle:
      'What Does Silicone Coating Do on a Paraglider? — A Technician Explains | paraMOT',
    metaDescription:
      'Silicone coating on paraglider fabric is a structural component, not just a surface treatment. Learn how it affects porosity, tear strength, UV resistance, and when it matters for your wing.',
    keywords: [
      'paraglider silicone coating',
      'paraglider fabric coating',
      'nylon ripstop coating',
      'paraglider porosity',
      'wing fabric degradation',
      'paraglider UV protection',
    ],
    author: 'Skye',
    publishedAt: '2026-03-02',
    category: 'technique',
    excerpt:
      "Most pilots know the coating matters, but few know exactly what it does. Here's how it affects your wing's structure, performance, and lifespan.",
    content: `Every paraglider canopy starts life as nylon ripstop fabric — lightweight, strong, and woven in a grid pattern that resists tearing. But raw nylon is porous. Air passes straight through it. A wing made from untreated nylon wouldn't hold internal pressure long enough to maintain a usable aerofoil shape.

That's where the silicone coating comes in.

## What the coating does

Silicone coating on nylon ripstop serves several functions simultaneously:

**Airtightness.** The most obvious job. The coating fills the gaps between warp and weft threads, making the fabric effectively airtight. This is what allows your wing to maintain cell pressure — the internal air pressure that gives the canopy its shape and structural rigidity.

**Dimensional stability.** The coating locks the weave geometry in place. Without it, the threads can shift under load, causing the fabric to stretch unevenly. This "ballooning" effect distorts the aerofoil profile and changes how the wing flies. The coating keeps the fabric dimensionally stable under the dynamic loads of flight.

**Tear resistance.** Silicone coating significantly increases the force needed to propagate a tear through the fabric. The ripstop weave provides the first line of defence (thicker threads at regular intervals that stop tears from running), but the coating adds a second layer by bonding the fibres together. When we measure tear resistance with a Bettsometer, we're measuring the combined strength of the weave and its coating.

**UV protection.** Nylon degrades under ultraviolet radiation — the polymer chains break down, reducing both strength and elasticity. The silicone coating acts as a partial UV shield, slowing this degradation. It's not complete protection (UV still gets through), but it meaningfully extends the fabric's useful life.

**Weight efficiency.** Silicone achieves all of the above while adding minimal weight. This matters when manufacturers are optimising every gram for performance, handling, and certification weight ranges.

## How the coating degrades

The coating doesn't last forever. Several factors break it down:

- **UV exposure** is the biggest factor. Every hour in the sun — whether flying or laid out on a field — chips away at the coating. The damage is cumulative and irreversible.
- **Mechanical wear** from repeated inflation, packing, and ground contact gradually abrades the coating, particularly on the leading edge and at fold lines.
- **Chemical exposure** from sunscreen, insect repellent, and even skin oils can attack the silicone bond. This is why we discourage washing your wing with detergents — they strip the coating.
- **Heat** accelerates all of the above. A wing stored in a hot car boot degrades faster than one in a cool cupboard.

## What degradation looks like in practice

As the coating breaks down, the fabric becomes more porous — air passes through more easily. This is exactly what we measure during a porosity test. New fabric typically reads 200+ seconds on a porosimeter (the time for a fixed volume of air to pass through). As the coating degrades, that number drops.

But here's the nuance that's often misunderstood: **a porous glider can still fly safely**, provided the fabric passes tear resistance tests. Porosity alone doesn't ground a wing. What you'll notice is slower inflation, slightly reduced performance, and the wing feeling less crisp in flight. The fabric losing its elasticity and tear strength — that's when it becomes a structural concern.

This is why a proper service tests both porosity *and* tear resistance. One number alone doesn't tell the full story.

## What you can do

You can't re-coat your wing (despite what some internet forums suggest — DIY silicone treatments cause more problems than they solve). But you can slow the degradation:

- **Pack your wing after landing.** Don't leave it laid out in the sun. Even 20 minutes of unnecessary UV exposure adds up over a season.
- **Store in a cool, dry, dark place.** Not in the car, not in the conservatory, not under a window.
- **Use a concertina bag.** Reduces random creasing that concentrates wear at fold points.
- **Avoid chemical contact.** Apply sunscreen before handling your wing, not after. Keep insect repellent away from the fabric.
- **Don't wash your wing** unless absolutely necessary (e.g., salt water exposure). If you must, use fresh water only — never detergent.

## The bottom line

The silicone coating is a structural component of your wing's fabric system — maintaining airtightness, dimensional stability, tear resistance, and UV protection simultaneously. When it degrades, you don't get a sudden failure — you get a gradual decline in fabric performance that's invisible from the outside but measurable with the right instruments.

That's why regular porosity and tear resistance testing matters. It gives you objective data on where your fabric sits on that degradation curve, so you can make informed decisions about your equipment rather than guessing.`,
    relatedFAQIds: [
      'what-does-silicone-coating-do',
      'what-is-porosity-testing',
      'washing-paraglider',
      'uv-protection',
      'storage-tips',
    ],
  },
];
