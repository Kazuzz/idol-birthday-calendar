# PROJECT STATUS --- Idol Calendar

> Living project status document.\
> Purpose: preserve the project's architecture, roadmap, completed work,
> current state, and important implementation decisions so development
> can continue safely in a new conversation.

------------------------------------------------------------------------

## 1. Project Overview

**Project:** Idol Calendar

**Purpose:**\
A responsive web application for managing and viewing idol birthdays.
The application combines a monthly birthday calendar with an idol
collection/profile management system.

The project is being developed in phases. Phase 4 established the core
calendar product, and Phase 5 is building the idol-management side of
the application.

### Current overall status

  Phase     Area                                     Status
  --------- ---------------------------------------- ----------------
  Phase 1   Foundation / initial project setup       ✅ Completed
  Phase 2   Core application structure               ✅ Completed
  Phase 3   Shared application/data infrastructure   ✅ Completed
  Phase 4   Core Calendar                            ✅ Completed
  Phase 5   Idol Management                          🔄 In progress
  5A        Idol data/context infrastructure         ✅ Passed
  5B        Idol Gallery / cards                     🔄 In progress

------------------------------------------------------------------------

# 2. Technology / Architecture

The application is a React + TypeScript project.

Important architectural pieces already established:

``` text
App
├── pages
├── components
├── context
├── hooks
├── services
├── utils
├── data
└── types
```

The application uses:

-   React
-   TypeScript
-   CSS Modules
-   Context API
-   custom React hooks
-   localStorage-backed repository
-   responsive CSS
-   accessible interactive controls

The development workflow uses Vite's dev server/HMR.

Recommended development workflow:

``` text
Terminal 1
└── npm run dev
    └── keep running

Terminal 2
├── npm run build
├── git status
├── git add .
├── git commit
└── other commands
```

During UI development:

``` text
edit
→ save
→ Vite HMR
→ browser updates
```

`npm run build` is used as the final TypeScript/build check rather than
after every small UI edit.

------------------------------------------------------------------------

# 3. Data Model

Current `src/types/idol.ts`:

``` ts
export interface Birthday {
  month: number;
  day: number;
}

export interface Idol {
  id: string;
  name: string;
  romanizedName: string;
  birthday: Birthday;
  birthYear?: number;
  group?: string;
  image?: string;
  color?: string;
  tags: string[];
  notes?: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IdolWithComputed extends Idol {
  nextBirthday: Date;
  daysUntil: number;
  age?: number;
  isBirthdayToday: boolean;
}

export interface IdolDataFile {
  version: number;
  idols: Idol[];
  exportedAt: string;
}
```

### Important data decision

`name` is the idol's Japanese name, e.g.:

``` ts
name: "大谷 映美里"
```

`romanizedName` is the Latin/Romanized display name:

``` ts
romanizedName: "OTANI EMIRI"
```

Do **not** replace the Japanese `name` with romaji.

The gallery UI currently displays:

``` text
大谷 映美里
OTANI EMIRI
```

Birthday data remains in the model because the Calendar depends on it,
even though birthday is not displayed on the Idol Gallery card.

------------------------------------------------------------------------

# 4. Storage Architecture

The application uses an `idolRepository` backed by localStorage.

The flow is:

``` text
sampleIdols.ts
      ↓
idolRepository
      ↓
localStorage
      ↓
useIdols()
      ↓
IdolContext
      ↓
pages / components
```

Important behavior:

-   `sampleIdols` is seed data.
-   It is written to storage when no existing idol data is present.
-   Once localStorage contains idol data, editing `sampleIdols.ts` does
    not automatically replace the stored data.

Therefore, when testing changes to sample data, existing localStorage
data may need to be cleared before refreshing.

For a disposable local development environment:

``` js
localStorage.clear()
```

Then refresh the application.

This should not be confused with production data migration.

------------------------------------------------------------------------

# 5. PHASE 1 --- Foundation

## Status

✅ Completed.

Phase 1 established the initial project foundation and basic application
environment.

The project was brought to a working React/TypeScript state with the
base application structure needed for subsequent phases.

### Important outcome

The project reached a stable enough foundation for the later calendar
and idol-management work.

------------------------------------------------------------------------

# 6. PHASE 2 --- Application Structure

## Status

✅ Completed.

Phase 2 established the application's main page/navigation structure and
reusable UI organization.

The application has distinct page-level areas including:

-   Calendar
-   Idols
-   Settings

Navigation is represented by the shared `Page` type from:

``` text
src/app/App
```

The desktop navigation and mobile tab navigation both use the same page
state and `onNavigate` mechanism.

### Top navigation

`TopBar`:

``` ts
interface TopBarProps {
  page: Page;
  onNavigate: (page: Page) => void;
}
```

Navigation targets:

``` text
calendar
idols
settings
```

### Mobile navigation

`TabBar` uses the same `Page` model.

The active tab is determined from the current page.

------------------------------------------------------------------------

# 7. PHASE 3 --- Shared Data / Infrastructure

## Status

✅ Completed.

Phase 3 established the reusable data and application infrastructure
required by the Calendar and Idol Management features.

Important infrastructure includes:

``` text
src/types/
src/data/
src/services/
src/hooks/
src/context/
src/utils/
```

The application uses a centralized idol state instead of having
individual pages manage their own independent idol data.

This made it possible for Calendar and Idol Management to consume the
same source of truth.

------------------------------------------------------------------------

# 8. PHASE 4 --- CORE CALENDAR

## Status

✅ Completed / Approved.

Original Phase 4 scope:

``` text
PHASE 4 — CORE CALENDAR

Implement:

- Monthly calendar
- Month navigation
- Today button
- Birthday indicators
- Today's birthdays
- Day details
- Upcoming birthdays
- Birthday calculations

This is the core product.
```

Phase 4 was approved before moving to Phase 5.

------------------------------------------------------------------------

## 8.1 Monthly Calendar

Implemented through:

``` text
src/components/calendar/MonthGrid.tsx
src/components/calendar/DayCell.tsx
```

The calendar generates a 42-cell month grid:

-   previous month's trailing days
-   current month's days
-   next month's leading days

Weekdays:

``` text
Sun
Mon
Tue
Wed
Thu
Fri
Sat
```

`MonthGrid` determines whether a date belongs to the current month and
passes the appropriate birthday data to `DayCell`.

------------------------------------------------------------------------

## 8.2 Month Navigation

Implemented with `MonthNav`.

Props:

``` ts
interface MonthNavProps {
  currentMonth: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}
```

The displayed month label uses:

``` ts
currentMonth.toLocaleDateString("en-US", {
  month: "long",
  year: "numeric",
});
```

Controls:

``` text
← previous month
month/year label
Today
→ next month
```

------------------------------------------------------------------------

## 8.3 Today

The Calendar previously had a Today action in `MonthNav`.

The project clarified that Today navigation belongs to the original
calendar navigation and should not be accidentally removed when
modifying other components.

------------------------------------------------------------------------

## 8.4 DayCell

`DayCell` receives:

``` ts
interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  birthdayIdols: Idol[];
  onClick: () => void;
}
```

It exposes state through:

``` tsx
aria-current={isToday ? "date" : undefined}
data-current-month={isCurrentMonth}
data-today={isToday}
```

It renders:

-   date number
-   birthday indicators

The `onClick` callback is provided by `MonthGrid`.

------------------------------------------------------------------------

## 8.5 Birthday Indicators

Implemented through:

``` text
src/components/birthday/BirthdayIndicators.tsx
src/components/birthday/BirthdayIndicators.module.css
```

Behavior:

-   no birthdays → render nothing
-   maximum of 3 visible avatars
-   remaining birthdays → `+N`
-   image available → image avatar
-   no image → first letter fallback

The component uses:

``` ts
const MAX_VISIBLE = 3;
```

and:

``` ts
const remainingCount = Math.max(
  idols.length - MAX_VISIBLE,
  0,
);
```

Accessibility labels were included for birthday count and additional
birthdays.

------------------------------------------------------------------------

## 8.6 Birthday Calculations

Birthday-related utilities are located under:

``` text
src/utils/dates/birthday
```

The Calendar uses birthday calculations to:

-   determine birthdays for a month
-   determine birthdays today
-   calculate upcoming birthdays
-   sort birthdays by next occurrence

------------------------------------------------------------------------

## 8.7 Day Details

Day detail behavior was implemented as part of Phase 4.

Accessibility behavior was also reviewed.

Important accessibility requirement:

> When the detail modal is open, keyboard Tab focus must not continue
> reaching navigation controls or day buttons behind the modal.

This was fixed and passed.

------------------------------------------------------------------------

## 8.8 Responsive Calendar Fixes

Phase 4 included responsive refinement.

Issues found and fixed:

### 390 × 844

-   avatars could overflow the day cell
-   day cells became excessively tall because of the narrow width
-   birthday indicators could touch the bottom border

These were adjusted so the indicator stays inside the cell and the
calendar remains usable at narrow widths.

### 768 × 1024

The day detail presentation needed to retain the intended
non-bottom-sheet presentation rather than incorrectly switching to the
mobile bottom-sheet style.

This was corrected.

------------------------------------------------------------------------

## 8.9 Calendar CSS

`MonthGrid.module.css` uses:

``` css
.weekdays,
.grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}
```

The grid uses a small gap and day cells have a minimum height.

`DayCell` received its own CSS after it was identified that the
component initially had no dedicated stylesheet.

------------------------------------------------------------------------

# 9. PHASE 5 --- IDOL MANAGEMENT

## Status

🔄 In progress.

Original scope:

``` text
PHASE 5 — IDOL MANAGEMENT

Implement:

- Idol cards
- Idol profile
- Add
- Edit
- Delete
- Favorites
- Tags
- Notes
- Groups
```

The phase started after Phase 4 was approved.

------------------------------------------------------------------------

# 10. PHASE 5A --- Idol State / Context

## Status

✅ Passed.

The Idol management state architecture was implemented before beginning
the gallery UI.

------------------------------------------------------------------------

## 10.1 IdolContext

`src/context/IdolContext.tsx`:

``` ts
import { createContext } from "react";
import type { UseIdolsResult } from "../hooks/useIdols";

export const IdolContext =
  createContext<UseIdolsResult | null>(null);
```

------------------------------------------------------------------------

## 10.2 IdolContextProvider

The provider wraps the application and exposes the result of
`useIdols()`.

``` tsx
import type { ReactNode } from "react";

import { IdolContext } from "./IdolContext";
import { useIdols } from "../hooks/useIdols";

interface IdolContextProviderProps {
  children: ReactNode;
}

export function IdolContextProvider({
  children,
}: IdolContextProviderProps) {
  const value = useIdols();

  return (
    <IdolContext.Provider value={value}>
      {children}
    </IdolContext.Provider>
  );
}
```

------------------------------------------------------------------------

## 10.3 useIdolContext

The custom context hook ensures it is used inside the provider.

``` ts
import { useContext } from "react";

import { IdolContext } from "../context/IdolContext";

export function useIdolContext() {
  const context = useContext(IdolContext);

  if (!context) {
    throw new Error(
      "useIdolContext must be used inside IdolContextProvider.",
    );
  }

  return context;
}
```

------------------------------------------------------------------------

## 10.4 useIdols

`useIdols()` owns the application-level idol state.

Current result interface:

``` ts
export interface UseIdolsResult {
  idols: Idol[];
  todayBirthdays: IdolWithComputed[];
  upcomingBirthdays: IdolWithComputed[];
  addIdol: (idol: Idol) => void;
  updateIdol: (idol: Idol) => void;
  deleteIdol: (id: string) => void;
  toggleFavorite: (id: string) => void;
}
```

Implemented operations:

``` text
addIdol
updateIdol
deleteIdol
toggleFavorite
```

The hook also calculates:

``` text
todayBirthdays
upcomingBirthdays
```

using the birthday utilities.

------------------------------------------------------------------------

## 10.5 Important state behavior

All updates use a common state/storage path:

``` text
new idol state
    ↓
setIdols()
    ↓
idolRepository.saveAll()
```

This keeps React state and persisted storage synchronized.

------------------------------------------------------------------------

# 11. PHASE 5B --- Idol Gallery

## Status

🔄 In progress.

The first version of the Idol page was only:

``` tsx
export function IdolsPage() {
  return (
    <section>
      <h1>Idols</h1>
      <p>Your idol collection will appear here.</p>
    </section>
  );
}
```

This was replaced with an actual gallery design.

------------------------------------------------------------------------

## 11.1 UI Direction

The gallery design is based on the provided visual reference.

Target structure:

``` text
                 PROFILE
                  Idols
                 6 idols


    ┌────────────┐    ┌────────────┐    ┌────────────┐
    │            │    │            │    │            │
    │    IMAGE   │    │    IMAGE   │    │    IMAGE   │
    │            │    │            │    │            │
    └────────────┘    └────────────┘    └────────────┘

    大谷 映美里          大場 花菜           音嶋 莉沙
    OTANI EMIRI         OBA HANA            OTOSHIMA RISA
```

Design decisions:

-   image is square
-   Japanese name is shown first
-   Romanized name is shown underneath
-   birthday is NOT displayed on the gallery card
-   group is NOT displayed on the gallery card
-   favorite icon is NOT displayed on the gallery card
-   cards are intentionally minimal
-   desktop target: 3 columns
-   mobile target: 2 columns
-   clicking the image/card is reserved for opening the idol profile

------------------------------------------------------------------------

## 11.2 IdolCard

Current component:

``` text
src/components/idol/IdolCard.tsx
```

Responsibilities:

-   render image
-   fallback when no image exists
-   render Japanese name
-   render Romanized name
-   provide accessible clickable image/button

The card receives:

``` ts
interface IdolCardProps {
  idol: Idol;
  onClick?: () => void;
}
```

------------------------------------------------------------------------

## 11.3 IdolCard CSS

Current stylesheet:

``` text
src/components/idol/IdolCard.module.css
```

The image wrapper uses:

``` css
aspect-ratio: 1 / 1;
```

The image is currently conceptually:

``` css
object-fit: cover;
```

------------------------------------------------------------------------

## 11.4 Current Image-Cropping Issue

A design issue is still being refined.

The source idol images can be rectangular/portrait, while the gallery
display is square.

With:

``` css
object-fit: cover;
```

the browser crops from the center by default.

The desired behavior is NOT necessarily the exact center crop.

For idol portraits, the desired crop may prioritize the upper part of
the source image, e.g.:

``` css
object-position: center 20%;
```

or another value based on the source framing.

Current requirement:

> Keep the display area square while allowing the crop position to favor
> the intended visible region instead of automatically cutting the
> center of the source image.

This is an active 5B refinement and should be tested visually before 5B
is marked complete.

------------------------------------------------------------------------

# 12. Current Sample Data

`src/data/sampleIdols.ts` has been updated to support the new data
model.

Example structure:

``` ts
{
  id: "sample-001",
  name: "大谷 映美里",
  romanizedName: "OTANI EMIRI",
  birthday: { month: 3, day: 15 },
  birthYear: 1998,
  group: "=LOVE",
  image: "https://...",
  color: "#C9718A",
  tags: ["vocal", "favorite"],
  notes: "Sample idol — birthday today.",
  favorite: true,
  createdAt: "2026-08-01T00:00:00.000Z",
  updatedAt: "2026-08-01T00:00:00.000Z",
}
```

Current sample set contains three example idols.

### Important URL rule

`image` must contain a direct image URL:

``` ts
image: "https://example.com/image.jpg"
```

not a Markdown link:

``` ts
image: "[https://example.com/image.jpg](https://example.com/image.jpg)"
```

------------------------------------------------------------------------

# 13. IdolsPage

The Idol page is being developed under:

``` text
src/pages/IdolsPage.tsx
src/pages/IdolsPage.module.css
```

It consumes idol state through:

``` ts
useIdolContext()
```

and maps the idols into `IdolCard` components.

The intended page structure is:

``` text
IdolsPage
├── page header
│   ├── PROFILE
│   ├── Idols
│   └── idol count
│
└── idol gallery
    └── IdolCard[]
```

------------------------------------------------------------------------

# 14. Accessibility Decisions

Accessibility has already been treated as a project requirement during
Phase 4.

Important patterns:

-   interactive elements use actual `<button>` elements
-   navigation has ARIA labels
-   calendar date state uses `aria-current`
-   birthday indicator containers expose meaningful labels
-   modal focus behavior prevents background controls from remaining in
    the keyboard tab sequence
-   image buttons have accessible labels
-   image fallback content is marked appropriately when it is decorative

These standards should continue into Phase 5.

------------------------------------------------------------------------

# 15. Responsive Design Requirements

The project has already been tested against narrow/mobile layouts.

Important reference viewport:

``` text
390 × 844
```

Other tested/reference viewport:

``` text
768 × 1024
```

The Idol Gallery target:

``` text
Desktop
3 columns

Mobile
2 columns
```

Avoid introducing horizontal overflow.

Images should stay inside their cards.

Text should not cause cards to overflow at narrow widths.

------------------------------------------------------------------------

# 16. Current File/Feature Map

Important current files:

``` text
src/
├── app/
│   └── App.tsx
│
├── components/
│   ├── birthday/
│   │   ├── BirthdayIndicators.tsx
│   │   └── BirthdayIndicators.module.css
│   │
│   ├── calendar/
│   │   ├── DayCell.tsx
│   │   ├── DayCell.module.css
│   │   ├── MonthGrid.tsx
│   │   ├── MonthGrid.module.css
│   │   └── MonthNav.tsx
│   │
│   ├── idol/
│   │   ├── IdolCard.tsx
│   │   └── IdolCard.module.css
│   │
│   └── navigation/
│       ├── TopBar.tsx
│       └── TabBar.tsx
│
├── context/
│   ├── IdolContext.tsx
│   └── IdolContextProvider.tsx
│
├── data/
│   └── sampleIdols.ts
│
├── hooks/
│   ├── useIdols.ts
│   └── useIdolContext.ts
│
├── pages/
│   ├── IdolsPage.tsx
│   └── IdolsPage.module.css
│
├── services/
│   └── storage/
│       └── idolRepository.ts
│
├── types/
│   └── idol.ts
│
└── utils/
    └── dates/
        └── birthday/
```

Exact directory names should be checked against the repository if files
have subsequently been reorganized.

------------------------------------------------------------------------

# 17. Current Roadmap

## PHASE 4 --- CORE CALENDAR

✅ COMPLETE

``` text
[x] Monthly calendar
[x] Month navigation
[x] Today button
[x] Birthday indicators
[x] Today's birthdays
[x] Day details
[x] Upcoming birthdays
[x] Birthday calculations
[x] Responsive calendar fixes
[x] Modal keyboard focus behavior
```

------------------------------------------------------------------------

## PHASE 5 --- IDOL MANAGEMENT

🔄 IN PROGRESS

Original scope:

``` text
[ ] Idol cards
[ ] Idol profile
[ ] Add
[ ] Edit
[ ] Delete
[ ] Favorites
[ ] Tags
[ ] Notes
[ ] Groups
```

Progress:

``` text
[x] 5A — Idol state/context/storage infrastructure
[~] 5B — Idol Gallery / Idol Cards
[ ] 5C — Idol Profile
[ ] Add
[ ] Edit
[ ] Delete
[ ] Favorites UI
[ ] Tags UI
[ ] Notes UI
[ ] Groups UI
```

The exact subdivision after 5B should be maintained as development
continues.

------------------------------------------------------------------------

# 18. Immediate Next Steps

Before declaring 5B complete:

1.  Verify the updated `sampleIdols.ts`.
2.  Verify all `image` fields are direct URLs.
3.  Clear localStorage if old sample data is still displayed.
4.  Confirm the gallery uses Japanese name + Romanized name.
5.  Confirm birthday is absent from the card.
6.  Confirm images are square.
7.  Tune `object-position` so portrait images crop at the intended
    vertical position.
8.  Check desktop 3-column layout.
9.  Check mobile 2-column layout.
10. Run:

``` powershell
npm run build
```

11. If build and visual checks pass, mark:

``` text
5B — Idol Gallery
✅ PASS
```

Then proceed to:

``` text
5C — Idol Profile
```

------------------------------------------------------------------------

# 19. Development Rules / Decisions to Preserve

### Do not bypass the repository

Do not make individual pages directly manage persistent idol data.

Use:

``` text
useIdolContext()
→ useIdols()
→ idolRepository
```

### Do not treat sample data as the database

`sampleIdols.ts` is seed data.

Once data has been persisted to localStorage, changing the sample file
does not automatically overwrite existing stored data.

### Preserve Japanese + Romanized naming

Use:

``` ts
name
romanizedName
```

rather than replacing one with the other.

### Calendar and Idol Management share the same idol source

Do not create a second independent idol dataset for the gallery.

The Calendar and Idol Management UI should consume the same idol state.

### Keep UI responsibilities separated

Calendar components should remain focused on calendar behavior.

Idol components should remain focused on idol presentation/profile
management.

### Keep accessibility intact

Do not remove keyboard focus behavior, semantic buttons, ARIA labels, or
modal focus management when refactoring.

### Responsive behavior is part of acceptance

A feature is not complete just because it looks correct on desktop.

At minimum check:

``` text
390 × 844
768 × 1024
desktop
```

------------------------------------------------------------------------

# 20. How to Resume Development in a New Conversation

If this project is continued in another ChatGPT conversation:

1.  Put this file in the repository root:

``` text
PROJECT_STATUS.md
```

2.  Tell the new conversation to read `PROJECT_STATUS.md`.

3.  If needed, provide the current source files for the active task.

4.  Continue from the status marked `🔄 In progress`.

At the moment, the correct continuation point is:

``` text
PHASE 5
└── 5B — Idol Gallery
    └── refine image crop / verify UI
        ↓
    5B PASS
        ↓
    5C — Idol Profile
```

Do not restart Phase 1--4 unless a regression is discovered.

------------------------------------------------------------------------

# 21. Current State --- Short Version

``` text
PROJECT: Idol Calendar

PHASE 1  Foundation
         ✅ PASS

PHASE 2  Application Structure
         ✅ PASS

PHASE 3  Shared Data / Infrastructure
         ✅ PASS

PHASE 4  Core Calendar
         ✅ PASS

PHASE 5  Idol Management
         🔄 IN PROGRESS

         5A State / Context / Storage
         ✅ PASS

         5B Idol Gallery
         🔄 IN PROGRESS

         Current task:
         - square idol images
         - Japanese name
         - Romanized name
         - no birthday on card
         - 3-column desktop
         - 2-column mobile
         - refine vertical crop position

         Next:
         5C Idol Profile
```

------------------------------------------------------------------------

## 22. Last Known Working Point

The project had successfully passed multiple Phase 4 calendar
refinements and moved into Phase 5.

The Idol Context / Provider / `useIdols` infrastructure passed.

The Idol Gallery redesign was accepted as the intended visual direction.

The latest unresolved issue is **image crop positioning**: the gallery
should use square display areas, but portrait source images should not
be cropped from the exact center when the desired visible area is higher
in the source image.

The next coding task should therefore continue from the current 5B
implementation rather than redesigning the overall architecture.
