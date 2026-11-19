window.MGE_CASE_GROUPS = [
  {
    "id": "graphics",
    "title": "Graphics, Materials & Mobile GPU",
    "intro": "Follow the shader interface, geometry and colour pipeline through to measured bandwidth, frame time and resource lifetime on the Galaxy S21. The records include candidates that were withdrawn.",
    "cases": [
      {
        "id": "g-capture-baseline",
        "title": "Render the same frame twice before changing the renderer",
        "area": "Regression infrastructure",
        "situation": "A change to materials could move hit regions while still producing a plausible screenshot.",
        "task": "Establish separate baselines for pixels and input geometry.",
        "action": "Pin song, shader and UI clocks in a hidden Windows Test Game. Save hashes and anchors from the captured frame, including lanes, sweep endpoints and disk transforms. Require a fresh capture log.",
        "result": "All 16 R0 baseline frames at 1280 × 720 and 2400 × 1080 repeated byte for byte. Inverting outer-ring anchors recovered the original lanes in 8- and 12-lane charts. R12 rechecked 16 legacy and 36 new-look frames.",
        "reflection": "HUD glyph edges moved by up to 3/255 after a font atlas change. Localize that difference before changing tolerances for an entire frame."
      },
      {
        "id": "g-binding",
        "title": "Replace only the Hard difficulty’s hold body",
        "area": "Material binding",
        "situation": "One song needs a distinct striped long note on Hard without changing the other difficulties.",
        "task": "Resolve targets by part, state and region and show the origin of the selected binding.",
        "action": "Resolve stable keys such as note.hold.body in difficulty, song and project order. Prefer specific state and region keys within each layer. Return explicit, inherited or default provenance.",
        "result": "MaterialBindingTest covers precedence, malformed records, migration and round trips. R1’s 16 legacy frames match R0 byte for byte. The demo binds both ordinary and active bodies on Hard.",
        "reflection": "The editor can tell authors where to write the override and which difficulties will inherit it."
      },
      {
        "id": "g-program-layout",
        "title": "Prepare surface draws once and record them in more than one pass",
        "area": "Rendering architecture",
        "situation": "The emerging surface renderer had to supply both forward shading and future shadow draws.",
        "task": "Share a prepared draw list and avoid cross-frame resource reuse.",
        "action": "Separate descriptor sets by pass, material and object. Carry tangent handedness, region and path coordinates in an 80-byte vertex. Group opaque draws by program and material, and depth-sort translucent draws before recording.",
        "result": "SPIR-V reflection checked host offsets. GPU tests cover 600 draws, pool exhaustion, invalid pipeline caches and reuse across frame slots. Default sphere shading was within 1/255 per channel of the old path. All 16 legacy frames matched.",
        "reflection": "GPU waits can hide lifetime problems. Check the actual resources assigned to each frame slot."
      },
      {
        "id": "g-compiled-program",
        "title": "Turn author functions into an Android-ready material program",
        "area": "Shader toolchain",
        "situation": "Authors can supply GLSL for local geometry and surface appearance. The runtime needs a stable interface and precompiled artifacts.",
        "task": "Validate local authoring without replacing the last usable program after a bad edit.",
        "action": "Check source tokens, compile in isolation, then validate and reflect the final SPIR-V. Generate render and shadow wrappers. Hash inputs and toolchain versions. Publish the validated artifacts atomically and package only referenced outputs.",
        "result": "535 material program checks and 178 source checks passed. The dual-ABI APK includes three showcase programs. On S21, five Drop 3D runs measured 5.81–6.16 ms GPU p95 at 130 MHz with zero missed vsyncs.",
        "reflection": "Author diagnostics, compiled artifacts and the phone loader form one delivery contract. Transient tool failures need a retry path."
      },
      {
        "id": "g-material-inspection",
        "title": "Check a material on a bent hold, in its actual scene",
        "area": "Authoring and compatibility",
        "situation": "A material sphere can hide texture discontinuities and gameplay geometry changes.",
        "task": "Preview the material on the live object and verify that old songs can roll back.",
        "action": "Use the actual surface pipeline for Sphere and Tile, the selected preview draw for Object view, and the player camera for Scene view. Plan an upgrade before applying it and record it in undo history. Animate stripes with path distance and song time.",
        "result": "The 36 R11 new-look frames moved their tested hit anchors by 0 pixels relative to legacy twins. The GPU inspection fixture measured 0/255 output difference. Rollback restored original chart and song configuration bytes.",
        "reflection": "A sphere lacks the scene’s extra lights, shadows and bloom. Anchor tests verify geometry rather than touch latency."
      },
      {
        "id": "g-arc-geometry",
        "title": "Close the exposed end of a clipped sky arc",
        "area": "Procedural geometry",
        "situation": "As an arc crossed the judgment gate, visible clipping could expose an empty tube end.",
        "task": "Keep the surface closed, the texture attached to the original path and the hit positions stable.",
        "action": "Use rotation-minimising frames, capped six-sided tubes and explicit seam vertices. Sample by path length. Clip the visible portion but retain the original shading frame and sort translucent segments by their midpoints.",
        "result": "Three R3 new-look fixtures retained old hit anchors, and all 16 legacy frames matched. Three S21 runs at the 9-second fixture measured 5.96, 6.19 and 6.33 ms at 130 MHz.",
        "reflection": "A cap fixes visible geometry. Separate anchor checks catch input errors that visual inspection cannot detect."
      },
      {
        "id": "g-ribbons",
        "title": "Keep hold patterns continuous across bends and rotating disks",
        "area": "Path coordinates and transforms",
        "situation": "Adding spatial materials to Drop 2D and Circle can expose UV seams or shift geometry during a hold.",
        "task": "Preserve chart geometry, visibility and the feel of the old hit regions.",
        "action": "Build a distance-mapped ribbon in Drop 2D. Generate sectors, rings and a single hold ribbon in disk coordinates for Circle. Carry gameplay fade via object alpha and move all geometry with the same disk transform.",
        "result": "All 12 R5 new-look samples retained their legacy anchor values and 16 legacy frames matched R4. On S21, all-bound stress fixtures measured 8.33–8.37 ms for Drop 2D and 6.70–7.67 ms for Circle. Plain Circle was 4.00–4.69 ms.",
        "reflection": "Material color, visibility and input position are distinct inputs. Plain and fully bound charts need separate budgets."
      },
      {
        "id": "g-cartoon",
        "title": "Give Scan Line its own 2D material path",
        "area": "2D compositing",
        "situation": "A fixed-camera rhythm page orders translucent shapes differently from the spatial modes.",
        "task": "Keep the original layer ordering, hit-ring result and judgment positions while exposing author materials.",
        "action": "Use 2D vertices, painter order and premultiplied alpha, with depth tests and culling disabled. Retain straight alpha for the legacy hit ring and align capture time after each hit.",
        "result": "Hit-ring comparisons at both sizes differed by zero pixels. All eight anchor fixtures matched. S21 legacy p95 was 7.22–8.05 ms and new-look p95 was 7.32–8.47 ms at about 119.9 FPS.",
        "reflection": "The November tile compositor reused this 2D contract. The October timings belong to the earlier implementation."
      },
      {
        "id": "g-hdr-display",
        "title": "Keep exposure out of the scan-line overlay and HUD",
        "area": "HDR display",
        "situation": "A change to scene exposure also altered Scan Line decoration and affected UI readability.",
        "task": "Give spatial modes per-song exposure while preserving the screen-space look and alpha.",
        "action": "Render the spatial scene to RGBA16F, apply exposure and a fitted tone curve, then write the sRGB display image before drawing the HUD. Bypass spatial lighting and exposure for Scan Line. Read back known radiance at EV 0, +1 and −1.",
        "result": "24 GPU checks covered brightness, alpha, HUD isolation and resize. Exposure affected the scene while HUD text stayed stable. Pausing and resuming on S21 recovered the 2400 × 1080 Studio reference.",
        "reflection": "The pipeline uses a fitted ACES-style curve and fixed per-song exposure. Full ACES colour management and automatic exposure were outside this implementation."
      },
      {
        "id": "g-environment",
        "title": "Test the direction and roughness of image-based reflections",
        "area": "Image-based lighting",
        "situation": "A plausible metal reflection can still use the wrong cubemap face, orientation or mip level.",
        "task": "Verify the bake, packaged asset and final GPU sample independently.",
        "action": "Bake diffuse spherical harmonics, a prefiltered specular cube and a split-sum lookup table from Radiance HDR. Check a constant environment, then directional environments, texture seams, rotation, normal maps and asset fallbacks.",
        "result": "The environment test passed 2,625 checks. The CLI bake checked 524,286 cube texels and the zeroth-order irradiance coefficient. Twenty GPU checks covered lighting, texture orientation and fallback.",
        "reflection": "Static image-based lighting represents the baked environment. Dynamic light bounces were evaluated separately."
      },
      {
        "id": "g-texture-mips",
        "title": "Filter colour, alpha and normals according to their meaning",
        "area": "Texture filtering",
        "situation": "Averaging encoded colour or treating normals as colour corrupts lower-resolution texture levels.",
        "task": "Build a complete mip chain with correct semantics and demonstrate that the GPU samples its last level.",
        "action": "Decode sRGB to linear light and weight colour by alpha. Decode normal vectors, average them and renormalize. Handle non-power-of-two dimensions all the way to the last mip. Keep the separate 2D Scan Line path.",
        "result": "12 texture checks covered colour, alpha edges, vector direction, dimensions and limits. GPU tests sampled the final mip and still checked downstream normal and reflection shading.",
        "reflection": "The same byte format can encode colour, vector direction or coverage. The importer needs that semantic information."
      },
      {
        "id": "g-ggx",
        "title": "Recover a sharp highlight suppressed by a denominator guard",
        "area": "Microfacet shading",
        "situation": "A protective epsilon flattened the distribution peak on very smooth materials.",
        "task": "Keep the GGX lobe physically meaningful near its peak and keep writes finite.",
        "action": "Rearrange the denominator to reduce cancellation near one. Clamp dot products, handle zero-length vectors explicitly, and protect the RGBA16F write. Share the lighting code between built-in and generated programs.",
        "result": "Double-precision comparisons covered four roughnesses and three half-vector angles. The numeric fix took the fixed Drop 3D scene from 4.203 to 4.315 ms at 130 MHz.",
        "reflection": "Clamping a final half-float value and flattening the interior of a model change different things. Test near the extremes."
      },
      {
        "id": "g-coat-aa",
        "title": "Ship clear coat and measure whether specular antialiasing earns its cost",
        "area": "Material modelling and performance",
        "situation": "A clear-coat lobe improves material range, while highlights on moving objects can still flicker.",
        "task": "Keep the old material ABI intact and measure the optional filtering cost on phone.",
        "action": "Append coat strength and roughness to the uniform buffer. Add approximate direct and environment coat lobes. Prototype specular filtering using derivatives of the final normal and compare matched motion sequences.",
        "result": "The coated Studio fixture rose from 5.398 to 5.512 ms at 130 MHz. Filtering reduced temporal deviation, but its Drop 3D run was 5.461 ms against same-clock baselines of 4.203 and 4.297 ms. The filter stayed experimental.",
        "reflection": "Same clocks still leave device-state drift. Keep adjacent controls and the visual benefit alongside the performance cost."
      },
      {
        "id": "g-stage-lights",
        "title": "Show which authored lights will survive a phone quality tier",
        "area": "Stage lighting and quality tiers",
        "situation": "Extra stage lights improved scene control but raised fragment cost on the S21.",
        "task": "Provide predictable light selection with numerical checks and labelled device limits.",
        "action": "Store light ranges, cone angles, colour space and influence groups. Use inverse-square falloff with a smooth distance window and spot cone falloff. Preserve author order, report excluded lights, and allow 16 desktop lights, 8 at mobile High, and the key light at Standard.",
        "result": "80 lighting checks include analytical and GPU comparisons. Enabling four and eight lights unconditionally raised the measured workload proxy by about 40% and 84%. The final Standard fixtures ran at 5.74–5.78 ms at 130 MHz. High with eight lights was 9.46 ms at 250 MHz.",
        "reflection": "Visualize which lights a tier drops. Workload estimates using activity and frequency apply to the scenes tested."
      },
      {
        "id": "g-shadow-map",
        "title": "Keep a moving-camera shadow aligned to a deformed note",
        "area": "Directional shadow mapping",
        "situation": "Camera motion could shimmer the map, and a deformed caster could disagree with its visible mesh.",
        "task": "Match both draws while budgetting map resolution and sampling across devices.",
        "action": "Record shadow draws from the prepared list and use the material’s shadow vertex variant. Quantize shadow bounds and snap the center to texels. Use depth and normal bias. Desktop uses a 2048² map with four compares, mobile High a 1024² map with one, and Standard planar shadows.",
        "result": "35 checks cover camera motion, low sun, alpha masks and vertex deformation. Selected lit and shadowed pixels matched a CPU ray reference at 0/255. A stale scroll clock caused a 220/255 difference. S21 High shadow cost measured 0.37–0.74 ms.",
        "reflection": "The map modulates the key light’s direct term. Caster alpha and receiver extent affect what can be shown."
      },
      {
        "id": "g-disney",
        "title": "Verify the Disney reflection implementation against CPU calculations",
        "area": "Bidirectional reflectance distribution function",
        "situation": "The renderer needed an optional richer BRDF with a way to distinguish formula errors from IBL approximations.",
        "task": "Implement the published lobes and verify direct shading, environment lookup and energy behaviour independently.",
        "action": "Use Burley diffuse, anisotropic GTR2 specular, sheen and GTR1 clear coat. Approximate environment lobes separately with a 32 × 16 table. Scan a parameter grid against a double-precision reference and correct a bent-normal axis error.",
        "result": "Absolute error was below 4 × 10⁻⁶ across 1,296 samples. Four point-lit materials differed by at most 1/255 per channel. The table was within 1.5% of a higher-sampling reference. The white furnace recorded dielectric response up to 1.50.",
        "reflection": "The project implemented and checked the published model. Its formula accuracy, environment approximation and energy behaviour are separate claims."
      },
      {
        "id": "g-bloom",
        "title": "Keep bloom energy stable as the viewport changes",
        "area": "Bloom and post-processing",
        "situation": "Bloom that simply sums scaled levels changes brightness with the size of the window or pyramid.",
        "task": "Normalize the filter and account for the loss of tile compatibility on mobile.",
        "action": "Soft-knee threshold in exposed linear light, use a 13-tap downsample and 3 × 3 tent upsample, normalize layer weights, and composite before tone mapping. Build the pyramid at the active viewport size.",
        "result": "Reintroduced energy was 0.973–0.979 of the extracted light, with the remainder leaving through the edges. 74 HDR checks covered scale, exposure and HUD bytes. Early S21 bloom used 2.7–3.0 times the tile-path workload. Standard keeps the tile path and High permits bloom.",
        "reflection": "Disabling the tile path alone raised the tested workload by 1.6–1.8 times. Reducing blur levels only addresses the other part of the cost."
      },
      {
        "id": "g-refraction",
        "title": "Find the missing rows in a half-resolution glass snapshot",
        "area": "Screen-space refraction",
        "situation": "A half-resolution colour and depth snapshot made rows of the floor disappear through glass.",
        "task": "Keep mobile snapshots small and test ray hits at full and half resolution.",
        "action": "Capture opaque colour and linear depth. March refracted rays against the depth. Average each 2 × 2 colour block while taking the farthest depth among drawn samples. Apply exponential path absorption and fall back to the environment on a miss.",
        "result": "The full-resolution slab matched all 8,489 assessed CPU reference pixels and the half-resolution case missed one. All 4,192 off-screen rays fell back correctly. S21 High ran at 8.57–9.46 ms p95. Standard draws translucency.",
        "reflection": "A screen-space snapshot lacks off-screen objects and farther glass. Omitting exit Fresnel and internal bounces raised slab transmittance by 0.037 at normal and 0.082 at 60°."
      },
      {
        "id": "g-scattering",
        "title": "Choose which part of subsurface scattering ships on phone",
        "area": "Subsurface scattering",
        "situation": "The desktop spread made light bleed beneath the surface, but its full pass was expensive on S21.",
        "task": "Keep the useful thin-material response within the mobile budget and validate object boundaries.",
        "action": "Filter diffuse light per channel using separable Gaussians. Reject different object IDs and weight depth and normal discontinuities. Add the difference back to the scene. Make thin-surface backlighting available independently.",
        "result": "Uniform, specular and emissive test areas retained their bytes. Boundary differences were at most one level. The RTX 4070 Laptop fixture rose from 0.17 to 0.44 ms. Forcing full spread on S21 required 3.7–4.5 times the work, so both phone tiers ship backlighting.",
        "reflection": "The desktop effect is screen-space diffusion. Fading Circle notes receive backlighting only because they do not write depth."
      },
      {
        "id": "g-proxies",
        "title": "Light the track with a glowing hold without unstable light selection",
        "area": "Emissive proxy lights",
        "situation": "Many luminous note fragments can compete for a small direct-light budget and cause visible popping.",
        "task": "Select stable representatives and respect stage-light costs.",
        "action": "Partition strips into 0.5-unit cells with stable IDs. Rank estimated flux from radiance and area with distance to the play focus. Apply 25% hysteresis. Allow up to eight desktop and four S21 High proxies after the stage budget.",
        "result": "55 CPU checks cover selection and intensity. Standard toggle captures are identical. Four High proxies raised workload by 39%, 30% and 4% in Drop 3D, Drop 2D and Circle fixtures. Desktop p50 was 0.068 ms baseline, 0.085 ms with four and 0.103 ms with eight.",
        "reflection": "Point proxies provide direct lighting on the track without shadows or contributions to other notes. Distant cells can fall outside the budget."
      },
      {
        "id": "g-global-illumination",
        "title": "Validate the reference before evaluating probe-grid GI",
        "area": "Path tracing and global illumination",
        "situation": "A precomputed probe grid might add indirect lighting, but the obvious close-geometry cases were uncertain.",
        "task": "Set a 25% mean relative-error limit against a checked reference before choosing whether to ship.",
        "action": "Use multiple importance sampling and 65,536 paths per scoring point. Validate against an analytical rectangle light and white furnace, then measure cubemap probes at 0.5 spacing and two light gathers.",
        "result": "The white-furnace indirect reference was −0.08% from the analytical value. Reference standard errors were 1.6%–1.8%. Probe mean errors were 38%–44%, with single-thread CPU rebuilds of 10–119 ms. The candidate stayed in tests.",
        "reflection": "Probe spacing missed the light variation between nearby boxes. CPU build timings give no direct measurement of a potential GPU version."
      },
      {
        "id": "g-rectangle-light",
        "title": "Test rectangular area lights at grazing angles before shipping",
        "area": "Rectangular area lights",
        "situation": "A fitted linearly transformed cosine looked accurate head-on. The renderer uses its own GGX and Smith approximation.",
        "task": "Measure a fit to the actual lobe against a numerical reference, including horizon crossings.",
        "action": "Fit a 64 × 64 table of roughness and view angle using Nelder–Mead. Clip rectangles to the receiver horizon and integrate in the transformed domain. Validate 1024 × 1024 midpoint quadrature against known diffuse form factors.",
        "result": "Normal view mean error was 1.6%. Across 64 scored cases, specular error averaged 15.1% and peaked at 116%, beyond the 10% and 25% limits. A longer fit did not solve grazing error. The work stopped at CPU feasibility.",
        "reflection": "A good diffuse form factor and a few frontal renders say little about the distribution of specular error."
      },
      {
        "id": "g-composition",
        "title": "Remove an intermediate full-screen pass and profile the remaining frame",
        "area": "Compositing and GPU profiling",
        "situation": "Spatial rendering wrote an intermediate converted image before the final swapchain pass.",
        "task": "Find the cost of direct conversion while preserving capture and scaled-preview paths.",
        "action": "Read GPU query results after the frame fence and group samples into warmed 240-frame windows. Convert full-size scene colour directly into the swapchain. Compare separate compiler, blend and spherical-harmonics candidates.",
        "result": "In uncapped S21 diagnostics, the baseline GPU queue interval was 2.6243 ms. Direct runs measured 2.3838 and 2.4090 ms with mean clocks around 400 MHz versus 494 MHz. Image interiors matched, and the formerly clipped 3,996-pixel border filled in.",
        "reflection": "Queue time and displayed FPS measure different things. The device changed clocks, so keep the recorded rates with the figures."
      },
      {
        "id": "g-negative-trials",
        "title": "A two-subpass prototype was slower in the device test",
        "area": "Ablation study",
        "situation": "A remaining full-screen stage appeared expensive. Arithmetic and attachment traffic were both possible explanations.",
        "task": "Compare alternatives under identical timestamp instrumentation before selecting one.",
        "action": "Split timestamps into scene, display, compositing and HUD. Try a simpler tone curve, constant output, texelFetch, pre-rotation and a two-subpass layout. Use visual-changing variants as diagnostic ablations.",
        "result": "Three unchanged 403 MHz controls measured 2.3255–2.3744 ms. texelFetch was 2.3269 ms. The corrected two-subpass prototype took 2.7463 ms at 460 MHz against an adjacent 2.3744 ms control at 403 MHz. Only finer instrumentation was retained.",
        "reflection": "Queue timestamps cannot establish bytes transferred or silent subpass merging. That question led to external hardware counters."
      },
      {
        "id": "g-tile-bandwidth",
        "title": "Cut external bandwidth at the same 119.5 FPS",
        "area": "Tile-local HDR",
        "situation": "A 2400 × 1080 RGBA16F frame is 20.736 MB. The baseline stores it externally and fetches it again for display conversion.",
        "task": "Measure external reads and writes for the same Drop 3D scene without changing resolution, content or HUD order.",
        "action": "Use ordered attachment reads in one Vulkan subpass when supported. Convert with subpassLoad from tile-local HDR. Mark HDR and depth transient and draw the HUD separately. Use off/on/on/off runs, 15 seconds each after warmup, on an unlocked S21. Sample HWCPipe every 200 ms.",
        "result": "External read plus write was 5.1315, 0.3301, 0.3277 and 5.1275 GB/s, about 93.6% lower. All four runs held 119.4–119.5 FPS and zero missed vsyncs. At 90°, 225 of 2,592,000 pixels differed and only three exceeded two channel levels.",
        "reflection": "The fixed scene demonstrates removal of the full-image round trip. Battery draw and whole-song averages require their own measurements."
      },
      {
        "id": "g-tile-rollout",
        "title": "Retest tile-local HDR on Drop 2D and Circle",
        "area": "Cross-mode validation",
        "situation": "The original bandwidth result covered a single Drop 3D fixture.",
        "task": "Decide whether broader eligibility preserves images and provides a repeatable benefit.",
        "action": "Reuse the Android capability and shader path. Hold Drop 2D at 0.9 s and Circle at 1.6 s. Run off/on/on/off, compare both orientations without resizing, and check HUD and background recovery.",
        "result": "On S21, Drop 2D went from about 5.10 to 0.30 GB/s and Circle from 5.09 to 0.24 GB/s, reductions of 94.0% and 95.3%. Circle was pixel-identical. Drop 2D differed by up to one level and missed one vsync in one of eight runs.",
        "reflection": "A separate, lower-clock timestamp run showed about 8% and 48% shorter intervals respectively. Similar bandwidth savings did not imply similar time savings."
      },
      {
        "id": "g-resize-pass",
        "title": "Reproduce the crash by resizing on the first frame",
        "area": "Vulkan object lifetime",
        "situation": "The game crashed if resized before the first draw. Later resizes worked.",
        "task": "Find which lazily created object received a stale dependency.",
        "action": "Symbolize the stack to QuadBatch’s first pipeline creation. Keep the render pass alive across resize and rebuild only dimension-dependent targets. Drive resize at a chosen frame in a hidden window.",
        "result": "Before the fix the frame-one fixture crashed consistently. Afterward, 12/12 optimized symbol builds and 15/15 Release runs completed with the expected 1280 × 720 captures.",
        "reflection": "First-use ordering is part of the test. Warming the renderer before every resize would hide this failure."
      },
      {
        "id": "g-present-sync",
        "title": "Give the present semaphore to the swapchain image",
        "area": "Swapchain synchronization",
        "situation": "Two CPU frame slots shared semaphores across three desktop or four S21 swapchain images, leading to VUID-00067.",
        "task": "Prove that presentation has finished waiting before reusing each semaphore.",
        "action": "Use one render-finished semaphore per acquired image, and rebuild the array with the swapchain. Keep acquire semaphores and frame fences indexed by frame. Reacquiring the image establishes when its previous present wait has finished.",
        "result": "Desktop messages fell from 20 to zero through autoplay to results, and 10 to zero during resize. Six screenshots matched. An S21 pass covered 100 background returns and ten manual 180° turns.",
        "reflection": "Submission fences establish GPU submission completion. Presentation uses a different lifetime tied to its image."
      },
      {
        "id": "g-frame-slots",
        "title": "Keep batch buffers aligned with the frame fence",
        "area": "Frames-in-flight resource ownership",
        "situation": "A frame without quad draws could desynchronize the batcher’s private frame counter from the renderer.",
        "task": "Make every dynamic buffer write use the slot whose fence has been waited on.",
        "action": "Take the slot from Renderer::frameIndex(). Verify host-coherent dynamic memory. Size line buffers by the six vertices actually written per line and clamp their limits.",
        "result": "Eight clock-pinned desktop captures across the modes changed by zero pixels. Synchronization validation and regressions ran. Present semaphores were investigated in a separate case.",
        "reflection": "Pixel equality alone gives limited evidence about overlapping reads and writes. Identify the fence protecting each update."
      },
      {
        "id": "g-retire",
        "title": "Release meshes only after the last frame that draws them",
        "area": "Deferred destruction",
        "situation": "Exit or retry could destroy GPU resources still in a submitted frame or already referenced by the frame being built.",
        "task": "Restore safe resource ownership without a device-wide idle for every exit.",
        "action": "Retire buffers, meshes and textures into the current slot during a frame, or the last submitted slot outside it. Release after the slot fence. Trigger exits and restarts at fixed song time under synchronization validation.",
        "result": "At 3 s, Drop 3D mid-frame exit messages fell from 48 to zero, restart from 34 to zero, and update-loop exit from 10 to zero. Circle exit with a background fell from 38 to zero. Fixed screenshots matched.",
        "reflection": "Gameplay lifetime ends before GPU lifetime. A shared retirement path also supports shader reload and scene transitions."
      },
      {
        "id": "g-arc-uploads",
        "title": "Remove 59 GPU waits from startup on a Drop 3D fixture",
        "area": "Buffer uploads and reuse",
        "situation": "A short chart using many arcs stalled during startup on repeated allocation and upload waits.",
        "task": "Lower blocking work while preserving dynamic vertices and pause/resume behavior.",
        "action": "Share static index buffers. Keep vertices per frame slot and rewrite them only when clip or speed changes. Record staging copies and visibility barriers into the normal frame instead of waiting after each transfer.",
        "result": "Desktop waits fell from 59 to 19 and then zero. Two S21 APKs measured Drop 3D initialization at 8.0–17.6 ms before and 0.1–0.4 ms after, with 59 to zero waits. The tested pause screen matched across three returns.",
        "reflection": "Wait counts identify the mechanism. Startup timing and pause screenshots verify separate user-facing outcomes."
      },
      {
        "id": "g-shader-layout",
        "title": "Fix a valid shader that reads the wrong time and tint",
        "area": "Host–shader interface",
        "situation": "A compiled custom shader appeared static or ignored the color control.",
        "task": "Align data layout and ensure colour is applied once across mesh and quad paths.",
        "action": "Place shared GLSL declarations beside the C++ data, check offsets through SPIR-V reflection of the 128-byte layout, and multiply by the tint carried in fragColor once, at the end. Fix song time and vary shader time or tint separately.",
        "result": "At song time 1.8 s the old captures at two shader times matched. After the fix 0.8 and 2.36 s differed only on the two hold bodies, 0.50% of the image. Yellow tint turned cyan green, and the white control matched.",
        "reflection": "Compilation covers syntax and types. Cross-language field offsets and ownership of colour operations require explicit checks."
      },
      {
        "id": "g-hot-reload",
        "title": "Reload a shader while queued draws still use the previous pipeline",
        "area": "Hot reload and transactional installation",
        "situation": "An edited shader can compile while the GPU or a pending batch still references the previous pipeline.",
        "task": "Update the preview without discarding the last good files or destroying a live pipeline.",
        "action": "Compile staged files first. Publish complete source and SPIR-V, invalidate by canonical path, and retire old pipelines behind frame fences. Memoize failures by file revision and use the plain particle fallback.",
        "result": "Desktop control, loop-top replacement and queued replacement produced zero validation errors and warnings. The render changed from red to blue. Immediate destruction as a negative control produced validation errors at both positions.",
        "reflection": "Track disk, preview and device lifetime together. Versioned failure caching avoids recompilation on every hit."
      },
      {
        "id": "g-cover-leak",
        "title": "Reproduce the song-select crash by reloading 60 times",
        "area": "Descriptor resource management",
        "situation": "Song select crashed after repeated loads even though covers appeared to be released.",
        "task": "Check the distinct lifetime of images and their ImGui descriptors.",
        "action": "Inject an exact reload count under validation. Retire descriptors and textures together in the thumbnail cache and release once the GPU is idle. On refresh keep resources still decoding.",
        "result": "The old Release build crashed after 30 reloads and logged destruction of an in-use image and sampler. The new build completed all 60 with visible covers and an empty validation log. All 15 test programs passed.",
        "reflection": "A texture and the descriptor naming it are separate allocations. Repeated deterministic reloads amplify both leaks and unsafe destruction."
      },
      {
        "id": "g-device-budget",
        "title": "Compare GPU budget with the same observed 120 FPS",
        "area": "Mobile performance regression",
        "situation": "An earlier build filled the S21 display interval while some modes exceeded the intended GPU budget.",
        "task": "Retain per-mode, per-tier readings alongside pacing and sustained results.",
        "action": "For R12, hold Hard at 9 s for approximately 15.6 s. Take the median of window p95s over 240-frame windows, alongside frequency, missed vsync and 1% lows. Separately run a chart sweep and sustained scene.",
        "result": "R12 new-look Standard p95 was 6.20 ms for Drop 3D, 4.75 for Circle, 7.48 for Drop 2D and 8.63 for Scan Line. Fixed Drop 2D at 600.9 s averaged 119.9 FPS with four misses. The sweep retained long frames on old looks.",
        "reflection": "The target was 6.5 ms with comparable clocks. The November build used a separate matched-asset acceptance run."
      },
      {
        "id": "g-publish-writes",
        "title": "Make scene colour visible to the next Vulkan pass",
        "area": "Vulkan memory visibility",
        "situation": "Early post-processing could show stale scene pixels despite apparently correct order in CPU code.",
        "task": "Identify the stages, access types and producer–consumer dependencies.",
        "action": "Declare dependencies into the scene pass and out from colour attachment writes so subsequent shader reads can see them. Centralize synchronization below the gameplay batchers.",
        "result": "The March development record describes flicker, the one-way dependency and the added reverse direction. Later desktop synchronization validation was performed on the October implementation.",
        "reflection": "CPU call order is insufficient to establish GPU memory visibility. The historical diagnosis has no paired timings or pixel-error counts."
      },
      {
        "id": "g-legacy-pbr",
        "title": "Add normal maps and highlights within the legacy parameter ABI",
        "area": "Physically based rendering",
        "situation": "The older shader already used its 128-byte parameter block and had no tangent vertex attribute.",
        "task": "Add opt-in PBR while preserving legacy effects and data.",
        "action": "Interpret the existing block per pipeline and derive the tangent basis from screen-space derivatives. Enable PBR by material slot, with legacy special effects the default. Add explicit tangents later in the separate surface pipeline.",
        "result": "The May record documents the Cook–Torrance path and normal maps. LegacyFreezeTest pins old shader and structure layouts during the R2 migration.",
        "reflection": "The May PBR path, October surface ABI and later Disney model each have their own capabilities."
      },
      {
        "id": "g-nov-track-cache",
        "title": "Trade extra texture reads for less track shading",
        "area": "Static shading cache",
        "situation": "At 7.22 ms in a fixed Drop 2D diagnostic, removing the track lowered cost to 4.96 ms. Removing notes or effects saved much less.",
        "task": "Avoid repeated stable shading while preserving the actual track depth, coverage and full-resolution image.",
        "action": "Cache stable track shading at viewport resolution and render actual mesh depth and coverage. Invalidate on camera, viewport, lighting, material or texture changes. Compare 90°, 270° and post-hit images, then use Mali counters and whole-song runs.",
        "result": "S21 120 Hz p95 was 5.15, 5.18 and 5.16 ms versus 7.04, 7.16 and 7.19 ms. Fixed images differed by at most 1/255. External reads rose from 85.4 to 550.2 MiB/s, while writes moved from 163.1 to 163.4.",
        "reflection": "This optimization has a measured bandwidth cost. The October HDR project removed a different transfer under a different baseline."
      },
      {
        "id": "g-nov-scan-tile",
        "title": "Apply tile-local compositing to compatible Scan Line materials",
        "area": "Tile-local cartoon compositing",
        "situation": "The fixed-camera cartoon path still incurred high composition traffic even without 3D lighting.",
        "task": "Reuse a tile pass while preserving transparency, HUD order and incompatible legacy paths.",
        "action": "Select by mode, material and pass capability. Draw the HUD separately. Retain the old route for incompatible passes or legacy shaders. Compare fixed frames in both orientations, including program materials and hit effects.",
        "result": "S21 reads fell from 2,461.0 to 86.1 MiB/s and writes from 2,399.4 to 167.1. Whole-song 120 Hz candidate p95 measured 4.14, 4.19 and 4.11 ms. At 90°, two of 2,592,000 pixels differed by over one level, with a 158/255 maximum. The legacy control matched.",
        "reflection": "A small average can coexist with visible outliers. Keep maximum channel error and original comparison frames."
      },
      {
        "id": "g-nov-pacing",
        "title": "Meet the GPU target and count the remaining missed presents",
        "area": "Presentation timing and frame pacing",
        "situation": "GPU p95 improved, but smooth display delivery has its own acceptance criteria.",
        "task": "Measure GPU queue times and actual present intervals under comparable conditions.",
        "action": "Autoplay all four modes at 60 and 120 Hz with identical assets and real audio. Run three A/B pairs per condition, reversing the second. Read Vulkan timestamps and SurfaceFlinger intervals. Count intervals over 1.5 periods and repeat with timing probes disabled.",
        "result": "At 120 Hz the worst of 122 window p95s was 6.17 ms and the worst run summary 5.58 ms. Actual misses were 0/17,288 at 60 Hz and 11/34,575 at 120 Hz. The probe-off repeat recorded 3/11,531 misses.",
        "reflection": "For all 11 misses, the next buffer was ready 10.20–12.96 ms before the previous image appeared. A later S21 trace followed individual buffer IDs from queue through GPU completion and compositor latch to display, separating delays before and after handoff."
      },
      {
        "id": "g-nov-memory",
        "title": "Reduce first-load memory while retaining the full mip chain",
        "area": "Startup memory high-water mark",
        "situation": "A large texture or video could create a transient process peak far above its final GPU allocation.",
        "task": "Bring the paired cold-start fixtures below 512 MiB while keeping resolution and mip levels.",
        "action": "Read VmHWM from fresh processes and sample PSS separately. Limit pending upload bytes, release temporary copies promptly, allocate GIF frames individually and upload one-channel glyph coverage where supported. Set Android’s preferred large block to 16 MiB.",
        "result": "Each 2048² fixture’s 12 mips totalled 22,369,620 bytes. Extra C++ allocation fell from 54,526,069 to 22,369,659 bytes with matching mips. Final dual-texture and video cold-start maxima were 493.2 and 487.0 MiB.",
        "reflection": "An alternating-song stress run later reached 580.5 MiB. This cold-start result applies to the tested S21. Physical 4 GiB hardware needs its own validation."
      },
      {
        "id": "g-nov-cache",
        "title": "Recover a shader cache after concurrent writes or Windows sharing failures",
        "area": "Concurrent cache publication",
        "situation": "Multiple editor processes could compile the same cache entry, or the OS could deny its replacement.",
        "task": "Publish complete cache directories safely and preserve the last good version after failure.",
        "action": "Stage in process-specific directories, serialize publication with an interprocess mutex, recheck the key and apply bounded backoff to sharing conflicts. Restore the old directory on failure and check recoverable entries at startup. Inject a real NTFS ACL denial.",
        "result": "Two concurrent processes exited successfully with identical keys and zero staging leftovers. Error 5 left the old file hashes intact. With permissions restored, a new process hit the disk cache with zero extra compilations. MaterialProgramTest passed three times.",
        "reflection": "A shader can work for this session even if disk publication fails. Actual file locking and separate processes verify the recovery path."
      }
    ]
  },
  {
    "id": "foundations",
    "title": "Graphics & Program Debugging",
    "intro": "Trace visible failures back to data, API contracts and a reproducible sequence of operations.",
    "cases": [
      {
        "id": "base-halo-mask",
        "title": "Fade a ring’s glow before it reaches the sprite edge",
        "area": "Signed distance fields",
        "situation": "A faint square surrounded the particle’s circular halo on dark backgrounds.",
        "task": "Keep the ring stroke and inner glow while removing the rectangular cutoff.",
        "action": "Inspect the fragment shader. The SDF ring extended to 0.95 of the quad radius, leaving about a fifth of its outer glow at the edge. Add a smooth mask that reaches zero at the inscribed circle.",
        "result": "With the same background and seed, 1.31%, 1.09% and 0.85% of three ring effects changed. Their squares disappeared and the inner glow remained. The Glow Pop control was identical.",
        "reflection": "An SDF describes a shape. The carrier geometry still bounds the pixels the shader can reach."
      },
      {
        "id": "base-gif-clock",
        "title": "Separate GIF playback errors from capture timing",
        "area": "Animation timing",
        "situation": "The title GIF ran at one tenth speed, and desktop and phone screenshots still showed different frames after correcting the rate.",
        "task": "Verify frame duration, preserve the playhead on resume and align captures.",
        "action": "Remove an extra centiseconds-to-milliseconds conversion. Save the playhead separately from the Vulkan textures and reset the UI clock on return. Pin capture time to avoid delay between phone log polling and screenshots.",
        "result": "At 1.5 s the desktop stopwatch changed from frame 01 to 15. Seven points from 0.5–4.0 s matched expectation. Seven comparisons of the special one-centisecond fixture were unchanged.",
        "reflection": "A mismatched screenshot can come from decoding, playback, recovery or the capture clock. Test each independently."
      },
      {
        "id": "base-color-encoding",
        "title": "Recover the intended editor colours in the sRGB swapchain",
        "area": "Colour space",
        "situation": "Design cyan #5fb8c9 appeared as #a4dde6 and faint white lines looked grey.",
        "task": "Make the editor tokens match their design values while preserving the game view palette.",
        "action": "Trace ImGui vertex colour through the sRGB swapchain. Decode style tokens to linear light at compile time and handle alpha and mixed colours separately. Preserve independent palettes for the canvas and player.",
        "result": "The September record documents the colour match and centralizes the rule in the style tokens. It also records that faint glow tails can round to zero with eight-bit linear alpha.",
        "reflection": "Check representation at input, blend and output boundaries. The alpha conversion depended on the background blend."
      },
      {
        "id": "base-ui-particles",
        "title": "Render custom click particles above the player buttons",
        "area": "UI compositing",
        "situation": "ImGui covered particles drawn in the earlier offscreen scene pass.",
        "task": "Support authored GLSL click effects without changing note-effect ordering.",
        "action": "Instantiate a second copy of the particle system for the swapchain pass and flush it after ImGui. Reuse the emitters and shaders with window-pixel event coordinates.",
        "result": "The same asset formats work for charts and buttons. A missing effect in standalone Test Game exposed an uninitialized project library, fixed by opening the project on entry.",
        "reflection": "Shared drawing needs matching pass order, coordinates and asset initialization. An editor preview only exercises some of that path."
      },
      {
        "id": "base-particle-flip",
        "title": "Use paired markers to distinguish Y reversal from DPI scaling",
        "area": "Coordinate transforms",
        "situation": "Particles from a click near the top appeared near the bottom even after using display dimensions.",
        "task": "Find whether the problem comes from DPI, viewport size or the projection.",
        "action": "Draw an ImGui ring and a particle at the same screen coordinate and display both dimensions. At 1280 × 720 the sizes and X position matched, while Y was mirrored. Correct the bounds passed to makeOrtho.",
        "result": "The click target and particle aligned after the projection fix. The existing drop-mode path had its own coordinate flip, which explained why copying it failed.",
        "reflection": "A known marker and the actual output in one frame can distinguish scale, translation and axis reversal."
      },
      {
        "id": "base-white-stripes",
        "title": "Trace unexpected white stripes to a negative power base",
        "area": "Shader numerical stability",
        "situation": "A hold mesh stretched roughly 35 times along Z showed saturated stripes.",
        "task": "Keep the intended rim glow at the edges of the floating-point domain.",
        "action": "Trace normal normalization, the dot product and pow. Tiny length overshoot can leave a negative base. Clamp the base before exponentiation.",
        "result": "The September log reports the bands gone. A separate change repaired geometry beyond the hit line. This historical case has no paired before capture.",
        "reflection": "Numerical normalization does not enforce an exact range. The authored animated stripes in the showcase are a separate material."
      },
      {
        "id": "base-async-image",
        "title": "Move the remaining image-upload stall off the main thread",
        "area": "Asynchronous texture upload",
        "situation": "Even after worker decoding, a 1920 × 1080 JPEG cost 8.2–12.5 ms on the desktop main thread.",
        "task": "Break out preparation, copy and retirement while guarding a song change.",
        "action": "Prepare the image and staging data on a worker, queue the copy into the next frame, and retire staging behind its fence. Make ownership cancellable and compare fixed-time output.",
        "result": "Worker decode took about 12–13 ms and preparation about 1 ms. Main-thread enqueue took 0.001–0.002 ms. The fixed frame matched and the pause difference was 0.0051%, attributed to particle phase.",
        "reflection": "This measures main-thread blocking. Decode work still happens on the worker."
      },
      {
        "id": "base-lane-edit",
        "title": "Stop a lane-count drag from rewriting 221 notes",
        "area": "Edit transactions",
        "situation": "Dragging from 12 to 7 lanes repeatedly applied modulo and collapsed 221 notes into lane 0.",
        "task": "Preview the lane count live and commit one coherent remap after the edit.",
        "action": "Move the remap to IsItemDeactivatedAfterEdit. Use the final lane count for both hold heads and waypoints. Restore affected project charts from version history.",
        "result": "A headless ImGui test reproduced five old rewrites and one new rewrite. Lanes 7–11 mapped to 0–4, and the test hold followed 2, 3, 2. The autosaving project was not used for the replay.",
        "reflection": "UI events can be frequent. A destructive data transform belongs at the edit boundary."
      },
      {
        "id": "base-path-encoding",
        "title": "Preserve a non-ASCII filename across selection, save and analysis",
        "area": "Text encoding",
        "situation": "A path could display correctly yet fail JSON serialization, audio decoding or analysis. Substituting bad bytes damaged a song list.",
        "task": "Restore the catalogue and preserve the resource’s identity at every boundary.",
        "action": "Recover the 305-line list from Git. Trace Windows code pages, UTF-8 and wide-character APIs through file selection, process launch and Python. Read bytes using the correct path before decoding in memory.",
        "result": "Two real tracks containing Chinese or Japanese characters reopened, played, showed waveforms and ran analysis. An October test separately exercised a non-ASCII install directory.",
        "reflection": "A name can be readable while the path used to open it has already changed. Test both operations."
      }
    ]
  },
  {
    "id": "runtime",
    "title": "Game Runtime, Input & Audio",
    "intro": "From timing and hit geometry to display presentation, audio output and tests of the shared runtime.",
    "cases": [
      {
        "id": "rt-hold-path",
        "title": "Make editor, renderer and judgment evaluate one hold curve",
        "area": "Path geometry and hit testing",
        "situation": "An editor bend could look straight during play or require a touch path different from its visible ribbon.",
        "task": "Define one path that supports dense render samples and discrete judgment ticks.",
        "action": "Use evalHoldLaneAt over timed waypoints with target lane and turn duration. Sample it for ribbons and Circle miter joins and query it at the authored ticks for hit testing.",
        "result": "The fixed captures cover bent holds across the shared spatial modes. Controlled input tests and autoplay check that a held finger follows the expected lane at each tick.",
        "reflection": "Tessellation density can change without redefining the input curve. The recorded input checks were controlled."
      },
      {
        "id": "rt-camera-picking",
        "title": "Keep notes visible and playable after a 90° camera roll",
        "area": "Camera projection and picking",
        "situation": "A rotated camera could clip notes or make a lane lock to the screen’s horizontal axis.",
        "task": "Match note projection and hit testing through rotation and near-plane crossings.",
        "action": "Use yaw × pitch × roll, clip 2D lines and quads against the near plane before projection, measure widths in their own direction, and pick lanes along the projected judgment line and playfield axes.",
        "result": "The camera and turn regressions exercise rolled layouts, projected hold geometry and picking through the same scene rules.",
        "reflection": "A front-facing picture will miss bugs in orientation, clipping and inverse picking. Each path needs a rotated fixture."
      },
      {
        "id": "rt-3d-sky",
        "title": "Pick the sky tap at the position actually drawn",
        "area": "3D interaction geometry",
        "situation": "A hard-coded lane strip left ground and sky touches disconnected from their rendered positions.",
        "task": "Let perspective views remain playable with both touch and ground keys.",
        "action": "Extract GPU-independent world-to-screen layout. Prioritize the ground or sky region along the projected vector between the two lines, then rank hits by timing and position. Ground keys only check ground candidates.",
        "result": "Drop3DInputTest measures screen targets from a 1920 × 1080 frame, then exercises hit, miss and ground/sky dispatch. The Android build also compiled the shared input code.",
        "reflection": "Recorded screen coordinates supply an independent reference. A round trip through the same wrong projection can still pass."
      },
      {
        "id": "rt-arc-coverage",
        "title": "Give manual play and autoplay the same arc scoring denominator",
        "area": "Continuous arc tracking",
        "situation": "Void guides and tracked arcs could create inconsistent score events across play methods.",
        "task": "Count each playable arc once and exclude visual-only guides.",
        "action": "Integrate covered song time using horizontal error. Use the greater of 12% of playfield width and one lane as tolerance. Score at each segment end and keep sky taps as separate positional tests. Remove void arcs from score events.",
        "result": "Regression cases include followed, abandoned, lifted and chained arcs, void guides and autoplay. The checks verify one final judgment per playable arc.",
        "reflection": "Define the degree of freedom a player controls separately from the arc’s appearance."
      },
      {
        "id": "rt-circle-wide",
        "title": "Re-evaluate a stationary finger as the disk moves underneath it",
        "area": "Moving frames and wide notes",
        "situation": "A wide note might become unreachable as a rotating disk moved its lanes beneath a stationary touch.",
        "task": "Keep wide holds valid across covered lanes and associate feedback with the judged note.",
        "action": "Map the touch into current disk coordinates every frame. Use wrapped lane coverage, retain touch identity and pass the note ID to feedback.",
        "result": "Tests cover held fingers staying inside or leaving the transformed path. A miss only removes its own note. Cross-platform checks guard the matching mobile calls.",
        "reflection": "A held coordinate still carries new meaning as the playfield transforms. Reuse the judgment’s note identity for feedback."
      },
      {
        "id": "rt-flick",
        "title": "Judge a flick at slide onset and preserve nearby taps",
        "area": "Gesture semantics",
        "situation": "Flick direction or late release could interfere with judgment and consume ordinary notes.",
        "task": "Recognize flick motions during the hit window and preserve active holds.",
        "action": "Search flick-only candidates from the initial press when SlideBegin or SlideMove occurs. Prioritize an already held long note. Permit any swipe direction under the current mode rule.",
        "result": "Controlled tests cover radial and crosswise motion, slow swipes, two-lane releases, a second attempt after a 0.25 s early motion, and tap-then-flick sequences.",
        "reflection": "An arrow can remain part of the note’s visual language even where scoring accepts any swipe direction."
      },
      {
        "id": "rt-scan-tempo",
        "title": "Use the same tempo schedule for editing and play",
        "area": "Page scheduling and synchronization",
        "situation": "Ba Hard changes from 89.6 to 134.8 BPM at 106.65 s. The old runtime sweep kept the first BPM.",
        "task": "Bring the sweep through the authored note while preserving unchanged sections.",
        "action": "Build the same page table from timing points and page overrides in both paths. Use a complete final page to avoid divergent results based on song length or last note.",
        "result": "At 107.32 s on Windows, the old sweep was at rows 671–673. The fix returned it to 399–401 through the note on row 401. The 149.96 s case also improved. At 19.96 s the control was pixel-identical.",
        "reflection": "Keep a failing and normal timestamp. Legacy speed-keyframe charts have a separate compatibility path."
      },
      {
        "id": "rt-scan-legacy-phase",
        "title": "Integrate legacy sweep speed across a discontinuity",
        "area": "Piecewise integration and compatibility",
        "situation": "A sudden speed step added about 0.08 sweeps to the old accumulated phase.",
        "task": "Correct the mathematical step and preserve an author-controlled migration path.",
        "action": "Split at every event boundary and select the active rule at each interval midpoint. Add phase samples every sixteenth of a ramp. Explain the legacy model and allow its removal per difficulty.",
        "result": "All 77 timing checks passed. Step error stayed below 10⁻⁴ and the 1× to 3× ramp below 3 × 10⁻⁴. Removing free keyframes matched the page model within 10⁻⁵.",
        "reflection": "Exact step integration and sampled ramp error need different assertions. Migration is independently testable."
      },
      {
        "id": "rt-scan-slide",
        "title": "Keep a slide visible and score its real nodes after a page turn",
        "area": "Slide paths and tick sampling",
        "situation": "A cross-page slide disappeared while the runtime still judged its later points.",
        "task": "Keep the visible path attached to its scoring times, including old chart formats.",
        "action": "Share the node and tick ordering rule. Use the real node time for one-to-one ticks, preserve legacy distribution otherwise, and clip the remaining rendered path to the current page.",
        "result": "32 GPU-free checks passed. At 12.1 s the remaining slide became visible, and a tap-only control matched. With +0.2 s calibration, a 442 px off-path touch correctly missed the 64 px tolerance.",
        "reflection": "A polyline has a spatial shape and an associated timing function. Uniform interpolation can preserve its endpoints while changing gameplay."
      },
      {
        "id": "rt-scan-space",
        "title": "Place the phone’s hit region under the pictured note",
        "area": "Screen and world coordinates",
        "situation": "A Scan Line note shown low in the editor could appear or respond high on the phone.",
        "task": "Make display and reverse mapping agree while keeping the background camera.",
        "action": "Define the playfield in screen coordinates and use touchToWorld for its boundaries and input. Exercise the intended click and the mirrored wrong position.",
        "result": "On S21 at 20.82 s, (818, 780) scored a Perfect and 1000. A replay at (818, 300) left the note. Matched desktop and phone capture differences were 0.0%. Reverting the fix failed 17 checks.",
        "reflection": "Pixel parity and a correct touch require separate evidence. Mirroring the final frame would also mirror the background."
      },
      {
        "id": "rt-touch-clocks",
        "title": "Track multiple Android fingers on one monotonic time base",
        "area": "Multi-touch and event clocks",
        "situation": "Desktop keys worked while a phone hold could fail before it began.",
        "task": "Make touch recognition consistent with each finger’s identity, movement and sample history.",
        "action": "Use the same monotonic epoch for updates and touch events. Replay historical samples before the latest one, keep IDs through release and scale thresholds by display density.",
        "result": "Shared input tests cover simultaneous ground and sky touches and releasing only the lifted finger. Density-one tap and slide thresholds are 20 and 25 px, scaled on device.",
        "reflection": "A common unit does not guarantee a common clock epoch. Keyboard and autoplay bypass touch recognition."
      },
      {
        "id": "rt-touch-time",
        "title": "Judge the tap on the early press, even with a late release",
        "area": "Input latency and event ownership",
        "situation": "Waiting for release or the next rendering frame can move a tap out of its true timing window.",
        "task": "Use the event timestamp and preserve release semantics for held gestures.",
        "action": "Try a tap or hold head on Press. Map Android monotonic event time onto the latest song-clock sync, clamped from −250 to +100 ms. Dispatch pause and results input by active view.",
        "result": "TurnCameraTest pressed 10 ms early and released 200 ms later. The result was exactly one Perfect. Android event-time wiring and fixed-point touch checks were verified separately.",
        "reflection": "Controlled event tests verify the rule. End-to-end touch, display and acoustic delay need external measurement."
      },
      {
        "id": "rt-hold-lifecycle",
        "title": "Count the same hold events even when the player misses the head",
        "area": "Scoring invariants and gesture lifetime",
        "situation": "Missing a hold could omit future events and improve the apparent accuracy.",
        "task": "Keep a stable denominator and correctly end holds and released fingers.",
        "action": "Count heads, ticks and tails explicitly. Account for remaining events on miss or early release. Mark a finger consumed until lift, and clear live hold ownership on pause.",
        "result": "Three desktop input suites cover completion, cancellation and ticks. On S21 a Scan Line hold at 4.28 s changed from zero visible body pixels to 5,315 and scored the tail with a hit effect.",
        "reflection": "The chart’s total event count is an invariant. Controlled tests and one device replay cover different failure paths."
      },
      {
        "id": "rt-song-offset",
        "title": "Keep music seconds and chart seconds explicit",
        "area": "Music time and chart time",
        "situation": "A positive author offset affects playback, waveforms, beats and page time in different places.",
        "task": "Apply a single offset convention across editor and runtime.",
        "action": "Define chart time as music time minus song offset in SongClock. Use music time for waveform and audio, chart time for notes, markers and pages, and the inverse only where needed. Prepare audio during lead-in.",
        "result": "A +0.2 s S21 fixture started audio 1.795 s after game start versus 1.8 s expected and autoplay hit Perfect. AudioOffsetTest covers editor mapping and cross-platform callers.",
        "reflection": "Author offset, player calibration and hardware output delay are separate quantities."
      },
      {
        "id": "rt-output-latency",
        "title": "Estimate when audio reaches the output clock",
        "area": "Audio output latency",
        "situation": "Autoplay looked aligned while tapping to the audible beat felt offset.",
        "task": "Drive gameplay from a better estimate of the actual audio playback position.",
        "action": "Seed from buffer periods and sample rate. On Android combine AAudio frames written, hardware frame position and monotonic timestamp. Smooth valid estimates and fall back when unavailable.",
        "result": "On the same Galaxy S21, the buffer estimate was 32.0 ms and the AAudio estimate 24.2 ms. The log checks monotonic song-clock progression.",
        "reflection": "This is audio-side timing evidence. Touch-to-speaker latency still needs an external measurement chain."
      },
      {
        "id": "rt-player-calibration",
        "title": "Apply player calibration to taps, hold ticks and autoplay",
        "area": "Player calibration and timing windows",
        "situation": "A calibrated tap could line up while a hold tick or picker still used the raw clock.",
        "task": "Apply the correction once at each suitable boundary.",
        "action": "Use calibrated time for outer picking and affected comparisons. Pass raw time into the detector that already applies correction. Add positive and negative offsets, lane changes and slide fixtures.",
        "result": "±0.2 s desktop runs hit taps and all four cross-lane hold ticks. Circle with +0.2 s gave a Perfect. Reverting each of five corrected code paths failed its assertion.",
        "reflection": "An API should say whether it expects raw or calibrated time. Mutation checks catch misplaced or double corrections."
      },
      {
        "id": "rt-preview-delay",
        "title": "Find the extra tenth of a second after file prefetch",
        "area": "End-to-end measurement and initialization",
        "situation": "Faster file opening barely changed the preview’s total delay.",
        "task": "Time entry-to-audio and find which event restarts the dwell timer.",
        "action": "Compare prefetch on and off within one debug APK. Log file open and timer boundaries. A category was selected before its song, causing a second timer start. Select them together during load.",
        "result": "Prefetch opened in 0.3–0.4 ms versus 13.1–14.5 ms. After the selection fix, total delay fell from 0.609–0.616 to 0.510–0.517 s with prefetch. Without prefetch it was 0.517–0.522 s.",
        "reflection": "The initial high file-open attribution changed after repeated A/B runs. Log the whole user-visible interval."
      },
      {
        "id": "rt-idle-audio",
        "title": "Stop mixing silence after a menu becomes idle",
        "area": "Audio resource scheduling",
        "situation": "A drawing-idle screen could keep its audio thread processing silence.",
        "task": "Save CPU time without blocking the first interaction after sleep.",
        "action": "Stop the device after sustained silence. Wake asynchronously on touch or new sound and handle background transitions. Rest song previews after two minutes idle at the end of the current preview.",
        "result": "Idle title CPU went from about 7.7% to 0.2% on S21. Settings and Results passed 20 returns each. A preview stopped at 126 s and the worker woke in 153 ms after a tap.",
        "reflection": "The observed built-in audio route passed. Plugging a headset or changing Bluetooth routes while idle is a separate test."
      },
      {
        "id": "rt-ogg",
        "title": "Distinguish Vorbis and Opus before importing an Ogg file",
        "area": "Codec detection and decoding",
        "situation": "Two .ogg files could have different codecs and one played silently.",
        "task": "Give both platforms consistent Vorbis playback and clear import feedback.",
        "action": "Integrate stb_vorbis with miniaudio, size effects from decoded samples and detect OpusHead for drag and drop, project paths and packaging.",
        "result": "Offline mix tests cover seeks, loops, file ends and a Chinese filename. S21 logs show 52 hits in about ten seconds with AAudio started. Thirty desktop suites passed the Opus fix.",
        "reflection": "The phone was muted during verification. The precheck reads the first logical Ogg stream."
      },
      {
        "id": "rt-sfx",
        "title": "Keep sample lead-in from delaying feedback",
        "area": "Audio assets and hit feedback",
        "situation": "Hit sounds could start late because the source files had leading silence.",
        "task": "Use events, per-song overrides and reusable packs with measurable attack times.",
        "action": "Dispatch through a shared sound slot. Trim and normalize one-shots, check loops and likely simultaneous pairs, and start or stop sustain loops with the held state.",
        "result": "Five packs contain 121 CC0 sounds, 113 one-shots and eight loops. The checks enforce at most 1 ms leading silence and peak onset within 10 ms. Some overly similar pairs were remade.",
        "reflection": "Sampling and engine timing meet at the asset boundary. Auditioning the musical feel is a separate exercise."
      },
      {
        "id": "rt-hit-particles",
        "title": "Capture the same particle state on desktop and phone",
        "area": "Event-driven feedback and deterministic capture",
        "situation": "A phone hit produced an empty ring where the desktop showed a burst.",
        "task": "Compare the same note, effect time and random state.",
        "action": "Pass the note ID and hit type through HitFx. Seed the simulation, use a fixed 1/60 s step and autoplay a one-second run-up before freezing at the requested step.",
        "result": "The S21 Scan Line fixture changed from zero mint burst pixels to 72. Fixed desktop/S21 captures for Drop 2D, Circle, Drop 3D and Scan Line differed by 0.05%, 0.00%, 0.00% and 0.00%.",
        "reflection": "Equal song time alone does not reproduce stateful effects. Preserve seed, run-up and capture step."
      },
      {
        "id": "rt-presentation-pacing",
        "title": "Compare engine late-frame messages with actual presents",
        "area": "Frame pacing diagnosis",
        "situation": "Engine logs showed hundreds of slow iterations, but the display appeared smooth.",
        "task": "Find out what reached the panel and clarify the timing source of each metric.",
        "action": "Record SurfaceFlinger presents for two roughly 150-second S21 sessions and compare application timings, layer jank and panel interval. The measured period was about 8.373 ms against nominal 8.333 ms.",
        "result": "Ac Hard delivered 99.994% of 18,122 frames on time with one missed vsync. Aa Easy showed all 18,095 frames on time. Both layers reported zero janky frames despite 747 and 66 engine warnings.",
        "reflection": "The engine and compositor observe different boundaries. This run covers two autoplay windows on one device."
      },
      {
        "id": "rt-player-boundary",
        "title": "Share player views between preview, Test Game and Android",
        "area": "Interface boundaries and shared implementation",
        "situation": "Separate platform and preview implementations risked placing controls and feedback differently.",
        "task": "Share the real UI without merging platform boot and storage responsibilities.",
        "action": "Expose audio, clock, input and rendering through IPlayerEngine. Adapt Android to the same ScreenCtx views and let editor previews call those real views.",
        "result": "Nine desktop comparisons matched apart from about 30 rounded-corner pixels. Nine later S21 comparisons showed identical Pause and Results and 0–0.01% change in the four gameplay HUDs.",
        "reflection": "Shared views cover layout and behaviour. Test the device input path into the interface separately."
      },
      {
        "id": "rt-loop-contract",
        "title": "Write dynamic geometry only after the slot’s fence",
        "area": "Main loop and frames in flight",
        "situation": "Game updates and GPU reads can overlap, especially during scene entry and exit.",
        "task": "Define where gameplay state advances and where dynamic geometry may be written.",
        "action": "Use GameModeRenderer onUpdate for song state and clipping, then onRender for per-slot geometry after the fence. Share index buffers and rewrite vertices only when clip or scroll state changes.",
        "result": "For 21 arcs and one bent hold, initialization waits fell from 59 to 19 at this stage. Fixed captures matched and validation reported no synchronization messages in autoplay, exit or restart.",
        "reflection": "Game updates and GPU frame slots follow separate schedules. Document who writes and who retires the GPU resource."
      },
      {
        "id": "rt-engine-stack",
        "title": "Diagnose Test Game exiting before its first log",
        "area": "Object layout and initialization",
        "situation": "Standalone Test Game died before logging and after the crash fix still lacked expected effects.",
        "task": "Locate the pre-log failure and initialize the same project libraries as the editor.",
        "action": "Recognize the stack overflow and inspect aggregate storage. Construct Engine on the heap with make_unique. Call openProject before loading standalone screens.",
        "result": "The June log records both fixes. Current entry points still allocate the engine on the heap, standalone opens its project, and the particle pool now uses a configurable vector.",
        "reflection": "A silent crash can narrow the suspect interval. Running startup also requires checking initialized asset registries."
      },
      {
        "id": "rt-scene-data",
        "title": "Store components densely and propagate transforms through a hierarchy",
        "area": "Component storage and scene hierarchy",
        "situation": "Entity components need efficient iteration while a child must follow its parent’s transform.",
        "task": "Maintain fast entity lookup and cached world matrices with clear ownership.",
        "action": "Use dense arrays per component type and a sparse entity-to-index map. Move the last element on deletion. Compose TRS locally and propagate dirty world matrices as parent world × child local.",
        "result": "The registry, dense view and SceneGraph implementation are visible in the cited C++ headers. A legacy mode uses the graph while the four playable modes retain their geometry implementations.",
        "reflection": "Array addresses can move after a deletion. The archived implementation has no separate performance benchmark for this storage layout."
      },
      {
        "id": "rt-score-end",
        "title": "Wait for the final judgment before showing results",
        "area": "Completion criteria and player records",
        "situation": "Audio could finish before the last note or its delayed judgment.",
        "task": "Preserve the scoring denominator and commit records only at the correct boundary.",
        "action": "Query audio EOF, advance through chart end and drain judgments, with a bounded grace interval. Share a pure tally, keep unjudged events in the denominator and store records by song and difficulty.",
        "result": "PlayerScreensTest covers ranks, early exit, empty D grade, full combo, all-perfect and score persistence. Perfect, Good and Bad carry 1, 0.7 and 0.3 accuracy weights. Autoplay stays session-only.",
        "reflection": "Audio EOF, chart completion and record persistence are separate events with separate tests."
      },
      {
        "id": "rt-judgment-options",
        "title": "Allow a custom timing window while preserving existing charts",
        "area": "Backward-compatible rule configuration",
        "situation": "Authors wanted different timing windows without silently rebalancing songs that have configuration fields.",
        "task": "Define explicit opt-in and one validated source of timings and scores.",
        "action": "Use customJudgment plus shared judgmentSetupFor. Preserve 20/60/100 ms and 1000/500/100 defaults. Clamp custom windows to 5–300 ms in ascending order and scores to non-negative descending values.",
        "result": "Tests cover disabled, valid and conflicting input. Timings 50/30/500 became 50/50/300 ms and scores 300/400/−5 became 300/300/0.",
        "reflection": "A field’s presence differs from an author enabling it. Both platforms and the mode pickers read the validated result."
      },
      {
        "id": "rt-retry-reuse",
        "title": "Reuse same-song resources without retaining old play state",
        "area": "Retry latency and resource lifetime",
        "situation": "Retrying a song could repeat expensive resource setup although the chart and assets were unchanged.",
        "task": "Reuse immutable data and reset judgment, effects, clocks and media.",
        "action": "Add restartRun to all four modes. Rewind already-open audio and video where possible and keep full rebuild as fallback. Verify Scan Line’s old hit ring disappears and notes can score again.",
        "result": "S21 recorded 24 retries and 25 results. Callback median was 0.38 ms and maximum 0.79 ms. First present after callback was 27.99 ms median and 38.26 ms max. A 5,748-interval repeat had no frame over 50 ms.",
        "reflection": "The lead-in remains roughly two seconds. The output cursor moved around 2,024.88 ms after callback on the measured run, which includes that delay."
      },
      {
        "id": "rt-video-present",
        "title": "Count the video frames that reached the display",
        "area": "Video presentation timestamps",
        "situation": "Decoder conversion rate cannot show dropped, repeated or delayed frames at presentation.",
        "task": "Measure distinct displayed PTS values, pacing, offset, drift and pause recovery.",
        "action": "Tag submitted swapchain frames with video PTS and presentation ID, match Vulkan present history with compositor timestamps, and deduplicate repeats. Compare pause and resume pixels and check loop boundaries.",
        "result": "S21 showed 719 distinct frames at 30.00 FPS, with zero skipped or reversed frames. The source-frame interval p99 was 50.02 ms, median offset from the audio play call +61.3 ms and drift +2.7 ms. Small-core stress logged 2/2,882 intervals beyond the threshold.",
        "reflection": "Pacing, fixed offset and drift describe different behaviour. The audio play call is a software reference, with acoustic output unmeasured."
      }
    ]
  },
  {
    "id": "tools",
    "title": "Authoring Tools, Assets & Delivery",
    "intro": "Trace production from a piece of music to an installed game, including editor state, resource persistence, packaging and device regression tests.",
    "cases": [
      {
        "id": "te-downbeat",
        "title": "Run the real downbeat model for Easy charts",
        "area": "Beat and downbeat tracking",
        "situation": "Easy received beat markers without the intended detector for the first beat of a bar.",
        "task": "Use the model while preserving the other difficulties and an explicit fallback.",
        "action": "Connect madmom’s tracker, handle ragged NumPy data, and snap predictions to detected beats within 50 ms. Report a model failure on stderr and fall back.",
        "result": "Four 203–367 s tracks exercised the model. Medium, Hard, features and tempo maps were byte-identical. Skate Easy went from 710 to 721 markers, removing 112 and adding 123. Analysis increased from 31–44 s to 51–119 s.",
        "reflection": "The output and execution traces prove the model ran. Accuracy needs annotated music."
      },
      {
        "id": "te-analysis-cancel",
        "title": "Cancel analysis without freezing the editor",
        "area": "Process lifecycle",
        "situation": "Changing songs during beat analysis could block the editor for one or two minutes.",
        "task": "Cancel the full process tree and prevent a finished result from changing the next song.",
        "action": "Share ProcessRunner and a per-run token across editor and agent. On Windows, own child processes with a Job Object. Read stdout and stderr independently and match cancel actions by song and job.",
        "result": "In the fixture, cancellation took 2 ms, switching 2–12 ms, and a two-second deadline terminated the process tree at 2.07 s. All 39 checks passed. Later cases cover completed but uncommitted results.",
        "reflection": "UI responsiveness, process exit and protection from late writes are separate conditions. The milliseconds come from a controlled process fixture."
      },
      {
        "id": "te-marker-data",
        "title": "Save the audio features that automatic charting depends on",
        "area": "Feature persistence",
        "situation": "Beat timestamps survived reopening, but automatic placement behaved differently without the original features.",
        "task": "Keep timing and features associated through save, merge and reload, including legacy data.",
        "action": "Persist onset strength, sustain and spectral centroid alongside markers. Require valid matching arrays. Move features with markers and prefer the existing marker if times differ by under 1 ms.",
        "result": "Editor round trips cover unordered and missing arrays and invalid numbers. Disabling feature writes makes the test fail. Sixteen marker charts supplied 15,931 times to strict parsing.",
        "reflection": "Older marker-only files remain readable. Features absent from the file require analysis again."
      },
      {
        "id": "te-autoplace",
        "title": "Generate editable notes while keeping lane and timing constraints",
        "area": "Automatic charting",
        "situation": "Authors wanted to insert beats after analysis and still receive a playable placement pass.",
        "task": "Respect existing notes and apply the same placement rules from editor and assistant.",
        "action": "Use sustain for holds, onset for flicks and spectral centroid for lanes. Apply anti-jack and lane cooldown rules. Sort a working copy by time with features attached before placing notes.",
        "result": "The four-marker fixture produced three notes before the fix and four after it. Tests cover bounds, ordering and partial features. The notes can still be edited and playtested.",
        "reflection": "The tests validate placement rules. The author still judges how the chart feels against its music."
      },
      {
        "id": "te-chart-audit",
        "title": "Turn a density warning into a specific, inspectable time range",
        "area": "Chart audit",
        "situation": "A general warning about a busy section does not show the author where to edit.",
        "task": "Compute repeatable findings and connect them to the waveform.",
        "action": "Calculate density, same-lane jacks, wide crossovers, gaps and beat alignment in C++. Merge windows with at least 16 events in four seconds or eight in one. Select a finding to seek and highlight. Use marker density before notes exist.",
        "result": "The audit panel, agent and generation tools use one implementation. Fixed fixtures expose the event times and lanes for manual checking.",
        "reflection": "The thresholds flag places to inspect. Deliberate challenge sections can also satisfy them."
      },
      {
        "id": "te-style-reference",
        "title": "Transfer lane use from a 12-lane chart to a seven-lane chart",
        "area": "Reference-based style transfer",
        "situation": "A useful reference may have different geometry, and its rhythm belongs to a different song.",
        "task": "Reuse patterns of note types and lanes without moving the destination rhythm.",
        "action": "Compute a C++ fingerprint and resample lane centres in normalized coordinates. Reassign eligible types by strength and sustain, filter references, and leave optional narration to the model.",
        "result": "Tests confirm that hold control points move together, self-reference is blocked and reference state resets. A simulated blocked narration request cancelled in 0.1 ms, with late results dropped.",
        "reflection": "The fingerprint describes distributions. Phrasing and feel remain author decisions. Cancellation timing came from a controlled transport."
      },
      {
        "id": "te-edit-ops",
        "title": "Make a drag one undoable operation across four playfields",
        "area": "Editing operations and invariants",
        "situation": "Each mode has different geometry, and ad hoc edits diverged across tools.",
        "task": "Share the data operations while preserving correct mode-specific hit testing and snapping.",
        "action": "Use stable IDs and ChartEditOps for selection, snapping, deletion, clipboard and page operations. Show a ghost during a drag and commit one named operation. Clamp, wrap or reattach by mode.",
        "result": "The edit tests grew from 376 to 596 checks across four modes. Hidden editor frames exercise keys, focus, movement and the inspector.",
        "reflection": "Corrections at the data layer reach both manual and assisted editing. Device usability still benefits from observing actual use."
      },
      {
        "id": "te-editor-theme",
        "title": "Switch the editor theme without altering the game preview",
        "area": "Editor theming and visual regression",
        "situation": "A dark or light editor theme could leak into the actual player view.",
        "task": "Keep the preview visually faithful and maintain usable toolbars across sizes.",
        "action": "Wrap the preview with GameViewScope and restore editor style afterward. Give the waveform and timeline independent tokens and collapse toolbar actions as space shrinks.",
        "result": "Day and Night previews of four modes matched byte for byte at 1920 × 1500. ThemeTest recorded 560 checks, including 3:1 graphical contrast and 4.5:1 text contrast. Later checks covered 1280 and 1600 widths and 100% and 150% scale.",
        "reflection": "Compare the region that should stay identical. Whole-window differences include intended editor changes."
      },
      {
        "id": "te-assets-intent",
        "title": "Show what a same-name import will replace",
        "area": "Asset editing and deletion semantics",
        "situation": "Dropping a same-name asset could overwrite a file that other pages depend on.",
        "task": "Make overwrite, keep both and skip explicit and make deletion recoverable.",
        "action": "Use a shared file-slot flow and list references before removal. Send files to the Windows Recycle Bin or fall back to project trash. Clearing chart data uses the editor’s undo history.",
        "result": "Hidden editor tests drove real file slots through drops, replacements and a rename rollback. A separate Recycle Bin probe found and restored the removed file.",
        "reflection": "Restoring bytes can still require rebinding. UI Set saves and APK export have different recovery paths."
      },
      {
        "id": "te-agent-main-thread",
        "title": "Commit model tool calls at a safe edit boundary",
        "area": "Concurrency and tool dispatch",
        "situation": "A streamed model response could arrive while the author was dragging a note.",
        "task": "Keep writes on the editor’s owning thread and revalidate the active song.",
        "action": "Parse in the background and dispatch on the main thread outside drawing. Apply writes on a working copy with invariant checks. Defer writes during drags and resume long-running jobs in their original turn.",
        "result": "Offline tests split stream events at byte boundaries and ran a scripted call. They verify thread ownership, cancellation, resume and protection from late writes after a song switch.",
        "reflection": "Deterministic fixtures test editor orchestration. The musical quality of generated charts is a separate evaluation."
      },
      {
        "id": "te-agent-history",
        "title": "Undo the material file and its binding in the same operation",
        "area": "Transactions, undo and redo",
        "situation": "A single assistant request can change a chart, a binding and a file.",
        "task": "Restore the entire edit including the exact bytes of touched files.",
        "action": "Store transaction snapshots with before and after bytes. Remove new files on undo and write original bytes on redo. Include manual edits in order and use hashes to detect outside mutations.",
        "result": "The material and binding disappeared together on undo and returned byte-for-byte on redo. Property tests generated 500 tool sequences per mode and checked invariants and exact undo.",
        "reflection": "Session history has limits of 100 entries and 256 MB. Immediate saves, exports and edits outside snapshots have separate recovery rules."
      },
      {
        "id": "te-external-agent",
        "title": "Serialize external authoring tools with the editor’s own changes",
        "area": "Model Context Protocol",
        "situation": "A second authoring client can write while a built-in assistant or human interaction is active.",
        "task": "Reuse existing validators with bounded waits, cancellation and undo.",
        "action": "Connect a local MCP server and stdio bridge to the tool registry and executor. Return busy or timeout when applicable. Close external undo batches after 30 seconds idle or a project or song change.",
        "result": "Tests cover handshake, busy writes, timeouts, cancellation, batch undo and the bridge process. A separate live editor run returned a screenshot to the client.",
        "reflection": "External clients share authorization and batching. A disconnected request without cancellation waits for its timeout."
      },
      {
        "id": "te-test-game-report",
        "title": "Return a judgment report from the real standalone player",
        "area": "End-to-end test play",
        "situation": "Launching a playtest alone left the caller with no structured evidence of which notes failed.",
        "task": "Run the same executable and verify that the requested chart was judged.",
        "action": "Run the regular Test Game as a process job with song, difficulty and autoplay. Read its report and return status plus missed times and lanes. Check exit status and the selected chart.",
        "result": "A real --test process finished an all-perfect fixture and closed after results. Other tests cover missing difficulties, failed processes and positional miss reports.",
        "reflection": "Autoplay checks wiring and rules. Human difficulty and touch latency require their own evaluation."
      },
      {
        "id": "te-roundtrip",
        "title": "Preserve existing chart fields when saving another difficulty",
        "area": "Lossless serialisation",
        "situation": "Editing Hard and saving could drop offsets, meters or void arcs from other files.",
        "task": "Keep supported chart fields, ordering and valid strings through a full load/save cycle.",
        "action": "Retain offsets, signatures, directions and arc validity. Stable-sort equal times, serialize materials in slot order and parse brackets inside JSON strings correctly. Surface file and parse failures.",
        "result": "Eighteen actual charts passed tolerant comparisons and stable saves. Reverting each fix broke its guard. An S21 follow-up loaded and played eight packaged charts.",
        "reflection": "Some special fields had desktop-only fixtures, including 3/4 timing and bracketed material names."
      },
      {
        "id": "te-numeric-roundtrip",
        "title": "Keep saved beat times bit-exact past 100 seconds",
        "area": "Floating-point round trip",
        "situation": "Short decimal formatting moved beats and note boundaries when the chart reopened.",
        "task": "Round-trip both float and double values with stable text output.",
        "action": "Emit the shortest round-tripping float. Permit that form for a double only when exactly float-representable. Otherwise use the required double precision and accept exponent notation.",
        "result": "Real editor saves cover all four modes with nine-digit values, a next-float case above 1000, and 7200.123 s. Reverting exact formatting fails bitwise checks.",
        "reflection": "Serialization preserves precision already in memory. It cannot recover data rounded during initial entry."
      },
      {
        "id": "te-failed-save",
        "title": "Stop closing or exporting a project after a chart write fails",
        "area": "Atomic writes and error propagation",
        "situation": "A failed write could leave a previous chart on disk while APK export used it as if it were current.",
        "task": "Keep the last good file and surface the failure to the relevant caller.",
        "action": "Write a temporary file and replace atomically. Share the save check with requestClose, Test Game and APK builds for the current project. Retain dirty state and report the failing chart.",
        "result": "Real engine-object tests cover repeated close, export refusal after failure, building a different project, recovery and explicit discard. A clean close writes nothing extra.",
        "reflection": "Filesystem outcome, editor state and caller behaviour all matter. An abnormal exit can log errors but cannot show a useful interactive prompt."
      },
      {
        "id": "te-thumbnail-lifetime",
        "title": "Decode visible thumbnails off-thread and invalidate same-name replacements",
        "area": "Asynchronous assets and cache invalidation",
        "situation": "A full 1920 × 1080 image could stall the editor even in a small card, and same-name replacements left stale textures.",
        "task": "Limit background work and safely replace caches that the next frame will use.",
        "action": "Centralize ThumbCache, process up to four visible items asynchronously, and use 256 px cards or 512 px checks where appropriate. Propagate the actual replaced path to thumbnail, cover and background caches.",
        "result": "All 16 visible slots loaded and synchronization validation was clean. Replacement tests showed the inverted new asset in the title, selection and song editors where before they showed the old image.",
        "reflection": "Test decoding, presentation size and cache consistency separately. Same-name replacement has paired captures."
      },
      {
        "id": "te-win-paths",
        "title": "Open covers and run analysis from a multilingual Windows path",
        "area": "Unicode paths and process boundaries",
        "situation": "Projects in directories with CJK letters, emoji or other non-ASCII characters failed across several Windows subsystems.",
        "task": "Keep the actual pathname across process launch, asset resolution and decoding.",
        "action": "Declare a UTF-8 active code page for supported Windows, retain wide paths for executable and process launch, and strictly validate legacy entry points. Normalize parent and filename separately.",
        "result": "Two real temporary directory sets with CJK, spaces, diacritics, Korean and emoji ran the editor, standalone views and actual audio analysis. Previous launches returned code 1.",
        "reflection": "A test with only a non-ASCII basename misses installation paths and child process arguments. The manifest applies from Windows 10 1903 onward."
      },
      {
        "id": "te-apk-closure",
        "title": "Shrink the APK while restoring a missing referenced material",
        "area": "Dependency closure",
        "situation": "A broad copy inflated APK size and still missed some resources needed on the phone.",
        "task": "Package only the runtime dependency closure of selected songs and screens.",
        "action": "Use runtime loaders to walk titles, songs, charts, textures, particle and sound effects, UI Sets and compiled SPIR-V. Exclude songs with no chart and use one packager from UI, CLI and assistant.",
        "result": "On 5 October the fixed project shrank from 111.9 to 39.5 MB. The audit found 104 used resources, zero unused and zero missing. Eight charts launched on a clean S21 install, including a custom shader.",
        "reflection": "Figure size depends on asset redundancy. The resource audit is specific to this project."
      },
      {
        "id": "te-apk-upgrade",
        "title": "Refresh changed charts after an Android app update",
        "area": "Asset migration and streaming",
        "situation": "The new build could still read data extracted from the old APK.",
        "task": "Update changed and deleted project assets while retaining streamed music.",
        "action": "Publish an APK manifest with content hashes, atomically replace changed files and remove expired items. Stream music through a virtual filesystem directly from the package. Assign unique app IDs per project.",
        "result": "The S21 fixture found 103 entries, extracting 100 files around 2.6 MB and streaming three. Upgrade extracted only three changes. First extraction took about 0.1 s.",
        "reflection": "The manifest establishes versioning, deletion and how resources are read. Extraction duration is only one part of startup."
      },
      {
        "id": "te-ui-set-inheritance",
        "title": "Package the theme an author actually selected",
        "area": "UI Set inheritance",
        "situation": "A customized or inherited UI Set could fall back to the phone default after packaging.",
        "task": "Match the selected project theme and include its small set of dependencies.",
        "action": "Resolve the basedOn chain and overrides with the shared resource loader. Stage only that result and have runtime load it from the manifest.",
        "result": "Fixtures cover Classic with zero extra sets, Retro alone and Pop with overrides. Simulated extraction found all images and fonts. Neon plus six fonts staged at about 1.7 MB.",
        "reflection": "This audit checks staging and simulated extraction. A separate S21 run checked installed behaviour."
      },
      {
        "id": "te-safe-preview",
        "title": "Keep phone previews, controls and the playfield aligned",
        "area": "Device preview and safe areas",
        "situation": "A desktop preview placed controls where a camera cutout, corner or gesture inset could cover them.",
        "task": "Use one fit for rendering and picking while preserving mode-specific aspect ratios.",
        "action": "Separate UI safe area and play area. Share PlayAreaFit between editor, player and input, keep Scan Line’s aspect, centre Circle and pass orientation to standalone Test Game.",
        "result": "Layout tests covered nine profiles, two orientations and 3,240 items. Nine S21 landscape scenes fit the measured safe rectangle and swapped margins under rotation. Scan Line preview corners match hit positions.",
        "reflection": "Being visible and being large enough to tap are different checks. Several compact custom sets needed additional sizing work."
      },
      {
        "id": "te-idle-menus",
        "title": "Stop presenting unchanged Android menus and Pause frames",
        "area": "On-demand rendering",
        "situation": "An idle title, song selection or paused scene could still draw at 120 Hz.",
        "task": "Wait for actual changes while preserving touch response and pending animations.",
        "action": "Block the event loop until input, window state or animation deadline. Skip identical pictures by hash. Let feedback fades request draws and reset the clock on resume.",
        "result": "Classic title and selection each drew zero frames in 20 idle seconds, with 0% GPU and about 0.1% and 0.2% game-thread use. Pause also drew zero, returned to 120 Hz on input and passed 20 returns.",
        "reflection": "This measures idle behaviour. The phone recording did not sample the exact frame of a fading hit during Pause."
      },
      {
        "id": "te-resume-lifetime",
        "title": "Follow the fourth-resume crash after the first texture fix",
        "area": "Vulkan device resource lifetime",
        "situation": "A results cover showed a font atlas after backgrounding. Releasing early textures fixed several views, but Pause still crashed on its fourth return.",
        "task": "Find both old-device resource paths and verify every player view repeatedly.",
        "action": "Release text, covers and view textures before tearing down the device. Trace the remaining QuadBatch::flush failure to vkCmdBindDescriptorSets using an old pool. Clear descriptor caches on recreation.",
        "result": "Title, selection, settings, Pause and Results each ran 20 Home/return cycles. All 100 captures matched their references and the crash log was empty.",
        "reflection": "The second stack trace localized a different cache. An original black screen did not recur, so its detailed cause remains inferred."
      },
      {
        "id": "te-h264",
        "title": "Match native video planes on Android and measure the memory cost",
        "area": "Video decoding and pixel formats",
        "situation": "A desktop H.264 clip could crash on Android when the decoder exposed a different plane layout.",
        "task": "Support native decode and resume with checked format conversion and fallback.",
        "action": "Use MediaCodec byte buffers, validate plane sizes and layout, release hardware buffers promptly and convert YUV with NEON. Compare the first frame to a scalar reference and support controlled software fallback.",
        "result": "On S21, the 720p30 clip showed 30.0 video FPS. A 1080p60 Circle fixture showed 59.3–60.0 video FPS and 119.9 game FPS over three minutes. PSS grew from 137 MB to 249–251 MB.",
        "reflection": "Frame rate and memory can move in opposite directions. Hardware results are from one Exynos S21."
      },
      {
        "id": "te-note-skin-script",
        "title": "Connect authored note skins and scripted transitions to runtime",
        "area": "Note skins and scripted transitions",
        "situation": "Preview and author assets needed consistent slots and bounded transition execution.",
        "task": "Preserve optional materials and make invalid scripts fall back to a working transition.",
        "action": "Map note heads to explicit slots, respect authored material shading and expose a limited Lua drawing API. Set memory, instruction and geometry budgets. Validate on a worker and fall back to fade.",
        "result": "S21 played a custom circle wipe from the real Start button. All four modes showed the test textures and the Drop 3D sample matched desktop. Script tests cover 15 categories of possible blocking calls and budget exhaustion.",
        "reflection": "Assets need explicit missing, loading and failed states. The phone test was 64-bit, and the tested slots did not include the Drop 3D hold body."
      },
      {
        "id": "te-localisation",
        "title": "Keep language preference and glyph coverage within the phone atlas limit",
        "area": "Localisation and font atlases",
        "situation": "System locale, custom project text and large CJK glyph sets could disagree or exhaust texture limits.",
        "task": "Pick a default correctly and keep manual choice, text and layouts working.",
        "action": "Build font fallback chains and glyph sets by language and project. Check placeholders, widths and UI Set strings. Give explicit choice priority over first-run locale and verify Traditional Chinese.",
        "result": "On S21 with zh-Hant-HK, a clean start chose Traditional Chinese. All atlas sides stayed at or below 4096, with Traditional at 4096 × 3684. English persisted after restart. An autoplay run showed 752 Perfects and localized results.",
        "reflection": "Translation, glyph coverage, layout and preference persistence each need a test. This atlas size depends on the project’s text."
      },
      {
        "id": "te-abi",
        "title": "Validate the Android process architecture and display rotation separately",
        "area": "ABI and device compatibility",
        "situation": "Producing two ABIs did not prove both could load textures correctly, and tablets may have a different natural orientation.",
        "task": "Exercise actual 32-bit and 64-bit play and use the surface transform.",
        "action": "Build arm64-v8a and armeabi-v7a, use 64-bit texture identifiers in both, and handle actual surface extents and pre-rotation. Run the S21 in both process modes and rotate natural-landscape tablet emulators.",
        "result": "Both S21 builds ran eight charts at 120 Hz with at least 99.92% on-time presents. Nine parity comparisons differed by at most 0.26%. Android 14 and 16 emulators recorded 180° pre-rotation and accepted touch.",
        "reflection": "A 32-bit process on S21 does not stand in for a low-end device. The Android 17 emulator repeatedly lost its system compositor, leaving that target unverified."
      },
      {
        "id": "te-device-suite",
        "title": "Keep frame pacing failures visible even when all 31 charts launch",
        "area": "Device QA and frame pacing",
        "situation": "A chart can load and average 120 FPS while still producing a visible long frame.",
        "task": "Check setup, whole-chart coverage, pacing, memory and a sustained fixture independently.",
        "action": "Read installed chart metadata, collect actual presents and retain image references. Rerun old-look stalls on a pre-rendering APK and measure a separate fixed 600-second scene.",
        "result": "All 31 charts launched on 28 October at 119.4–120.0 FPS and 99.92–100% on-time intervals. Two legacy Circle frames and one legacy Scan Line startup frame missed at least two vsyncs. Fixed Drop 2D ran 600.9 s at 119.9 FPS with four misses.",
        "reflection": "The old Circle stalls also occurred on the baseline. Their root cause was unmeasured, and an earlier five-song soak is a separate build and workload."
      },
      {
        "id": "te-guide",
        "title": "Detect a tutorial that still refers to an old editor control",
        "area": "Testable authoring documentation",
        "situation": "Frequent editor redesign would leave help text and step anchors stale.",
        "task": "Connect tutorials to real controls and user actions with checks for drift.",
        "action": "Write structured Markdown and bind F1 and contextual help to control anchors. Advance tutorials from editor events. Include a reproducible starter project and omit help from APK export.",
        "result": "The release guide has 12 chapters, 84 topics and 12 tours. GuideTest ran 2,353 checks, and the tutorial checker found every step in all 12 tours.",
        "reflection": "These checks catch broken technical connections. Human onboarding quality needs observation with new users."
      }
    ]
  }
];
window.MGE_SYSTEMS = [
  {
    "id": "rendering",
    "title": "Rendering & materials",
    "summary": "Bind a shader to a note.",
    "capability": "The Vulkan backend batches quads, lines and meshes. Three spatial modes share depth, configurable cameras, stage lighting and baked image-based lighting. Local vertex and surface functions compile inside engine wrappers. The installer checks the source, an isolated compile and the compiled SPIR-V interfaces before replacing the last good program.",
    "validation": "The optional implementation of Brent Burley’s Disney 2012 reflection model was checked against a double-precision CPU reference. Absolute error stayed below 4 × 10⁻⁶ across 1,296 inputs. The table describes the spatial profiles. Disney-based author programs can run at either mobile tier. Forcing the full desktop scattering pass on the S21 took 3.7–4.5 times the GPU work; the shipped mobile material keeps thin-surface backlighting.",
    "limit": "Scan Line uses flat shapes and a fixed camera at both phone tiers. The probe-grid GI prototype missed its 25% error threshold against a path-traced reference (38–44%). The rectangular area-light fit also missed its threshold at grazing angles. Both remain experiments.",
    "tiers": [
      {
        "feature": "Local stage lights",
        "desktop": "Up to 16",
        "standard": "Key light only",
        "high": "Up to 8"
      },
      {
        "feature": "Directional shadows",
        "desktop": "2048² map",
        "standard": "Planar",
        "high": "1024² map"
      },
      {
        "feature": "Disney standard materials",
        "desktop": "Opt-in Disney BRDF",
        "standard": "Standard shading",
        "high": "Opt-in Disney BRDF"
      },
      {
        "feature": "Bloom",
        "desktop": "Per song",
        "standard": "Off",
        "high": "Per song"
      },
      {
        "feature": "Glass",
        "desktop": "Opaque scene snapshot",
        "standard": "Translucency",
        "high": "Half-resolution snapshot"
      },
      {
        "feature": "Scattering",
        "desktop": "Screen-space spread + backlight",
        "standard": "Backlight",
        "high": "Backlight"
      },
      {
        "feature": "Emissive proxies",
        "desktop": "Up to 8",
        "standard": "Off",
        "high": "Up to 4"
      }
    ]
  },
  {
    "id": "resources",
    "title": "Resources & serialisation",
    "summary": "Keep chart timing intact across saves.",
    "capability": "The loader translates versioned JSON and legacy formats including AFF and XML into common chart data. Projects resolve music, still images, GIFs, video, materials and their assets by reference. Because saving a song can rewrite all its difficulties, the writer preserves offsets, timing signatures, flick directions, void arcs and exact note times. A completed temporary file replaces the previous chart.",
    "validation": "ChartRoundtripTest reloads exported charts, checks field and ordering preservation and exercises the failed-write path. Deliberately reverting the guards for offset, void arcs, ordering and other fields made their matching checks fail.",
    "limit": "The round-trip evidence covers the supported unified-chart fields. Each legacy importer has its own format rules. Song audio supports Ogg Vorbis; the importer rejects Ogg Opus."
  },
  {
    "id": "core",
    "title": "Core runtime",
    "summary": "Share chart time and player views.",
    "capability": "The core supplies an entity registry, hierarchical transforms and a game clock. The update loop advances song time, resolves input and judgments, then updates the active mode. The Windows editor launches a separate test player. Android has its own lifecycle and audio-output timing, while both players use the same chart offset convention and player-screen views.",
    "validation": "A desktop/phone HUD comparison exposed a 0.44% changed-pixel rate in one Drop 2D capture. Holding shader time on both platforms reduced that scene’s measured difference to 0.00%.",
    "limit": "The shared clock converts coordinates in time. On the S21, AAudio reported 24.2 ms of output latency where the buffer-size estimate gave 32.0 ms. The phone runtime smooths that estimate during playback."
  },
  {
    "id": "input",
    "title": "Input & gestures",
    "summary": "Judge each touch at its event time.",
    "capability": "A recogniser tracks each finger separately. Density-scaled movement thresholds and geometry-aware picking map a touch to the drawn playfield. Android replays coalesced motion samples and maps each event’s monotonic timestamp to song time. A tap can register at touch-down; a flick requires a swipe.",
    "validation": "TurnCameraTest presses 10 ms early and releases 200 ms later. The tap receives exactly one Perfect at touch-down. Other checks cover perspective lane picking and tracking a turning hold on the disk.",
    "limit": "Input-time correction is bounded to 250 ms before and 100 ms after the clock sync. The archived S21 rendering sweep used autoplay; the touch-down result above comes from a controlled input test."
  },
  {
    "id": "gameplay",
    "title": "Gameplay & feedback",
    "summary": "Score hold heads, path ticks and releases.",
    "capability": "A hit updates judgment, score and combo. A hold produces a head, timed samples along its lane path and a release. Missing the head also accounts for the remaining samples and tail. Calibration shifts judgment and the displayed notes together. Per-song slots bind bursts, tap sounds and sustain loops to these events.",
    "validation": "With a +0.2 s offset, the Scan Line slide test scores each on-path tick once at its adjusted time. Moving the finger off the path misses the tick. On-device particle captures also compare feedback across the four modes.",
    "limit": "The eight particle packs and five sound kits are configurable defaults. The 121 CC0 sounds include Kenney samples and in-house synthesis; the credits identify their origins."
  },
  {
    "id": "modes",
    "title": "Game modes",
    "summary": "Four playfields share one mode interface.",
    "capability": "The factory chooses Drop 2D, Drop 3D, Circle or Scan Line from the authored game-mode configuration. Each mode receives the chart and renderer and owns the mapping between chart events, drawn geometry and hit locations. The drop modes and Circle use spatial surfaces; Scan Line draws a fixed-camera 2D page.",
    "validation": "The capture matrix exercises every playable mode and compares new-look input anchors with legacy references. Separate checks cover the Drop 3D ground/sky split, Circle picking and Scan Line page timing and slides.",
    "limit": "The editor exposes these four modes. The legacy Phigros chart reader and renderer code are outside that playable selection."
  },
  {
    "id": "editor",
    "title": "Editor & authoring",
    "summary": "Turn beat suggestions into editable charts.",
    "capability": "Project Hub, Start Screen, Music Selection, Song Editor, Player Settings and UI Set cover game authoring. Beat analysis suggests markers for three difficulties. Authors can place notes automatically, edit the waveform timeline, audit a chart and restyle from a reference. Scene controls edit the camera and lights and inspect the saved material on its actual note. The toolset also covers five player languages, UI themes and an in-editor guide.",
    "validation": "One agent test creates a material and assigns it in the same turn. Undo removes the new file and the binding; redo restores the saved bytes and binding. Manual edits, Copilot turns and external MCP tool batches enter one ordered history.",
    "limit": "Undo covers chart, song-list and title edits in the supported pages during the session. UI-set changes save immediately, and APK export writes a file. Style transfer operates on eligible notes in the spatial modes."
  },
  {
    "id": "android",
    "title": "Android delivery & QA",
    "summary": "Package the resources reached from each song.",
    "capability": "The packager follows title, song, chart and material references through textures, compiled shader programs, particle effects, sounds and the UI set. Android reads the manifest and streams music. The editor can preview a device’s cutout and safe areas. Idle player menus draw on demand. In one packaging fixture the APK fell from 111.9 to 39.5 MB, with 104 resources used and none missing.",
    "validation": "On 28 October 2026, the S21 exercised 31/31 charts with autoplay at 120 Hz. A separate fixed Drop 2D Stage scene ran for 600.9 s at Standard, averaging 119.9 FPS with four missed vsyncs. The lifecycle check restored all five screens across 100 returns.",
    "limit": "The chart sweep recorded two long frames in legacy Circle and one at legacy Scan Line startup. These device results describe one Galaxy S21, its test charts and the recorded graphics tiers."
  }
];
window.MGE_MODES = [
  {
    "id": "drop2d",
    "title": "Drop 2D",
    "authoring": "Draw a hold on the timeline, cross into the next lane, then drag its two transition handles to set the turn duration and end.",
    "input": "Hit the lane at the judgment line. During a hold, sampled ticks check whether the finger is in the lane reached by the authored path.",
    "rendering": "The spatial profile emits track strips, note slabs and hold ribbons. Distance coordinates make an authored pattern follow the bends."
  },
  {
    "id": "drop3d",
    "title": "Drop 3D",
    "authoring": "Place ground notes on lanes. In the sky region, chain arc waypoints, set their heights and easing, then attach ArcTaps at chosen times.",
    "input": "Ground presses select lanes. For an arc, the engine accumulates coverage as a finger traces it through the judgment gate. Sky taps have their own positional hit test.",
    "rendering": "The new profile builds capped six-sided arc tubes on rotation-minimising frames. ArcTap boxes share the same path coordinates in the perspective scene."
  },
  {
    "id": "circle",
    "title": "Circle",
    "authoring": "Place notes around 3–36 lanes and keyframe the disk’s rotation, scale and translation. The editor hatches off-screen lane intervals for disks with up to 32 lanes.",
    "input": "Tap the tile as it reaches the ring, swipe a flick or follow a hold as it changes lane. A wide hold accepts any lane it covers at that sample.",
    "rendering": "Rings, sector-shaped tiles and fading hold ribbons are built in disk coordinates. One disk transform carries those shapes through the song’s motion."
  },
  {
    "id": "scanline",
    "title": "Scan Line",
    "authoring": "Each page represents one sweep. The author places notes directly on the page, sets a speed override and can extend a hold or slide across page boundaries.",
    "input": "Tap when the line crosses a note, hold through its duration, or follow a slide’s path. Screen touches are mapped to the camera’s playfield coordinates.",
    "rendering": "A fixed camera draws flat shapes in order. The runtime and editor build the same tempo/page schedule; legacy free-form speed-keyframe charts retain a separate phase model."
  }
];
window.MGE_LABELS = {};
