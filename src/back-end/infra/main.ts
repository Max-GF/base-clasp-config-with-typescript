function doGet(
  e: GoogleAppsScript.Events.DoGet,
): GoogleAppsScript.HTML.HtmlOutput {
  console.log("doGet called with parameters:", e.parameters);
  return HtmlService.createHtmlOutputFromFile("index").setTitle("My TS WebApp");
}

// Google AppScripts Base Functions
globalThis.doGet = doGet;
