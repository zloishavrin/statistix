import { useLayoutEffect, useRef, useState } from "react";

export const useLineCount = <T extends HTMLElement>() => {
	const ref = useRef<T | null>(null);
	const [lines, setLines] = useState(1);

	useLayoutEffect(() => {
		const el = ref.current;
		if (!el) return;

		const compute = () => {
			const style = window.getComputedStyle(el);
			const lineHeight = parseFloat(style.lineHeight);
			const height = el.getBoundingClientRect().height;

			setLines(Math.round(height / lineHeight));
		};

		compute();

		const ro = new ResizeObserver(compute);
		ro.observe(el);

		return () => ro.disconnect();
	}, []);

	return { ref, lines };
};
