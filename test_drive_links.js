const urls = [
    "https://drive.google.com/file/d/1jQ0umA2frSZSfxsayM7yRgQeJ0Xp-MLu/view?usp=drivesdk",
    "https://drive.google.com/open?id=12qDXDJDL0ikQEpkpTrYezhgb6zwo4_tU",
    "https://drive.google.com/open?id=10FiF3IGMQYW2sTUxuNh1ujSN91LHjSL-",
    "https://drive.google.com/open?id=12VMkHJc9Huegxix1Kb7Q2YDNnV4T69XT"
];

function fixDriveLink(url) {
    if (!url) return '';
    let id = '';
    const match1 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match1) {
        id = match1[1];
        console.log(`Matched Type 1: ${id}`);
    } else {
        const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (match2) {
            id = match2[1];
            console.log(`Matched Type 2: ${id}`);
        } else {
            console.log(`No Match for: ${url}`);
        }
    }

    if (id) {
        return `https://drive.google.com/uc?export=view&id=${id}`;
    }
    return url;
}

urls.forEach(url => {
    console.log(`Input: ${url}`);
    console.log(`Output: ${fixDriveLink(url)}`);
    console.log('---');
});
