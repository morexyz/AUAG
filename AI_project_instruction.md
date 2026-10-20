# AUAG — AI Project Instruction

Project: AUAG / آئواژ, a narrowly scoped rebrand of the supplied interactive web-presentation source. Existing product logic and architecture are intentionally preserved.

## Status

- Deliverable: narrative scroll-led website + separately routed experimental visualization studio.
- Customer-facing copy adapted from the supplied 15-section AUAG narrative; no confidential trading algorithm is disclosed.
- English-first and Persian/RTL supported. Functional controls and major narrative copy are translated.
- Vanilla JavaScript, native ES Modules, no third-party packages, build step not required for running project.
- The optional `scripts/build_standalone.py` packages a single-file HTML for distribution; it is not required for development/runtime.
- A11y: native buttons, labels, descriptive navigation, keyboard focus, reduced-motion policy, semantically readable HTML without JavaScript.
- Status of financial content: illustrative concept, not live market data, not a wallet connector, no on-chain transactions.

## How to run

```sh
cd AUAG_Experience
python3 -m http.server 8000
# Open http://localhost:8000
node --test tests/*.test.mjs
# Optional, regenerate independently usable HTML:
python3 scripts/build_standalone.py
```

ES Module imports need a static HTTP server in their modular form. The standalone file embeds CSS, modules and Worker script and is intended to open directly in a modern browser.

## Structure and responsibilities

```
index.html                      static semantic source; accessible without JS
assets/css/tokens.css           palettes, utilities, shared controls, direction
assets/css/layout.css           scenes, adaptive layouts and canvas UI
assets/css/motion.css           CSS motion, native scroll-linked enhancement
assets/css/brand.css            pearl/gold/silver reference identity; Persian font fallbacks
assets/img/auag-mark.png       exact supplied brand mark; never redraw casually
src/app.js                      bootstrap, controllers and optional sound
src/config.js                   immutable flags, feature detection, budgets
src/core/router.js              story hashes + lazy-loaded studio route
src/core/scroll.js              IntersectionObserver reveals, RAF batching
src/core/animation.js           RAF tween, easing, WAAPI, timeline, SVG morph
src/core/event-bus.js           minimal pub/sub
src/core/i18n.js                translation state / RTL, original EN fallback
src/i18n/fa.js                  Persian translations
src/features/ratio/             MVC: normalized financial illustration
src/features/journey/           MVC: step data / DOM view / controller
src/features/network/           MVC: network state / UI view / controller
src/features/studio/            isolated Canvas 2D controller / view / renderer
src/workers/field.worker.js     off-main-thread scalar procedural field
scripts/build_standalone.py     optional packaging helper
AUAG_Standalone.html          generated, one-file distribution artifact
tests/project.test.mjs          model, parser, event-bus and translation tests
```

## State & navigation

- Story chapter anchors (`#idea`, `#relationship` etc.) work with JS disabled.
- `#/studio` is a client-side route, dynamic imports studio controller only when the user requests it.
- Non-studio narrative is in HTML from the start for progressive enhancement.
- `createEventBus()` propagates language and optional audio feedback events.
- No route or scene changes modify wallets, transact or request token approvals.

## Motion and experience mapping

1. Gold/silver opening sculpture: supplied AUAG emblem within existing SVG masked/orbital motion. Pointer parallax and interpolated SVG-path morph remain. No WebGL dependency.
2. Editorial scroll narrative: responsive CSS Grid/Flexbox, IntersectionObserver entry transitions; `animation-timeline:view()` for supported browsers with reduced-motion alternative.
3. Ratio lab: MVC normalized equal-value exposures; changing assumed SLV relative value changes percentage weights. It does **not** implement or reveal the actual strategy's formula. The 50/50 target button only shows educational text.
4. Strategy cycle: WAAPI animation sequencer + SVG stroke timeline; user can replay.
5. Wallet flow: SVG point-at-length frame motion, observation pauses outside viewport.
6. Studio: dynamic import; Canvas 2D particles and procedural flow; Worker-generated noise grid; pointer pressure, tilt, multi-touch. Off by default until studio route activated.
7. Audio feedback: native Web Audio, user opt-in, bounded sound; off by default.
8. Concept dashboard & network flow: user-controlled tabs; no external data.

### Performance defaults

- `maxCanvasDpr=1.65`, `maxParticles=220`, `studioFps=50`, `workerIntervalMs=130`.
- Canvas paused when leaving studio, Worker instantiated only after navigating there.
- Avoid forced layouts in continuous frame loops, batch scroll writes in RAF, animate `transform` and `opacity` where possible.
- Recalculate procedural field on Worker; sensible fallback if Worker unsupported.
- `prefers-reduced-motion` disables continuous decorative scene animation and reveals static content.

### Feature flags

Edit `src/config.js` `features` (studio, worker, audio, pointer, svgMorph, scrollMotion). Capability detection must always accompany flags. Note: the CSS native scroll animation is guarded with `@supports` and reduced-motion media query; any future complete disable via `scrollMotion` should additionally set a root CSS class.

### Integration and extension guidelines

- New interactive feature: create `src/features/<name>/{model,view,controller}.js`, put pure calculations in Model, DOM in View, events/lifecycle in Controller.
- Keep initial HTML semantically complete; use native anchor links as baseline and hash routes only for rich optional tools.
- Add expensive modules behind `import()` and activate on explicit navigation/visibility; provide static fallback.
- SVG: keep shapes/masks in SVG, animate path only where command structures are compatible, ensure reduced-motion counterpart.
- Canvas: scale by bounded DPR, resize based on parent, stop RAF and terminate Worker on unmount, never use Canvas for essential copy.
- Worker: send typed transferable arrays for heavy fields; terminate after use; build a safe main-thread fallback.
- Pointer: use `PointerEvent`, pressure/tilt only when available; set `touch-action` exclusively inside gesture canvases.
- Scroll: avoid persistent RAF when passive/observer-driven updates suffice; prefer viewport observers.
- Audio: require explicit user action; no auto-playing on load, support disabling.
- Use manual browser testing for visual quality. No external dependencies.

## Financial and accuracy guardrails

- GLD/SLV in this narrative are Robinhood Stock Tokens linked to ETF securities, **not** ownership of physical metals or ETF shares.
- Robinhood Chain / Uniswap availability does not confirm a particular GLD/SLV pool, execution liquidity, or product deployment.
- This project must not claim a deployed AUAG contract, a live trading strategy, current wallet integration, independent audit, or financial returns.
- Don't silently turn the illustrative normalized 50/50 lab into strategy execution logic.
- User-provided content defines copy, but official issuer materials must be reviewed before a public launch.
- Official references: https://docs.robinhood.com/chain/stock-tokens/ and https://blog.uniswap.org/robinhood-chain-is-live

## Decisions and caveats

- A presentation is a **scroll-driven web experience**, not an enforced slide deck.
- Persian localization is intentionally native RTL; diagrams/numeric charts keep LTR numeric orientation where appropriate.
- The studio uses stylized directional flow; this is **not** a computational fluid-dynamics solver.
- Current AUAG visual changes have **not** been browser-verified in this execution environment because Chromium blocks local HTTP, file and data navigations. Run desktop/mobile visual and interaction checks before release.
- Test modules with `node --test`. Browser-level testing is additionally recommended before production release.
- Preserve separation between AUAG and any unrelated product; do not reuse another product's brand, token network, or strategy code.
- Brand identity supplied by the user: Latin name AUAG, Persian name آئواژ, exact uploaded emblem, pearl white / electrum gold / liquid silver / graphite / warm gray. Do not insert implementation technology labels into customer-facing copy.
- Persian uses Vazirmatn through optional web-font loading, with Arabic-capable local fallbacks; the app works without the font service.
