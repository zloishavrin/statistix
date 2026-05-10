import { createRoute } from "@tanstack/react-router";
import { privateLayoutRoute } from "./routeTree";
import { Profile } from "../../pages/profile";
import { Main } from "@pages/main";
import { Extension } from "@pages/extension";
import { Method } from "@pages/method";
import { History } from "@pages/history";
import { Task } from "@pages/task";

export const mainRoute = createRoute({
	getParentRoute: () => privateLayoutRoute,
	path: "/",
	component: Main,
});

export const historyRoute = createRoute({
	getParentRoute: () => privateLayoutRoute,
	path: "/history",
	component: History,
});

export const profileRoute = createRoute({
	getParentRoute: () => privateLayoutRoute,
	path: "/profile",
	component: Profile,
});

export const extensionRoute = createRoute({
	getParentRoute: () => privateLayoutRoute,
	path: "/extension/$id",
	component: Extension,
});

export const methodRoute = createRoute({
	getParentRoute: () => privateLayoutRoute,
	path: "/method/$extensionId/$methodId",
	component: Method,
});

export const taskRoute = createRoute({
	getParentRoute: () => privateLayoutRoute,
	path: "/task/$id",
	component: Task,
});
