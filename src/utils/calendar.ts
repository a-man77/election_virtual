/**
 * Calendar Utility
 * Generates Google Calendar links for election events.
 */

export const generateGoogleCalendarLink = (title: string, date: string, description: string) => {
  const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
  
  // Parse date (assuming YYYYMMDD format or simple string for now)
  // In production, we would use date-fns to format the date correctly
  // Example: 20261103T070000Z/20261103T200000Z
  
  const eventDate = new Date(date);
  const start = eventDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const end = new Date(eventDate.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  const params = new URLSearchParams({
    text: title,
    dates: `${start}/${end}`,
    details: description,
    sf: "true",
    output: "xml"
  });

  return `${baseUrl}&${params.toString()}`;
};
