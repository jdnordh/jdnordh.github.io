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

    // Wobbling Contact Orb Effect
    const contactIslandEle = document.querySelector('.contact-island');
    const wobbleFilter = document.getElementById('wobble-displacement');
    const contactContainerEle = document.querySelector('.contact-glow-container');

    if (contactIslandEle && wobbleFilter && contactContainerEle) {
        let currentScale = 5;
        let targetScale = 10;

        const baseScale = 5;    // Subtle ambient hum
        const maxScale = 60;    // Intense vibration proximity
        const effectRadius = 600; // Trigger distance

        // Smooth animation loop for organic sound-wave ramping
        function tightenWobble() {
            // Lerp towards target for buttery smooth reactivity
            currentScale += (targetScale - currentScale) * 0.15;
            wobbleFilter.setAttribute('scale', currentScale);
            requestAnimationFrame(tightenWobble);
        }
        tightenWobble();

        contactIslandEle.addEventListener('mousemove', (e) => {
            const rect = contactContainerEle.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance < effectRadius) {
                // Decay intensity on a curved trajectory based on distance
                const intensity = 1 - (distance / effectRadius);
                const easedIntensity = intensity * intensity * intensity; // Cubic curve bounds it tighter to the center
                targetScale = baseScale + (maxScale - baseScale) * easedIntensity;
            } else {
                targetScale = baseScale;
            }
        });

        contactIslandEle.addEventListener('mouseleave', () => {
            targetScale = baseScale;
        });
    }
});
