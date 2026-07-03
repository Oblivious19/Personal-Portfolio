<script>
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import gsap from "gsap";

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

        /* ── body ── */
        const torso = new THREE.Mesh(
            track(new THREE.SphereGeometry(1.0, 14, 12)),
            hoodieMat
        );
        torso.scale.set(1, 1.12, 0.92);
        torso.position.y = 0.62;
        charGroup.add(torso);

        // chest core: glowing cyan ring + dot
        const chestRing = new THREE.Mesh(
            track(new THREE.TorusGeometry(0.16, 0.03, 8, 24)),
            cyanBasic(THREE)
        );
        chestRing.position.set(0, 0.78, 0.86);
        charGroup.add(chestRing);
        const chestDot = new THREE.Mesh(
            track(new THREE.CircleGeometry(0.07, 16)),
            magentaMat
        );
        chestDot.position.set(0, 0.78, 0.87);
        charGroup.add(chestDot);

        /* ── head ── */
        const head = new THREE.Mesh(
            track(new THREE.SphereGeometry(0.72, 14, 12)),
            hoodieMat
        );
        head.position.y = 2.0;
        head.scale.set(1, 0.95, 0.95);
        charGroup.add(head);

        // dark glossy visor on the FRONT of the head
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
        visor.position.set(0, 2.0, 0.28);
        visor.scale.set(0.95, 0.78, 0.65);
        charGroup.add(visor);

        // eyes ON the visor (visible, blinking) with lash-lines
        const eyeGeo = track(new THREE.CapsuleGeometry(0.055, 0.1, 4, 8));
        const lashGeo = track(new THREE.CapsuleGeometry(0.014, 0.06, 4, 6));
        for (const x of [-0.19, 0.19]) {
            const eye = new THREE.Mesh(eyeGeo, eyeMat);
            eye.position.set(x, 2.03, 0.74);
            charGroup.add(eye);
            eyes.push(eye);
            // small angled lash at the outer top corner of each eye
            const s = Math.sign(x);
            const lash = new THREE.Mesh(lashGeo, eyeMat);
            lash.position.set(x + s * 0.075, 2.13, 0.73);
            lash.rotation.z = s * -0.95;
            charGroup.add(lash);
        }
        // little smile
        const smile = new THREE.Mesh(
            track(new THREE.TorusGeometry(0.09, 0.018, 6, 12, Math.PI)),
            eyeMat
        );
        smile.position.set(0, 1.86, 0.74);
        smile.rotation.z = Math.PI;
        charGroup.add(smile);

        /* ── antenna ── */
        const antennaRod = new THREE.Mesh(
            track(new THREE.CylinderGeometry(0.025, 0.025, 0.34, 8)),
            deviceMat
        );
        antennaRod.position.set(0, 2.82, 0);
        charGroup.add(antennaRod);
        const antennaTip = new THREE.Mesh(
            track(new THREE.SphereGeometry(0.07, 10, 8)),
            magentaMat
        );
        antennaTip.position.set(0, 3.02, 0);
        charGroup.add(antennaTip);
        gsapPulse(antennaTip);

        /* ── headphones ── */
        const band = new THREE.Mesh(
            track(new THREE.TorusGeometry(0.76, 0.075, 8, 16, Math.PI)),
            deviceMat
        );
        band.position.y = 2.05;
        charGroup.add(band);
        const cupGeo = track(new THREE.CylinderGeometry(0.2, 0.2, 0.14, 12));
        for (const x of [-0.76, 0.76]) {
            const cup = new THREE.Mesh(cupGeo, deviceMat);
            cup.position.set(x, 1.98, 0);
            cup.rotation.z = Math.PI / 2;
            charGroup.add(cup);
            const glowRing = new THREE.Mesh(
                track(new THREE.TorusGeometry(0.2, 0.022, 6, 20)),
                x < 0 ? accentMat : cyanBasic(THREE)
            );
            glowRing.position.set(x * 1.1, 1.98, 0);
            glowRing.rotation.y = Math.PI / 2;
            charGroup.add(glowRing);
        }

        /* ── arms: shoulders → forward to the laptop ── */
        const armGeo = track(new THREE.CapsuleGeometry(0.15, 0.62, 4, 8));
        const handGeo = track(new THREE.SphereGeometry(0.15, 10, 8));
        for (const s of [-1, 1]) {
            const arm = new THREE.Mesh(armGeo, hoodieMat);
            arm.position.set(s * 0.78, 0.72, 0.45);
            arm.rotation.set(-1.15, 0, s * -0.35);
            charGroup.add(arm);
            const hand = new THREE.Mesh(handGeo, hoodieMat);
            hand.position.set(s * 0.52, 0.32, 0.92);
            charGroup.add(hand);
        }

        /* ── stubby legs tucked under ── */
        const legGeo = track(new THREE.CapsuleGeometry(0.19, 0.4, 4, 8));
        for (const s of [-1, 1]) {
            const leg = new THREE.Mesh(legGeo, hoodieMat);
            leg.position.set(s * 0.42, -0.35, 0.42);
            leg.rotation.set(1.35, 0, s * 0.35);
            charGroup.add(leg);
        }

        /* ── laptop: open toward the robot, glowing lid facing camera ── */
        const laptop = new THREE.Group();
        laptop.position.set(0, -0.12, 1.0);
        charGroup.add(laptop);

        const lapBase = new THREE.Mesh(
            track(new THREE.BoxGeometry(1.3, 0.07, 0.75)),
            deviceMat
        );
        laptop.add(lapBase);

        // keyboard keys with random cyan flicker (typing)
        const keyGeo = track(new THREE.BoxGeometry(0.12, 0.035, 0.1));
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 7; c++) {
                const key = new THREE.Mesh(keyGeo, keyDimMat);
                key.position.set(-0.48 + c * 0.16, 0.055, -0.22 + r * 0.15);
                laptop.add(key);
                litKeys.push(key);
            }
        }

        // lid hinged on the camera-side edge, tilted slightly back
        const screen = new THREE.Mesh(
            track(new THREE.BoxGeometry(1.3, 0.82, 0.05)),
            deviceMat
        );
        screen.position.set(0, 0.38, 0.44);
        screen.rotation.x = 0.16;
        laptop.add(screen);

        // glowing </> logo on the lid back (faces camera)
        const logoTex = track(
            new THREE.CanvasTexture(
                makeCanvas(128, 96, (ctx) => {
                    ctx.fillStyle = "#f9a8d4";
                    ctx.font = "bold 40px monospace";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.shadowColor = "#f472b6";
                    ctx.shadowBlur = 14;
                    ctx.fillText("</>", 64, 50);
                })
            )
        );
        const logo = new THREE.Mesh(
            track(new THREE.PlaneGeometry(0.6, 0.42)),
            track(
                new THREE.MeshBasicMaterial({
                    map: logoTex,
                    transparent: true,
                    depthWrite: false,
                })
            )
        );
        logo.position.set(0, 0.385, 0.475);
        logo.rotation.x = 0.16;
        laptop.add(logo);

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

        if (reducedMotion) {
            renderer.render(scene, camera);
            return;
        }

        /* ── blink loop ── */
        const scheduleBlink = () => {
            blinkTimer = setTimeout(() => {
                for (const eye of eyes) {
                    gsap.to(eye.scale, {
                        y: 0.08,
                        duration: 0.07,
                        yoyo: true,
                        repeat: 1,
                        ease: "power2.inOut",
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
            torso.scale.set(breath, 1.12, 0.92 * breath);

            // mouse follow (eased)
            currentRotX += (targetRotX - currentRotX) * 0.06;
            currentRotY += (targetRotY - currentRotY) * 0.06;
            charGroup.rotation.y = currentRotY;
            charGroup.rotation.x = currentRotX;

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

    function handlePointerMove(e) {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        targetRotY = nx * 0.45;
        targetRotX = -ny * 0.18;
        if (pointerNDC) pointerNDC.set(nx, -ny);
    }

    function handlePointerLeave() {
        targetRotX = 0;
        targetRotY = 0;
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
    });

    onDestroy(() => {
        if (!browser) return;
        cancelAnimationFrame(rafId);
        clearTimeout(blinkTimer);
        clearTimeout(keyTimer);
        window.removeEventListener("resize", resize);
        for (const item of disposables) item.dispose?.();
        if (renderer) {
            renderer.dispose();
            renderer.domElement?.parentNode?.removeChild(renderer.domElement);
        }
    });
</script>

<div
    bind:this={container}
    class="w-full h-full"
    on:pointermove={handlePointerMove}
    on:pointerleave={handlePointerLeave}
    role="presentation"
/>
