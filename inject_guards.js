const fs = require('fs');

const filesToUpdate = [
    'tools/Media & Design/Audio & Video/mediaworks-audio-converter.html',
    'tools/Media & Design/Audio & Video/mediaworks-subtitle-generator.html',
    'tools/Media & Design/Audio & Video/mediaworks-video-converter.html',
    'tools/Media & Design/Image & Color Tools/_components/mediaworks-image-converter.html',
    'tools/Media & Design/PDF & Documents/file-pdf-ocr.html',
    'tools/Media & Design/PDF & Documents/file-pdf-signer.html',
    'tools/SEO & Webmaster/Crawling & Indexing/audit-broken-link-checker.html',
    'tools/SEO & Webmaster/Crawling & Indexing/audit-security-headers-checker.html'
];

const guardScript = `
    <!-- Desktop Engine Guard -->
    <script>
        if (typeof require === 'undefined' || !window.process || !window.process.versions || !window.process.versions.electron) {
            const appLayout = document.getElementById('app-layout');
            if (appLayout) {
                appLayout.style.filter = 'blur(8px)';
                appLayout.style.pointerEvents = 'none';
                appLayout.style.userSelect = 'none';
            }
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100vw';
            overlay.style.height = '100vh';
            overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.85)';
            overlay.style.backdropFilter = 'blur(4px)';
            overlay.style.zIndex = '999999';
            overlay.style.display = 'flex';
            overlay.style.flexDirection = 'column';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.color = 'white';
            overlay.style.fontFamily = 'Inter, sans-serif';
            overlay.style.textAlign = 'center';
            overlay.style.padding = '20px';
            
            overlay.innerHTML = \`
                <div style="background: var(--bg-card, #1e293b); padding: 40px; border-radius: 20px; border: 1px solid var(--border, #334155); max-width: 500px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                    <div style="font-size: 48px; margin-bottom: 20px;">⚡</div>
                    <h2 style="font-size: 24px; font-weight: 700; margin: 0 0 15px 0;">Desktop Engine Required</h2>
                    <p style="font-size: 16px; color: #94a3b8; line-height: 1.6; margin: 0 0 25px 0;">This advanced feature requires a local engine. It is available exclusively on the TRutiL Studio Desktop App <strong style="color: white;">FOR FREE</strong>.</p>
                    <button style="font-size: 16px; padding: 12px 24px; cursor: pointer; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 600;" onclick="window.history.back();">Return</button>
                </div>
            \`;
            document.body.appendChild(overlay);
        }
    </script>
`;

filesToUpdate.forEach(file => {
    if(fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (!content.includes('Desktop Engine Guard')) {
            content = content.replace('</body>', guardScript + '</body>');
            fs.writeFileSync(file, content);
            console.log('Injected guard into: ' + file);
        } else {
            console.log('Guard already exists in: ' + file);
        }
    } else {
        console.log('File not found: ' + file);
    }
});
