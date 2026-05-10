import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { Ripple, UseRippleProps } from "../types";

let rippleIdCounter = 0;

export const useRipple = ({ duration }: UseRippleProps) => {
	const [ripples, setRipples] = useState<Ripple[]>([]);
	const containerRef = useRef<HTMLDivElement>(null);

	const animationRefs = useRef<Map<string, number>>(new Map());

	const handleRipple = (event: MouseEvent<HTMLDivElement>) => {
		if (!containerRef || !containerRef.current) return;

		const rect = containerRef.current.getBoundingClientRect();
		const size = Math.max(rect.width, rect.height);
		const x = event.clientX - rect.left - size / 2;
		const y = event.clientY - rect.top - size / 2;

		const id = `ripple-${rippleIdCounter++}-${new Date().getTime().toString()}`;

		const newRipple = {
			x,
			y,
			size,
			id,
		};

		setRipples((prev) => [...prev, newRipple]);

		const startTime = performance.now();

		const animate = (now: number) => {
			const elapsed = now - startTime;

			if (elapsed >= duration) {
				setRipples((prev) => prev.filter((r) => r.id !== id));
				animationRefs.current.delete(id);
				return;
			}

			const rafId = requestAnimationFrame(animate);
			animationRefs.current.set(id, rafId);
		};

		const rafId = requestAnimationFrame(animate);
		animationRefs.current.set(id, rafId);
	};

	useEffect(() => {
		const animations = animationRefs.current;

		return () => {
			animations.forEach((rafId) => cancelAnimationFrame(rafId));
			animations.clear();
		};
	}, []);

	return {
		rippleContainerRef: containerRef,
		ripples,
		handleRipple,
	};
};
