/**
 * Theme Loader
 * This script loads the theme colors from localStorage and applies them to any page
 * This ensures consistent theming across all pages of the website
 */

(function() {
    'use strict';
    
    // Execute immediately to prevent flash of unstyled content
    (function loadStoredTheme() {
        try {
            // Try to get stored theme colors
            const storedTheme = localStorage.getItem('crystalWings_themeColors');
            
            if (storedTheme) {
                const colors = JSON.parse(storedTheme);
                
                // Check if the stored theme is recent (less than 1 day old)
                const now = new Date().getTime();
                const storedTime = colors.timestamp || 0;
                const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds
                
                if (now - storedTime < oneDay) {
                    // Apply the stored theme immediately
                    applyStoredTheme(colors);
                }
            }
        } catch (e) {
            console.log('Error loading stored theme', e);
        }
    })();
    
    // Apply stored theme colors
    function applyStoredTheme(colors) {
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
                color: white !important;
            }
            
            .btn-main:hover {
                background: var(--primary-color-dark);
                border-color: var(--primary-color-dark);
            }
            
            header.smaller {
                background: rgba(var(--primary-color-rgb), 0.7) !important;
            }
            
            /* Text styling for maximum visibility */
            body {
                color: rgba(255, 255, 255, 0.9);
            }
            
            p, .text-light, .lead, p.lead {
                color: rgba(255, 255, 255, 0.9) !important;
                text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
            }
            
            .subtitle, h1, h2, h3, h4, h5, h6 {
                color: var(--primary-color) !important;
                text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4);
            }
            
            a {
                color: var(--primary-color);
            }
            
            a:hover {
                color: var(--primary-light);
            }
            
            #mainmenu a {
                color: white !important;
                text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.5);
            }
            
            #mainmenu a.active {
                color: var(--primary-color) !important;
            }
            
            /* Enhanced styling */
            .subtitle::after {
                background-color: var(--primary-color);
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
            
            /* Ensure all text is visible */
            p, .lead, li, span:not(.op-2) {
                color: rgba(255, 255, 255, 0.9) !important;
                text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
            }
            
            /* Enhance contrast for dark sections */
            .section-dark p, 
            .section-dark .lead, 
            .section-dark li, 
            .section-dark span:not(.op-2),
            .bg-dark p,
            .bg-dark .lead,
            .bg-dark li,
            .bg-dark span:not(.op-2) {
                color: white !important;
                text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
            }
            
            /* Responsive text visibility for all screen sizes */
            @media only screen and (max-width: 767px) {
                p, .lead, li, span:not(.op-2) {
                    color: white !important;
                    text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
                    font-size: 1.05em;
                }
                
                h1, h2, h3, h4, h5, h6 {
                    color: var(--primary-color) !important;
                    text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
                }
            }
            
            /* 3D Depth Effect for Elements */
            body {
                perspective: 1000px;
                transform-style: preserve-3d;
            }
            
            h1, h2, h3 {
                transform: translateZ(5px);
                position: relative;
                z-index: 15;
            }
            
            .btn-main {
                transform: translateZ(8px);
                position: relative;
                z-index: 20;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }
            
            .container {
                transform: translateZ(5px);
                position: relative;
                z-index: 20;
            }
            
            section {
                position: relative;
                z-index: 5;
            }
            
            img:not([src*="logo.jpeg"]) {
                transform: translateZ(2px);
                position: relative;
                z-index: 11;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
            }
            
            /* Why Choose Us section text visibility improvements */
            #section-why-choose .hover .bg-dark-2 .abs.p-40 {
                background: linear-gradient(to top, 
                    rgba(0, 0, 0, 0.9) 0%, 
                    rgba(0, 0, 0, 0.7) 50%,
                    rgba(0, 0, 0, 0.4) 80%,
                    rgba(0, 0, 0, 0) 100%);
                width: 100%;
                padding: 40px !important;
            }
            
            #section-why-choose .hover .bg-dark-2 .abs.p-40 h4 {
                color: white !important;
                text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
                font-weight: 600;
            }
            
            #section-why-choose .hover .bg-dark-2 .abs.p-40 p {
                color: rgba(255, 255, 255, 0.95) !important;
                text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.5);
                font-weight: 500;
            }
        `;
        
        // Add the style element to the head
        document.head.appendChild(style);
    }
    
    // Restore scroll position when navigating back
    document.addEventListener('DOMContentLoaded', function() {
        try {
            const scrollPosition = sessionStorage.getItem('crystalWings_scrollPosition');
            if (scrollPosition) {
                window.scrollTo(0, parseInt(scrollPosition));
                sessionStorage.removeItem('crystalWings_scrollPosition');
            }
        } catch (e) {
            console.log('Could not restore scroll position', e);
        }
    });
})();