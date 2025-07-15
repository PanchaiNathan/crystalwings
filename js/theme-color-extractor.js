/**
 * Theme Color Extractor
 * This script extracts the dominant color from the logo and applies it to the website theme
 */

(function() {
    'use strict';
    
    // Create and style preloader
    function createPreloader() {
        const preloader = document.createElement('div');
        preloader.id = 'theme-preloader';
        preloader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #1a1a1a;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        `;
        
        const spinner = document.createElement('div');
        spinner.style.cssText = `
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
        `;
        
        const keyframes = document.createElement('style');
        keyframes.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        
        document.head.appendChild(keyframes);
        preloader.appendChild(spinner);
        document.body.appendChild(preloader);
        
        return preloader;
    }
    
    // Create preloader immediately
    const preloader = createPreloader();
    
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Create a canvas element to analyze the logo
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Find all instances of the logo
        const logoImages = document.querySelectorAll('img[src*="logo.jpeg"]');
        
        if (logoImages.length === 0) {
            console.log('Logo images not found');
            return;
        }
        
        // Use the first logo found
        const logoImg = logoImages[0];
        
        // Make sure the image is loaded before processing
        if (logoImg.complete) {
            extractColors(logoImg);
        } else {
            logoImg.onload = function() {
                extractColors(logoImg);
            };
        }
        
        function extractColors(img) {
            // Set canvas size to match image
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            
            // Draw image to canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Variables to store color counts
            const colorCounts = {};
            let maxCount = 0;
            let dominantColor = { r: 0, g: 0, b: 0 };
            
            // Analyze every 5th pixel (for performance)
            for (let i = 0; i < data.length; i += 20) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3];
                
                // Skip transparent pixels
                if (a < 128) continue;
                
                // Skip very dark or very light pixels
                if ((r + g + b) < 100 || (r + g + b) > 700) continue;
                
                // Create a simple color key
                const key = Math.round(r/10) * 10000 + Math.round(g/10) * 100 + Math.round(b/10);
                
                if (!colorCounts[key]) {
                    colorCounts[key] = 0;
                }
                
                colorCounts[key]++;
                
                if (colorCounts[key] > maxCount) {
                    maxCount = colorCounts[key];
                    dominantColor = { r, g, b };
                }
            }
            
            // Create secondary colors based on the dominant color
            const colors = generateColorPalette(dominantColor);
            
            // Apply the colors to the website
            applyColors(colors);
        }
        
        function generateColorPalette(baseColor) {
            // Convert RGB to HSL for easier manipulation
            const hsl = rgbToHsl(baseColor.r, baseColor.g, baseColor.b);
            
            // Increase saturation and lightness for better visibility
            const enhancedS = Math.min(1, hsl.s * 1.3);
            const enhancedL = Math.min(0.8, Math.max(0.5, hsl.l * 1.2));
            
            // Create variations with enhanced visibility
            return {
                primary: hslToRgbString(hsl.h, enhancedS, enhancedL),
                primaryRgb: rgbToRgbValues(hslToRgb(hsl.h, enhancedS, enhancedL)),
                primaryDark: hslToRgbString(hsl.h, enhancedS, Math.max(0.3, enhancedL - 0.2)),
                primaryLight: hslToRgbString(hsl.h, enhancedS * 0.8, Math.min(0.9, enhancedL + 0.2)),
                accent: hslToRgbString((hsl.h + 180) % 360, enhancedS, enhancedL),
                textColor: '#ffffff',
                textColorRgb: '255, 255, 255',
                textAccent: hslToRgbString((hsl.h + 30) % 360, enhancedS, 0.8),
                textMuted: 'rgba(255, 255, 255, 0.8)'
            };
        }
        
        // Helper function: Convert HSL to RGB values
        function hslToRgb(h, s, l) {
            h /= 360;
            let r, g, b;
            
            if (s === 0) {
                r = g = b = l; // achromatic
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
                
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
            
            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        }
        
        // Helper function: Convert RGB object to comma-separated values
        function rgbToRgbValues(rgb) {
            return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
        }
        
        function applyColors(colors) {
            // Create a style element
            const style = document.createElement('style');
            
            // Define CSS variables
            style.textContent = `
                :root {
                    --primary-color: ${colors.primary};
                    --primary-color-rgb: ${colors.primaryRgb};
                    --primary-color-dark: ${colors.primaryDark};
                    --primary-color-light: ${colors.primaryLight};
                    --accent-color: ${colors.accent};
                    --text-color: ${colors.textColor};
                    --text-color-rgb: ${colors.textColorRgb};
                    --text-accent: ${colors.textAccent};
                    --text-muted: ${colors.textMuted};
                }
                
                /* Apply to specific elements */
                .btn-main {
                    background: var(--primary-color);
                    border-color: var(--primary-color);
                    color: var(--text-color);
                }
                
                .btn-main:hover {
                    background: var(--primary-color-dark);
                    border-color: var(--primary-color-dark);
                }
                
                header.smaller {
                    background: rgba(var(--primary-color-rgb), 0.7) !important;
                }
                
                header.smaller::after {
                    background: linear-gradient(to right, transparent, var(--primary-color), transparent);
                }
                
                /* Text styling based on theme - Enhanced visibility */
                body {
                    color: rgba(255, 255, 255, 0.9);
                }
                
                p, .text-light, .lead, p.lead {
                    color: rgba(255, 255, 255, 0.9) !important;
                    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
                }
                
                .subtitle, h1, h2, h3, h4, h5, h6 {
                    color: var(--primary-color);
                    text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4);
                }
                
                a {
                    color: var(--primary-color);
                    text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2);
                }
                
                a:hover {
                    color: var(--primary-light);
                    text-decoration: none;
                }
                
                .social-icons a {
                    color: white !important;
                }
                
                .social-icons a:hover {
                    background: var(--primary-color);
                    color: white !important;
                }
                
                #mainmenu a {
                    color: white !important;
                    text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.5);
                }
                
                #mainmenu a.active {
                    color: var(--primary-color) !important;
                }
                
                .de-marquee-list-1 span:not(.op-2), .de-marquee-list-2 span:not(.op-2) {
                    color: var(--primary-color);
                }
                
                /* Enhanced styling */
                .subtitle::after {
                    background-color: var(--primary-color);
                }
                
                .hover:hover .bg-dark-2 {
                    box-shadow: 0 15px 30px rgba(var(--primary-color-rgb), 0.2);
                }
                
                .gradient-overlay::after {
                    background: linear-gradient(135deg, 
                        rgba(var(--primary-color-rgb), 0.7) 0%, 
                        rgba(var(--primary-color-rgb), 0) 100%);
                }
                
                /* Scroll indicator */
                .scrollbar-v {
                    background-color: var(--primary-color) !important;
                }
                
                /* Add subtle glow to images */
                .hover .bg-dark-2 img {
                    box-shadow: 0 5px 15px rgba(var(--primary-color-rgb), 0.3);
                }
                
                /* Add color to list markers */
                .ul-check li:before {
                    color: var(--primary-color);
                }
                
                /* Add subtle border accents */
                section {
                    border-bottom: 1px solid rgba(var(--primary-color-rgb), 0.1);
                }
                
                /* Add subtle gradient to dark backgrounds */
                .bg-dark {
                    background: linear-gradient(45deg, 
                        var(--bg-dark-1), 
                        rgba(var(--primary-color-rgb), 0.2)) !important;
                }
                
                /* Footer text colors - Enhanced visibility */
                footer h3, footer h4, footer h5 {
                    color: var(--primary-color) !important;
                    text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
                }
                
                footer p, footer a, footer span, footer div, .subfooter {
                    color: rgba(255, 255, 255, 0.9) !important;
                    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
                }
                
                footer a:hover {
                    color: var(--primary-color) !important;
                }
                
                /* Form elements */
                input, textarea {
                    border-color: rgba(var(--primary-color-rgb), 0.2);
                }
                
                input:focus, textarea:focus {
                    border-color: var(--primary-color);
                }
                
                /* Blockquotes */
                blockquote {
                    border-left: 3px solid var(--primary-color);
                    color: var(--text-accent);
                }
                
                /* Selection color */
                ::selection {
                    background: var(--primary-color);
                    color: var(--text-color);
                }
            `;
            
            // Add the style element to the head
            document.head.appendChild(style);
            
            // Apply color to specific elements that might need direct styling
            document.querySelectorAll('.bg-color').forEach(el => {
                el.style.backgroundColor = colors.primary;
            });
            
            document.querySelectorAll('.bg-color-2').forEach(el => {
                el.style.backgroundColor = colors.primaryDark;
            });
            
            // Add subtle animation to logo
            document.querySelectorAll('img[src*="logo.jpeg"]').forEach(logo => {
                logo.style.transition = 'all 0.5s ease';
                
                // Add hover effect
                logo.addEventListener('mouseenter', () => {
                    logo.style.transform = 'scale(1.05)';
                    logo.style.boxShadow = `0 5px 15px rgba(${colors.primaryRgb}, 0.5)`;
                });
                
                logo.addEventListener('mouseleave', () => {
                    logo.style.transform = 'scale(1)';
                    logo.style.boxShadow = 'none';
                });
            });
            
            // Add subtle animation to buttons
            document.querySelectorAll('.btn-main').forEach(btn => {
                btn.style.transition = 'all 0.3s ease';
                
                // Add hover effect
                btn.addEventListener('mouseenter', () => {
                    btn.style.transform = 'translateY(-3px)';
                    btn.style.boxShadow = `0 7px 20px rgba(${colors.primaryRgb}, 0.4)`;
                });
                
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'translateY(0)';
                    btn.style.boxShadow = `0 5px 15px rgba(0, 0, 0, 0.2)`;
                });
            });
            
            // Add subtle scroll effect
            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollProgress = scrollTop / scrollHeight;
                
                // Apply subtle color shift to header based on scroll position
                const header = document.querySelector('header.smaller');
                if (header) {
                    const opacity = 0.7 + (scrollProgress * 0.3); // 0.7 to 1.0
                    header.style.background = `rgba(${colors.primaryRgb}, ${opacity})`;
                }
            });
            
            // Update preloader with theme color
            const preloader = document.getElementById('theme-preloader');
            if (preloader) {
                const spinner = preloader.querySelector('div');
                if (spinner) {
                    spinner.style.borderTopColor = colors.primary;
                }
                
                // Fade out and remove preloader
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    preloader.style.visibility = 'hidden';
                    
                    // Remove from DOM after animation completes
                    setTimeout(() => {
                        preloader.remove();
                    }, 500);
                }, 500);
            }
            
            // Store theme colors in localStorage for use across all pages
            storeThemeColors(colors);
            
            // Add event listeners for page navigation to ensure theme persists
            setupPageTransitions();
        }
        
        // Store theme colors in localStorage
        function storeThemeColors(colors) {
            try {
                localStorage.setItem('crystalWings_themeColors', JSON.stringify({
                    primary: colors.primary,
                    primaryRgb: colors.primaryRgb,
                    primaryDark: colors.primaryDark,
                    primaryLight: colors.primaryLight,
                    accent: colors.accent,
                    textColor: colors.textColor,
                    textColorRgb: colors.textColorRgb,
                    textAccent: colors.textAccent,
                    textMuted: colors.textMuted,
                    timestamp: new Date().getTime()
                }));
            } catch (e) {
                console.log('Could not store theme colors in localStorage', e);
            }
        }
        
        // Setup page transition handling
        function setupPageTransitions() {
            // Handle all link clicks to store current scroll position
            document.querySelectorAll('a').forEach(link => {
                // Only handle links to other pages on the same site
                if (link.hostname === window.location.hostname && 
                    !link.href.includes('#') && 
                    link.getAttribute('target') !== '_blank') {
                    
                    link.addEventListener('click', function(e) {
                        // Store current scroll position
                        try {
                            sessionStorage.setItem('crystalWings_scrollPosition', window.pageYOffset);
                        } catch (e) {
                            console.log('Could not store scroll position', e);
                        }
                    });
                }
            });
        }
        
        // Helper function: Convert RGB to HSL
        function rgbToHsl(r, g, b) {
            r /= 255;
            g /= 255;
            b /= 255;
            
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            
            if (max === min) {
                h = s = 0; // achromatic
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                
                h /= 6;
            }
            
            return { h: h * 360, s, l };
        }
        
        // Helper function: Convert HSL to RGB string
        function hslToRgbString(h, s, l) {
            h /= 360;
            let r, g, b;
            
            if (s === 0) {
                r = g = b = l; // achromatic
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
                
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
            
            return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
        }
    });
})();