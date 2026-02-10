export interface CalendarEvent {
    title: string;
    description?: string;
    start: Date;
    end?: Date;
    location?: string;
}

/**
 * Generates a Google Calendar URL for the given event.
 * If no end date is provided, it defaults to 6 hours after the start date.
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
    const { title, description, start, location } = event;

    // Default duration: 6 hours
    const end = event.end ? event.end : new Date(start.getTime() + 6 * 60 * 60 * 1000);

    const formatDate = (date: Date) => {
        return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const startStr = formatDate(start);
    const endStr = formatDate(end);

    // Base URL
    let url = `https://calendar.google.com/calendar/render?action=TEMPLATE`;

    // Add params
    url += `&text=${encodeURIComponent(title)}`;
    url += `&dates=${startStr}/${endStr}`;

    if (description) {
        url += `&details=${encodeURIComponent(description)}`;
    }

    if (location) {
        url += `&location=${encodeURIComponent(location)}`;
    }

    return url;
}
