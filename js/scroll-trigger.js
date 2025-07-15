/**
 * Static 3D Depth Effect for Sections
 * This script adds a subtle 3D depth effect to sections without animations
 */

(function() {
    'use strict';
    
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Get all sections
        const sections = document.querySelectorAll('section');
        
        // Apply static 3D depth to sections
        sections.forEach((section, index) => {
            // Make sure all sections are visible
            section.style.opacity = '1';
            
            // Apply static 3D transform with alternating depths
            const depth = -5 - (index % 3) * 5; // -5, -10, or -15 px depth
            section.style.transform = `translateZ(${depth}px)`;
            
            // Set z-index to create proper stacking
            section.style.position = 'relative';
            section.style.zIndex = 10 - Math.abs(depth);
            
            // Add subtle shadow for depth perception
            if (index % 2 === 0) {
                section.style.boxShadow = 'inset 0 5px 15px rgba(0, 0, 0, 0.1)';
            }
        });
        
        // Add subtle 3D effect to section content
        sections.forEach(section => {
            // Find content container in section
            const container = section.querySelector('.container');
            if (container) {
                container.style.transform = 'translateZ(5px)';
                container.style.position = 'relative';
                container.style.zIndex = 20;
            }
        });
    });
})();