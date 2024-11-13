import type { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import path, { dirname } from "path";
import express from "express";
import compression from "compression";
import serveStatic from "serve-static";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import serverless from "serverless-http";
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const resolve = (p: string) => path.resolve(__dirname, "../..", p);

const getStyleSheets = async () => {
    try {
        const assetpath = resolve("public");
        const files = await fs.readdir(assetpath);
        const cssAssets = files.filter(l => l.endsWith(".css"));
        const allContent = [];
        for (const asset of cssAssets) {
            const content = await fs.readFile(path.join(assetpath, asset), "utf-8");
            allContent.push(`<style type="text/css">${content}</style>`);
        }
        return allContent.join("\n");
    } catch {
        return "";
    }
};

const app = express();
const isProd = process.env.NODE_ENV === "production";

async function setupServer() {
    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "custom",
        root: isProd ? "dist" : "",
    });

    app.use(vite.middlewares);

    const assetsDir = resolve("public");
    const requestHandler = express.static(assetsDir);
    app.use(requestHandler);
    app.use("/public", requestHandler);

    if (isProd) {
        app.use(compression());
        app.use(serveStatic(resolve("client"), { index: false }));
    }

    const stylesheets = getStyleSheets();

    const baseTemplate = await fs.readFile(isProd ? resolve("client/index.html") : resolve("index.html"), "utf-8");
    const buildModule = isProd ? path.join(__dirname, "./server/entry-server.js") : path.join(__dirname, "./src/client/entry-server.tsx");
    const { render } = await vite.ssrLoadModule(buildModule);

    app.use("*", async (req: Request, res: Response, next: NextFunction) => {
        const url = req.originalUrl;

        try {
            const template = await vite.transformIndexHtml(url, baseTemplate);
            const appHtml = await render(url);
            const cssAssets = await stylesheets;

            const html = template.replace(`<!--app-html-->`, appHtml).replace(`<!--head-->`, cssAssets);
            res.status(200).set({ "Content-Type": "text/html" }).end(html);
        } catch (e: unknown) {
            if (!isProd && vite.ssrFixStacktrace(e as Error)) {
                console.error((e as Error).stack);
                vite.ssrFixStacktrace(e as Error);
                next(e);
            }
        }
    });
}

setupServer();

export const handler = serverless(app);
