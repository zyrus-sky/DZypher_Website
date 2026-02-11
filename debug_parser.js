const text = `THEME,logo
"#4E56C0
#9B5DE0
#D78FEE
#FDCFFA",VORTIX'26`;

function parseTheme(text) {
    console.log("Parsing text length:", text.length);
    const dataContent = text.substring(text.indexOf("\n") + 1);
    console.log("Data Content Start:", dataContent.substring(0, 20));

    const colorsMatch = dataContent.match(/"([^"]+)"/);

    if (colorsMatch) {
        const colorString = colorsMatch[1];
        const colors = colorString.split(/[\r\n]+/).map(c => c.trim()).filter(c => c.startsWith("#"));
        console.log("Colors found:", colors);

        // Clean up the logo string
        // Strategy: split by '",' which marks the end of the quoted colors and start of the logo field
        // This is fragile if spacing varies, but standard CSV output usually adheres to this if the first field is quoted.
        const parts = dataContent.split('",');
        let logo = "";
        if (parts.length > 1) {
            // The rest contains the logo
            // dataContent is: "colors",logo
            // parts[0] is "colors
            // parts[1] is logo (maybe with trailing newline)
            logo = parts[1].trim();
            // If there are more columns, parts[1] might be "logo,col3,..."
            // But we requested valid CSV.
            // Let's assume the logo is the second column.
            // If the logo itself has a comma? "Logo, Inc." -> CSV would quote it.
            // But here we see VORTIX'26 which doesn't need quotes.
            // Let's stick to the current logic to test it.
            logo = parts[1].split(',').pop()?.trim() || "";
        }

        // Simulating the fallback in the original code
        if (!logo && text.includes("VORTIX")) logo = "VORTIX";

        console.log("Logo found:", logo);
        return { colors, logo };
    } else {
        console.log("No colors match found");
        return null;
    }
}

const result = parseTheme(text);
console.log("Result:", result);
