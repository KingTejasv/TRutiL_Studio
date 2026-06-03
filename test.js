const fs = require('fs');

const navData = JSON.parse(fs.readFileSync('C:\\Users\\tejas\\.gemini\\antigravity\\scratch\\toolverse\\navigation.json', 'utf8'));

const currentPath = '/C:/Users/tejas/.gemini/antigravity/scratch/toolverse/tools/Business%20&%20Finance/Corporate%20&%20Startup/index.html';
const decodedPath = decodeURIComponent(currentPath);

let currentMainCategory = null;
let isInsideSubHub = false;

const parts = decodedPath.split('/tools/');
if (parts.length > 1) {
    const afterTools = parts[1].split('/').filter(p => p.length > 0);
    if (afterTools.length >= 2 && afterTools[1] !== 'index.html') {
        currentMainCategory = afterTools[0];
        isInsideSubHub = true;
    }
}

console.log("isInsideSubHub:", isInsideSubHub);
console.log("currentMainCategory:", currentMainCategory);

if (isInsideSubHub && navData[currentMainCategory]) {
    const prefix = '../../';
    const afterTools = parts[1].split('/').filter(p => p.length > 0);
    const currentSubHub = afterTools[1];
    
    console.log("currentSubHub:", currentSubHub);
    const tools = navData[currentMainCategory][currentSubHub];
    
    console.log("tools:", tools ? tools.length : "undefined");
    
    let html = '';
    
    html += `<a href="${prefix}index.html" class="nav-home"><span class="ni">🏠</span> Main Hub</a>`;
    html += `<a href="${prefix}${currentMainCategory}/index.html" class="nav-home" style="margin-bottom: 1rem;"><span class="ni">📂</span> ${currentMainCategory} Hub</a>`;
    
    if (tools) {
        html += `<div style="padding: 1rem 1.5rem 0.5rem 1.5rem; font-weight: 700; color: var(--tv-text); opacity: 0.5; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em;">${currentSubHub} Tools</div>`;
        html += `<div style="display: flex; flex-direction: column; gap: 0.25rem; padding: 0 1rem;">`;
        
        for (const tool of tools) {
            const isActiveTool = decodedPath.endsWith(tool.path.split('/').pop());
            const linkUrl = prefix + tool.path.replace(/\\/g, '/');
            html += `
                <a href="${linkUrl}" class="nav-item ${isActiveTool ? 'active' : ''}">
                    <span class="ni">▪</span> ${tool.name}
                </a>
            `;
        }
        html += `</div>`;
    }
    console.log("HTML generated successfully, length:", html.length);
}
