// theme.js - Universal Theme Manager for TRutiL Studio
(function() {
    // 1. Initialize Theme immediately to prevent flash of wrong theme
    const savedTheme = localStorage.getItem('TRutiL Studio_theme');
    let currentTheme = savedTheme || 'dark';
    
    document.documentElement.setAttribute('data-theme', currentTheme);

    const savedAccent = localStorage.getItem('TRutiL Studio_accent') || 'blue';
    document.documentElement.setAttribute('data-accent', savedAccent);

    // 2. Inject floating customizer UI and Navbar after DOM is ready
    window.addEventListener('DOMContentLoaded', () => {
        if (!document.getElementById('tv-loader')) {
            const loader = document.createElement('div');
            loader.id = 'tv-loader';
            document.body.appendChild(loader);
        }
        // Calculate path depth to root hub
        let prefix = '';
        const pathSegments = window.location.pathname.split('/');
        const toolsIndex = pathSegments.indexOf('tools');
        if (toolsIndex !== -1) {
            const depth = pathSegments.length - toolsIndex - 1; // -2 because of filename
            if (depth > 0) {
                prefix = '../'.repeat(depth);
            }
        }

        // Inject Universal Styles for Navbar and Customizer
        const style = document.createElement('style');
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Ole&display=swap');
            
            :root {
                --tv-nav-bg: #ffffff;
                --tv-text: #0f172a;
                --tv-border: #e2e8f0;
                --tv-primary: #3b82f6;
                --tv-nav-text-hover: #3b82f6;
                --tv-settings-bg: #000000;
                --tv-settings-color: #ffffff;
            }
            [data-theme="dark"] {
                --tv-nav-bg: #000000;
                --tv-text: #f8fafc;
                --tv-border: #1a1a1a;
                --tv-primary: #00FF25;
                --tv-nav-text-hover: #33FF51;
                --tv-settings-bg: #00e622;
                --tv-settings-color: #000000;
            }
            
            /* Universal Navbar */
            
            /* Fix for empty space / layout gap (Sledgehammer) */
            .main-content, .page-content, .tool-layout-container {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding-left: 0 !important;
            }
            .split-pane {
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)) !important;
                gap: 1.5rem;
                width: 100% !important;
            }

            .tv-navbar {
                box-sizing: border-box !important;
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 70px;
                padding: 0 2rem;
                background-color: var(--tv-nav-bg);
                border-bottom: 1px solid var(--tv-border);
                transition: background-color 0.2s, border-color 0.2s;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                margin-bottom: 2rem;
            }
            .tv-nav-logo {
                font-family: 'Ole', cursive;
                font-weight: 400;
                font-size: 2.25rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: var(--tv-text);
                text-decoration: none;
            }
            .tv-nav-logo span { color: var(--tv-primary); }
            
            .tv-nav-links {
                display: flex;
                gap: 2rem;
                font-weight: 500;
                font-size: 0.95rem;
                align-items: center;
            }
            .tv-nav-links a {
                color: var(--tv-text);
                text-decoration: none;
                transition: color 0.2s;
                opacity: 0.8;
            }
            .tv-nav-links a:hover {
                color: var(--tv-nav-text-hover);
                opacity: 1;
            }


            @media (max-width: 639px) {
                .tv-navbar {
                    height: 60px;
                    padding: 0 1rem;
                    margin-bottom: 1.5rem;
                }
                .tv-nav-logo {
                    font-size: 1.75rem;
                }
                .tv-nav-links {
                    gap: 1rem;
                    font-size: 0.85rem;
                }
            }

            
                                                                                                                                                            /* Sidebar Styling */
            /* --- SPA Loader --- */
            #tv-loader {
                position: fixed;
                top: 0; left: 0; right: 0;
                height: 3px;
                background: var(--tv-primary);
                z-index: 9999;
                transform-origin: left;
                transform: scaleX(0);
                transition: transform 0.2s ease;
            }
            .spa-loading .main-content {
                opacity: 0.5;
                pointer-events: none;
                transition: opacity 0.2s ease;
            }

            /* --- Sidebar Minimization --- */
            body {
                transition: padding-left 0.3s ease;
            }
            .sidebar {
                width: 280px;
                background-color: var(--tv-nav-bg);
                border-right: 1px solid var(--tv-border);
                height: 100vh;
                position: fixed;
                left: 0;
                top: 0;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                transition: transform 0.3s ease, width 0.3s ease;
                overflow-y: auto;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }

            
            .sidebar::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            .sidebar::-webkit-scrollbar-track {
                background: transparent;
            }
            .sidebar::-webkit-scrollbar-thumb {
                background: var(--tv-border);
                border-radius: 4px;
            }
            .sidebar::-webkit-scrollbar-thumb:hover {
                background: rgba(128, 128, 128, 0.5);
            }

            .sidebar-minimized {
                width: 70px !important;
                overflow: hidden;
            }
            .sidebar-minimized .sidebar-logo span,
            .sidebar-minimized .nav-item,
            .sidebar-minimized .nav-home,
            .sidebar-minimized .nav-section-toggle,
            .sidebar-minimized .sidebar-bottom {
                opacity: 0;
                pointer-events: none;
                white-space: nowrap;
            }
            .sidebar-minimized .sidebar-logo {
                justify-content: center;
                padding: 0;
            }
            .sidebar-minimized .sidebar-logo > a {
                display: none !important;
            }

            .sidebar-toggle-btn {
                background: transparent;
                color: var(--tv-text);
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                padding: 4px;
                transition: transform 0.2s ease, opacity 0.2s;
                pointer-events: auto !important;
                z-index: 9999 !important;
                position: relative;
            }
            .sidebar-toggle-btn:hover {
                opacity: 0.7;
            }

            @media (min-width: 1025px) {
                body.has-sidebar {
                    padding-left: 280px !important;
                }
                body.has-sidebar.sidebar-min-body {
                    padding-left: 70px !important;
                }
                .sidebar {
                    transform: translateX(0);
                }
                body.has-sidebar #tv-hamburger, 
                body:not(.has-sidebar) #tv-hamburger,
                #tv-hamburger {
                    display: none !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                    width: 0 !important;
                    height: 0 !important;
                    overflow: hidden !important;
                }
            }
            @media (max-width: 1024px) {
                .sidebar {
                    transform: translateX(-100%);
                }
                .sidebar.open {
                    transform: translateX(0);
                    box-shadow: 4px 0 24px rgba(0,0,0,0.2);
                }
                body.has-sidebar #tv-hamburger {
                    display: flex !important;
                }
                body:not(.has-sidebar) #tv-hamburger {
                    display: none !important;
                }
            }
            /* Rest of Sidebar styling */
            .sidebar-logo {
                box-sizing: border-box !important;
                height: 70px;
                padding: 0 1.5rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid var(--tv-border);
                background: var(--tv-nav-bg);
                position: sticky;
                top: 0;
                z-index: 10;
            }

            .sidebar-nav {
                padding: 1rem;
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            .nav-home, .nav-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1rem;
                color: var(--tv-text);
                text-decoration: none;
                border-radius: 8px;
                font-weight: 500;
                font-size: 0.95rem;
                transition: background 0.2s, color 0.2s;
            }
            .nav-home:hover, .nav-item:hover {
                background: rgba(59, 130, 246, 0.1);
                color: var(--tv-primary);
            }
            .nav-item.active {
                background: var(--tv-primary);
                color: white;
            }
            [data-theme="dark"] .nav-item.active {
                color: #000;
                font-weight: 700;
            }
            .nav-section {
                display: flex;
                flex-direction: column;
            }
            .nav-section-toggle {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem 1rem;
                background: transparent;
                border: none;
                color: var(--tv-text);
                font-weight: 600;
                font-size: 0.85rem;
                cursor: pointer;
                border-radius: 8px;
                transition: background 0.2s;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            .nav-section-toggle:hover {
                background: rgba(0,0,0,0.05);
            }
            [data-theme="dark"] .nav-section-toggle:hover {
                background: rgba(255,255,255,0.05);
            }
            .nav-section-children {
                display: none;
                flex-direction: column;
                padding-left: 0.5rem;
                margin-top: 0.25rem;
                gap: 0.25rem;
                border-left: 1px solid var(--tv-border);
                margin-left: 1.5rem;
            }
            .nav-section.open .nav-section-children {
                display: flex;
            }
            .nav-section.open .chevron {
                transform: rotate(90deg);
            }
            .chevron {
                transition: transform 0.2s;
                font-size: 0.8rem;
                display: inline-block;
            }
            .sidebar-bottom {
                padding: 1rem;
                border-top: 1px solid var(--tv-border);
                text-align: center;
                font-size: 0.8rem;
                color: var(--tv-text);
                opacity: 0.7;
            }
            
            /* Customizer */
            .tv-customizer-btn {
                position: fixed;
                bottom: 24px;
                right: 24px;
                width: 48px;
                height: 48px;
                background-color: var(--tv-settings-bg);
                color: var(--tv-settings-color);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border: none;
                z-index: 9999;
                transition: transform 0.2s, background-color 0.2s;
            }
            .tv-customizer-btn:hover {
                transform: scale(1.05) rotate(15deg);
            }
            .tv-customizer-btn svg {
                width: 24px;
                height: 24px;
                fill: none;
                stroke: currentColor;
                stroke-width: 2;
                stroke-linecap: round;
                stroke-linejoin: round;
            }
            .tv-customizer-panel {
                position: fixed;
                bottom: 80px;
                right: 24px;
                width: 280px;
                background-color: var(--tv-nav-bg);
                border: 1px solid var(--tv-border);
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                padding: 16px;
                z-index: 9998;
                opacity: 0;
                transform: translateY(10px) scale(0.95);
                pointer-events: none;
                transition: opacity 0.2s, transform 0.2s;
                color: var(--tv-text);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            .tv-customizer-panel.active {
                opacity: 1;
                transform: translateY(0) scale(1);
                pointer-events: auto;
            }
            .tv-customizer-panel h4 {
                margin: 0 0 12px 0;
                font-size: 1rem;
                font-weight: 600;
            }
            .tv-theme-toggle {
                display: flex;
                border: 1px solid var(--tv-border);
                border-radius: 8px;
                overflow: hidden;
                margin-bottom: 16px;
            }
            .tv-theme-toggle button {
                flex: 1;
                padding: 8px;
                background: transparent;
                border: none;
                cursor: pointer;
                color: var(--tv-text);
                font-weight: 500;
                font-size: 0.9rem;
                transition: background 0.2s, color 0.2s;
            }
            .tv-theme-toggle button.active {
                background: var(--tv-primary);
                color: #fff;
            }
        `;
        document.head.appendChild(style);

        // Inject Universal Navbar if not already present (Hubs have their own nav, but tools need it)
        if (!document.querySelector('.navbar') && !document.querySelector('.tv-navbar')) {
            const navbar = document.createElement('nav');
            navbar.className = 'tv-navbar';
            navbar.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <button class="hamburger" id="tv-hamburger" style="display: none; background: none; border: none; cursor: pointer; color: var(--tv-text); padding: 0;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <a href="${prefix}index.html" class="tv-nav-logo" style="text-decoration:none;">
                        <span style=" color: var(--tv-text); font-family: 'Ole', cursive; font-size: 2.25rem; transform: translateY(4px);">TRutiL Studio</span>
                    </a>
                </div>
                <div class="tv-nav-links">
                </div>
            `;
            // Prepend to body
            document.body.insertBefore(navbar, document.body.firstChild);
        }

        // Inject Panel HTML
        const panel = document.createElement('div');
        panel.className = 'tv-customizer-panel';
        panel.innerHTML = `
            <h4>Appearance</h4>
            <div class="tv-theme-toggle">
                <button id="tv-theme-light" class="${currentTheme === 'light' ? 'active' : ''}">Light</button>
                <button id="tv-theme-dark" class="${currentTheme === 'dark' ? 'active' : ''}">Dark</button>
            </div>
        `;
        document.body.appendChild(panel);

        // Inject Button HTML
        const btn = document.createElement('button');
        btn.className = 'tv-customizer-btn';
        btn.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
        document.body.appendChild(btn);

        // Inject Universal Footer if not already present
        if (!document.querySelector('.tv-footer')) {
            const footer = document.createElement('footer');
            footer.className = 'tv-footer';
            footer.style.cssText = 'background: transparent; padding: 2rem; margin-top: auto; border-top: 1px solid var(--tv-border); width: 100%; box-sizing: border-box;';
            footer.innerHTML = `
                <div class="tv-footer-content" style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem; color: var(--tv-text); opacity: 0.7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <div>&copy; 2026 TRutiL Studio. All rights reserved.</div>
                    <div style="display: flex; gap: 1.5rem;">
                        <a href="${prefix}terms.html" style="color: inherit; text-decoration: none;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Terms of Service</a>
                        <a href="${prefix}privacy.html" style="color: inherit; text-decoration: none;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Privacy Policy</a>
                    </div>
                </div>
            `;
            const mainContainer = document.querySelector('.main-container') || document.querySelector('.main-content');
            if (mainContainer) {
                mainContainer.appendChild(footer);
            } else {
                document.body.appendChild(footer);
            }
        }

        // Logic
        btn.addEventListener('click', () => {
            panel.classList.toggle('active');
        });

        const lightBtn = document.getElementById('tv-theme-light');
        const darkBtn = document.getElementById('tv-theme-dark');

        const setTheme = (theme) => {
            currentTheme = theme;
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('TRutiL Studio_theme', theme);
            if (theme === 'light') {
                lightBtn.classList.add('active');
                darkBtn.classList.remove('active');
            } else {
                darkBtn.classList.add('active');
                lightBtn.classList.remove('active');
            }
        };

        lightBtn.addEventListener('click', () => setTheme('light'));
        darkBtn.addEventListener('click', () => setTheme('dark'));

        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        // --- Sidebar Logic ---
        window.navData = {
    "Business & Finance": {
        "Calculators": [
            {
                "name": "Business & Startup Calculators",
                "path": "Business & Finance/Calculators/business-calculators.html"
            },
            {
                "name": "EMI Calculator",
                "path": "Business & Finance/Calculators/emi.html"
            },
            {
                "name": "Freelance Rate Calculator",
                "path": "Business & Finance/Calculators/freelance-rate-calculator.html"
            },
            {
                "name": "GST Calculator",
                "path": "Business & Finance/Calculators/gst-calculator.html"
            },
            {
                "name": "Pricing & Margin Calculators",
                "path": "Business & Finance/Calculators/pricing-calculators.html"
            },
            {
                "name": "Trading & Stock Calculator",
                "path": "Business & Finance/Calculators/trading-calculator.html"
            }
        ],
        "Invoicing & Taxation": [
            {
                "name": "Professional Invoice Generator",
                "path": "Business & Finance/Invoicing & Taxation/invoice-generator.html"
            }
        ],
        "Validation": [
            {
                "name": "Credit Card Validator Pro",
                "path": "Business & Finance/Validation/protools-credit-card-val.html"
            },
            {
                "name": "IBAN Validator Pro",
                "path": "Business & Finance/Validation/protools-iban-validator.html"
            }
        ]
    },
    "Cybersecurity & Networking": {
        "Cryptography & Hashing": [
            {
                "name": "BCrypt Verifier",
                "path": "Cybersecurity & Networking/Cryptography & Hashing/codelab-bcrypt-verifier.html"
            },
            {
                "name": "Bcrypt Generator",
                "path": "Cybersecurity & Networking/Cryptography & Hashing/cypher-bcrypt-generator.html"
            },
            {
                "name": "HMAC Generator",
                "path": "Cybersecurity & Networking/Cryptography & Hashing/cypher-hmac-generator.html"
            },
            {
                "name": "RSA Key Generator",
                "path": "Cybersecurity & Networking/Cryptography & Hashing/cypher-rsa-key-gen.html"
            },
            {
                "name": "SSL Certificate Checker",
                "path": "Cybersecurity & Networking/Cryptography & Hashing/cypher-ssl-checker.html"
            }
        ],
        "Hashing": [
            {
                "name": "Universal Hash Generator",
                "path": "Cybersecurity & Networking/Hashing/hash-generator.html"
            }
        ],
        "Network Analysis": [
            {
                "name": "Advanced Network Analyzer",
                "path": "Cybersecurity & Networking/Network Analysis/advanced-network-analyzer.html"
            },
            {
                "name": "Bandwidth Calculator",
                "path": "Cybersecurity & Networking/Network Analysis/compute-bandwidth-calc.html"
            },
            {
                "name": "MAC Address Lookup",
                "path": "Cybersecurity & Networking/Network Analysis/cypher-mac-address-lookup.html"
            },
            {
                "name": "Subnet Calculator",
                "path": "Cybersecurity & Networking/Network Analysis/compute-subnet-calculator.html"
            }
        ],
        "Passwords & Access": [
            {
                "name": "Password Generator",
                "path": "Cybersecurity & Networking/Passwords & Access/password.html"
            },
            {
                "name": "Password Strength Checker",
                "path": "Cybersecurity & Networking/Passwords & Access/pwdstrength.html"
            },
            {
                "name": "htpasswd Generator",
                "path": "Cybersecurity & Networking/Passwords & Access/cypher-htpasswd-generator.html"
            }
        ]
    },
    "Everyday Utilities & Converters": {
        "Calculators": [
            {
                "name": "Compound Interest & ROI Calculator",
                "path": "Everyday Utilities & Converters/Calculators/compound-interest-calculator.html"
            },
            {
                "name": "Financial & Loan Calculators",
                "path": "Everyday Utilities & Converters/Calculators/financial-calculators.html"
            },
            {
                "name": "Fraction & Probability Calculator",
                "path": "Everyday Utilities & Converters/Calculators/fraction-probability-calculator.html"
            },
            {
                "name": "Health & Fitness Calculators",
                "path": "Everyday Utilities & Converters/Calculators/health-calculators.html"
            },
            {
                "name": "Retail & Tax Calculators",
                "path": "Everyday Utilities & Converters/Calculators/retail-tax-calculators.html"
            },
            {
                "name": "Salary & Wage Calculator",
                "path": "Everyday Utilities & Converters/Calculators/salary-calculator.html"
            },
            {
                "name": "Scientific Calculator",
                "path": "Everyday Utilities & Converters/Calculators/scientific-calculator.html"
            },
            {
                "name": "Time & Date Calculators",
                "path": "Everyday Utilities & Converters/Calculators/time-date-calculators.html"
            }
        ],
        "Files & Misc": [
            {
                "name": "Clipboard History",
                "path": "Everyday Utilities & Converters/Files & Misc/clipboard.html"
            },
            {
                "name": "Duplicate File Detector",
                "path": "Everyday Utilities & Converters/Files & Misc/file-duplicate-detector.html"
            },
            {
                "name": "Metadata Remover",
                "path": "Everyday Utilities & Converters/Files & Misc/metadata.html"
            },
            {
                "name": "Spreadsheet Formulas",
                "path": "Everyday Utilities & Converters/Files & Misc/data-spreadsheet-formulas.html"
            },
            {
                "name": "Typing Speed Test",
                "path": "Everyday Utilities & Converters/Files & Misc/typing.html"
            }
        ],
        "Generators & Readers": [
            {
                "name": "Barcode Generator",
                "path": "Everyday Utilities & Converters/Generators & Readers/essentials-barcode-generator.html"
            },
            {
                "name": "Barcode Reader",
                "path": "Everyday Utilities & Converters/Generators & Readers/essentials-barcode-reader.html"
            },
            {
                "name": "Octal Converter",
                "path": "Everyday Utilities & Converters/Generators & Readers/transform-octal-conv.html"
            },
            {
                "name": "QR Code Generator",
                "path": "Everyday Utilities & Converters/Generators & Readers/qrcode.html"
            },
            {
                "name": "QR Code Reader",
                "path": "Everyday Utilities & Converters/Generators & Readers/essentials-qr-code-reader.html"
            },
            {
                "name": "Random Number Generator",
                "path": "Everyday Utilities & Converters/Generators & Readers/essentials-random-number-gen.html"
            },
            {
                "name": "Roman Numeral Converter",
                "path": "Everyday Utilities & Converters/Generators & Readers/transform-roman-numeral-conv.html"
            },
            {
                "name": "UUID/GUID Generator",
                "path": "Everyday Utilities & Converters/Generators & Readers/essentials-uuid-guid-gen.html"
            }
        ],
        "Health & Fitness": [
            {
                "name": "Age Calculator",
                "path": "Everyday Utilities & Converters/Health & Fitness/age.html"
            },
            {
                "name": "BMI Calculator",
                "path": "Everyday Utilities & Converters/Health & Fitness/bmi.html"
            },
            {
                "name": "Percentage Calculator",
                "path": "Everyday Utilities & Converters/Health & Fitness/percentage.html"
            }
        ],
        "Math & Probability": [
            {
                "name": "Coin Flipper",
                "path": "Everyday Utilities & Converters/Math & Probability/essentials-coin-flipper.html"
            },
            {
                "name": "Dice Roller",
                "path": "Everyday Utilities & Converters/Math & Probability/essentials-dice-roller.html"
            }
        ],
        "Time & Date": [
            {
                "name": "Calendar Generator",
                "path": "Everyday Utilities & Converters/Time & Date/essentials-calendar-generator.html"
            },
            {
                "name": "Countdown Timer",
                "path": "Everyday Utilities & Converters/Time & Date/essentials-countdown-timer.html"
            },
            {
                "name": "Pomodoro Timer",
                "path": "Everyday Utilities & Converters/Time & Date/pomodoro.html"
            },
            {
                "name": "Stopwatch",
                "path": "Everyday Utilities & Converters/Time & Date/essentials-stopwatch.html"
            },
            {
                "name": "Time Converter",
                "path": "Everyday Utilities & Converters/Time & Date/transform-time-conv.html"
            },
            {
                "name": "Timestamp Converter",
                "path": "Everyday Utilities & Converters/Time & Date/timestamp.html"
            },
            {
                "name": "World Clock",
                "path": "Everyday Utilities & Converters/Time & Date/essentials-world-clock.html"
            }
        ],
        "Unit Converters": [
            {
                "name": "Angle Converter",
                "path": "Everyday Utilities & Converters/Unit Converters/transform-angle-conv.html"
            },
            {
                "name": "Area Converter",
                "path": "Everyday Utilities & Converters/Unit Converters/transform-area-conv.html"
            },
            {
                "name": "Data Storage Converter",
                "path": "Everyday Utilities & Converters/Unit Converters/transform-data-storage-conv.html"
            },
            {
                "name": "Data Transfer Converter",
                "path": "Everyday Utilities & Converters/Unit Converters/transform-data-transfer-conv.html"
            },
            {
                "name": "Energy Converter",
                "path": "Everyday Utilities & Converters/Unit Converters/transform-energy-conv.html"
            },
            {
                "name": "Force Converter",
                "path": "Everyday Utilities & Converters/Unit Converters/transform-force-conv.html"
            },
            {
                "name": "Frequency Converter",
                "path": "Everyday Utilities & Converters/Unit Converters/transform-frequency-conv.html"
            },
            {
                "name": "Length Converter",
                "path": "Everyday Utilities & Converters/Unit Converters/transform-length-conv.html"
            },
            {
                "name": "Power Converter",
                "path": "Everyday Utilities & Converters/Unit Converters/transform-power-conv.html"
            },
            {
                "name": "Pressure Converter",
                "path": "Everyday Utilities & Converters/Unit Converters/transform-pressure-conv.html"
            },
            {
                "name": "Speed Converter",
                "path": "Everyday Utilities & Converters/Unit Converters/transform-speed-conv.html"
            },
            {
                "name": "Temperature Converter",
                "path": "Everyday Utilities & Converters/Unit Converters/transform-temperature-conv.html"
            },
            {
                "name": "Unit Converter",
                "path": "Everyday Utilities & Converters/Unit Converters/unit.html"
            },
            {
                "name": "Volume Converter",
                "path": "Everyday Utilities & Converters/Unit Converters/transform-volume-conv.html"
            },
            {
                "name": "Weight Converter",
                "path": "Everyday Utilities & Converters/Unit Converters/transform-weight-conv.html"
            }
        ]
    },
    "Media & Design": {
        "Audio & Video": [
            {
                "name": "Audio Analyzer",
                "path": "Media & Design/Audio & Video/mediaworks-mp3-converter.html"
            },
            {
                "name": "Audio Converter",
                "path": "Media & Design/Audio & Video/audio.html"
            },
            {
                "name": "Audio Noise Remover",
                "path": "Media & Design/Audio & Video/mediaworks-audio-noise-remover.html"
            },
            {
                "name": "Audio Trimmer",
                "path": "Media & Design/Audio & Video/mediaworks-audio-trimmer.html"
            },
            {
                "name": "Auto Subtitle Generator",
                "path": "Media & Design/Audio & Video/mediaworks-subtitle-generator.html"
            },
            {
                "name": "Screen Recorder",
                "path": "Media & Design/Audio & Video/mediaworks-screen-recorder.html"
            },
            {
                "name": "Speech to Text",
                "path": "Media & Design/Audio & Video/mediaworks-speech-to-text.html"
            },
            {
                "name": "Voice Recorder",
                "path": "Media & Design/Audio & Video/mediaworks-voice-recorder.html"
            },
            {
                "name": "Webcam Recorder",
                "path": "Media & Design/Audio & Video/mediaworks-webcam-recorder.html"
            }
        ],
        "Image & Color Tools": [
            {
                "name": "Color & Design Toolkit",
                "path": "Media & Design/Image & Color Tools/color-design-toolkit.html"
            },
            {
                "name": "Image Processing Studio",
                "path": "Media & Design/Image & Color Tools/image-processing-studio.html"
            }
        ],
        "PDF & Documents": [
            {
                "name": "OCR Text Extractor",
                "path": "Media & Design/PDF & Documents/ocr.html"
            },
            {
                "name": "PDF OCR Converter",
                "path": "Media & Design/PDF & Documents/file-pdf-ocr.html"
            },
            {
                "name": "PDF Signer",
                "path": "Media & Design/PDF & Documents/file-pdf-signer.html"
            },
            {
                "name": "Professional PDF Studio",
                "path": "Media & Design/PDF & Documents/universal-pdf-toolkit.html"
            }
        ]
    },
    "Programming & Development": {
        "API & Networking": [
            {
                "name": "API Response Visualizer",
                "path": "Programming & Development/API & Networking/codelab-api-response-visualizer.html"
            },
            {
                "name": "API Tester",
                "path": "Programming & Development/API & Networking/api.html"
            },
            {
                "name": "CORS Tester",
                "path": "Programming & Development/API & Networking/cypher-cors-tester.html"
            },
            {
                "name": "CURL \u2194 Fetch Converter",
                "path": "Programming & Development/API & Networking/codelab-curl-fetch-converter.html"
            },
            {
                "name": "OpenAPI Viewer",
                "path": "Programming & Development/API & Networking/codelab-openapi-viewer.html"
            },
            {
                "name": "Webhook Tester",
                "path": "Programming & Development/API & Networking/codelab-webhook-tester.html"
            }
        ],
        "DevOps & Server": [
            {
                "name": ".htaccess Generator",
                "path": "Programming & Development/DevOps & Server/cypher-htaccess-generator.html"
            },
            {
                "name": "Chmod Calculator",
                "path": "Programming & Development/DevOps & Server/codelab-chmod-calculator.html"
            },
            {
                "name": "Cron Builder",
                "path": "Programming & Development/DevOps & Server/cron.html"
            },
            {
                "name": "DevOps Config Generator",
                "path": "Programming & Development/DevOps & Server/devops-config-generator.html"
            },
            {
                "name": "Kubernetes YAML Validator",
                "path": "Programming & Development/DevOps & Server/codelab-kubernetes-yaml-validator.html"
            }
        ],
        "Git & Documentation": [
            {
                "name": ".gitignore Generator",
                "path": "Programming & Development/Git & Documentation/codelab-git-ignore-gen.html"
            },
            {
                "name": "Git Diff Viewer",
                "path": "Programming & Development/Git & Documentation/codelab-git-diff-viewer.html"
            },
            {
                "name": "GitHub README Generator",
                "path": "Programming & Development/Git & Documentation/codelab-github-readme-generator.html"
            }
        ],
        "Security & Auth": [
            {
                "name": "CSP Generator",
                "path": "Programming & Development/Security & Auth/cypher-csp-generator.html"
            },
            {
                "name": "JWT Builder",
                "path": "Programming & Development/Security & Auth/codelab-jwt-builder.html"
            },
            {
                "name": "JWT Decoder",
                "path": "Programming & Development/Security & Auth/jwt.html"
            },
            {
                "name": "JWT Inspector",
                "path": "Programming & Development/Security & Auth/codelab-jwt-inspector.html"
            }
        ],
        "Utilities": [
            {
                "name": "Binary Calculator",
                "path": "Programming & Development/Utilities/compute-binary-calculator.html"
            },
            {
                "name": "Fake Data Generator",
                "path": "Programming & Development/Utilities/fakedata.html"
            },
            {
                "name": "Hex Calculator",
                "path": "Programming & Development/Utilities/compute-hex-calculator.html"
            },
            {
                "name": "Number Base Converter",
                "path": "Programming & Development/Utilities/base.html"
            }
        ],
        "Web Development": [
            {
                "name": "Browser Window Size Checker",
                "path": "Programming & Development/Web Development/codelab-browser-window-size.html"
            },
            {
                "name": "CSS to LESS Converter",
                "path": "Programming & Development/Web Development/codelab-css-to-less.html"
            },
            {
                "name": "Code Minifier & Formatter",
                "path": "Programming & Development/Web Development/code-minifier-formatter.html"
            },
            {
                "name": "JSON Schema Generator",
                "path": "Programming & Development/Web Development/codelab-json-schema-generator.html"
            },
            {
                "name": "REM to PX Converter",
                "path": "Programming & Development/Web Development/transform-rem-to-px.html"
            },
            {
                "name": "URL Parser",
                "path": "Programming & Development/Web Development/codelab-url-parser.html"
            },
            {
                "name": "User Agent Parser",
                "path": "Programming & Development/Web Development/codelab-user-agent-parser.html"
            }
        ]
    },
    "SEO & Webmaster": {
        "Crawling & Indexing": [
            {
                "name": "Broken Link Checker",
                "path": "SEO & Webmaster/Crawling & Indexing/audit-broken-link-checker.html"
            },
            {
                "name": "Canonical Tag Checker",
                "path": "SEO & Webmaster/Crawling & Indexing/searchops-canonical-tag-checker.html"
            },
            {
                "name": "Google Cache Checker",
                "path": "SEO & Webmaster/Crawling & Indexing/searchops-google-cache-checker.html"
            },
            {
                "name": "Hreflang Generator",
                "path": "SEO & Webmaster/Crawling & Indexing/searchops-hreflang-generator.html"
            },
            {
                "name": "Link Extractor",
                "path": "SEO & Webmaster/Crawling & Indexing/searchops-link-extractor.html"
            },
            {
                "name": "Meta Tag Generator",
                "path": "SEO & Webmaster/Crawling & Indexing/searchops-meta-tag-generator.html"
            },
            {
                "name": "Redirect Checker",
                "path": "SEO & Webmaster/Crawling & Indexing/searchops-redirect-checker.html"
            },
            {
                "name": "Robots.txt Generator",
                "path": "SEO & Webmaster/Crawling & Indexing/cypher-robots-txt-generator.html"
            },
            {
                "name": "Robots.txt Tester",
                "path": "SEO & Webmaster/Crawling & Indexing/searchops-robots-txt-tester.html"
            },
            {
                "name": "SERP Preview Tool",
                "path": "SEO & Webmaster/Crawling & Indexing/searchops-serp-preview-tool.html"
            },
            {
                "name": "Schema Markup Generator",
                "path": "SEO & Webmaster/Crawling & Indexing/searchops-schema-markup-gen.html"
            },
            {
                "name": "Security Headers Checker",
                "path": "SEO & Webmaster/Crawling & Indexing/audit-security-headers-checker.html"
            },
            {
                "name": "Sitemap Auditor",
                "path": "SEO & Webmaster/Crawling & Indexing/audit-sitemap-auditor.html"
            },
            {
                "name": "Website Technology Detector",
                "path": "SEO & Webmaster/Crawling & Indexing/audit-technology-detector.html"
            },
            {
                "name": "XML Sitemap Generator",
                "path": "SEO & Webmaster/Crawling & Indexing/searchops-sitemap-generator.html"
            }
        ],
        "Performance Auditing": [
            {
                "name": "Domain Authority Checker",
                "path": "SEO & Webmaster/Performance Auditing/searchops-domain-authority.html"
            },
            {
                "name": "Keyword Typo Generator",
                "path": "SEO & Webmaster/Performance Auditing/searchops-keyword-typo-gen.html"
            },
            {
                "name": "Long Tail Keyword Generator",
                "path": "SEO & Webmaster/Performance Auditing/searchops-long-tail-keyword.html"
            },
            {
                "name": "Mobile Friendly Test",
                "path": "SEO & Webmaster/Performance Auditing/searchops-mobile-friendly-test.html"
            },
            {
                "name": "Moz Rank Checker",
                "path": "SEO & Webmaster/Performance Auditing/searchops-moz-rank-checker.html"
            },
            {
                "name": "Page Speed Tester",
                "path": "SEO & Webmaster/Performance Auditing/searchops-page-speed-tester.html"
            },
            {
                "name": "Ultimate SEO Audit Dashboard",
                "path": "SEO & Webmaster/Performance Auditing/ultimate-seo-dashboard.html"
            }
        ]
    },
    "Social & Marketing": {
        "Social Media": [
            {
                "name": "Social Meta Card Studio",
                "path": "Social & Marketing/Social Media/social-meta-studio.html"
            }
        ]
    },
    "Text & Data Processing": {
        "Advanced Processing": [
            {
                "name": "CSV Cleaner &amp; Optimizer",
                "path": "Text & Data Processing/Advanced Processing/file-csv-cleaner.html"
            },
            {
                "name": "CSV Editor",
                "path": "Text & Data Processing/Advanced Processing/data-csv-editor.html"
            },
            {
                "name": "Diff Checker Pro",
                "path": "Text & Data Processing/Advanced Processing/protools-diff-checker-pro.html"
            },
            {
                "name": "JSON Validator &amp; Formatter",
                "path": "Text & Data Processing/Advanced Processing/essentials-json-validator.html"
            },
            {
                "name": "Markdown Editor Pro",
                "path": "Text & Data Processing/Advanced Processing/protools-markdown-editor.html"
            },
            {
                "name": "RegEx Tester Pro",
                "path": "Text & Data Processing/Advanced Processing/protools-regex-tester-pro.html"
            }
        ],
        "Data Conversion": [
            {
                "name": "ASCII Converter",
                "path": "Text & Data Processing/Data Conversion/transform-ascii-conv.html"
            },
            {
                "name": "Base64 Codec",
                "path": "Text & Data Processing/Data Conversion/base64.html"
            },
            {
                "name": "CSV to JSON Converter",
                "path": "Text & Data Processing/Data Conversion/transform-csv-to-json.html"
            },
            {
                "name": "JSON to CSV Converter",
                "path": "Text & Data Processing/Data Conversion/transform-json-to-csv.html"
            },
            {
                "name": "JSON to XML Converter",
                "path": "Text & Data Processing/Data Conversion/transform-json-to-xml.html"
            },
            {
                "name": "Universal Text Encoder / Decoder",
                "path": "Text & Data Processing/Data Conversion/text-encoder.html"
            },
            {
                "name": "XML to JSON Converter",
                "path": "Text & Data Processing/Data Conversion/transform-xml-to-json.html"
            },
            {
                "name": "YAML \u2194 JSON Converter",
                "path": "Text & Data Processing/Data Conversion/yaml-json.html"
            }
        ],
        "Text Formatting": [
            {
                "name": "ASCII Table Reference",
                "path": "Text & Data Processing/Text Formatting/codelab-ascii-table.html"
            },
            {
                "name": "Fancy Text Generator",
                "path": "Text & Data Processing/Text Formatting/fancytext.html"
            },
            {
                "name": "JSON Escape/Unescape",
                "path": "Text & Data Processing/Text Formatting/codelab-json-escape-unescape.html"
            },
            {
                "name": "Lorem Ipsum Generator",
                "path": "Text & Data Processing/Text Formatting/essentials-lorem-ipsum-gen.html"
            },
            {
                "name": "Text Tools",
                "path": "Text & Data Processing/Text Formatting/text.html"
            },
            {
                "name": "Universal Text Formatter",
                "path": "Text & Data Processing/Text Formatting/text-formatter.html"
            }
        ]
};
        const navData = window.navData;
        // Determine current main category and sub-hub
        const currentPath = window.location.pathname;
        const decodedPath = decodeURIComponent(currentPath);
        
        let currentMainCategory = null;
        let isInsideSubHub = false;
        
        const parts = decodedPath.split('/tools/');
        if (parts.length > 1) {
            const afterTools = parts[1].split('/').filter(p => p.length > 0 && !p.endsWith('.html'));
            if (afterTools.length >= 1) {
                currentMainCategory = afterTools[0];
                isInsideSubHub = true;
            }
        }

        if (isInsideSubHub && navData[currentMainCategory]) {
            if (!document.querySelector('.sidebar')) {
                document.body.classList.add('has-sidebar');
                
                const sidebar = document.createElement('aside');
                sidebar.className = 'sidebar';
                sidebar.innerHTML = `
                    <div class="sidebar-logo">
                        <a href="${prefix}index.html" style="text-decoration:none; display:flex; align-items:center;">
                            <span style="font-weight: 800; color: var(--tv-text); font-family: 'Ole', cursive; font-size: 1.75rem; transform: translateY(4px);">TRutiL Studio</span>
                        </a>
                        <div class="sidebar-toggle-btn" id="tv-sidebar-toggle">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        </div>
                    </div>
                    <div style="padding: 10px 1.5rem; border-bottom: 1px solid var(--tv-border);">
                        <input type="text" id="tv-sidebar-search" placeholder="Search tools..." style="width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid var(--tv-border); background: var(--tv-nav-bg); color: var(--tv-text); font-size: 0.9rem;">
                    </div>
                    <div class="sidebar-nav" id="tv-sidebar-nav" style="transition: opacity 0.2s;">
                        <!-- Loaded dynamically -->
                    </div>
                    <div class="sidebar-bottom" style="transition: opacity 0.2s;">
                        <span class="sidebar-ver">v2.0</span>
                    </div>
                `
                document.body.insertBefore(sidebar, document.body.firstChild);
                
                const navContainer = document.getElementById('tv-sidebar-nav');
                let html = '';
                html += `<a href="${prefix}index.html" class="nav-home"><span class="ni">🏠</span> Main Hub</a>`;
                html += `<a href="${prefix}tools/${currentMainCategory}/index.html" class="nav-home" style="margin-bottom: 1rem;"><span class="ni">📂</span> ${currentMainCategory} Hub</a>`;
                
                // Render all subcategories for the current main category
                const subHubs = navData[currentMainCategory];
                
                for (const [subHubName, subTools] of Object.entries(subHubs)) {
                    // Check if this section should be open (if current page is in this subhub)
                    const isSectionActive = decodedPath.includes(`/${subHubName}/`) || subTools.some(t => decodedPath.endsWith(t.path.split('/').pop()));
                    
                    if (subTools && subTools.length > 0) {
                        html += `<div class="nav-section ${isSectionActive ? 'open' : ''}">
                            <button class="nav-section-toggle">
                                <span>${subHubName}</span>
                                <span class="chevron">▶</span>
                            </button>
                            <div class="nav-section-children">`;
                        
                        for (const tool of subTools) {
                            const isActiveTool = decodedPath.endsWith(tool.path.split('/').pop());
                            const linkUrl = prefix + 'tools/' + tool.path.replace(/\\/g, '/');
                            html += `
                                <a href="${linkUrl}" class="nav-item ${isActiveTool ? 'active' : ''}">
                                    <span class="ni">▪</span> ${tool.name}
                                </a>
                            `;
                        }
                        
                        html += `</div></div>`;
                    }
                }
                
                navContainer.innerHTML = html;
                
                const toggles = navContainer.querySelectorAll('.nav-section-toggle');
                toggles.forEach(t => {
                    t.addEventListener('click', (e) => {
                        e.currentTarget.parentElement.classList.toggle('open');
                    });
                });
                
                const searchInput = document.getElementById('tv-sidebar-search');
                if (searchInput) {
                    searchInput.addEventListener('input', (e) => {
                        const term = e.target.value.toLowerCase();
                        const sections = navContainer.querySelectorAll('.nav-section');
                        
                        sections.forEach(sec => {
                            const items = sec.querySelectorAll('.nav-item');
                            let hasVisible = false;
                            
                            items.forEach(item => {
                                if (item.textContent.toLowerCase().includes(term)) {
                                    item.style.display = 'flex';
                                    hasVisible = true;
                                } else {
                                    item.style.display = 'none';
                                }
                            });
                            
                            if (term && hasVisible) {
                                sec.classList.add('open');
                                sec.style.display = 'flex';
                            } else if (term && !hasVisible) {
                                sec.style.display = 'none';
                            } else {
                                sec.style.display = 'flex';
                                // Restore original open state based on active path
                                if (!sec.querySelector('.nav-item.active')) {
                                    sec.classList.remove('open');
                                }
                            }
                        });
                    });
                }
            }

            const hamburgerBtn = document.getElementById('tv-hamburger');
            const sidebarEl = document.querySelector('.sidebar');
            if (hamburgerBtn && sidebarEl) {
                hamburgerBtn.addEventListener('click', () => {
                    sidebarEl.classList.toggle('open');
                });
                document.addEventListener('click', (e) => {
                    if (sidebarEl.classList.contains('open') && !sidebarEl.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                        sidebarEl.classList.remove('open');
                    }
                });
            } // ADDED MISSING BRACE!
            
            // --- Sidebar Minimization State ---
            const toggleBtn = document.getElementById('tv-sidebar-toggle');
            if (toggleBtn) {
                const savedMin = localStorage.getItem('TRutiL Studio_sidebar_min');
                if (savedMin === 'true') {
                    sidebar.classList.add('sidebar-minimized');
                    document.body.classList.add('sidebar-min-body');
                }
                
                toggleBtn.addEventListener('click', () => {
                    sidebar.classList.toggle('sidebar-minimized');
                    document.body.classList.toggle('sidebar-min-body');
                    const isMin = sidebar.classList.contains('sidebar-minimized');
                    localStorage.setItem('TRutiL Studio_sidebar_min', isMin);
                });
            }


        } else {
            const hamburgerBtn = document.getElementById('tv-hamburger');
            if(hamburgerBtn) hamburgerBtn.style.display = 'none';
        }
    });
})();
