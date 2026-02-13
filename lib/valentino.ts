export type Relationship = "Partner" | "Crush" | "Friend" | "Family"
export type Trait =
  | "Funny"
  | "Kind"
  | "Chaotic"
  | "Creative"
  | "Calm"
  | "Brave"
  | "Weird"
  | "Caring"
export type Vibe = "Sweet" | "Funny" | "Deep" | "Confession"

export type WizardState = {
  nickname: string
  relationship: Relationship | null
  traits: Trait[]
  vibe: Vibe | null
}

export type RequestBody = {
  nickname: string
  relationship: string
  traits: string[]
  vibe: string
}

export type GeneratedPoem = {
  title: string
  poem: string
}

export const TRAITS: Trait[] = [
  "Funny",
  "Kind",
  "Chaotic",
  "Creative",
  "Calm",
  "Brave",
  "Weird",
  "Caring"
]

export const RELATIONSHIPS: { key: Relationship; emoji: string; description: string }[] = [
  { key: "Partner", emoji: "💞", description: "steady, close, true" },
  { key: "Crush", emoji: "🍒", description: "shy sparks & suspense" },
  { key: "Friend", emoji: "🫶", description: "easy laughter, loyal" },
  { key: "Family", emoji: "🏡", description: "warm roots, always" }
]

export const VIBES: { key: Vibe; preview: string }[] = [
  { key: "Sweet", preview: "Soft devotion, gentle details, bright warmth." },
  { key: "Funny", preview: "Playful lines, clever turns, affectionate mischief." },
  { key: "Deep", preview: "Quiet gravity, intimate imagery, heart-level truth." },
  { key: "Confession", preview: "A brave admission, close to the edge of saying it." }
]

export function safeNickname(nickname: string) {
  const trimmed = nickname.trim().slice(0, 40)
  return trimmed
}

