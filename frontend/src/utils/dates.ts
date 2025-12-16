export const formatDate = (date: Date) =>
	date.toLocaleString([], {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

export const parseDate = (date: string) => formatDate(new Date(date));
