
const ids = [
    "1i1V5if13dB2PBMENBK2kSB6FNPFHVlGd", // Image 1 (Failed initially)
    "11lPy9z8OcLL6bWjF745OzmvYo0FO0I0r"  // Image 2 (Worked initially)
];

const formats = [
    (id) => `https://lh3.googleusercontent.com/d/${id}`,
    (id) => `https://drive.google.com/uc?export=view&id=${id}`,
    (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
    (id) => `https://drive.google.com/thumbnail?id=${id}`, // No size param
];

async function checkUrl(url) {
    try {
        const res = await fetch(url, { method: 'HEAD' });
        return { url, status: res.status, ok: res.ok };
    } catch (e) {
        return { url, status: 'Error', error: e.message };
    }
}

async function main() {
    for (const id of ids) {
        console.log(`\nTesting ID: ${id}`);
        for (const fmt of formats) {
            const result = await checkUrl(fmt(id));
            console.log(`${result.status} : ${result.url}`);
        }
    }
}

main();
