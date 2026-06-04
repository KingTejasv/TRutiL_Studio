/**
 * patch-asar.js
 * Runs after electron-builder to patch the built asar with the correct
 * app-shell.html (has insertCSS sidebar fix) and nav-data.js (full tool list).
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const asarPath = 'dist/win-unpacked/resources/app.asar';
const extractDir = 'dist/app_extracted';

console.log('🔧 Patching asar...');

// Extract
execSync(`node_modules/.bin/asar extract "${asarPath}" "${extractDir}"`, { stdio: 'inherit' });

// Rebuild nav-data.js from actual tool files
function scanTools(baseDir) {
    const nav = {};
    const categories = fs.readdirSync(baseDir).filter(f => {
        const full = path.join(baseDir, f);
        return fs.statSync(full).isDirectory() && f !== 'ffmpeg' && !f.startsWith('_') && !f.startsWith('.');
    });
    for (const cat of categories) {
        nav[cat] = {};
        const catDir = path.join(baseDir, cat);
        const subCats = fs.readdirSync(catDir).filter(f => {
            const full = path.join(catDir, f);
            return fs.statSync(full).isDirectory() && !f.startsWith('_') && !f.startsWith('.');
        });
        for (const sub of subCats) {
            const subDir = path.join(catDir, sub);
            const htmlFiles = fs.readdirSync(subDir).filter(f =>
                f.endsWith('.html') && f !== 'index.html' && f !== 'category.html' &&
                f !== 'subcategory.html' && !f.startsWith('_')
            );
            if (htmlFiles.length > 0) {
                nav[cat][sub] = htmlFiles.map(f => ({
                    name: f.replace('.html', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                    path: cat + '/' + sub + '/' + f
                }));
            }
        }
    }
    return nav;
}

const nav = scanTools('./tools');
const navDataContent = 'window.navData = ' + JSON.stringify(nav, null, 4) + ';';
fs.writeFileSync('nav-data.js', navDataContent);
fs.writeFileSync(path.join(extractDir, 'nav-data.js'), navDataContent);

// Copy updated app-shell.html
fs.copyFileSync('app-shell.html', path.join(extractDir, 'app-shell.html'));
fs.copyFileSync('theme.js', path.join(extractDir, 'theme.js'));

// Repack
execSync(`node_modules/.bin/asar pack "${extractDir}" "${asarPath}"`, { stdio: 'inherit' });

console.log('✅ asar patched successfully!');
