import { createRouter } from "@tanstack/react-router";
import { homeRoute, loginRoute } from "./public-routes";
import { privateLayoutRoute, publicLayoutRoute, rootRoute } from "./routeTree";
import {
	extensionRoute,
	historyRoute,
	mainRoute,
	methodRoute,
	profileRoute,
	taskRoute,
} from "./private-routes";
import { NotFound } from "@pages/not-found";

const routeTree = rootRoute.addChildren([
	publicLayoutRoute.addChildren([homeRoute, loginRoute]),
	privateLayoutRoute.addChildren([
		mainRoute,
		historyRoute,
		profileRoute,
		extensionRoute,
		methodRoute,
		taskRoute,
	]),
]);

export const router = createRouter({
	routeTree,
	defaultErrorComponent: NotFound,
	defaultNotFoundComponent: NotFound,
});
