document.addEventListener('DOMContentLoaded', () => {
    // 1. Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // 2. Smooth scrolling for internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Because we use a parallax wrapper, we need to scroll that container, not the window
                const wrapper = document.querySelector('.parallax-wrapper');
                // Calculate position relative to wrapper
                const topPos = targetElement.getBoundingClientRect().top + wrapper.scrollTop;
                
                wrapper.scrollTo({
                    top: topPos - 100, // offset for header
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. (Removed JS 3D hover effect, CSS handles simple vertical lift)
    const wrapper = document.querySelector('.parallax-wrapper');

    // 4. Depth-based blur adjustments on scroll (Bonus)
    const farIslands = document.querySelector('.depth-4');
    const midIslands = document.querySelector('.depth-2');
    
    wrapper.addEventListener('scroll', () => {
        const scrollAmount = wrapper.scrollTop;
        const maxScroll = wrapper.scrollHeight - wrapper.clientHeight;
        const scrollPercent = scrollAmount / maxScroll;
        
        // Adjust blur based on scroll depth
        if (farIslands) {
            const farBlur = 2 + (scrollPercent * 4); // Starts at 2px, goes to 6px
            farIslands.style.filter = `blur(${farBlur}px)`;
        }
        
        if (midIslands) {
            const midBlur = 1 + (scrollPercent * 2); // Starts at 1px, goes to 3px
            midIslands.style.filter = `blur(${midBlur}px)`;
        }
    }, { passive: true });

    // 5. Contact Orb "Reach Out" Effect
    const contactIsland = document.querySelector('.contact-island');
    const contactContainer = document.querySelector('.contact-glow-container');
    const contactReach = document.querySelector('.contact-glow-reach');
    
    if (contactIsland && contactContainer && contactReach) {
        contactIsland.addEventListener('mousemove', (e) => {
            const rect = contactContainer.getBoundingClientRect();
            // Calculate mouse position relative to center of the actual orb
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            
            // Constrain the reach radius (max 60px distance physically moved)
            const maxReach = 60;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            let reachX = deltaX;
            let reachY = deltaY;
            
            if (distance > maxReach) {
                const ratio = maxReach / distance;
                reachX *= ratio;
                reachY *= ratio;
            }
            // Move orb slightly towards mouse
            contactReach.style.setProperty('--reach-x', `${reachX}px`);
            contactReach.style.setProperty('--reach-y', `${reachY}px`);
        });
        
        // Reset when mouse leaves
        contactIsland.addEventListener('mouseleave', () => {
            contactReach.style.setProperty('--reach-x', `0px`);
            contactReach.style.setProperty('--reach-y', `0px`);
        });
    }
});
