import { createRootRoute, createRoute } from "@tanstack/react-router";
import { PublicLayout } from "../layouts/public";
import { PrivateLayout } from "../layouts/private";

export const rootRoute = createRootRoute();

export const publicLayoutRoute = createRoute({
	getParentRoute: () => rootRoute,
	id: "public-layout",
	component: PublicLayout,
});

export const privateLayoutRoute = createRoute({
	getParentRoute: () => rootRoute,
	id: "private-layout",
	component: PrivateLayout,
});
