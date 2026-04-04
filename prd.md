# 📄 Product Requirements Document (PRD)

## 🌌 Content Explorer — NASA APOD (Tailored Implementation)

---

## 1. 🧭 Overview

Build a **high-quality, production-ready Content Explorer** using:

* **Next.js App Router (Server + Client Components)**
* **TypeScript (strict)**
* **Tailwind CSS (no UI libraries)**
* **TanStack Query (for client caching & UX)**

This version is optimized for **clean architecture, scalability, and real-world frontend patterns**.

---

## 2. 🚀 Data Source — NASA APOD

### API Strategy

APOD is **not paginated**, so we will:

* Use **date-range batching** (core pattern)
* Cache results aggressively (ISR + React Query)

### API Layer (IMPORTANT)

All API calls go through:

```
/lib/apod.ts
```

Example responsibilities:

* fetchApodsByRange(start, end)
* normalize data (handle videos/images)

---

## 3. 🧱 Architecture (Opinionated)

### Folder Structure

```
/app
  /(root)
    page.tsx                # listing page (server)
    loading.tsx
    error.tsx
  /items/[date]
    page.tsx                # detail page (server)

/components
  /ui                      # reusable primitives (Card, Grid, Skeleton)
  /apod                    # domain-specific components

/hooks
  useSearch.ts
  useDebounce.ts

/lib
  apod.ts                  # API abstraction
  utils.ts

/types
  apod.ts
```

### Key Rules

* ❌ No fetch inside components
* ✅ Use **server components for initial data**
* ✅ Use **TanStack Query for client interactions (search/filter)**
* ✅ Extract logic into hooks

---

## 4. 🎯 Features (Implementation-Focused)

### F-1 Listing Page

#### Rendering Strategy

* Use **Server Component + ISR**
* `revalidate = 86400` (daily)

#### Data Flow

1. Server fetches initial dataset (20–30 days range)
2. Hydrate into client
3. React Query manages filtering/search

#### UI

* Responsive grid (Tailwind)
* Card component (fully reusable)

#### Card Contract

```ts
interface ApodCardProps {
  title: string;
  date: string;
  url: string;
  media_type: 'image' | 'video';
}
```

---

### F-2 Detail Page

#### Route

```
/items/[date]
```

#### Pattern

* Server fetch per item
* Use `generateMetadata`

#### UX Details

* Optimized image (priority)
* Video embed fallback

---

### F-3 Search & Filtering (Important Design)

Since APOD has no backend search:

### Strategy

* Fetch **bounded dataset (e.g., last 60 days)**
* Perform **client-side filtering**

### State Management

* Use **URL state (source of truth)**
* Sync with:

  * `useSearchParams`
  * custom `useSearch` hook

### Debounce

* Custom hook:

```
useDebounce(value, 300)
```

---

### F-4 UX States

#### Loading

* Skeleton grid (match final layout)

#### Error

* error.tsx boundary
* Retry button

#### Empty

* Friendly illustration + reset filters CTA

---

## 5. ⚡ Performance (Deliberate Choices)

### Must Implement

#### 1. Image Optimization

* `next/image`
* Always set width/height

#### 2. ISR Strategy

```ts
export const revalidate = 86400;
```

#### 3. React Query Benefits

* Cache search results
* Avoid refetching same range

#### 4. Code Splitting

* Lazy load heavy components (e.g., filters panel)

#### 5. Fonts

* `next/font` (no layout shift)

---

## 6. 🧠 Data Modeling

### Normalize API Response

Create a clean type:

```ts
export interface ApodItem {
  date: string;
  title: string;
  description: string;
  imageUrl: string;
  mediaType: 'image' | 'video';
}
```

---

## 7. 🧪 Testing Strategy

Focus on meaningful tests:

* Card rendering (props → UI)
* Search/filter logic

Tools:

* Vitest
* React Testing Library

---

## 8. 🧠 Key Trade-offs (Explicit)

| Problem             | Decision                 |
| ------------------- | ------------------------ |
| No pagination       | Simulate via date ranges |
| No API search       | Client filtering         |
| Video inconsistency | Fallback thumbnail       |

---

## 9. 🔮 Enhancements (If Time Permits)

* Bookmark/favorites (localStorage or Zustand)
* Dark mode (CSS variables)
* Smooth transitions (Framer Motion optional)

---

## ✅ End of Tailored PRD
