# BNext Founder Story Slides — Full Redesign Instructions

## Overview

These slides are part of a BNext funding renewal presentation for government officials deciding whether to renew program funding. CEO Vik will present them live. The current founder slides are structured as program case studies. They need to become **human transformation stories** where each founder's personal journey is the emotional anchor and the business traction is the proof.

**Do not deviate from the existing presentation's design system** — dark mode panels, BHive color palette (black/gold `#F5C100` / orange `#F48424`), Barlow Condensed display typography, hexagonal motifs, rounded card borders, `SlideSection` wrapper, `SectionRule` chip+divider pattern.

---

## 1. Founder Photos — How to Incorporate

Photos are stored in the GitHub repo at `Public/FounderPics/`. Reference them using the Vite base URL pattern already used in the project (see `SlideBrandRow` which uses `` `${base}BNextLogo.png` ``).

Each story object should get a `founderPhoto` field pointing to the correct filename:

```js
// In content.js, add to each story object:
{ founderPhoto: 'FounderPics/Enable_Talent_Amandipp.jpg' }
```

**Complete filename mapping:**

| Story ID | Photo Filename |
|---|---|
| Enabled Talent | `FounderPics/Enable_Talent_Amandipp.jpg` |
| SimpleView | `FounderPics/SimpleView_Shushant_Jain.jpg` |
| Questify | `FounderPics/Questify_Vynanvin_Madheswaran.jpg` |
| Oxana Technologies | `FounderPics/OxanaTechnologies_Frederick_Elum.jpeg` |
| BookMyTherapy | `FounderPics/BookMyTherapy_Neha_Juwale.jpg` |
| Synoris | `FounderPics/Synoris_Inderjeet_Singh.jpg` |
| AISHAR | `FounderPics/AISHAR_Manmeet_Singh.jpg` |
| Treepz | `FounderPics/Treepz_Onyeka_Akumah.jpg` |

Note the Oxana file uses `.jpeg` extension, all others use `.jpg`.

In the component, resolve the path the same way logos are resolved:

```jsx
const base = import.meta.env.BASE_URL;
// then:
<img src={`${base}${story.founderPhoto}`} ... />
```

---

## 2. Which Founders Get Slides

After reviewing the narrative data, **8 founders** have enough detail for compelling transformation slides. The others (Chromatic Solutions, Kayfko Zafarani, Ukrainochka, SilkNext, Milesmate, GAIN AI Network) either have no narrative or only a one-line revenue stat — not enough for the new format. Remove any existing slides for founders without sufficient narrative, and build slides for these 8.

The recommended **presentation order** places the strongest transformation stories at positions of emphasis (first, last, and the Oxana revenue story as the crescendo):

1. **Enabled Talent** — Amandeep Singh (strongest personal transformation)
2. **AISHAR** — Manmeet Singh ($60K→$500K in 14 weeks, Silicon Valley pedigree)
3. **BookMyTherapy** — Neha Juwale (mental health for immigrants, Oktoberfest Woman of the Year)
4. **Questify** — Vynavin & Madheswaran (high school students, representing Canada internationally)
5. **SimpleView** — Sushant Jain (IBM veteran, co-founder found + 2 sales in 10 days)
6. **Synoris** — Inderjeet Singh (aggressive seller → relationship-first communicator)
7. **Treepz** — Onyeka Akumah (HQ launch → $500K government project)
8. **Oxana Technologies** — Frederick Elum (first-time entrepreneur → $250M+ carbon credits, projected $20M revenue — the biggest number, saved for last)

---

## 3. New Slide Layout — Component Architecture

### Delete these old components:
- `StoryVisual`
- `StoryVisualSlide4`
- `StorySection`
- `StorySectionSlide4`

### Create these new components:

#### `FounderPhoto` component

```jsx
function FounderPhoto({ src, alt, company }) {
  const base = import.meta.env.BASE_URL;
  return (
    <div className="relative h-full min-h-[20rem] overflow-hidden rounded-[28px]">
      <img
        src={`${base}${src}`}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      {/* Bottom gradient fade into dark bg */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,10,0.95)_0%,rgba(10,10,10,0.4)_35%,transparent_60%)]" />
      {/* Subtle gold accent glow at top */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,202,5,0.12),transparent_50%)]" />
      {/* Company watermark at bottom of photo */}
      <div className="absolute bottom-4 left-5 right-5 z-10">
        <p className="font-display text-[clamp(1.4rem,2.2vw,2rem)] uppercase leading-none text-white/25">
          {company}
        </p>
      </div>
    </div>
  );
}
```

#### `StorySlideRedesigned` component

This replaces both `StorySection` and `StorySectionSlide4` with a single unified component:

```jsx
function StorySlideRedesigned({ story }) {
  return (
    <SlideSection id={story.id} mode="dark">
      <div className="flex h-full flex-col">
        {/* Top bar */}
        <div className="flex-none">
          <SectionRule label={story.label} tone="dark" compact />
        </div>

        {/* Main content */}
        <div className="mt-3 flex min-h-0 flex-1">
          <div className="grid h-full w-full grid-cols-12 gap-5 lg:gap-6">

            {/* LEFT: Founder photo */}
            <div className="col-span-12 lg:col-span-4">
              <FounderPhoto
                src={story.founderPhoto}
                alt={`${story.name}, founder of ${story.company}`}
                company={story.company}
              />
            </div>

            {/* RIGHT: Narrative content */}
            <div className="col-span-12 flex flex-col lg:col-span-8">

              {/* Founder name + company */}
              <div className="flex-none">
                <p className="text-[0.78rem] uppercase tracking-[0.22em] text-white/50">
                  {story.name}
                </p>
                <h2 className="mt-1 font-display text-[clamp(2.8rem,5.5vw,5.2rem)] uppercase leading-[0.90] tracking-[-0.02em] text-white">
                  {story.company}
                </h2>
              </div>

              {/* Pull quote — the emotional hook */}
              <div className="mt-4 flex-none">
                <p className="max-w-3xl text-[clamp(1.15rem,1.5vw,1.4rem)] leading-[1.55] text-[var(--yellow)]">
                  {story.pullQuote}
                </p>
              </div>

              {/* THEN / NOW cards */}
              <div className="mt-5 grid min-h-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2">

                {/* THEN card — subdued */}
                <div className="flex flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="mb-2 flex-none text-[0.72rem] uppercase tracking-[0.22em] text-white/40">
                    Then
                  </p>
                  <p className="min-h-0 flex-1 text-base leading-7 text-white/70">
                    {story.thenSnapshot}
                  </p>
                </div>

                {/* NOW card — elevated with gold accent */}
                <div className="flex flex-col overflow-hidden rounded-[24px] border border-[var(--yellow)]/25 bg-[linear-gradient(180deg,rgba(255,202,5,0.10),rgba(255,202,5,0.03)_40%,rgba(255,255,255,0.02))] p-5">
                  <p className="mb-2 flex-none text-[0.72rem] uppercase tracking-[0.22em] text-[var(--yellow)]/70">
                    Now
                  </p>
                  <p className="min-h-0 flex-1 text-base leading-7 text-white/90">
                    {story.nowSnapshot}
                  </p>
                </div>
              </div>

              {/* Bottom row: micro-proof badges + breadcrumb */}
              <div className="mt-4 flex-none">
                <div className="flex flex-wrap items-center gap-2">
                  {story.microProof.slice(0, 4).map((proof) => (
                    <div
                      key={proof}
                      className="rounded-2xl border border-white/10 bg-black/20 px-3.5 py-2 text-sm text-white/75"
                    >
                      {proof}
                    </div>
                  ))}
                  <div className="mx-2 h-5 w-px bg-white/15" />
                  <StoryBreadcrumb />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideSection>
  );
}
```

### Update the render block in `App()`

Replace the old story rendering block (approximately lines 1037–1044) with:

```jsx
{/* 3–10. Founder stories */}
{stories.map((story) => (
  <StorySlideRedesigned key={story.id} story={story} />
))}
```

### Mobile responsiveness

On screens below `lg`, the photo stacks above the content. Add `max-h-[14rem]` to the photo container on mobile so narrative content remains visible:

```jsx
<div className="col-span-12 max-h-[14rem] lg:col-span-4 lg:max-h-none">
```

---

## 4. Revised Content for `content.js` — All 8 Founder Stories

Replace the existing `stories` array with the following. Preserve the existing field names that the rest of the app still uses (`id`, `label`, `name`, `company`) and add the new fields (`founderPhoto`, `pullQuote`, `thenSnapshot`, `nowSnapshot`). Keep `microProof` as it provides the badge data. The fields `oneLiner`, `whereTheyStarted`, `support`, `tractionTitle`, `tractionDetail`, `accent`, `visualStat`, and `companyTag` can be removed or left in place — the new component does not render them.

---

### Story 1: Enabled Talent

```js
{
  id: 'story-enabled-talent',
  label: 'Founder Impact Story',
  name: 'Amandeep Singh',
  company: 'Enabled Talent',
  founderPhoto: 'FounderPics/Enable_Talent_Amandipp.jpg',
  pullQuote: 'Amandeep walked into BNext unable to speak confidently in front of a small room of his peers. Today he delivers keynotes at major conferences and interviews on national media.',
  thenSnapshot: 'Entered the program at an early stage — before revenue, before operations. Beyond the business challenges, Amandeep struggled with the foundational skill every founder needs: the ability to communicate his vision. Speaking to even a small group of peers felt daunting.',
  nowSnapshot: 'Enabled Talent has reached over 20,000 users, expanded internationally through the UNICEF Startup Lab into Africa, Saudi Arabia, Qatar, and Europe, and built partnerships with universities, nonprofits, and government organizations. Amandeep has been introduced to national leaders including Canada\'s AI Minister and won the City of Brampton Accessibility Award, the Y Media Humanitarian Award, and recognition among Canada\'s Top 3 Diversity Companies.',
  microProof: [
    '20,000+ users',
    'UNICEF Startup Lab',
    'International expansion',
    'Multiple awards',
  ],
}
```

---

### Story 2: AISHAR

```js
{
  id: 'story-aishar',
  label: 'Founder Impact Story',
  name: 'Manmeet Singh',
  company: 'AISHAR',
  founderPhoto: 'FounderPics/AISHAR_Manmeet_Singh.jpg',
  pullQuote: 'After 15 years at Adobe, Apple, and Instacart in Silicon Valley, Manmeet moved to Canada and grew from $60K to $500K in secured contracts within 14 weeks of the program.',
  thenSnapshot: 'A deeply experienced technologist — but a first-time entrepreneur. After more than a decade in Silicon Valley, Manmeet relocated to Canada and needed to learn an entirely new playbook: how to find customers, navigate public procurement, and position AI services in an unfamiliar market.',
  nowSnapshot: 'Within 14 weeks, AISHAR grew from $60,000 to $500,000 in secured contracts. Manmeet defined his customer personas, shaped a go-to-market strategy spanning private and public sector opportunities, and was matched with experienced mentors in financial planning and entrepreneurship — building the foundation for sustained scale.',
  microProof: [
    '$60K → $500K in 14 weeks',
    'Public + private sector clients',
    'Silicon Valley experience',
    'AI solutions company',
  ],
}
```

---

### Story 3: BookMyTherapy

```js
{
  id: 'story-bookmytherapy',
  label: 'Founder Impact Story',
  name: 'Neha Juwale',
  company: 'BookMyTherapy',
  founderPhoto: 'FounderPics/BookMyTherapy_Neha_Juwale.jpg',
  pullQuote: 'Neha went from fearing that sharing her ideas would lead to them being copied, to confidently pitching partnerships on the stage at Brampton City Hall — and winning them.',
  thenSnapshot: 'Neha was building something deeply personal — a platform connecting immigrant communities with culturally relevant mental health support. But she struggled with partnership leakages and a fear that sharing her ideas openly would lead to them being taken. That caution held her back from the collaborations her platform needed to grow.',
  nowSnapshot: 'Through targeted mentorship and pitch coaching, Neha learned to structure partnerships with the right safeguards. She secured collaborations with the YMCA and the Social Development Centre, delivered a pitch at the Cohort 3 graduation at Brampton City Hall, and was recognized as the Kitchener-Waterloo Oktoberfest Woman of the Year 2024 for her contribution to mental health.',
  microProof: [
    'YMCA partnership',
    'Oktoberfest Woman of the Year',
    'Culturally relevant care',
    'Multi-language platform',
  ],
}
```

---

### Story 4: Questify

```js
{
  id: 'story-questify',
  label: 'Founder Impact Story',
  name: 'Vynavin Vinod & Madheswaran Kamal',
  company: 'Questify',
  founderPhoto: 'FounderPics/Questify_Vynanvin_Madheswaran.jpg',
  pullQuote: 'Two high school students entered BNext with an idea. They\'re now among Canada\'s Top 25 EdTech Companies and preparing to represent the country at a world summit in Delaware.',
  thenSnapshot: 'Vynavin and Madheswaran were high school students and Peel District School Board Innovation Advisors with a vision for AI-powered learning — but no business infrastructure, no pilot strategy, and no investor narrative. They joined BNext at the MVP stage.',
  nowSnapshot: 'They refined their product positioning, launched a pilot within the Peel District School Board, and presented at the Brampton City Hall graduation showcase. Questify was named among MindShare Learning\'s Top 25 EdTech Companies of 2025, won the Diamond Challenge, and earned the opportunity to represent Canada at the Limitless World Summit in Delaware. They\'re now moving toward product launch and early investment conversations.',
  microProof: [
    'Top 25 EdTech (MindShare)',
    'Diamond Challenge winners',
    'Peel DSB pilot',
    'World Summit delegate',
  ],
}
```

---

### Story 5: SimpleView

```js
{
  id: 'story-simpleview',
  label: 'Founder Transformation / Cohort 3',
  name: 'Sushant Jain',
  company: 'SimpleView',
  founderPhoto: 'FounderPics/SimpleView_Shushant_Jain.jpg',
  pullQuote: 'Sushant went from struggling to retain partners and tech talent due to unclear terms and direction, to closing two sales within 10 days of restructuring his agreements with his mentor.',
  thenSnapshot: 'Sushant spent years at IBM watching SMEs sit on data they couldn\'t use. He founded SimpleView — a chat-based analytics platform — and joined BNext at the MVP stage with a product concept but no co-founder, inconsistent partnerships, and a business model that still needed refinement.',
  nowSnapshot: 'After intensive 1:1 coaching, Sushant restructured his partnership agreements with clarity and confidence. The result: a tech co-founder onboarded, a salesperson hired, and two sales closed within 10 days. He also built traction with companies such as LG and developed a stronger strategic direction and entrepreneurial network.',
  microProof: [
    'Early customers',
    'Revenue growth',
    'Cofounder added',
    'Sales team expanded',
  ],
}
```

---

### Story 6: Synoris

```js
{
  id: 'story-synoris',
  label: 'Founder Impact Story',
  name: 'Inderjeet Singh',
  company: 'Synoris',
  founderPhoto: 'FounderPics/Synoris_Inderjeet_Singh.jpg',
  pullQuote: 'Inderjeet arrived as an aggressive, product-heavy seller who dominated conversations. He left as a relationship-first communicator — delivering crisp, context-aware pitches aligned with the Canadian market.',
  thenSnapshot: 'Inderjeet was building Shippeasy, an AI-powered SaaS platform to digitize global trade logistics. He had deep domain expertise from India trade corridors, but his sales approach was product-first and overwhelming — he would dominate conversations rather than build trust, a mismatch for the Canadian market.',
  nowSnapshot: 'Through mentorship and coaching, Inderjeet transformed his communication style into a relationship-first approach. BNext supported his incorporation, banking setup, go-to-market strategy, and grant applications including CanExport. He pitched at the Cohort 3 graduation and is now expanding from India to Canada-US corridors, targeting $200K ARR and 2,500 shipments by 2026.',
  microProof: [
    'Canada–US expansion',
    '$200K ARR target',
    'CanExport grant',
    '2,500 shipments by 2026',
  ],
}
```

---

### Story 7: Treepz

```js
{
  id: 'story-treepz',
  label: 'Founder Impact Story',
  name: 'Onyeka Akumah',
  company: 'Treepz',
  founderPhoto: 'FounderPics/Treepz_Onyeka_Akumah.jpg',
  pullQuote: 'Within one quarter of launching its North American headquarters in Brampton, Treepz secured a $500,000 project with the Canadian High Commission in Nigeria.',
  thenSnapshot: 'Onyeka is an angel investor, author, Techstars mentor, and keynote speaker who leads Treepz, a mobility and travel technology company. Despite significant international experience, the company needed to build its Canadian market presence, local partnerships, and government relationships from scratch.',
  nowSnapshot: 'Through BNext, Treepz was connected into the local innovation ecosystem — including a direct introduction to the Minister of AI. The company launched its North American headquarters in Brampton with Mayor Patrick Brown, secured a $500,000 project with the Canadian High Commission in Nigeria, and began exploring opportunities including the OVIN program to deepen its Canadian footprint.',
  microProof: [
    '$500K government project',
    'North American HQ in Brampton',
    'Ministerial introductions',
    'OVIN exploration',
  ],
}
```

---

### Story 8: Oxana Technologies

```js
{
  id: 'story-oxana',
  label: 'Founder Impact Story',
  name: 'Frederick Elum',
  company: 'Oxana Technologies',
  founderPhoto: 'FounderPics/OxanaTechnologies_Frederick_Elum.jpeg',
  pullQuote: 'Frederick came in as a first-time entrepreneur with no prior exposure to building a business. Today he\'s onboarded 5 Tier 1 corporate clients representing over $250 million in carbon credits — with projected 2026 revenue of $20 million.',
  thenSnapshot: 'Frederick joined BNext while still developing his MVP — a blockchain-enabled platform for carbon credit tokenization, emissions tracking, and renewable energy trading. He had no prior entrepreneurial experience, no refined pitch, and no clear path to market.',
  nowSnapshot: 'Through structured programming, mentorship, and intensive 1:1 coaching, Frederick sharpened his messaging, marketing strategy, and pitch deck. He presented at the Cohort 2 graduation, secured Oxana\'s first international client, and built partnerships with IBM, Puro.Earth, and Foresight Canada. Following pitch day, the company onboarded 5 Tier 1 corporate clients representing more than 23 million carbon credits valued at over $250 million, with projected 2026 revenue of approximately $20 million.',
  microProof: [
    'Projected $20M revenue (2026)',
    '23M+ carbon credits',
    'IBM partnership',
    '5 Tier 1 clients',
  ],
}
```

---

## 5. Update `sectionMeta` for Navigation

The existing `sectionMeta` array drives the presenter navigation. Update it to reflect 8 founder stories instead of the previous count. Each entry needs an `id`, `nav` (short label for the nav control), and `title`. Match the `id` values to the story IDs above:

```js
// Replace the old story entries in sectionMeta with:
{ id: 'story-enabled-talent', nav: 'Enabled Talent', title: 'Amandeep Singh' },
{ id: 'story-aishar', nav: 'AISHAR', title: 'Manmeet Singh' },
{ id: 'story-bookmytherapy', nav: 'BookMyTherapy', title: 'Neha Juwale' },
{ id: 'story-questify', nav: 'Questify', title: 'Vynavin & Madheswaran' },
{ id: 'story-simpleview', nav: 'SimpleView', title: 'Sushant Jain' },
{ id: 'story-synoris', nav: 'Synoris', title: 'Inderjeet Singh' },
{ id: 'story-treepz', nav: 'Treepz', title: 'Onyeka Akumah' },
{ id: 'story-oxana', nav: 'Oxana Technologies', title: 'Frederick Elum' },
```

Update the slide numbering comments in `App()` accordingly (the founder stories now span slides 3–10, and subsequent sections shift).

---

## 6. Section Label Variation

Not every slide should say "Founder Impact Story" — vary the `label` field to keep the deck from feeling repetitive. Recommended labels:

| Slide | Label |
|---|---|
| Enabled Talent | `Founder Impact Story` |
| AISHAR | `From Expertise to Venture` |
| BookMyTherapy | `Founder Impact Story` |
| Questify | `Next Generation Founders` |
| SimpleView | `Founder Transformation / Cohort 3` |
| Synoris | `Founder Impact Story` |
| Treepz | `Market Entry / Brampton HQ` |
| Oxana Technologies | `From MVP to Global Scale` |

These labels appear in the `SectionRule` chip at the top of each slide.

---

## 7. What Gets Removed From Each Slide

- ❌ `StoryVisual` card (replaced by founder photo)
- ❌ "Where they started" card (replaced by "Then" card with human-centered content)
- ❌ "How BNext supported them" bullet list (removed entirely — the program's value is implied by the gap between Then and Now; Vik narrates the specifics live)
- ❌ "Progress" card as a separate zone (merged into "Now" card)
- ❌ `companyTag` display
- ❌ Large ghost letters behind StoryVisual (the `story.company.slice(0, 2)` watermark)
- ❌ `accent` and `visualStat` chip displays from the old StoryVisual header

## 8. What Stays

- ✅ `SectionRule` chip + divider at top of each slide
- ✅ `StoryBreadcrumb` (Idea → Mentorship → Traction) — moved to bottom row
- ✅ Micro-proof badges (4 items) — moved to bottom row alongside breadcrumb
- ✅ Founder name in small caps above company name
- ✅ Company name as giant display headline
- ✅ Dark mode panel styling, rounded corners, existing color palette
- ✅ `SlideSection` wrapper with all responsive/viewport logic
- ✅ Presenter navigation controls (they adapt automatically via `sectionMeta`)

---

## 9. Why This Structure Works for Vik

1. **The photo creates an immediate human connection.** Government officials are deciding whether to fund people, not program mechanics. A face makes it real.

2. **The pull quote gives Vik his opening line.** He can gesture at the slide and pause on the transformation. "When Amandeep walked in, he couldn't present to five people. Look at him now." That's a story. The old slide gave him nothing to narrate.

3. **THEN/NOW is instantly legible.** The visual contrast between the subdued Then card and the gold-accented Now card IS the argument for the program's value. No interpretation required.

4. **Removing the support list is counterintuitive but correct.** Listing program services makes the slide about the accelerator. Showing the transformation makes it about the founder — which is what makes a funder feel the investment was worth it. Vik narrates the "how" live.

5. **Ending on Oxana's $250M / $20M revenue story** gives the audience the biggest number last — the one they walk out remembering. It's proof that this program generates real economic value for the region.

---

## 10. Testing Checklist

After implementation, verify:

- [ ] All 8 founder photos load correctly from `Public/FounderPics/`
- [ ] Each slide fits within a single desktop viewport (`100svh`) without overflow
- [ ] The THEN/NOW cards stack vertically on mobile (`< sm` breakpoint)
- [ ] The photo container respects `max-h-[14rem]` on mobile to keep content visible
- [ ] Presenter navigation shows all 8 founder slides with correct labels
- [ ] Arrow key navigation cycles through all slides in order
- [ ] The slide numbering comments in App.jsx match the new section count
- [ ] The `StoryBreadcrumb` and micro-proof badges render correctly in the bottom row
- [ ] No references to deleted components (`StoryVisual`, `StorySectionSlide4`, etc.) remain
