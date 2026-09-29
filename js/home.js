// home.js: entrance choreography and press feedback for the landing page.
// Uses the vendored Motion build (public/js/motion.js, global `Motion`).

(function () {
	const reduced = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;
	const m = window.Motion;

	// No Motion, or the visitor asked for less motion: drop the pre-animation
	// state and show everything as a plain static page.
	if (!m || reduced || !document.documentElement.classList.contains('anim')) {
		document.documentElement.classList.remove('anim');
		return;
	}

	const { animate, stagger, press, hover } = m;
	// Standard deceleration curve: fast start, long glide out.
	const EASE = [0.22, 1, 0.36, 1];
	const SPRING_IN = { stiffness: 900, damping: 42 };
	const SPRING_OUT = { stiffness: 520, damping: 26, velocity: 2 };

	try {
		// Chrome first, then content, one element at a time.
		animate(
			'.navbar',
			{ opacity: [0, 1], x: [-16, 0] },
			{ duration: 0.45, ease: EASE }
		);

		const intro = { startDelay: 0.12, step: 0.1 };
		animate(
			'[data-anim]',
			{ opacity: [0, 1] },
			{ duration: 0.4, ease: 'linear', delay: stagger(intro.step, intro) }
		);
		animate(
			'[data-anim]',
			{ y: [26, 0] },
			{ duration: 0.85, ease: EASE, delay: stagger(intro.step, intro) }
		);

		// Buttons compress while held, settle back with a touch of life on release.
		press('.btn', element => {
			animate(element, { scale: 0.96 }, SPRING_IN);
			return () => animate(element, { scale: 1 }, SPRING_OUT);
		});

		// The arrow leans forward on hover, falls back on leave.
		hover('.btn-hero', element => {
			const arrow = element.querySelector('.btn-arrow');
			if (!arrow) return;
			animate(arrow, { x: 4 }, SPRING_OUT);
			return () => animate(arrow, { x: 0 }, SPRING_OUT);
		});
	} catch (err) {
		// Anything went wrong: kill the pre-animation state so the page stays visible.
		document.documentElement.classList.remove('anim');
	}
})();
