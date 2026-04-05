This project you are in is a portfolio. The background vibe is aiming to be pandora islands from avatar. I want you to look at fog.css, and the current layout of index.html. It's in a bit of a mess at the moment, so feel free to make changes.

What I want you to accomplish with the background is the following:
1. A 5 layer layout with parallaxing effects with the following layers:
    1. (Furthest forward, but behind the information tiles) a set of 10 sparsly placed islands, large size 200-450 px. Scrolls down at 0.9 speed.
    2. A layer of fog (using fog.css - example at https://codepen.io/Ravyre/pen/gXawyY, which we should include a comment reference to) that extends the full width and height of the page, moves left to right at 1x fog-speed (a new variable to introduce). Scrolls down at 0.8 speed
    3. A set of 10 sparsly placed islands, medium size. Scrolls down at 0.7 speed
    4. A layer of fog that extends the full width and height of the page, moves left to right at 0.5x fog_speed. Scrolls down at 0.6 speed
    5. (Furthest back) a set of 10 sparsly placed islands, all small, between 80-200 px height/width. Scrolls down at 0.5 speed

Layer 1 (depth-4) shows how I want islands to be created, but are not accomplishing the parallax effect, and the islands need to be spread out still. Layer 2 (depth-3) shows the correct usage of fog, but it also does not do parallax scrolling, and does not stretch to the bottom of the screen (we can either tile or strech it, but I want it to be seemless). 