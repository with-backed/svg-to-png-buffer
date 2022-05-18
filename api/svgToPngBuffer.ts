import puppeteer from "puppeteer-core";
import chrome from "chrome-aws-lambda";
import { VercelRequest, VercelResponse } from "@vercel/node";
import nodeHtmlToImage from "node-html-to-image";

const UNI_V3_ADDRESS = "0xc36442b4a4522e871399cd717abdd847ab11fe88";

export default async function (req: VercelRequest, res: VercelResponse) {
  if (req.method != "POST") {
    res.status(405).send("Only POST requests allowed");
    return;
  }

  try {
    const { svg, contractAddress } = req.body as {
      svg: string;
      contractAddress: string;
    };

    let html: string = "";
    if (contractAddress.toLowerCase() === UNI_V3_ADDRESS) {
      html = `<img src="${svg}" height="100%" width="auto" />`;
    } else {
      html = `<html><body><img src="${svg}" width="100%" height="auto" /></body></html>`;
    }

    const pngBuffer = (await nodeHtmlToImage({
      html,
      type: "png",
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
