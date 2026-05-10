import { createRoute } from "@tanstack/react-router";
import { publicLayoutRoute } from "./routeTree";
import { Home } from "@pages/home";
import { Login } from "@pages/login";

export const homeRoute = createRoute({
	getParentRoute: () => publicLayoutRoute,
	path: "/home",
	component: Home,
});

export const loginRoute = createRoute({
	getParentRoute: () => publicLayoutRoute,
	path: "/login",
	component: Login,
});
