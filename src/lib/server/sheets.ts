import { google } from 'googleapis';
import KEY from '../../../website-db.json';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly', 'https://www.googleapis.com/auth/drive.readonly'];

const auth = new google.auth.GoogleAuth({
    credentials: KEY,
    scopes: SCOPES
});

const sheets = google.sheets({ version: 'v4', auth });
const drive = google.drive({ version: 'v3', auth });

let cachedSpreadsheetId: string | null = null;

async function getSpreadsheetId() {
    if (cachedSpreadsheetId) return cachedSpreadsheetId;

    try {
        const res = await drive.files.list({
            q: "name = 'dzypher_web_db' and mimeType = 'application/vnd.google-apps.spreadsheet'",
            fields: 'files(id, name)',
        });

        if (res.data.files && res.data.files.length > 0) {
            cachedSpreadsheetId = res.data.files[0].id!;
            return cachedSpreadsheetId;
        } else {
            console.error("Spreadsheet 'dzypher_web_db' not found.");
            return null;
        }
    } catch (error) {
        console.error("Error finding spreadsheet:", error);
        return null;
    }
}

// Helper to extract date from various inputs
function parseSmartDate(input: string): { date: string, link: string } {
    const clean = input?.trim() || '';
    if (!clean) return { date: 'TBA', link: '' };

    // 1. Check if it's a Google Calendar Link
    if (clean.includes('http') && clean.includes('dates=')) {
        const match = clean.match(/dates=(\d{8})\//);
        if (match) {
            const y = match[1].substring(0, 4);
            const m = match[1].substring(4, 6);
            const d = match[1].substring(6, 8);
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthName = months[parseInt(m) - 1];
            return { date: `${monthName} ${parseInt(d)}, ${y}`, link: clean };
        }
        return { date: 'TBA', link: clean };
    }

    // 2. If it's a regular string, return it as date
    return { date: clean, link: '' };
}

export async function getEvents() {
    const spreadsheetId = await getSpreadsheetId();
    if (!spreadsheetId) return [];

    try {
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'event!A2:H', // Fetch up to H (Manual Date)
        });

        const rows = res.data.values;
        if (!rows || rows.length === 0) return [];

        const events = rows.map(row => {
            const title = row[0]?.trim() || '';
            if (!title || title.toLowerCase() === 'event_name') return null;

            const typeRaw = row[1]?.trim().toLowerCase();
            const type = typeRaw?.includes('workshop') ? 'workshop' : 'program';

            const description = row[2]?.trim() || 'Join us for this exciting event!';
            const image = row[3]?.trim() || '';
            const regLink = row[4]?.trim() || '#';

            const statusRaw = row[5]?.trim().toUpperCase();
            const isOpen = statusRaw === 'TRUE' || statusRaw === 'OPEN';

            // Smart Parse Column G (Chip/Link)
            const rawColG = row[6] || '';
            const { date: dateG, link } = parseSmartDate(rawColG);

            // Check Column H (Manual Date Override)
            const rawColH = row[7]?.trim();

            // Priority: Manual H > Link Date > Chip Title (which is usually dateG if no link)
            let finalDate = 'TBA';

            if (rawColH) {
                finalDate = rawColH;
            } else if (dateG !== 'TBA' && dateG !== title) {
                // If dateG parsed uniquely (not just returning value), use it
                finalDate = dateG;
            } else {
                // If G is just text (Title from chip) and H is empty -> TBA
                finalDate = dateG === title ? 'Date TBA' : dateG;
            }

            return {
                title,
                image,
                registration_link: regLink,
                registration_status: isOpen ? 'OPEN' : 'CLOSED',
                calendar_link: link,
                description,
                type,
                date: finalDate
            };
        }).filter(e => e !== null);

        return events;

    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
}
