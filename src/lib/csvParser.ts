
export interface Event {
    title: string;
    type: string;
    description: string;
    image: string;
    registration_link: string;
    registration_status: 'OPEN' | 'CLOSED';
    calendar_link: string;
    date: string;
}

export interface Fanfic {
    title: string;
    author: string;
    description: string;
    cover: string;
    link: string; // Google Doc Link
}

const SHEET_ID = "2PACX-1vQkAWq7TMm6Zn_ADLHbPYCEncybc4pA652fnQ5xaUzL4oWtQZfV1cJWFyjSeUHJ22v8SEedMS1bOaDK";
// Wait, the previous link was a PUBHTML link: .../pub?output=csv. This usually DOES NOT work with gviz.
// GVIZ works with the underlying Sheet ID (long alpha-numeric). 
// The user provided: https://docs.google.com/spreadsheets/d/e/2PACX-1vQkAWq7TMm6Zn_ADLHbPYCEncybc4pA652fnQ5xaUzL4oWtQZfV1cJWFyjSeUHJ22v8SEedMS1bOaDK/pub?output=csv
// "2PACX..." is a PUBLISHED ID, not the source Sheet ID.
// Published IDs CANNOT use gviz usually. They are static representations.
// BUT, if the user "Published to Web" the ENTIRE DOCUMENT, then:
// Link format: .../pub?gid=...&single=true&output=csv
// If they only published the 'event' tab, we CANNOT get 'fanficx' unless they publish that too.

// STRATEGY: 
// I will attempt to assume they published the *Entire Document*. 
// If so, we can try to guess GID. 
// Event GID is usually 0. 
// Fanficx GID is unknown.
// OR, I'll ask the user for the Fanficx Link.
// BUT, to be "Agentic", I will try a fallback.
// I will try to fetch the default link. If it fails or is wrong data, I'll return empty.

// HOWEVER, the user said "the details are in the same google sheet but the page is fanficx".
// If I can't fetch it, I can't show it.
// I will add a 'sheetName' param, but for the "Publish" link, 'sheet=' param MIGHT NOT WORK.
// Let's stick to the current link for Events.
// For Fanfics, I need a NEW LINK or I need to assume the user will update the code/link.
// I will create `fetchFanfics` that effectively tries to fetch a different GID or URL. 
// Since I don't have it, I'll use the SAME URL for now and check if the headers match "Title, Author...".
// If the user replaces the link with the 'fanficx' one, it will work.

// Scraped from pubhtml source:
// event GID: 0
// fanficx GID: 1703895837
export const EVENT_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQkAWq7TMm6Zn_ADLHbPYCEncybc4pA652fnQ5xaUzL4oWtQZfV1cJWFyjSeUHJ22v8SEedMS1bOaDK/pub?gid=0&single=true&output=csv";
export const FANFIC_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQkAWq7TMm6Zn_ADLHbPYCEncybc4pA652fnQ5xaUzL4oWtQZfV1cJWFyjSeUHJ22v8SEedMS1bOaDK/pub?gid=1703895837&single=true&output=csv";
export const TEAM_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQkAWq7TMm6Zn_ADLHbPYCEncybc4pA652fnQ5xaUzL4oWtQZfV1cJWFyjSeUHJ22v8SEedMS1bOaDK/pub?gid=2102444075&single=true&output=csv";
export const GALLERY_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQkAWq7TMm6Zn_ADLHbPYCEncybc4pA652fnQ5xaUzL4oWtQZfV1cJWFyjSeUHJ22v8SEedMS1bOaDK/pub?gid=981880627&single=true&output=csv";
export const COUNTDOWN_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQkAWq7TMm6Zn_ADLHbPYCEncybc4pA652fnQ5xaUzL4oWtQZfV1cJWFyjSeUHJ22v8SEedMS1bOaDK/pub?gid=2011076060&single=true&output=csv";

export async function fetchEventsLive(): Promise<Event[]> {
    try {
        const response = await fetch(EVENT_CSV_URL);
        const text = await response.text();
        return parseEventCSV(text);
    } catch (error) {
        console.error("Failed to fetch live events:", error);
        return [];
    }
}

export async function fetchFanficsLive(): Promise<Fanfic[]> {
    try {
        const response = await fetch(FANFIC_CSV_URL);
        const text = await response.text();
        return parseFanficCSV(text);
    } catch (error) {
        console.error("Failed to fetch fanfics:", error);
        return [];
    }
}

export function fixDriveLink(url: string): string {
    if (!url) return '';
    let id = '';
    const match1 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match1) id = match1[1];
    else {
        const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (match2) id = match2[1];
    }

    if (id) {
        return `https://lh3.googleusercontent.com/d/${id}`;
    }
    return url;
}

function parseEventCSV(csvText: string): Event[] {
    const rows = parseCSVLines(csvText);
    const events: Event[] = [];

    if (rows.length < 2) return [];

    for (const row of rows.slice(1)) {
        if (row.length < 1) continue;

        const title = row[0]?.trim();
        if (!title || title.toLowerCase() === 'event_name') continue;

        const typeRaw = row[1]?.trim().toLowerCase() || '';
        const type = typeRaw.includes('workshop') ? 'workshop' : 'program';

        const description = row[2]?.trim() || 'No description available.';

        let image = row[3]?.trim() || '';
        image = fixDriveLink(image);

        const regLink = row[4]?.trim() || '#';

        const statusRaw = row[5]?.trim().toUpperCase();
        const isOpen = statusRaw === 'TRUE' || statusRaw === 'OPEN';

        const finalDate = row[7]?.trim() || 'TBA';

        events.push({
            title,
            type,
            description,
            image,
            registration_link: regLink,
            registration_status: isOpen ? 'OPEN' : 'CLOSED',
            calendar_link: '',
            date: finalDate
        });
    }
    return events;
}

function parseFanficCSV(csvText: string): Fanfic[] {
    const rows = parseCSVLines(csvText);
    const fanfics: Fanfic[] = [];

    if (rows.length < 2) return [];

    for (const row of rows.slice(1)) {
        if (row.length < 2) continue;

        const author = row[0]?.trim() || 'Anonymous';
        const title = row[1]?.trim();
        if (!title) continue;

        const description = row[2]?.trim() || '';
        const link = row[4]?.trim() || '#';
        let cover = row[5]?.trim() || '';
        cover = fixDriveLink(cover);

        fanfics.push({ title, author, description, cover, link });
    }
    return fanfics;
}

export function parseCSVLines(text: string): string[][] {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = '';
    let inQuote = false;

    // Normalize newlines
    const raw = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    for (let i = 0; i < raw.length; i++) {
        const char = raw[i];
        const nextChar = raw[i + 1];

        if (inQuote) {
            if (char === '"') {
                if (nextChar === '"') {
                    // Escaped quote
                    currentField += '"';
                    i++; // Skip next quote
                } else {
                    // End of quote
                    inQuote = false;
                }
            } else {
                currentField += char;
            }
        } else {
            if (char === '"') {
                inQuote = true;
            } else if (char === ',') {
                currentRow.push(currentField);
                currentField = '';
            } else if (char === '\n') {
                currentRow.push(currentField);
                rows.push(currentRow);
                currentRow = [];
                currentField = '';
            } else {
                currentField += char;
            }
        }
    }

    // Push last field/row if exists
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
    }

    return rows;
}

function parseSmartDate(val: string): { date: string, link: string } {
    if (!val) return { date: 'TBA', link: '' };
    let link = '';
    const urlMatch = val.match(/https?:\/\/[^\s"]+/);
    if (urlMatch) link = urlMatch[0];
    let date = 'TBA';
    if (link && link.includes('google.com/calendar')) {
        const dateMatch = link.match(/dates=(\d{8})\//);
        if (dateMatch) {
            const raw = dateMatch[1];
            const y = raw.slice(0, 4);
            const m = raw.slice(4, 6);
            const d = raw.slice(6, 8);
            const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
            date = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        }
    }
    if (date === 'TBA' && !val.includes('http')) date = val;
    return { date, link };
}

export function parseFlexibleDate(dateStr: string): string {
    if (!dateStr) return '';

    // If it's already an ISO string or recognized format that Date parses correctly
    if (!isNaN(Date.parse(dateStr)) && dateStr.includes(',')) {
        return dateStr;
    }

    const currentYear = new Date().getFullYear();
    const cleanDate = dateStr.trim();

    // Regular Expressions for different formats
    const dayMonthRegex = /^(\d{1,2})\s+([a-zA-Z]+)$/; // "20 Feb", "20 February"
    const dayMonthYearRegex = /^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})$/; // "20 Feb 2026"

    // Check for "DD MMM" or "DD Month" (e.g., "20 Feb")
    const matchDayMonth = cleanDate.match(dayMonthRegex);
    if (matchDayMonth) {
        return `${matchDayMonth[1]} ${matchDayMonth[2]} ${currentYear}`;
    }

    // Check if it's already full date "20 Feb 2026", just return it
    if (cleanDate.match(dayMonthYearRegex)) {
        return cleanDate;
    }

    return cleanDate;
}

const THEME_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQkAWq7TMm6Zn_ADLHbPYCEncybc4pA652fnQ5xaUzL4oWtQZfV1cJWFyjSeUHJ22v8SEedMS1bOaDK/pub?gid=98630973&single=true&output=csv";

export interface ThemeData {
    colors: string[];
    logo: string;
}

export async function fetchThemeLive(): Promise<ThemeData | null> {
    try {
        const response = await fetch(`${THEME_CSV_URL}&t=${Date.now()}`);
        const text = await response.text();

        // Expected format:
        // Header: THEME,logo
        // Row 1: "hex1\nhex2...", VORTIX

        // Robust Parsing
        // Find logo: Look for "VORTIX" anywhere
        let logo = "DZypher";
        if (text.includes("VORTIX") || text.includes("vortix")) {
            logo = "VORTIX";
        }

        // Find colors: Look for #XXXXXX patterns
        // We expect 4 colors.
        const colorRegex = /#[0-9a-fA-F]{6}/g;
        const matches = text.match(colorRegex);

        let colors: string[] = [];
        if (matches && matches.length >= 4) {
            // Take the first 4 unique or just first 4?
            // The sheet has 4 colors.
            colors = matches.slice(0, 4);
        }

        console.log("Parsed Theme:", { colors, logo });

        if (colors.length > 0) {
            return { colors, logo };
        }

        // Fallback to Vortix Protocol if parsing fails but VORTIX is mentioned
        if (logo === "VORTIX") {
            return {
                colors: ["#4E56C0", "#9B5DE0", "#D78FEE", "#FDCFFA"],
                logo: "VORTIX"
            };
        }

        return null;

    } catch (e) {
        console.error("Error fetching theme, falling back to VORTIX default:", e);
        // Fallback to Vortix Protocol on network error
        return {
            colors: ["#4E56C0", "#9B5DE0", "#D78FEE", "#FDCFFA"],
            logo: "VORTIX"
        };
    }
}
