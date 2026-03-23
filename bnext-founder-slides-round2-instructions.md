# BNext Founder Slides — Update Instructions (Round 2)

This document covers three changes:
1. **Layout density fixes** — eliminate the empty space in THEN/NOW cards and bottom row across ALL founder slides
2. **Photo path updates** — update `founderPhoto` references for all existing + new slides
3. **6 new founder slides** — full content for Dacasto, SilkNext, SmartAura, Nativ Chefs, OfficeFlow, and Milesmate

---

## Part 1: Layout Density Fixes (Apply to `StorySlideRedesigned`)

The current implementation has significant dead space in the THEN/NOW cards — the text occupies the top third and the rest is empty. The micro-proof badges and breadcrumb at the bottom are also too small relative to the available width. Here are the specific changes:

### 1A. Increase text size inside THEN/NOW cards

The card body text is currently `text-base leading-7` (16px). Bump it up to fill more of the card area:

```
// BEFORE (both THEN and NOW cards):
<p className="min-h-0 flex-1 text-base leading-7 text-white/70">

// AFTER:
<p className="min-h-0 flex-1 text-[clamp(1rem,1.15vw,1.15rem)] leading-[1.65] text-white/70">
```

Same change for the NOW card but keeping `text-white/90`.

### 1B. Add the company one-liner as a subheading

There's unused vertical space between the company name and the pull quote. Add the company description as a bridging line — this uses the existing `companyTag` or `oneLiner` field (or a new `companyDescription` field for new stories):

```jsx
{/* Founder name + company */}
<div className="flex-none">
  <p className="text-[0.78rem] uppercase tracking-[0.22em] text-white/50">
    {story.name}
  </p>
  <h2 className="mt-1 font-display text-[clamp(2.8rem,5.5vw,5.2rem)] uppercase leading-[0.90] tracking-[-0.02em] text-white">
    {story.company}
  </h2>
  {/* NEW — company description line */}
  <p className="mt-2 text-[clamp(0.85rem,1vw,0.95rem)] uppercase tracking-[0.15em] text-white/35">
    {story.companyDescription}
  </p>
</div>
```

### 1C. Increase pull quote size

The pull quote is the emotional anchor — it should command more space:

```
// BEFORE:
<p className="max-w-3xl text-[clamp(1.15rem,1.5vw,1.4rem)] leading-[1.55] text-[var(--yellow)]">

// AFTER:
<p className="max-w-3xl text-[clamp(1.2rem,1.6vw,1.5rem)] leading-[1.5] text-[var(--yellow)]">
```

### 1D. Increase THEN/NOW card header label size and add spacing

The "THEN" and "NOW" labels are currently tiny (`text-[0.72rem]`). Make them slightly larger and add a subtle divider beneath them:

```jsx
{/* BEFORE: */}
<p className="mb-2 flex-none text-[0.72rem] uppercase tracking-[0.22em] text-white/40">
  Then
</p>

{/* AFTER: */}
<p className="mb-3 flex-none border-b border-white/8 pb-2 text-[0.78rem] uppercase tracking-[0.22em] text-white/40">
  Then
</p>
```

Same for the NOW label, but using `border-[var(--yellow)]/15` and `text-[var(--yellow)]/60`.

### 1E. Increase card internal padding

The THEN/NOW cards currently have `p-5`. Bump to `p-6`:

```
// BEFORE:
rounded-[24px] border border-white/10 bg-white/[0.03] p-5

// AFTER:
rounded-[24px] border border-white/10 bg-white/[0.03] p-6
```

Same for the NOW card.

### 1F. Make micro-proof badges larger and more prominent

The badges are currently compact. Increase their size and give them more visual weight:

```
// BEFORE:
<div className="rounded-2xl border border-white/10 bg-black/20 px-3.5 py-2 text-sm text-white/75">

// AFTER:
<div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-[0.9rem] font-medium text-white/80">
```

### 1G. Increase the bottom row spacing

Add more vertical breathing room above the badges row:

```
// BEFORE:
<div className="mt-4 flex-none">

// AFTER:
<div className="mt-5 flex-none">
```

### 1H. Remove flex-1 from the THEN/NOW grid and let cards grow naturally

The current `flex-1` on the THEN/NOW grid container forces the cards to stretch to fill all remaining viewport height, which creates the dead space. Instead, change the THEN/NOW section to NOT stretch, and redistribute the flex growth to the gap between the pull quote and the cards:

```jsx
{/* Pull quote — the emotional hook */}
<div className="mt-4 flex-none">
  <p className="max-w-3xl text-[clamp(1.2rem,1.6vw,1.5rem)] leading-[1.5] text-[var(--yellow)]">
    {story.pullQuote}
  </p>
</div>

{/* Flexible spacer — absorbs remaining vertical space between pull quote and cards */}
<div className="min-h-4 flex-1" />

{/* THEN / NOW cards — auto height, not stretched */}
<div className="flex-none grid grid-cols-1 gap-4 sm:grid-cols-2">
  {/* ... THEN and NOW cards ... */}
</div>

{/* Bottom row: micro-proof badges + breadcrumb */}
<div className="mt-5 flex-none">
  {/* ... badges ... */}
</div>
```

This pushes the THEN/NOW cards toward the bottom of the slide, anchored near the badges, with the breathing room sitting between the pull quote and the cards instead of inside the cards. The cards will size to their content, eliminating the internal dead space.

### Summary of density changes (before → after):

| Element | Before | After |
|---|---|---|
| Card body text | `text-base leading-7` (16px) | `text-[clamp(1rem,1.15vw,1.15rem)] leading-[1.65]` |
| Pull quote | `clamp(1.15rem,1.5vw,1.4rem)` | `clamp(1.2rem,1.6vw,1.5rem)` |
| Card labels | `text-[0.72rem]`, `mb-2` | `text-[0.78rem]`, `mb-3`, with border-bottom |
| Card padding | `p-5` | `p-6` |
| Badge size | `text-sm`, `px-3.5 py-2` | `text-[0.9rem] font-medium`, `px-4 py-2.5` |
| THEN/NOW container | `flex-1` (stretches) | `flex-none` (auto height) |
| Space distribution | Inside cards (dead space) | Between pull quote and cards (intentional) |
| Company description | Not present | New `text-white/35` line under company name |

---

## Part 2: Photo Path Updates

The founder profile images are being updated in the GitHub repo at `Public/FounderPics/`. Update the `founderPhoto` field for every story in `content.js`.

### Existing slides — updated filenames

These follow the naming convention already established in the repo. If the user has renamed or replaced any files, the filenames below reflect the expected convention. Verify against the actual repo contents after the update:

```js
// Enabled Talent
founderPhoto: 'FounderPics/Enable_Talent_Amandipp.jpg',

// AISHAR
founderPhoto: 'FounderPics/AISHAR_Manmeet_Singh.jpg',

// BookMyTherapy
founderPhoto: 'FounderPics/BookMyTherapy_Neha_Juwale.jpg',

// Questify
founderPhoto: 'FounderPics/Questify_Vynanvin_Madheswaran.jpg',

// SimpleView
founderPhoto: 'FounderPics/SimpleView_Shushant_Jain.jpg',

// Synoris
founderPhoto: 'FounderPics/Synoris_Inderjeet_Singh.jpg',

// Treepz
founderPhoto: 'FounderPics/Treepz_Onyeka_Akumah.jpg',

// Oxana Technologies
founderPhoto: 'FounderPics/OxanaTechnologies_Frederick_Elum.jpeg',
```

### New slides — expected filenames

These photos need to be added to `Public/FounderPics/` following the same `CompanyName_FounderName.jpg` convention. Use these paths in `content.js` and verify the actual filenames once uploaded:

```js
// Dacasto Gran Pasticceria
founderPhoto: 'FounderPics/Dacasto_Enrico_Laura.jpg',

// SilkNext
founderPhoto: 'FounderPics/SilkNext_Chhavi_Dikholkar.jpg',

// SmartAura
founderPhoto: 'FounderPics/SmartAura_Jai_Inder.jpg',

// Nativ Chefs
founderPhoto: 'FounderPics/NativChefs_Leena_Dixit.jpg',

// OfficeFlow
founderPhoto: 'FounderPics/OfficeFlow_Daljinder_Singh.jpg',

// Milesmate
founderPhoto: 'FounderPics/Milesmate_Vikash_Kumar.jpg',
```

**Important:** If any photos are not yet in the repo at build time, the `FounderPhoto` component should gracefully fall back to `FounderPhotoPlaceholder` (the initials-based fallback from the previous instruction set). Add this guard to the component:

```jsx
function FounderPhoto({ src, alt, company, name }) {
  const base = import.meta.env.BASE_URL;
  const [imgError, setImgError] = React.useState(false);

  if (imgError || !src) {
    return <FounderPhotoPlaceholder name={name} company={company} />;
  }

  return (
    <div className="relative h-full min-h-[20rem] overflow-hidden rounded-[28px]">
      <img
        src={`${base}${src}`}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover object-top"
        onError={() => setImgError(true)}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,10,0.95)_0%,rgba(10,10,10,0.4)_35%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,202,5,0.12),transparent_50%)]" />
      <div className="absolute bottom-4 left-5 right-5 z-10">
        <p className="font-display text-[clamp(1.4rem,2.2vw,2rem)] uppercase leading-none text-white/25">
          {company}
        </p>
      </div>
    </div>
  );
}
```

Also pass `name` to the component in `StorySlideRedesigned`:

```jsx
<FounderPhoto
  src={story.founderPhoto}
  alt={`${story.name}, founder of ${story.company}`}
  company={story.company}
  name={story.name}
/>
```

---

## Part 3: Six New Founder Story Slides

Add these 6 stories to the `stories` array in `content.js`. Insert them after the existing 8 stories. Recommended placement within the presentation order:

**Updated full presentation order (14 slides):**

1. Enabled Talent — Amandeep Singh *(existing)*
2. AISHAR — Manmeet Singh *(existing)*
3. Dacasto — Enrico & Laura Dacasto *(NEW — strongest new story)*
4. BookMyTherapy — Neha Juwale *(existing)*
5. Questify — Vynavin & Madheswaran *(existing)*
6. SilkNext — Chhavi Dikholkar *(NEW)*
7. SimpleView — Sushant Jain *(existing)*
8. Synoris — Inderjeet Singh *(existing)*
9. SmartAura — Jai Inder Singh *(NEW)*
10. OfficeFlow — Daljinder Singh *(NEW)*
11. Nativ Chefs — Leena Dixit *(NEW)*
12. Treepz — Onyeka Akumah *(existing)*
13. Milesmate — Vikash Kumar *(NEW)*
14. Oxana Technologies — Frederick Elum *(existing — biggest revenue number, stays last)*

---

### New Story 1: Dacasto Gran Pasticceria

```js
{
  id: 'story-dacasto',
  label: 'From Heritage to Enterprise',
  name: 'Enrico & Laura Dacasto',
  company: 'Dacasto',
  companyDescription: 'Artisanal Italian bakery rooted in generations of tradition',
  founderPhoto: 'FounderPics/Dacasto_Enrico_Laura.jpg',
  pullQuote: 'Enrico and Laura carried a century of Italian baking tradition across the Atlantic. BNext helped them turn that heritage into two stores, 25 employees, and $1.3 million in revenue — with a third location on the way.',
  thenSnapshot: 'The Dacastos arrived from Alba, Italy with mastery of a 54-hour natural sourdough fermentation process and a reputation endorsed by Michelin-starred chefs — but zero knowledge of Canadian food regulations, market dynamics, or how to incorporate a business here. They were simultaneously navigating settlement basics: housing, schooling, and local services.',
  nowSnapshot: 'With BNext\'s integrated support covering incorporation, business planning, regulatory guidance, and settlement navigation, Dacasto launched a revenue-generating artisanal bakery in Peel. Today they operate 2 stores with 25 employees generating $1.3M in revenue, won Y Media\'s Emerging Business of the Year award, and are expanding to a larger 3rd location that will bring the team to 45 employees.',
  microProof: [
    '$1.3M revenue',
    '25 employees (growing to 45)',
    '2 stores, 3rd opening',
    'Emerging Business of the Year',
  ],
}
```

---

### New Story 2: SilkNext

```js
{
  id: 'story-silknext',
  label: 'Next Generation Founders',
  name: 'Chhavi Dikholkar',
  company: 'SilkNext',
  companyDescription: 'Silk-based products starting with innovative hat liners',
  founderPhoto: 'FounderPics/SilkNext_Chhavi_Dikholkar.jpg',
  pullQuote: 'Chhavi joined as a McMaster student with an idea in her head and no path to execution. She left holding a physical product she built herself — silk hat liners ready to test in the market.',
  thenSnapshot: 'A university student with a concept she believed in but no business infrastructure, no product development experience, and no clear roadmap from idea to something a customer could hold in their hands.',
  nowSnapshot: 'Through hands-on program support, Chhavi moved from concept to R&D — collecting feedback, connecting with local tailors, sourcing materials, and building her first MVP: silk hat liners ready for market testing. More importantly, she developed the entrepreneurial confidence and mindset to pursue her venture alongside her studies and beyond.',
  microProof: [
    'Physical MVP built',
    'Market-ready prototype',
    'Local supplier network',
    'Student entrepreneur',
  ],
}
```

---

### New Story 3: SmartAura

```js
{
  id: 'story-smartaura',
  label: 'Founder Impact Story',
  name: 'Jai Inder Singh',
  company: 'SmartAura',
  companyDescription: 'Smart home integration for safety and seamless living',
  founderPhoto: 'FounderPics/SmartAura_Jai_Inder.jpg',
  pullQuote: 'Jai Inder started as a working professional with just an ambition to eventually leave his job and build something of his own. He showcased his business at City Hall and is now ready to launch.',
  thenSnapshot: 'A working professional with the ambition to build something of his own but no clarity on how to move from idea to execution. He had a concept for a smart home platform — integrating security, lighting, climate, and automation into a single ecosystem — but no customer personas, no channels, and no plan.',
  nowSnapshot: 'Through structured programming and intensive 1:1 mentorship, Jai Inder validated his idea, narrowed his focus, defined his audience, and built clear communication and marketing assets. He developed a comprehensive go-to-market strategy, turning a vague concept into a well-structured business plan. He presented at the graduation ceremony at Brampton City Hall and is now fully prepared to launch his venture.',
  microProof: [
    'Business plan complete',
    'Go-to-market strategy',
    'City Hall showcase',
    'Ready to launch',
  ],
}
```

---

### New Story 4: OfficeFlow

```js
{
  id: 'story-officeflow',
  label: 'From Employee to Employer',
  name: 'Daljinder Singh',
  company: 'OfficeFlow',
  companyDescription: 'AI agents and marketplace for dental practices',
  founderPhoto: 'FounderPics/OfficeFlow_Daljinder_Singh.jpg',
  pullQuote: 'Daljinder left his job to pursue entrepreneurship but had no idea where to start. Today he\'s running his own business out of BHive — he\'s gone from employee to employer.',
  thenSnapshot: 'Daljinder took the leap of leaving his job to pursue entrepreneurship, but lacked clarity on nearly everything: how to start, how to structure sales contracts, how to communicate with clients, and how to develop a go-to-market strategy for his AI-powered dental marketing platform.',
  nowSnapshot: 'With step-by-step guidance and hands-on 1:1 support, Daljinder launched his dental marketing business in Brampton, began acquiring customers, and started generating revenue. He has fully transitioned from employee to employer and is now running his business out of BHive, serving dental practices with AI agents that enhance customer service.',
  microProof: [
    'Revenue generating',
    'Active customers',
    'Operating from BHive',
    'Employee → employer',
  ],
}
```

---

### New Story 5: Nativ Chefs

```js
{
  id: 'story-nativchefs',
  label: 'Immigrant Founder Pivot',
  name: 'Leena Dixit',
  company: 'Nativ Chefs',
  companyDescription: 'Connecting communities to authentic homemade food while empowering home chefs',
  founderPhoto: 'FounderPics/NativChefs_Leena_Dixit.jpg',
  pullQuote: 'Leena arrived with a model proven globally — but Canadian regulations made her original approach unviable. BNext helped her pivot from uncertainty to a compliant, launch-ready business.',
  thenSnapshot: 'Leena had built and validated Nativ Chefs in another market — a platform connecting communities with authentic homemade food while empowering women home chefs. But when she brought the model to Canada, Ontario\'s food regulations created roadblocks that made her original approach unworkable. She was navigating a new country and a broken business model simultaneously.',
  nowSnapshot: 'Through the program, Leena was guided to understand Ontario\'s specific food regulations, connected with local food incubators, and supported in reassessing her model within the Canadian context. She pivoted from navigating uncertainty to making informed strategic decisions, and is now building a new, compliant model preparing to launch in Brampton with clarity and confidence.',
  microProof: [
    'Regulatory pivot complete',
    'Compliant model built',
    'Brampton launch planned',
    'Empowering home chefs',
  ],
}
```

---

### New Story 6: Milesmate

```js
{
  id: 'story-milesmate',
  label: 'From MVP to International Clients',
  name: 'Vikash Kumar',
  company: 'Milesmate',
  companyDescription: 'AI-powered mileage tracking and fleet compliance platform',
  founderPhoto: 'FounderPics/Milesmate_Vikash_Kumar.jpg',
  pullQuote: 'Vikash went from an early-stage MVP to 2 international clients in the US and Mexico generating $7K monthly recurring revenue — and is scaling to $17K+ by 2026.',
  thenSnapshot: 'An early-stage, angel-funded startup with a live product called Fuelshine — an AI-powered platform automating trip tracking, mileage reimbursements, fuel oversight, and driver coaching for fleets. The product existed, but international traction and a scalable sales motion were still out of reach.',
  nowSnapshot: 'Through BNext, Vikash secured 2 international clients in the United States and Mexico, reaching $7,000 in monthly recurring revenue. The company is now scaling toward $17,000+ MRR by 2026, building on a growing pipeline of SMBs and mid-sized organizations with field-service, logistics, and fleet management needs.',
  microProof: [
    '$7K MRR',
    'US & Mexico clients',
    'Scaling to $17K+ MRR',
    'AI-powered SaaS',
  ],
}
```

---

## Part 4: Update `sectionMeta` Navigation

Replace the founder story entries in `sectionMeta` with the full 14-slide sequence:

```js
// After the opening and evidence-outcomes slides, add:
{ id: 'story-enabled-talent', nav: 'Enabled Talent', title: 'Amandeep Singh' },
{ id: 'story-aishar', nav: 'AISHAR', title: 'Manmeet Singh' },
{ id: 'story-dacasto', nav: 'Dacasto', title: 'Enrico & Laura Dacasto' },
{ id: 'story-bookmytherapy', nav: 'BookMyTherapy', title: 'Neha Juwale' },
{ id: 'story-questify', nav: 'Questify', title: 'Vynavin & Madheswaran' },
{ id: 'story-silknext', nav: 'SilkNext', title: 'Chhavi Dikholkar' },
{ id: 'story-simpleview', nav: 'SimpleView', title: 'Sushant Jain' },
{ id: 'story-synoris', nav: 'Synoris', title: 'Inderjeet Singh' },
{ id: 'story-smartaura', nav: 'SmartAura', title: 'Jai Inder Singh' },
{ id: 'story-officeflow', nav: 'OfficeFlow', title: 'Daljinder Singh' },
{ id: 'story-nativchefs', nav: 'Nativ Chefs', title: 'Leena Dixit' },
{ id: 'story-treepz', nav: 'Treepz', title: 'Onyeka Akumah' },
{ id: 'story-milesmate', nav: 'Milesmate', title: 'Vikash Kumar' },
{ id: 'story-oxana', nav: 'Oxana Technologies', title: 'Frederick Elum' },
// Then continue with mentor-network, access-gap, ecosystem-role, community-support, closing...
```

Update the slide numbering comments in `App()` — founder stories now span slides 3–16, and subsequent sections (mentor network, access gap, etc.) shift accordingly.

---

## Part 5: Section Label Variation (Full Set)

| Slide | `label` value |
|---|---|
| Enabled Talent | `Founder Impact Story` |
| AISHAR | `From Expertise to Venture` |
| Dacasto | `From Heritage to Enterprise` |
| BookMyTherapy | `Founder Impact Story` |
| Questify | `Next Generation Founders` |
| SilkNext | `Next Generation Founders` |
| SimpleView | `Founder Transformation / Cohort 3` |
| Synoris | `Founder Impact Story` |
| SmartAura | `Founder Impact Story` |
| OfficeFlow | `From Employee to Employer` |
| Nativ Chefs | `Immigrant Founder Pivot` |
| Treepz | `Market Entry / Brampton HQ` |
| Milesmate | `From MVP to International Clients` |
| Oxana Technologies | `From MVP to Global Scale` |

---

## Part 6: Implementation Checklist

### Layout density
- [ ] THEN/NOW card container changed from `flex-1` to `flex-none`
- [ ] Flexible spacer (`min-h-4 flex-1`) added between pull quote and THEN/NOW cards
- [ ] Card body text size increased to `clamp(1rem,1.15vw,1.15rem)` with `leading-[1.65]`
- [ ] Card internal padding increased from `p-5` to `p-6`
- [ ] Card labels increased to `text-[0.78rem]` with border-bottom divider
- [ ] Pull quote size increased to `clamp(1.2rem,1.6vw,1.5rem)`
- [ ] `companyDescription` line added below company name
- [ ] Micro-proof badges enlarged: `text-[0.9rem] font-medium`, `px-4 py-2.5`
- [ ] Verify no dead space inside THEN/NOW cards on desktop

### Photos
- [ ] `FounderPhoto` component updated with `onError` fallback to `FounderPhotoPlaceholder`
- [ ] `name` prop passed through to `FounderPhoto`
- [ ] All 8 existing `founderPhoto` paths verified against repo
- [ ] All 6 new `founderPhoto` paths added
- [ ] Placeholder gracefully renders for any missing photos

### New slides
- [ ] 6 new story objects added to `stories` array in `content.js`
- [ ] Stories ordered per the 14-slide sequence in Part 4
- [ ] `sectionMeta` updated with all 14 founder entries
- [ ] Slide numbering comments in `App()` updated
- [ ] All 14 slides render with `StorySlideRedesigned` (no references to old `StorySection` / `StorySectionSlide4`)
- [ ] Presenter navigation shows all slides with correct labels
- [ ] Each new slide fits within single desktop viewport (`100svh`)
- [ ] Mobile: photo container `max-h-[14rem]`, THEN/NOW stack vertically
