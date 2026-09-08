// Display preferences only. Never use user_metadata to grant roles or paid access.
export const AVATAR_TONES = {
  blue: { label: "Sky", background: "#eaf0ff", color: "#3556b7" },
  sage: { label: "Sage", background: "#eaf1e7", color: "#3d6845" },
  lilac: { label: "Lilac", background: "#f0ebfa", color: "#6b4ba1" },
  graphite: { label: "Graphite", background: "#ecefee", color: "#414c47" },
} as const;
export type AvatarTone = keyof typeof AVATAR_TONES;
export type Preferences = { reducedMotion: boolean; compact: boolean };
export type Profile = {
  displayName: string;
  bio: string;
  game: string;
  avatarTone: AvatarTone;
};
export type PublicViewer = {
  email: string;
  displayName: string;
  avatarTone: AvatarTone;
  preferences: Preferences;
};
export type SettingsState = {
  status: "idle" | "success" | "error";
  message: string;
};
export const EMPTY_SETTINGS: SettingsState = { status: "idle", message: "" };
export const GAMES = ["Undecided", "FiveM", "Minecraft", "Unturned"] as const;
const object = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
export function isAvatarTone(value: unknown): value is AvatarTone {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(AVATAR_TONES, value)
  );
}
export function readProfile(metadata: unknown): Profile {
  const p = object(object(metadata).sf_profile);
  return {
    displayName:
      typeof p.displayName === "string" ? p.displayName.slice(0, 50) : "",
    bio: typeof p.bio === "string" ? p.bio.slice(0, 240) : "",
    game:
      typeof p.game === "string" && GAMES.some((x) => x === p.game)
        ? p.game
        : "Undecided",
    avatarTone: isAvatarTone(p.avatarTone) ? p.avatarTone : "blue",
  };
}
export function readPreferences(metadata: unknown): Preferences {
  const p = object(object(metadata).sf_preferences);
  return {
    reducedMotion: p.reducedMotion === true,
    compact: p.compact === true,
  };
}
export function validateProfile(
  input: Record<string, unknown>,
): { value: Profile; error: null } | { value: null; error: string } {
  if (typeof input.displayName !== "string" || typeof input.bio !== "string")
    return { value: null, error: "Please enter valid profile details." };
  const displayName = input.displayName.trim();
  const bio = input.bio.trim();
  if (
    !displayName ||
    displayName.length > 50 ||
    /[\x00-\x1F\x7F]/.test(displayName)
  )
    return {
      value: null,
      error:
        "Use a display name of 1–50 characters without control characters.",
    };
  if (bio.length > 240 || /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(bio))
    return { value: null, error: "Keep your bio within 240 characters." };
  if (!isAvatarTone(input.avatarTone))
    return { value: null, error: "Choose one of the available avatar colors." };
  if (typeof input.game !== "string" || !GAMES.some((x) => x === input.game))
    return { value: null, error: "Choose a game from the list." };
  return {
    value: { displayName, bio, avatarTone: input.avatarTone, game: input.game },
    error: null,
  };
}
