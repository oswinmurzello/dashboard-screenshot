import http from "node:http";
import { Browser } from "./screenshot.js";
import { isAddOn, hassUrl, hassToken, keepBrowserOpen, screenshots_folder } from "./const.js";
import { CannotOpenPageError } from "./error.js";
import { scheduleScreenshots } from "./dashboard-screenshot.js"
import { createReadStream, readFileSync, statSync } from "node:fs";
import {join} from "node:path"

// Maximum number of next requests to keep in memory
const MAX_NEXT_REQUESTS = 100;
const BROWSER_TIMEOUT = 30_000; // Timeout for browser inactivity in milliseconds

class RequestHandler {
  constructor(screenshot_files) {
    this.screenshot_files = screenshot_files;

    // Pending web requests
    this.currentPage = 0;

    // Request counter to identify requests
    this.lastPage = screenshot_files.length;

    this.requestCount = 0
  }

  async handleRequest(request, response) {
    if (request.url === "/favicon.ico") {
      response.statusCode = 404;
      response.end();
      return;
    }

    const requestId = ++this.requestCount;
    console.debug(requestId, "Request", request.url);

    try {
      const requestUrl = new URL(
        request.url,
        // We don't use this, but we need full URL for parsing.
        "http://localhost",
      );

      let changePage = parseInt(requestUrl.searchParams.get("changePage"));
      if (isNaN(changePage)) {
        changePage = 1;
      }

      let format = requestUrl.searchParams.get("format") || "png";
      if (!["png", "jpeg", "webp", "bmp"].includes(format)) {
        format = "png";
      }

      const requiredPage = (this.currentPage + changePage)%this.lastPage;
      const file = join(screenshots_folder, requiredPage+"."+format);
      const image = readFileSync(file);
      const stats = statSync(file);
      console.debug(requestId, "respond with ", file);

      // If eink processing happened, the format could be png or bmp
      const responseFormat = format;
      let contentType;
      if (responseFormat === "jpeg") {
        contentType = "image/jpeg";
      } else if (responseFormat === "webp") {
        contentType = "image/webp";
      } else if (responseFormat === "bmp") {
        contentType = "image/bmp";
      } else {
        contentType = "image/png";
      }

      // Pipe the file stream to the HTTP response stream.

      response.writeHead(200, {
        "Content-Type": contentType,
        "page": requiredPage,
        'Content-Length': stats.size
      });
      // readStream.pipe(response);
      response.write(image);
      response.end();
    } catch (err) {
        console.error(requestId, "Error in request. ", err);
        response.statusCode = 404;
        response.end();
    }
    finally {
    }
  }

}

const screenshot_files = scheduleScreenshots()
const requestHandler = new RequestHandler(screenshot_files);
const port = 10000;
const server = http.createServer((request, response) =>
  requestHandler.handleRequest(request, response),
);
server.listen(port);
const now = new Date();
const serverUrl = isAddOn
  ? `http://homeassistant.local:${port}`
  : `http://localhost:${port}`;
console.log(
  `[${now.toLocaleTimeString()}] Visit server at ${serverUrl}/lovelace/0?viewport=1000x1000`,
);
