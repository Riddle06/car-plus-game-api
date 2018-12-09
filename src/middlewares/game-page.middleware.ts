import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { NextFunction } from "express";
import { checker } from "@utilities";


/**
 * 檢查有沒有 螢幕寬度Cookie
 */
export const gamePageMiddleware = async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
  const windowWidth = req.cookies.windowWidth;
  if (checker.isNullOrUndefinedOrWhiteSpace(windowWidth)) {
    res.redirect('/tutorial');
    return;
  } else {
    const scale = +windowWidth / 640;
    req._scale = scale < 0 || !scale ? 1 : scale;
    next();
  }
}