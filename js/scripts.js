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
    const parallaxLayers = document.querySelectorAll('[data-parallax-speed]');
    const fogInstances = document.querySelectorAll('.fog-instance');

    function syncParallaxContentHeight() {
        const fullHeight = Math.max(wrapper.scrollHeight, window.innerHeight);
        document.documentElement.style.setProperty('--parallax-content-height', `${fullHeight}px`);
    }

    function applyParallaxTransforms() {
        const scrollAmount = wrapper.scrollTop;
        parallaxLayers.forEach((layer) => {
            const speed = parseFloat(layer.dataset.parallaxSpeed || '0');
            layer.style.transform = `translate3d(0, ${scrollAmount * speed}px, 0)`;
        });
    }

    fogInstances.forEach((fog) => {
        const speedMultiplier = parseFloat(fog.dataset.fogSpeedMultiplier || '1');
        fog.style.setProperty('--fog-speed-multiplier', `${speedMultiplier}`);
    });

    syncParallaxContentHeight();
    applyParallaxTransforms();

    window.addEventListener('resize', () => {
        syncParallaxContentHeight();
        applyParallaxTransforms();
    });

    // 4. Depth-based blur adjustments on scroll (Bonus)
    const farIslands = document.querySelector('.depth-4');
    const midIslands = document.querySelector('.depth-2');

    wrapper.addEventListener('scroll', () => {
        const scrollAmount = wrapper.scrollTop;
        const maxScroll = wrapper.scrollHeight - wrapper.clientHeight;
        const scrollPercent = scrollAmount / maxScroll;

        applyParallaxTransforms();

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

    // --- Ninja Engine & Island Configuration ---
    const islands = [];
    const islandNodes = document.querySelectorAll('.island');
    const wrapperRectBase = wrapper.getBoundingClientRect(); // Useful for initial math

    // 1. Initialize Islands from HTML data-* attributes
    islandNodes.forEach((node, index) => {
        const xPct = parseFloat(node.dataset.x || 0);
        const yPct = parseFloat(node.dataset.y || 0);
        const scale = parseFloat(node.dataset.scale || 1);
        const size = parseFloat(node.dataset.size || 0);
        const delay = node.dataset.delay || '0s';
        
        node.style.left = `${xPct}%`;
        node.style.top = `${yPct}%`;
        if (node.dataset.scale) node.style.setProperty('--island-scale', scale);
        if (size > 0) {
            node.style.setProperty('--island-width', `${size}px`);
            node.style.setProperty('--island-height', `${Math.max(80, Math.round(size * 0.66))}px`);
        }
        node.style.setProperty('--island-delay', delay);

        // Determine Ninja Depth Scale based on layer
        const parentLayer = node.closest('.parallax-layer');
        let ninjaScale = 1;
        if (parentLayer) {
            if (parentLayer.classList.contains('depth-4')) ninjaScale = 0.5; // Far
            else if (parentLayer.classList.contains('depth-2')) ninjaScale = 0.75; // Mid
        }
        
        islands.push({
            node, 
            id: index,
            ninjaScale
        });
    });

    // 2. Ninja Controller State
    const ninjaEle = document.getElementById('ninja');
    let isJumping = false;
    let currentIslandIdx = 0; // Starts at first island
    let targetIslandIdx = 0;
    
    // Track Mouse
    let isTouchDevice = window.matchMedia("(pointer: coarse)").matches || ('ontouchstart' in window);
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    window.addEventListener('resize', () => {
        isTouchDevice = window.matchMedia("(pointer: coarse)").matches || ('ontouchstart' in window);
    });

    wrapper.addEventListener('mousemove', (e) => {
        if (isTouchDevice) return;
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    if (islands.length > 0 && ninjaEle) {
        // Init ninja visibility
        ninjaEle.classList.add('visible');
        
        // Initial Ninja placement
        const initRect = islands[0].node.getBoundingClientRect();
        const initWrappRect = wrapper.getBoundingClientRect();
        const initWx = (initRect.left - initWrappRect.left) + wrapper.scrollLeft + initRect.width / 2;
        const initWy = (initRect.top - initWrappRect.top) + wrapper.scrollTop + initRect.height / 2;
        
        ninjaEle.style.setProperty('--ninja-x', `${initWx - 12}px`);
        ninjaEle.style.setProperty('--ninja-y', `${initWy - 36}px`);
        ninjaEle.style.setProperty('--ninja-scale', islands[0].ninjaScale);

        // Pathfinding: Dijkstra over screen space
        function getShortestPath(startIdx, targetIdx) {
            const dist = [];
            const prev = [];
            const unvisited = new Set();
            for(let i = 0; i < islands.length; i++) {
                dist[i] = Infinity;
                prev[i] = -1;
                unvisited.add(i);
            }
            dist[startIdx] = 0;
            
            while(unvisited.size > 0) {
                let u = -1;
                let minD = Infinity;
                for(let i of unvisited) {
                    if(dist[i] < minD) { minD = dist[i]; u = i; }
                }
                if (u === -1 || u === targetIdx) break;
                unvisited.delete(u);
                
                const uRect = islands[u].node.getBoundingClientRect();
                const ux = uRect.left + uRect.width / 2;
                const uy = uRect.top + uRect.height / 2;

                for(let v of unvisited) {
                    const vRect = islands[v].node.getBoundingClientRect();
                    const vx = vRect.left + vRect.width / 2;
                    const vy = vRect.top + vRect.height / 2;
                    const cost = Math.hypot(ux - vx, uy - vy);
                    
                    if (dist[u] + cost < dist[v]) {
                        dist[v] = dist[u] + cost;
                        prev[v] = u;
                    }
                }
            }
            const path = [];
            let curr = targetIdx;
            while(curr !== -1) {
                path.unshift(curr);
                curr = prev[curr];
            }
            return path;
        }

        // Main Loop
        function engineTick() {
            if (isTouchDevice) {
                mouseX = window.innerWidth / 2;
                mouseY = window.innerHeight / 2;
            }

            // Find closest island dynamically
            let closestIsland = islands[targetIslandIdx];
            let minDist = Infinity;
            
            for(const island of islands) {
                const rect = island.node.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                // Add an offset so it targets the visual top of the island slightly
                const cy = rect.top + rect.height / 2;
                
                const dist = Math.hypot(cx - mouseX, cy - mouseY);
                if (dist < minDist) {
                    minDist = dist;
                    closestIsland = island;
                }
            }
            
            targetIslandIdx = closestIsland.id;

            // Trigger jump if idle
            if (!isJumping && currentIslandIdx !== targetIslandIdx) {
                const path = getShortestPath(currentIslandIdx, targetIslandIdx);
                if (path.length > 1) {
                    jumpTo(path[1]);
                }
            }

            // Idle state anchoring (in case wrapper is scrolling)
            if (!isJumping && currentIslandIdx === targetIslandIdx) {
                const r = islands[currentIslandIdx].node.getBoundingClientRect();
                const wRect = wrapper.getBoundingClientRect();
                const wX = (r.left - wRect.left) + wrapper.scrollLeft + r.width / 2;
                const wY = (r.top - wRect.top) + wrapper.scrollTop + r.height / 2;
                ninjaEle.style.setProperty('--ninja-x', `${wX - 12}px`);
                ninjaEle.style.setProperty('--ninja-y', `${wY - 36}px`);
            }

            requestAnimationFrame(engineTick);
        }
        
        function jumpTo(nextIdx) {
            isJumping = true;
            ninjaEle.classList.remove('idle');
            ninjaEle.classList.add('jumping');
            
            const startIsland = islands[currentIslandIdx];
            const endIsland = islands[nextIdx];
            
            const startTime = performance.now();
            // Dynamic jump duration based on distance? let's fix it to 700ms for solid rhythm.
            const duration = 700; 

            function animateJump(time) {
                let t = (time - startTime) / duration;
                if (t > 1) t = 1;
                
                // Read live positions to perfectly sync with scrolling wrapper
                const sRect = startIsland.node.getBoundingClientRect();
                const eRect = endIsland.node.getBoundingClientRect();
                const wRect = wrapper.getBoundingClientRect();

                // Get Live Wrapper World coordinates
                const sX = (sRect.left - wRect.left) + wrapper.scrollLeft + sRect.width / 2;
                const sY = (sRect.top - wRect.top) + wrapper.scrollTop + sRect.height / 2;
                const eX = (eRect.left - wRect.left) + wrapper.scrollLeft + eRect.width / 2;
                const eY = (eRect.top - wRect.top) + wrapper.scrollTop + eRect.height / 2;

                // Simple jump arc (Parabola)
                // Height of jump scaled by horizontal distance to make it feel natural
                const jumpHeight = Math.max(100, Math.hypot(eX - sX, eY - sY) * 0.25);
                const arc = Math.sin(t * Math.PI) * jumpHeight;
                
                const curX = sX + (eX - sX) * t;
                const curY = sY + (eY - sY) * t - arc; 
                const curScale = startIsland.ninjaScale + (endIsland.ninjaScale - startIsland.ninjaScale) * t;

                ninjaEle.style.setProperty('--ninja-x', `${curX - 12}px`);
                ninjaEle.style.setProperty('--ninja-y', `${curY - 36}px`);
                ninjaEle.style.setProperty('--ninja-scale', curScale);

                // Face direction loosely
                const dirX = eX - sX;
                ninjaEle.style.transform = `translate3d(var(--ninja-x, 0px), var(--ninja-y, 0px), 0px) scaleX(${dirX < 0 ? -1 : 1}) scaleY(1) scale(var(--ninja-scale, 1))`;
                // Wait, scaleX(-1) and scale(0.5) combining: transform applies left-to-right.
                // a better way: scale( var(scaleX)*var(ninja-scale) )
                const flip = dirX < 0 ? -1 : 1;
                ninjaEle.style.transform = `translate3d(var(--ninja-x), var(--ninja-y), 0) scaleX(${flip * curScale}) scaleY(${curScale})`;

                if (t < 1) {
                    requestAnimationFrame(animateJump);
                } else {
                    isJumping = false;
                    currentIslandIdx = nextIdx;
                    ninjaEle.classList.remove('jumping');
                    ninjaEle.classList.add('idle');
                    
                    // Reset transform orientation for idle (he faces last jump dir)
                    ninjaEle.style.transform = `translate3d(var(--ninja-x), var(--ninja-y), 0) scaleX(${flip * curScale}) scaleY(${curScale})`;
                }
            }
            requestAnimationFrame(animateJump);
        }

        requestAnimationFrame(engineTick);
    }
});
