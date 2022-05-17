import puppeteer from "puppeteer-core";
import chrome from "chrome-aws-lambda";
import { VercelRequest, VercelResponse } from "@vercel/node";
import nodeHtmlToImage from "node-html-to-image";

export default async function (req: VercelRequest, res: VercelResponse) {
  if (req.method != "POST") {
    res.status(405).send("Only POST requests allowed");
    return;
  }

  try {
    const { svg } = req.body;

    const pngBuffer = (await nodeHtmlToImage({
      html: `<img src="${svg}" />`,
      quality: 10,
      type: "jpeg",
      puppeteerArgs: {
        args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chrome.defaultViewport,
        executablePath: await chrome.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
      },
      encoding: "base64",
    })) as string;

    res.status(200).json({ pngBuffer });
  } catch (e) {
    res.status(404);
  }
}
