import { useGetFileMutation } from "@entities/file";
import type { UseDataPreviewProps, DataPreviewMode } from "../types";
import { useRef, useState } from "react";

export const useDataPreview = ({
	fileId,
	defaultMode,
}: UseDataPreviewProps) => {
	const [mode, setMode] = useState<DataPreviewMode>(defaultMode);
	const contentContainerRef = useRef<HTMLDivElement>(null);

	const { mutateAsync: getFileUrl } = useGetFileMutation();
	const [isDownloading, setIsDownloading] = useState<boolean>(false);

	const handleDownload = async () => {
		if (mode === "table") {
			downloadTable();
		} else {
			downloadScreenshot();
		}
	};

	const downloadScreenshot = async () => {
		setIsDownloading(true);
		try {
			const element = contentContainerRef.current;
			if (!element) throw new Error();

			const svg = element.querySelector('svg[role="application"]');
			if (!svg) throw new Error();

			const serializer = new XMLSerializer();
			const source = serializer.serializeToString(svg);

			const blob = new Blob([source], {
				type: "image/svg+xml;charset=utf-8",
			});

			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "chart.svg";
			link.click();

			URL.revokeObjectURL(url);
		} finally {
			setIsDownloading(false);
		}
	};

	const downloadTable = async () => {
		setIsDownloading(true);
		try {
			const blobData = await getFileUrl(fileId);
			const url = URL.createObjectURL(blobData);

			const link = document.createElement("a");
			link.href = url;
			link.download = "table.csv";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} finally {
			setIsDownloading(false);
		}
	};

	return {
		mode,
		setMode,
		isDownloading,
		handleDownload,
		contentContainerRef,
	};
};
