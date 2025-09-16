import { readFileSync, existsSync, mkdirSync } from "node:fs";

// load first file that exists
const optionsFile = ["./options-dev.json", "/data/options.json"].find(
  existsSync,
);
if (!optionsFile) {
  console.error(
    "No options file found. Please copy options-dev.json.sample to options-dev.json",
  );
  process.exit(1);
}
export const isAddOn = optionsFile === "/data/options.json";
const options = JSON.parse(readFileSync(optionsFile));

export const hassUrl = options.home_assistant_url;
export const hassToken = options.access_token;
export const debug = false;

export const chromiumExecutable = isAddOn ? "/usr/bin/chromium" : (options.chromium_executable || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome");

export const keepBrowserOpen = options.keep_browser_open || false;


export const dashboard_urls = options.dashboard_urls

export const screenshots_folder = "tmp/screenshot/";
if (!existsSync(screenshots_folder)){
    mkdirSync(screenshots_folder);
}

console.warn(`hassUrl : ${hassUrl}`);
console.warn(`dashboard_urls : ${dashboard_urls}`);
console.warn(`keepBrowserOpen 1 : ${keepBrowserOpen}`);

if (!hassToken) {
  console.error("No access token found. Please configure the access token");
  process.exit(1);
}

