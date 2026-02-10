import { writable } from 'svelte/store';
import type { Fanfic } from './csvParser';
import { parseCSVLines, TEAM_CSV_URL, GALLERY_CSV_URL, COUNTDOWN_CSV_URL, parseFlexibleDate } from './csvParser';
import type { TeamMember, GalleryItem, CountdownItem } from './data';

export const isMenuOpen = writable(false);
export const selectedFanfic = writable<Fanfic | null>(null);

// Data Stores
export const teamStore = writable<{ faculty: TeamMember[], core: TeamMember[] }>({ faculty: [], core: [] });
export const galleryStore = writable<GalleryItem[]>([]);
export const countdownStore = writable<CountdownItem | null>(null);

// Helper to fix Google Drive Image Links
function fixDriveLink(url: string) {
    if (!url) return '';
    if (url.includes('drive.google.com/file/d/')) {
        const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (idMatch && idMatch[1]) {
            return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
        }
    }
    return url;
}

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

            if (member.category === 'Faculty') faculty.push(member);
            else core.push(member);
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
