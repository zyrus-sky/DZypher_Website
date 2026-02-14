
const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQkAWq7TMm6Zn_ADLHbPYCEncybc4pA652fnQ5xaUzL4oWtQZfV1cJWFyjSeUHJ22v8SEedMS1bOaDK/pub?gid=981880627&single=true&output=csv";

async function main() {
    try {
        const response = await fetch(url);
        const data = await response.text();
        const lines = data.split(/\r?\n/);
        const headers = lines[0].split(',');
        console.log("ALL HEADERS:", headers);
        console.log("Total Columns:", headers.length);
        console.log("First Row:", lines[1]);
    } catch (e) {
        console.error(e);
    }
}
main();
