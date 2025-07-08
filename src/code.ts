function doGet(
  e: GoogleAppsScript.Events.DoGet,
): GoogleAppsScript.HTML.HtmlOutput {
  console.log("doGet called with parameters:", e.parameters);
  return HtmlService.createHtmlOutputFromFile("index").setTitle("My TS WebApp");
}

function getMessageFromServer(): string {
  return `Hi from the server! The current time is ${new Date().toLocaleTimeString()}.`;
}
