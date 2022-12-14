// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { launch } from "puppeteer"
import { Readable } from 'stream';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const browser = await launch()
    const page = await browser.newPage();
    await page.setViewport({
        width: 3000,
        height: 3000,
    })
    await page.goto(`https://menetrendek.shie1bi.hu/render?${(new URLSearchParams(req.query as any)).toString()}`);
    await page.waitForSelector("#done");
    Readable.from(await (await page.$("#renderBox"))?.screenshot({ type: 'jpeg', quality: 90, captureBeyondViewport: true, fromSurface: true }) as Buffer).pipe(res)
}
