/**
 * Static 3D Depth Effect
 * This script adds a subtle 3D depth effect to elements without animations
 */

(function() {
    'use strict';
    
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Apply 3D perspective to body
        document.body.style.perspective = '1000px';
        
        // Apply static 3D depth to sections
        document.querySelectorAll('section').forEach((section, index) => {
            // Alternate depth for visual interest
            const depth = index % 2 === 0 ? -10 : -5;
            section.style.transform = `translateZ(${depth}px)`;
            section.style.position = 'relative';
            section.style.zIndex = 10 - Math.abs(depth);
        });
        
        // Apply static 3D depth to headings
        document.querySelectorAll('h1, h2, h3, h4, h5, h6, .subtitle').forEach((heading) => {
            heading.style.transform = 'translateZ(5px)';
            heading.style.position = 'relative';
            heading.style.zIndex = 15;
        });
        
        // Apply static 3D depth to buttons
        document.querySelectorAll('.btn-main').forEach((btn) => {
            btn.style.transform = 'translateZ(8px)';
            btn.style.position = 'relative';
            btn.style.zIndex = 20;
            btn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        });
        
        // Apply static 3D depth to cards
        document.querySelectorAll('.hover').forEach((card) => {
            card.style.transform = 'translateZ(3px)';
            card.style.position = 'relative';
            card.style.zIndex = 12;
            card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        });
        
        // Apply static 3D depth to images
        document.querySelectorAll('img:not([src*="logo.jpeg"])').forEach((img) => {
            img.style.transform = 'translateZ(2px)';
            img.style.position = 'relative';
            img.style.zIndex = 11;
            img.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.15)';
        });
    });
})();