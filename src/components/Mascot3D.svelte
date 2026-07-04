<script>
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import gsap from "gsap";
    import { playPurr } from "$lib/chime.js";

    // "sm" renders a lighter cameo (no particles/panels) for the footer
    export let size = "lg";

    let container;
    let renderer;
    let scene;
    let camera;
    let charGroup;
    let panelsGroup;
    let eyes = [];
    let litKeys = [];
    let particlePoints;
    let raycaster;
    let pointerNDC;
    let hoveredPanel = null;
    let rafId;
    let blinkTimer;
    let keyTimer;
    let reducedMotion = false;
    let disposables = [];

    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let clockStart = 0;

    // interactions
    let headGroup;
    let doEmote = null;
    let spawnHearts = null;
    let dragging = false;
    // long-press: heart shower + purr
    let longPressTimer = null;
    let longPressing = false;
    let heartRainTimer = null;
    let stopPurr = null;
    let dragMoved = 0;
    let lastDragX = 0;
    let spinVel = 0;
    let spinExtra = 0;
    let lastPointerT = 0;
    let idleEmoteTimer;

    // speech bubble
    const speechLines = [
        "hi! i'm shreya's bot ✦",
        "deploying to prod…",
        "powered by caffeine",
        "0 bugs found (today)",
        "ask me about MERN",
        "click me!",
    ];
    let speechIdx = 0;
    let speechVisible = true;
    let speechTimer;
    let hearts = [];

    const VIOLET = 0x8b5cf6;
    const CYAN = 0xf472b6;
    const CYAN_BRIGHT = 0xf9a8d4;

    function track(...items) {
        disposables.push(...items);
        return items[0];
    }

    function cyanBasic(THREE) {
        return track(new THREE.MeshBasicMaterial({ color: CYAN }));
    }

    function gsapPulse(mesh) {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        gsap.to(mesh.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            duration: 0.9,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });
    }

    /* ── canvas texture helpers ── */
    function makeCanvas(w, h, draw) {
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        draw(c.getContext("2d"));
        return c;
    }

    function drawCodePanel(ctx) {
        ctx.fillStyle = "rgba(5, 8, 20, 0.85)";
        ctx.fillRect(0, 0, 256, 170);
        ctx.strokeStyle = "rgba(244, 114, 182, 0.8)";
        ctx.lineWidth = 2;
        ctx.strokeRect(3, 3, 250, 164);
        const colors = ["#8b5cf6", "#f472b6", "#e2e8f0", "#f9a8d4"];
        for (let i = 0; i < 8; i++) {
            ctx.fillStyle = colors[i % colors.length];
            ctx.globalAlpha = 0.85;
            const w = 40 + ((i * 73) % 140);
            ctx.fillRect(16 + (i % 2) * 14, 18 + i * 18, w, 5);
        }
        ctx.globalAlpha = 1;
    }

    function drawGraphPanel(ctx) {
        ctx.fillStyle = "rgba(5, 8, 20, 0.85)";
        ctx.fillRect(0, 0, 256, 170);
        ctx.strokeStyle = "rgba(139, 92, 246, 0.8)";
        ctx.lineWidth = 2;
        ctx.strokeRect(3, 3, 250, 164);
        // grid
        ctx.strokeStyle = "rgba(139, 92, 246, 0.2)";
        ctx.lineWidth = 1;
        for (let x = 30; x < 250; x += 36) {
            ctx.beginPath();
            ctx.moveTo(x, 20);
            ctx.lineTo(x, 150);
            ctx.stroke();
        }
        // line chart
        ctx.strokeStyle = "#f472b6";
        ctx.lineWidth = 3;
        ctx.beginPath();
        const pts = [130, 110, 118, 84, 92, 58, 40];
        pts.forEach((y, i) => {
            const x = 24 + i * 36;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.fillStyle = "#8b5cf6";
        pts.forEach((y, i) => {
            ctx.beginPath();
            ctx.arc(24 + i * 36, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawRingPanel(ctx) {
        ctx.fillStyle = "rgba(5, 8, 20, 0.85)";
        ctx.fillRect(0, 0, 170, 170);
        ctx.strokeStyle = "rgba(244, 114, 182, 0.8)";
        ctx.lineWidth = 2;
        ctx.strokeRect(3, 3, 164, 164);
        ctx.strokeStyle = "rgba(139, 92, 246, 0.35)";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(85, 85, 52, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "#f472b6";
        ctx.beginPath();
        ctx.arc(85, 85, 52, -Math.PI / 2, Math.PI * 1.1);
        ctx.stroke();
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "bold 30px monospace";
        ctx.textAlign = "center";
        ctx.fillText("98%", 85, 96);
    }

    function drawGlyph(ctx) {
        ctx.fillStyle = "#a78bfa";
        ctx.font = "bold 24px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("{ }", 16, 17);
    }

    async function init() {
        const THREE = await import("three");
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const width = rect.width || 1;
        const height = rect.height || 1;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        camera.position.set(0, 1.7, size === "sm" ? 6.8 : 7.8);
        camera.lookAt(0, 1.15, 0);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        renderer.domElement.style.display = "block";
        container.appendChild(renderer.domElement);

        raycaster = new THREE.Raycaster();
        pointerNDC = new THREE.Vector2(-9, -9);

        /* ── materials ── */
        const hoodieMat = track(
            new THREE.MeshStandardMaterial({
                color: 0xe4e7f2,
                flatShading: true,
                roughness: 0.6,
                metalness: 0.05,
            })
        );
        const eyeMat = track(
            new THREE.MeshBasicMaterial({ color: CYAN_BRIGHT })
        );
        const deviceMat = track(
            new THREE.MeshStandardMaterial({
                color: 0x272738,
                flatShading: true,
                roughness: 0.4,
                metalness: 0.5,
            })
        );
        const keyDimMat = track(
            new THREE.MeshStandardMaterial({ color: 0x3d3d55, roughness: 0.6 })
        );
        const keyLitMat = track(
            new THREE.MeshBasicMaterial({ color: CYAN })
        );
        const accentMat = track(
            new THREE.MeshBasicMaterial({ color: VIOLET })
        );
        const magentaMat = track(
            new THREE.MeshBasicMaterial({ color: 0xe879f9 })
        );

        charGroup = new THREE.Group();
        scene.add(charGroup);

        /* ── body: slimmer, tapered ── */
        const torso = new THREE.Mesh(
            track(new THREE.SphereGeometry(1.0, 14, 12)),
            hoodieMat
        );
        torso.scale.set(0.82, 1.25, 0.78);
        torso.position.y = 0.55;
        charGroup.add(torso);

        // small magenta core dot on the chest
        const chestDot = new THREE.Mesh(
            track(new THREE.CircleGeometry(0.05, 16)),
            magentaMat
        );
        chestDot.position.set(0, 0.95, 0.72);
        charGroup.add(chestDot);

        /* ── head group (tilts independently, follows cursor) ── */
        headGroup = new THREE.Group();
        headGroup.position.set(0, 2.0, 0);
        headGroup.scale.setScalar(0.92);
        charGroup.add(headGroup);

        const head = new THREE.Mesh(
            track(new THREE.SphereGeometry(0.72, 14, 12)),
            hoodieMat
        );
        head.scale.set(1, 0.95, 0.95);
        headGroup.add(head);

        // dark glossy visor clearly protruding from the head front
        const visor = new THREE.Mesh(
            track(new THREE.SphereGeometry(0.58, 14, 12)),
            track(
                new THREE.MeshStandardMaterial({
                    color: 0x0a0a1c,
                    roughness: 0.15,
                    metalness: 0.6,
                })
            )
        );
        visor.position.set(0, 0.02, 0.3);
        visor.scale.set(0.88, 0.72, 0.78);
        headGroup.add(visor);

        // eyes ON the visor (blinking, cursor-tracking) with lash-lines
        const eyeGeo = track(new THREE.CapsuleGeometry(0.055, 0.1, 4, 8));
        const lashGeo = track(new THREE.CapsuleGeometry(0.014, 0.06, 4, 6));
        for (const x of [-0.19, 0.19]) {
            const eye = new THREE.Mesh(eyeGeo, eyeMat);
            eye.position.set(x, 0.05, 0.79);
            eye.userData.baseX = x;
            eye.userData.baseY = 0.05;
            headGroup.add(eye);
            eyes.push(eye);
            const s = Math.sign(x);
            const lash = new THREE.Mesh(lashGeo, eyeMat);
            lash.position.set(x + s * 0.075, 0.15, 0.78);
            lash.rotation.z = s * -0.95;
            headGroup.add(lash);
        }
        // little smile
        const smile = new THREE.Mesh(
            track(new THREE.TorusGeometry(0.09, 0.018, 6, 12, Math.PI)),
            eyeMat
        );
        smile.position.set(0, -0.12, 0.79);
        smile.rotation.z = Math.PI;
        headGroup.add(smile);

        /* ── antenna ── */
        const antennaRod = new THREE.Mesh(
            track(new THREE.CylinderGeometry(0.025, 0.025, 0.34, 8)),
            deviceMat
        );
        antennaRod.position.set(0, 0.82, 0);
        headGroup.add(antennaRod);
        const antennaTip = new THREE.Mesh(
            track(new THREE.SphereGeometry(0.07, 10, 8)),
            magentaMat
        );
        antennaTip.position.set(0, 1.02, 0);
        headGroup.add(antennaTip);
        gsapPulse(antennaTip);

        /* ── headphones ── */
        const band = new THREE.Mesh(
            track(new THREE.TorusGeometry(0.76, 0.075, 8, 16, Math.PI)),
            deviceMat
        );
        band.position.y = 0.05;
        headGroup.add(band);
        const cupGeo = track(new THREE.CylinderGeometry(0.2, 0.2, 0.14, 12));
        for (const x of [-0.76, 0.76]) {
            const cup = new THREE.Mesh(cupGeo, deviceMat);
            cup.position.set(x, -0.02, 0);
            cup.rotation.z = Math.PI / 2;
            headGroup.add(cup);
            const glowRing = new THREE.Mesh(
                track(new THREE.TorusGeometry(0.2, 0.022, 6, 20)),
                x < 0 ? accentMat : cyanBasic(THREE)
            );
            glowRing.position.set(x * 1.1, -0.02, 0);
            glowRing.rotation.y = Math.PI / 2;
            headGroup.add(glowRing);
        }

        /* ── arms: shoulders → down to the laptop, hands resting on its edge ── */
        const armGeo = track(new THREE.CapsuleGeometry(0.13, 0.72, 4, 8));
        const handGeo = track(new THREE.SphereGeometry(0.13, 10, 8));
        for (const s of [-1, 1]) {
            const arm = new THREE.Mesh(armGeo, hoodieMat);
            arm.position.set(s * 0.58, 0.35, 0.62);
            arm.rotation.set(-1.05, 0, s * -0.28);
            charGroup.add(arm);
            const hand = new THREE.Mesh(handGeo, hoodieMat);
            hand.position.set(s * 0.4, -0.12, 0.95);
            charGroup.add(hand);
        }

        /* ── stubby legs tucked under ── */
        const legGeo = track(new THREE.CapsuleGeometry(0.18, 0.38, 4, 8));
        for (const s of [-1, 1]) {
            const leg = new THREE.Mesh(legGeo, hoodieMat);
            leg.position.set(s * 0.36, -0.42, 0.4);
            leg.rotation.set(1.35, 0, s * 0.35);
            charGroup.add(leg);
        }

        /* ── laptop: small, low, keyboard visible ── */
        const laptop = new THREE.Group();
        laptop.position.set(0, -0.24, 1.08);
        charGroup.add(laptop);

        const lapBase = new THREE.Mesh(
            track(new THREE.BoxGeometry(1.1, 0.06, 0.62)),
            deviceMat
        );
        laptop.add(lapBase);

        // keyboard keys with random flicker (typing)
        const keyGeo = track(new THREE.BoxGeometry(0.11, 0.035, 0.09));
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 6; c++) {
                const key = new THREE.Mesh(keyGeo, keyDimMat);
                key.position.set(-0.375 + c * 0.15, 0.05, -0.17 + r * 0.13);
                laptop.add(key);
                litKeys.push(key);
            }
        }

        // low lid tilted back so the keyboard reads from the camera
        const screen = new THREE.Mesh(
            track(new THREE.BoxGeometry(1.1, 0.5, 0.04)),
            deviceMat
        );
        screen.position.set(0, 0.2, 0.36);
        screen.rotation.x = 0.45;
        laptop.add(screen);

        // glowing "oblivious" wordmark on the lid back (faces camera)
        const logoTex = track(
            new THREE.CanvasTexture(
                makeCanvas(256, 64, (ctx) => {
                    ctx.fillStyle = "#f9a8d4";
                    ctx.font = "bold 36px monospace";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.shadowColor = "#f472b6";
                    ctx.shadowBlur = 12;
                    ctx.fillText("oblivious", 128, 34);
                })
            )
        );
        const logo = new THREE.Mesh(
            track(new THREE.PlaneGeometry(0.88, 0.22)),
            track(
                new THREE.MeshBasicMaterial({
                    map: logoTex,
                    transparent: true,
                    depthWrite: false,
                })
            )
        );
        // parent to the lid so it always sits just in front of its surface
        logo.position.set(0, 0, 0.045);
        screen.add(logo);

        // screen light spilling onto the robot's visor/chest
        const screenLight = new THREE.PointLight(CYAN, 1.0, 4, 0);
        screenLight.position.set(0, 0.7, 0.7);
        charGroup.add(screenLight);

        /* ── ground glow disc ── */
        const ground = new THREE.Mesh(
            track(new THREE.CircleGeometry(2.1, 32)),
            track(
                new THREE.MeshBasicMaterial({
                    color: VIOLET,
                    transparent: true,
                    opacity: 0.18,
                })
            )
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.62;
        charGroup.add(ground);
        const groundRing = new THREE.Mesh(
            track(new THREE.RingGeometry(1.9, 2.0, 48)),
            track(
                new THREE.MeshBasicMaterial({
                    color: CYAN,
                    transparent: true,
                    opacity: 0.5,
                    side: THREE.DoubleSide,
                })
            )
        );
        groundRing.rotation.x = -Math.PI / 2;
        groundRing.position.y = -0.61;
        charGroup.add(groundRing);

        /* ── holographic panels ── */
        panelsGroup = new THREE.Group();
        if (size !== "sm") {
            scene.add(panelsGroup);
            const panelDefs = [
                { draw: drawCodePanel, w: 256, h: 170, pw: 1.6, ph: 1.05, pos: [-2.3, 2.3, 0.3], rotY: 0.55 },
                { draw: drawGraphPanel, w: 256, h: 170, pw: 1.5, ph: 1.0, pos: [2.35, 2.7, 0.1], rotY: -0.55 },
                { draw: drawRingPanel, w: 170, h: 170, pw: 0.95, ph: 0.95, pos: [2.15, 1.0, 0.9], rotY: -0.7 },
            ];
            for (const def of panelDefs) {
                const tex = track(
                    new THREE.CanvasTexture(makeCanvas(def.w, def.h, def.draw))
                );
                const mat = track(
                    new THREE.MeshBasicMaterial({
                        map: tex,
                        transparent: true,
                        opacity: 0.55,
                        side: THREE.DoubleSide,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false,
                    })
                );
                const panel = new THREE.Mesh(
                    track(new THREE.PlaneGeometry(def.pw, def.ph)),
                    mat
                );
                panel.position.set(...def.pos);
                panel.rotation.y = def.rotY;
                panel.userData.baseY = def.pos[1];
                panelsGroup.add(panel);
            }
        }

        /* ── floating code glyph particles ── */
        if (size !== "sm") {
            const glyphTex = track(
                new THREE.CanvasTexture(makeCanvas(32, 32, drawGlyph))
            );
            const COUNT = 45;
            const positions = new Float32Array(COUNT * 3);
            for (let i = 0; i < COUNT; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 7;
                positions[i * 3 + 1] = Math.random() * 6 - 0.5;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 3 - 0.5;
            }
            const pGeo = track(new THREE.BufferGeometry());
            pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
            const pMat = track(
                new THREE.PointsMaterial({
                    map: glyphTex,
                    size: 0.22,
                    transparent: true,
                    opacity: 0.5,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                })
            );
            particlePoints = new THREE.Points(pGeo, pMat);
            scene.add(particlePoints);
        }

        /* ── lights: violet left, cyan right ── */
        scene.add(new THREE.AmbientLight(0xffffff, 0.75));
        const dir = new THREE.DirectionalLight(0xffffff, 1.0);
        dir.position.set(0, 4, 5);
        scene.add(dir);
        const violetLight = new THREE.PointLight(VIOLET, 1.6, 15, 0);
        violetLight.position.set(-4, 2.5, 2);
        scene.add(violetLight);
        const cyanLight = new THREE.PointLight(CYAN, 1.3, 15, 0);
        cyanLight.position.set(4, 2, 2);
        scene.add(cyanLight);

        reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        /* ── click emote: bounce + antenna flash + heart burst ── */
        const heartTex = track(
            new THREE.CanvasTexture(
                makeCanvas(64, 64, (ctx) => {
                    ctx.fillStyle = "#f472b6";
                    ctx.font = "48px serif";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText("♥", 32, 36);
                })
            )
        );
        spawnHearts = (count, spread = 1.2) => {
            for (let i = 0; i < count; i++) {
                const mat = new THREE.SpriteMaterial({
                    map: heartTex,
                    transparent: true,
                    opacity: 0.9,
                    depthWrite: false,
                });
                const sprite = new THREE.Sprite(mat);
                sprite.position.set(
                    (Math.random() - 0.5) * spread,
                    1.5 + Math.random() * 0.9,
                    0.85
                );
                const sc = 0.16 + Math.random() * 0.16;
                sprite.scale.set(sc, sc, sc);
                scene.add(sprite);
                hearts.push({
                    sprite,
                    vx: (Math.random() - 0.5) * 0.018,
                    vy: 0.018 + Math.random() * 0.02,
                    life: 1,
                });
            }
        };
        doEmote = () => {
            if (reducedMotion) return;
            gsap.timeline()
                .to(charGroup.scale, {
                    x: 1.08,
                    y: 0.86,
                    z: 1.08,
                    duration: 0.12,
                    ease: "power2.in",
                })
                .to(charGroup.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 0.7,
                    ease: "elastic.out(1, 0.35)",
                });
            gsap.killTweensOf(antennaTip.scale);
            gsap.timeline({ onComplete: () => gsapPulse(antennaTip) })
                .to(antennaTip.scale, { x: 2.4, y: 2.4, z: 2.4, duration: 0.12 })
                .to(antennaTip.scale, { x: 1, y: 1, z: 1, duration: 0.4 });
            spawnHearts(10);
        };

        // occasional idle emote when nobody has interacted for a while
        const scheduleIdleEmote = () => {
            idleEmoteTimer = setTimeout(() => {
                if (performance.now() - lastPointerT > 4000) doEmote();
                scheduleIdleEmote();
            }, 12000 + Math.random() * 8000);
        };

        if (reducedMotion) {
            renderer.render(scene, camera);
            return;
        }

        scheduleIdleEmote();

        /* ── blink loop ── */
        const scheduleBlink = () => {
            blinkTimer = setTimeout(() => {
                for (const eye of eyes) {
                    // explicit close→open so an interrupted blink can never
                    // leave the eyes stuck shut
                    gsap.killTweensOf(eye.scale);
                    gsap.timeline()
                        .to(eye.scale, {
                            y: 0.08,
                            duration: 0.07,
                            ease: "power2.in",
                        })
                        .to(eye.scale, {
                            y: 1,
                            duration: 0.09,
                            ease: "power2.out",
                        });
                }
                scheduleBlink();
            }, 2800 + Math.random() * 3200);
        };
        scheduleBlink();

        /* ── typing key flicker ── */
        const flickKeys = () => {
            keyTimer = setTimeout(() => {
                for (const key of litKeys) key.material = keyDimMat;
                const n = 2 + Math.floor(Math.random() * 3);
                for (let i = 0; i < n; i++) {
                    litKeys[Math.floor(Math.random() * litKeys.length)].material =
                        keyLitMat;
                }
                flickKeys();
            }, 140 + Math.random() * 180);
        };
        flickKeys();

        /* ── main loop ── */
        clockStart = performance.now();
        const animate = () => {
            const t = (performance.now() - clockStart) / 1000;

            // idle float + breathing
            charGroup.position.y = Math.sin(t * 1.1) * 0.12;
            const breath = 1 + Math.sin(t * 1.7) * 0.012;
            torso.scale.set(0.82 * breath, 1.25, 0.78 * breath);

            // mouse follow (eased) + drag-spin inertia
            currentRotX += (targetRotX - currentRotX) * 0.06;
            currentRotY += (targetRotY - currentRotY) * 0.06;
            spinExtra += spinVel;
            spinVel *= 0.92;
            if (!dragging) spinExtra *= 0.95;
            charGroup.rotation.y = currentRotY + spinExtra;
            charGroup.rotation.x = currentRotX;

            // head tilt + eyes track the cursor; wander when idle
            const idle = performance.now() - lastPointerT > 3000;
            let ex = targetRotY / 0.45;
            let ey = -targetRotX / 0.18;
            if (idle) {
                ex = Math.sin(t * 0.5) * 0.7;
                ey = Math.sin(t * 0.33 + 1) * 0.35;
            }
            if (headGroup) {
                headGroup.rotation.y += (ex * 0.35 - headGroup.rotation.y) * 0.08;
                headGroup.rotation.x += (ey * 0.12 - headGroup.rotation.x) * 0.08;
            }
            for (const eye of eyes) {
                eye.position.x +=
                    (eye.userData.baseX + ex * 0.05 - eye.position.x) * 0.15;
                eye.position.y +=
                    (eye.userData.baseY + ey * 0.04 - eye.position.y) * 0.15;
            }

            // heart burst particles
            for (let i = hearts.length - 1; i >= 0; i--) {
                const h = hearts[i];
                h.sprite.position.x += h.vx;
                h.sprite.position.y += h.vy;
                h.life -= 0.012;
                h.sprite.material.opacity = Math.max(h.life, 0) * 0.9;
                if (h.life <= 0) {
                    scene.remove(h.sprite);
                    h.sprite.material.dispose();
                    hearts.splice(i, 1);
                }
            }

            // panels bob + slight parallax counter-rotation
            if (panelsGroup) {
                panelsGroup.rotation.y = -currentRotY * 0.35;
                panelsGroup.children.forEach((p, i) => {
                    p.position.y =
                        p.userData.baseY + Math.sin(t * 1.4 + i * 2.1) * 0.09;
                });
            }

            // particles drift upward
            if (particlePoints) {
                const pos = particlePoints.geometry.attributes.position;
                for (let i = 0; i < pos.count; i++) {
                    let y = pos.getY(i) + 0.006;
                    if (y > 5.5) y = -0.6;
                    pos.setY(i, y);
                }
                pos.needsUpdate = true;
            }

            // holo panel hover via raycast
            if (panelsGroup && raycaster) {
                raycaster.setFromCamera(pointerNDC, camera);
                const hits = raycaster.intersectObjects(panelsGroup.children);
                const hit = hits[0]?.object || null;
                if (hit !== hoveredPanel) {
                    if (hoveredPanel) {
                        gsap.to(hoveredPanel.scale, { x: 1, y: 1, duration: 0.35 });
                        gsap.to(hoveredPanel.material, { opacity: 0.55, duration: 0.35 });
                    }
                    if (hit) {
                        gsap.to(hit.scale, { x: 1.18, y: 1.18, duration: 0.35 });
                        gsap.to(hit.material, { opacity: 0.95, duration: 0.35 });
                    }
                    hoveredPanel = hit;
                    if (container)
                        container.style.cursor = hit ? "pointer" : "default";
                }
            }

            renderer.render(scene, camera);
            rafId = requestAnimationFrame(animate);
        };
        animate();
    }

    // long-press: continuous heart shower + robot purr while held
    function startLove() {
        if (longPressing || reducedMotion) return;
        longPressing = true;
        stopPurr = playPurr();
        spawnHearts?.(6, 1.6);
        heartRainTimer = setInterval(() => spawnHearts?.(5, 1.6), 160);
        // gentle happy squeeze while being held
        if (charGroup) {
            gsap.to(charGroup.scale, {
                x: 1.05,
                y: 0.94,
                z: 1.05,
                duration: 0.25,
                ease: "power2.out",
            });
        }
    }

    function endLove() {
        if (!longPressing) return;
        longPressing = false;
        clearInterval(heartRainTimer);
        heartRainTimer = null;
        stopPurr?.();
        stopPurr = null;
        if (charGroup) {
            gsap.to(charGroup.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.6,
                ease: "elastic.out(1, 0.4)",
            });
        }
    }

    function cancelLongPress() {
        clearTimeout(longPressTimer);
        longPressTimer = null;
    }

    function handlePointerDown(e) {
        if (reducedMotion) return;
        dragging = true;
        dragMoved = 0;
        lastDragX = e.clientX;
        lastPointerT = performance.now();
        container?.setPointerCapture?.(e.pointerId);
        cancelLongPress();
        longPressTimer = setTimeout(() => {
            if (dragging && dragMoved < 6) startLove();
        }, 420);
    }

    function handlePointerMove(e) {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        targetRotY = nx * 0.45;
        targetRotX = -ny * 0.18;
        if (pointerNDC) pointerNDC.set(nx, -ny);
        lastPointerT = performance.now();

        if (dragging) {
            const dx = e.clientX - lastDragX;
            lastDragX = e.clientX;
            dragMoved += Math.abs(dx);
            spinVel += dx * 0.0016;
            if (dragMoved > 6) {
                container.style.cursor = "grabbing";
                cancelLongPress();
                endLove();
            }
        }
    }

    function handlePointerUp() {
        if (!dragging) return;
        dragging = false;
        cancelLongPress();
        if (container) container.style.cursor = "default";
        if (longPressing) {
            // long-press already showered hearts — just wind it down
            endLove();
        } else if (dragMoved < 6) {
            // small movement = a tap/click → she reacts
            doEmote?.();
        }
    }

    function handlePointerLeave() {
        targetRotX = 0;
        targetRotY = 0;
        dragging = false;
        cancelLongPress();
        endLove();
        if (container) container.style.cursor = "default";
        if (pointerNDC) pointerNDC.set(-9, -9);
    }

    function resize() {
        if (!container || !renderer || !camera) return;
        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        renderer.setSize(rect.width, rect.height);
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
        if (reducedMotion) renderer.render(scene, camera);
    }

    onMount(() => {
        if (!browser) return;
        init();
        window.addEventListener("resize", resize);

        // speech bubble cycle (hero only)
        if (size !== "sm") {
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (!reduced) {
                speechTimer = setInterval(() => {
                    speechVisible = false;
                    setTimeout(() => {
                        speechIdx = (speechIdx + 1) % speechLines.length;
                        speechVisible = true;
                    }, 350);
                }, 4500);
            }
        }
    });

    onDestroy(() => {
        if (!browser) return;
        cancelAnimationFrame(rafId);
        clearTimeout(blinkTimer);
        clearTimeout(keyTimer);
        clearTimeout(idleEmoteTimer);
        clearTimeout(longPressTimer);
        clearInterval(heartRainTimer);
        stopPurr?.();
        clearInterval(speechTimer);
        window.removeEventListener("resize", resize);
        for (const h of hearts) {
            scene?.remove(h.sprite);
            h.sprite.material.dispose();
        }
        hearts = [];
        for (const item of disposables) item.dispose?.();
        if (renderer) {
            renderer.dispose();
            renderer.domElement?.parentNode?.removeChild(renderer.domElement);
        }
    });
</script>

<div class="relative w-full h-full">
    <div
        bind:this={container}
        class="w-full h-full select-none"
        style="touch-action: pan-y; -webkit-touch-callout: none;"
        on:pointerdown={handlePointerDown}
        on:pointermove={handlePointerMove}
        on:pointerup={handlePointerUp}
        on:pointercancel={handlePointerLeave}
        on:pointerleave={handlePointerLeave}
        on:contextmenu|preventDefault
        role="presentation"
    />

    {#if size !== "sm"}
        <!-- holo speech bubble -->
        <div
            class={"absolute top-[7%] left-[58%] sm:left-[60%] pointer-events-none duration-300 " +
                (speechVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1")}
            aria-hidden="true"
        >
            <div
                class="relative px-3 py-1.5 rounded-lg rounded-bl-none border border-neon-cyan/50 bg-noir-900/80 backdrop-blur-sm text-[10px] sm:text-xs text-neon-cyan-bright whitespace-nowrap neon-glow-cyan"
            >
                {speechLines[speechIdx]}
                <span
                    class="absolute -bottom-[5px] left-0 w-2.5 h-2.5 bg-noir-900/80 border-b border-l border-neon-cyan/50"
                    style="clip-path: polygon(0 0, 100% 0, 0 100%);"
                />
            </div>
        </div>
    {/if}
</div>
