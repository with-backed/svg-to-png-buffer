import Chromium from "chrome-aws-lambda";
import { VercelRequest, VercelResponse } from "@vercel/node";
import nodeHtmlToImage from "node-html-to-image";

export default async function (req: VercelRequest, res: VercelResponse) {
  if (req.method != "POST") {
    res.status(405).send("Only POST requests allowed");
    return;
  }

  console.log("we here");

  try {
    const { svg } = req.body;
    console.log({ svg });
    const pngBuffer = (await nodeHtmlToImage({
      html: `<html><body><img src="${svg}" width="100%" height="auto" /></body></html>`,
      quality: 100,
      type: "png",
      puppeteerArgs: {
        args: [...Chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: Chromium.defaultViewport,
        executablePath: await Chromium.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
      },
      encoding: "base64",
    })) as string;
    console.log({ pngBuffer });

    res.status(200).json({ pngBuffer });
  } catch (e) {
    res.status(404);
  }
}
