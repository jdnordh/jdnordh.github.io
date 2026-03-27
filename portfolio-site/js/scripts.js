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

    // 3. Subtle mouse parallax effect for foreground elements 
    // to give it that extra "floating" alive feel
    const wrapper = document.querySelector('.parallax-wrapper');
    const contentIslands = document.querySelectorAll('.content-island');
    
    wrapper.addEventListener('mousemove', (e) => {
        // Calculate mouse position relative to center of screen (-1 to 1)
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
        
        contentIslands.forEach(island => {
            // Apply subtle rotation and translation
            island.style.transform = `translateY(-5px) perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
    });
    
    // Reset transform on mouse leave
    wrapper.addEventListener('mouseleave', () => {
        contentIslands.forEach(island => {
            island.style.transform = 'translateY(0) perspective(1000px) rotateY(0deg) rotateX(0deg)';
        });
    });

    // 4. Depth-based blur adjustments on scroll (Bonus)
    const farIslands = document.querySelector('.depth-4');
    const midIslands = document.querySelector('.depth-2');
    
    wrapper.addEventListener('scroll', () => {
        const scrollAmount = wrapper.scrollTop;
        const maxScroll = wrapper.scrollHeight - wrapper.clientHeight;
        const scrollPercent = scrollAmount / maxScroll;
        
        // Adjust blur based on scroll depth
        if (farIslands) {
            const farBlur = 4 + (scrollPercent * 4); // Starts at 4px, goes to 8px
            farIslands.style.filter = `blur(${farBlur}px)`;
        }
        
        if (midIslands) {
            const midBlur = 1.5 + (scrollPercent * 2); // Starts at 1.5px, goes to 3.5px
            midIslands.style.filter = `blur(${midBlur}px)`;
        }
    }, { passive: true });
});
