import { writable } from 'svelte/store';
import type { Fanfic, ThemeData } from './csvParser';
import { parseCSVLines, TEAM_CSV_URL, GALLERY_CSV_URL, COUNTDOWN_CSV_URL, parseFlexibleDate, fetchThemeLive, fixDriveLink } from './csvParser';
import type { TeamMember, GalleryItem, CountdownItem } from './data';

export const isMenuOpen = writable(false);
export const selectedFanfic = writable<Fanfic | null>(null);

// Data Stores
export const teamStore = writable<{ faculty: TeamMember[], core: TeamMember[] }>({ faculty: [], core: [] });
export const galleryStore = writable<GalleryItem[]>([]);
export const countdownStore = writable<{ title: string, date: string } | null>(null);
// Default VORTIX Theme
export const themeStore = writable<ThemeData | null>({
    colors: ["#4E56C0", "#9B5DE0", "#D78FEE", "#FDCFFA"],
    logo: "VORTIX"
});

// Helper to fix Google Drive Image Links


// Fetchers
export async function fetchTeamData() {
    try {
        const res = await fetch(TEAM_CSV_URL);
        const text = await res.text();
        const rows = parseCSVLines(text);

        const faculty: TeamMember[] = [];
        const core: TeamMember[] = [];

        // Skip header
        for (const row of rows.slice(1)) {
            if (row.length < 2) continue;
            // Name,Role,Category,Image,LinkedIn,GitHub
            const member: TeamMember = {
                name: row[0],
                role: row[1],
                category: row[2] as 'Faculty' | 'Core',
                image: fixDriveLink(row[3]),
                socials: {
                    linkedin: row[4],
                    github: row[5]
                }
            };

            // Loose check for Faculty to catch "Faculty Coordinators"
            if (member.category && member.category.toLowerCase().includes('faculty')) {
                faculty.push(member);
            } else {
                core.push(member);
            }
        }
        teamStore.set({ faculty, core });
    } catch (e) {
        console.error("Failed to fetch team data", e);
    }
}

export async function fetchGalleryData() {
    try {
        const res = await fetch(GALLERY_CSV_URL);
        const text = await res.text();
        const rows = parseCSVLines(text);
        const items: GalleryItem[] = [];

        for (const row of rows.slice(1)) {
            if (row.length < 2) continue;
            // Headers: archive_name, archive_description, archive_phone_link
            // Map: Name -> Alt, Link -> Src
            const src = fixDriveLink(row[2]);
            if (!src) continue;

            items.push({
                src: src,
                alt: row[0] || 'Gallery Image',
                size: 'medium' // Default size
            });
        }
        galleryStore.set(items);
    } catch (e) {
        console.error("Failed to fetch gallery data", e);
    }
}

export async function fetchCountdownData() {
    try {
        const res = await fetch(COUNTDOWN_CSV_URL);
        const text = await res.text();
        const rows = parseCSVLines(text);

        if (rows.length > 1) {
            // Title,Date
            const row = rows[1];
            if (row.length >= 2) {
                const rawDate = row[1];
                const cleanDate = parseFlexibleDate(rawDate);
                console.log("Countdown Date Parsed:", cleanDate, "from", rawDate); // Debugging

                countdownStore.set({
                    title: row[0],
                    date: cleanDate
                });
            }
        }
    } catch (e) {
        console.error("Failed to fetch countdown data", e);
    }
}

export function loadThemeFromStorage() {
    try {
        const stored = localStorage.getItem('themeData');
        if (stored) {
            const data: ThemeData = JSON.parse(stored);

            // CRITICAL FIX: If stored theme is the old RED theme, IGNORE IT.
            // Check if the first color is the old default red or if logo is NOT Vortix
            // CRITICAL FIX: Aggressive Sanitation
            // If the logo is 'VORTIX', we MUST ensure the color is the correct Purple.
            // Old configurations might have 'VORTIX' with Red colors.
            const isVortix = data?.logo === 'VORTIX';
            const isPurple = data?.colors?.[0]?.toLowerCase() === '#4e56c0';

            // Allow VORTIX to have other colors if the user explicitly chose them.
            // Only sanitize if structure is missing.
            // We trust the storage now.

            // General Legacy Check - ALLOW Red Theme now.
            if ((data?.logo !== 'VORTIX' && data?.logo !== 'DZypher') && !data?.colors) {
                console.warn("Ignoring invalid theme.");
                localStorage.removeItem('themeData');
                return;
            }

            if (data && data.colors && data.logo) {
                themeStore.set(data);
                console.log("Theme loaded from storage:", data);
            }
        }
    } catch (e) {
        console.error("Failed to load theme from storage", e);
    }
}

export async function initTheme() {
    // Try to load from storage first if not already loaded (optional, but good for redundancy)
    // loadThemeFromStorage(); 

    // Check if user has a saved preference allowed
    const stored = localStorage.getItem('themeData');
    if (stored) {
        console.log("User preference found, skipping live theme sync to preserve selection.");
        // We already loaded from storage in +layout.svelte, so we just return.
        // This ensures User Choice > Live Default.
        return;
    }

    const theme = await fetchThemeLive();
    if (theme) {
        themeStore.set(theme);
        console.log("Theme loaded live:", theme);

        try {
            localStorage.setItem('themeData', JSON.stringify(theme));
        } catch (e) {
            console.error("Failed to save theme to storage", e);
        }
    }
}
