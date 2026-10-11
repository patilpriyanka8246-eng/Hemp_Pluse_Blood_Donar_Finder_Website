---
name: Vital Red
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#5c403c'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#916f6b'
  outline-variant: '#e6bdb8'
  surface-tint: '#bf0715'
  primary: '#b70011'
  on-primary: '#ffffff'
  primary-container: '#dc2626'
  on-primary-container: '#fff6f5'
  inverse-primary: '#ffb4ab'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#9f3700'
  on-tertiary: '#ffffff'
  tertiary-container: '#c84700'
  on-tertiary-container: '#fff7f4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000b'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb599'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#7f2b00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  blood-group-tag:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '800'
    lineHeight: 18px
    letterSpacing: 0.04em
  stat-counter:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

The design system establishes a clinical yet deeply humane aesthetic tailored for critical healthcare discovery. It targets voluntary donors, hospital coordinators, and emergency seekers during high-stress scenarios. The interface balances urgent life-saving clarity with emotional reassurance, eliminating friction through systematic precision and scannability.

The visual style blends **Modern Clinical Precision** with **Humanist Minimalism**:
- **High-legibility structure:** Ample whitespace, high-contrast typography, and strict visual hierarchies that lower cognitive load during emergencies.
- **Controlled urgency:** Clinical neutrals dominate canvas space so that critical signals—such as crimson blood requests and amber emergency alerts—stand out instantly without inducing panic.
- **Physical reassurance:** Subtle containment borders, precise micro-elevations, and soft pill badges that humanize medical categorization.

## Colors

The palette relies on deliberate clinical roles to ensure instant triage and status comprehension.

### Roles & Semantic Meanings
- **Primary (`#DC2626` / Deep Ruby `#B91C1C`):** Reserved for primary calls to action, active blood drive banners, urgent unit shortages, and the primary brand identity.
- **Secondary (`#10B981` / Dark Emerald `#047857`):** Represents verified eligibility, live donor availability status ("Available Now"), successful matching confirmations, and safe stock levels.
- **Tertiary (`#EA580C` / Amber `#F59E0B`):** Dedicated to time-critical emergency requests, urgent patient requirements, and countdown timers.
- **Neutral Canvas & Surfaces (`#FFFFFF`, `#F8FAFC`, `#F1F5F9`):** Pristine, hospital-grade backdrop layers that keep content focused and reduce eye fatigue.
- **Neutral Structural & Text (`#E2E8F0`, `#94A3B8`, `#334155`, `#0F172A`):** Pure slate grays provide contrast ratios well exceeding WCAG AAA standards for critical health information.

## Typography

The design system standardizes on **Plus Jakarta Sans** across all roles. Its geometric construction conveys modern medical expertise, while generous aperture openings and humanist curves keep long donor profiles legible and warm.

- **Numerics & Counters:** Tabular numbers (`tnum`) must be enforced on emergency countdowns, donor distance markers, and stats counters to prevent layout shifts during live polling.
- **Blood Group Typography:** Uses uppercase weights with increased tracking (`blood-group-tag`) to ensure unambiguous legibility between signs (+/-) and letters (B vs. 8, O vs. 0) at all viewing angles.

## Layout & Spacing

The layout is built on an **8-point grid rhythm**, utilizing a 12-column responsive fluid grid anchored by maximum safe widths to optimize readability in clinical dashboards.

- **Desktop (1024px+):** 12 columns, `gutter` of 1.5rem, dynamic side margins constrained by a maximum container width of `1280px`. Donor search sidebars occupy 4 columns, while search results span 8 columns.
- **Tablet (768px - 1023px):** 8 columns, `gutter` of 1.25rem, margins of 1.5rem. Split views stack into a sticky collapsible filter bar above the list.
- **Mobile (< 768px):** 4 columns, `gutter-mobile` of 1rem, `margin-mobile` of 1rem. Emergency blood call action buttons pin to the bottom edge inside a safe-area drawer.

## Elevation & Depth

To preserve clinical hygiene and modern elegance, visual depth relies on **Crisp Structural Layering** paired with **Micro Ambient Shadows**:

- **Level 0 (Base Canvas):** Neutral flat color `#F8FAFC`. Zero elevation.
- **Level 1 (Card & Content Panels):** Pure white `#FFFFFF` surface enclosed by a 1px border (`#E2E8F0`), elevated by `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.03)`.
- **Level 2 (Hovered Cards & Interactive Controls):** Pure white surface, 1px border (`#CBD5E1`), elevated by `0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`.
- **Level 3 (Modals, Urgent Action Bottom Sheets, Sticky Drawers):** White surface with `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)`.
- **Emergency Halo (Urgent State Highlight):** Zero spread shadow combined with a subtle crimson/amber pulse: `0 0 0 4px rgba(220, 38, 38, 0.15)`.

## Shapes

The geometric architecture pairs structured card containers with dedicated pill-shaped tokens for human-centric data:

- **Containers & Surfaces:** Set to `roundedness: 2` (base 0.5rem / 8px radius; cards and modals scale to 0.75rem / 12px or 1rem / 16px).
- **Blood Group & Status Pills:** Strict full-radius capsules (`rounded-full` / 9999px) are dedicated exclusively to blood groups (e.g., `O+`, `AB-`) and operational status indicators (`Available`, `Urgent`). This reserved pill visual grammar signals immediate recognition across high-density tables and maps.

## Components

### 1. Blood Group Badges (Pills)
- **Geometry:** Height 36px, horizontal padding `space-md` (1rem), full pill radius (9999px).
- **Default State:** Crimson-tinted background (`#FEF2F2`), crimson border (`#FECACA`), bold dark crimson text (`#B91C1C`).
- **Active / Selected State:** Solid crimson fill (`#DC2626`), white text (`#FFFFFF`), shadow `0 2px 4px rgba(220, 38, 38, 0.25)`.
- **Urgent Need Pill:** Solid tertiary amber (`#EA580C`) background, white text, accompanied by an animated pulsating ping indicator.

### 2. Buttons
- **Primary (Emergency Action / Donate Now):** Solid `#DC2626` fill, `#FFFFFF` text, `0.5rem` radius, hover `#B91C1C`, active scale 0.98. Focus ring: 3px `#FCA5A5`.
- **Secondary (Contact Donor / Share):** White background, 1px `#E2E8F0` border, `#0F172A` text, hover `#F8FAFC` and border `#CBD5E1`.
- **Urgent Emergency (Broadcast Request):** Linear gradient from `#DC2626` to `#EA580C`, white text, high visual weight with 44px minimum touch target.

### 3. Donor & Hospital Cards
- **Structure:** 1px border (`#E2E8F0`), `#FFFFFF` background, `0.75rem` radius, padding `space-lg`.
- **Header:** Donor avatar or hospital icon, donor name (`title-md`), distance tag ("1.8 km away"), and blood type pill aligned top-right.
- **Meta Row:** Verification check badge, donation count, last donated timestamp.
- **Footer:** Availability chip (Emerald) and primary "Request Unit / Call" action button.

### 4. Status Chips
- **Available Now:** Soft emerald background (`#ECFDF5`), emerald text (`#047857`), leading 6px static circle dot (`#10B981`).
- **Urgent Request:** Soft amber background (`#FFFBEB`), amber text (`#B45309`), leading pulsating beacon (`#F59E0B`).
- **In Quarantine / Cooldown:** Soft slate background (`#F1F5F9`), slate text (`#475569`).

### 5. Input Fields & Search Bars
- **Height & Radius:** 44px desktop / 48px mobile, `0.5rem` radius.
- **Borders & Fill:** Background `#FFFFFF`, 1px border `#CBD5E1`.
- **Focus State:** 1px border `#DC2626` plus subtle ring `0 0 0 3px rgba(220, 38, 38, 0.12)`.
- **Leading Elements:** Built-in blood group quick-selector drop-down or geolocation crosshair trigger.

### 6. Stats Counters
- **Display:** Large bold metrics (`stat-counter`) in `#0F172A`, small uppercase sub-label (`label-md`) in `#64748B`.
- **Highlight Card Variant:** Soft crimson surface (`#FEF2F2`) with `#DC2626` numeric values highlighting lives saved, active donors within 5km, and units dispatched.