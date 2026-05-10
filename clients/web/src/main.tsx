import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./app/routes";
import "./shared/i18n/config";
import "./index.css";
import "./reset.css";
import { ThemeProvider } from "@app/theme";
import { extendedTheme } from "./theme";
import { initializeApi } from "@app/providers/api";

const root = document.getElementById("root");
if (!root) {
	throw new Error("Root element not found");
}

const queryClient = new QueryClient();
initializeApi();

createRoot(root).render(
	<StrictMode>
		<ThemeProvider theme={extendedTheme}>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</ThemeProvider>
	</StrictMode>,
);
