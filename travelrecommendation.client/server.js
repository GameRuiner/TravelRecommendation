"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var promises_1 = require("fs/promises");
var path_1 = require("path");
var express_1 = require("express");
var compression_1 = require("compression");
var serve_static_1 = require("serve-static");
var vite_1 = require("vite");
var url_1 = require("url");
var isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = (0, path_1.dirname)(__filename);
var resolve = function (p) { return path_1.default.resolve(__dirname, p); };
var getStyleSheets = function () { return __awaiter(void 0, void 0, void 0, function () {
    var assetpath, files, cssAssets, allContent, _i, cssAssets_1, asset, content, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                assetpath = resolve("public");
                return [4 /*yield*/, promises_1.default.readdir(assetpath)];
            case 1:
                files = _b.sent();
                cssAssets = files.filter(function (l) { return l.endsWith(".css"); });
                allContent = [];
                _i = 0, cssAssets_1 = cssAssets;
                _b.label = 2;
            case 2:
                if (!(_i < cssAssets_1.length)) return [3 /*break*/, 5];
                asset = cssAssets_1[_i];
                return [4 /*yield*/, promises_1.default.readFile(path_1.default.join(assetpath, asset), "utf-8")];
            case 3:
                content = _b.sent();
                allContent.push("<style type=\"text/css\">".concat(content, "</style>"));
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, allContent.join("\n")];
            case 6:
                _a = _b.sent();
                return [2 /*return*/, ""];
            case 7: return [2 /*return*/];
        }
    });
}); };
function createServer() {
    return __awaiter(this, arguments, void 0, function (isProd) {
        var app, vite, assetsDir, requestHandler, stylesheets, baseTemplate, productionBuildPath, devBuildPath, buildModule, render, port;
        var _this = this;
        if (isProd === void 0) { isProd = process.env.NODE_ENV === "production"; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = (0, express_1.default)();
                    return [4 /*yield*/, (0, vite_1.createServer)({
                            server: { middlewareMode: true },
                            appType: "custom",
                            logLevel: isTest ? "error" : "info",
                            root: isProd ? "dist" : "",
                            optimizeDeps: { include: [] },
                        })];
                case 1:
                    vite = _a.sent();
                    // use vite's connect instance as middleware
                    // if you use your own express router (express.Router()), you should use router.use
                    app.use(vite.middlewares);
                    assetsDir = resolve("public");
                    requestHandler = express_1.default.static(assetsDir);
                    app.use(requestHandler);
                    app.use("/public", requestHandler);
                    if (isProd) {
                        app.use((0, compression_1.default)());
                        app.use((0, serve_static_1.default)(resolve("client"), {
                            index: false,
                        }));
                    }
                    stylesheets = getStyleSheets();
                    return [4 /*yield*/, promises_1.default.readFile(isProd ? resolve("client/index.html") : resolve("index.html"), "utf-8")];
                case 2:
                    baseTemplate = _a.sent();
                    productionBuildPath = path_1.default.join(__dirname, "./server/entry-server.js");
                    devBuildPath = path_1.default.join(__dirname, "./src/client/entry-server.tsx");
                    buildModule = isProd ? productionBuildPath : devBuildPath;
                    return [4 /*yield*/, vite.ssrLoadModule(buildModule)];
                case 3:
                    render = (_a.sent()).render;
                    app.use("*", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                        var url, template, appHtml, cssAssets, html, e_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    url = req.originalUrl;
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 5, , 6]);
                                    return [4 /*yield*/, vite.transformIndexHtml(url, baseTemplate)];
                                case 2:
                                    template = _a.sent();
                                    return [4 /*yield*/, render(url)];
                                case 3:
                                    appHtml = _a.sent();
                                    return [4 /*yield*/, stylesheets];
                                case 4:
                                    cssAssets = _a.sent();
                                    html = template.replace("<!--app-html-->", appHtml).replace("<!--head-->", cssAssets);
                                    // 6. Send the rendered HTML back.
                                    res.status(200).set({ "Content-Type": "text/html" }).end(html);
                                    return [3 /*break*/, 6];
                                case 5:
                                    e_1 = _a.sent();
                                    !isProd && vite.ssrFixStacktrace(e_1);
                                    console.log(e_1.stack);
                                    // If an error is caught, let Vite fix the stack trace so it maps back to
                                    // your actual source code.
                                    vite.ssrFixStacktrace(e_1);
                                    next(e_1);
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); });
                    port = process.env.PORT || 7456;
                    app.listen(Number(port), "0.0.0.0", function () {
                        console.log("App is listening on http://localhost:".concat(port));
                    });
                    return [2 /*return*/];
            }
        });
    });
}
createServer();
