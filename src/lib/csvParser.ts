
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

function parseEventCSV(csvText: string): Event[] {
    const rows = parseCSVLines(csvText);
    const events: Event[] = [];

    if (rows.length < 2) return [];

    for (const row of rows.slice(1)) {
        if (row.length < 1) continue;

        const title = row[0]?.trim();
        // Skip header row if it slipped through or empty titles
        if (!title || title.toLowerCase() === 'event_name') continue;

        // Index 1: event_type - Default to 'program' if missing
        const typeRaw = row[1]?.trim().toLowerCase() || '';
        const type = typeRaw.includes('workshop') ? 'workshop' : 'program';

        // Index 2: event_description
        const description = row[2]?.trim() || 'No description available.';

        // Index 3: event_photo_link
        let image = row[3]?.trim() || '';
        // Fix drive links for event images too
        if (image.includes('drive.google.com/file/d/')) {
            const idMatch = image.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (idMatch && idMatch[1]) {
                image = `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
            }
        }

        // Index 4: registration_link
        const regLink = row[4]?.trim() || '#';

        // Index 5: registration_status
        const statusRaw = row[5]?.trim().toUpperCase();
        const isOpen = statusRaw === 'TRUE' || statusRaw === 'OPEN';

        // Index 7: event_date_m
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

        // Verified Headers from previous step:
        // NAME, title_of the book, prologue, MC, Google doc link, image_link, st_name, college, year, rank

        // Index 0: NAME (Author)
        const author = row[0]?.trim() || 'Anonymous';

        // Index 1: title_of the book
        const title = row[1]?.trim();
        if (!title) continue;

        // Index 2: prologue (Description)
        const description = row[2]?.trim() || '';

        // Index 4: Google doc link
        const link = row[4]?.trim() || '#';

        // Index 5: image_link (Cover)
        let cover = row[5]?.trim() || '';

        // Fix drive links for covers
        if (cover.includes('drive.google.com/file/d/')) {
            const idMatch = cover.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (idMatch && idMatch[1]) {
                cover = `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
            }
        }

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
