import { RequestExtension, ResponseExtension } from "@view-models/extension";
import { NextFunction } from "express";
import * as luxon from "luxon";
import { checker } from "@utilities";
import { formatter } from "@utilities/format";


/**
 * 
 */
export const listQueryHandlerMiddleware = async (req: RequestExtension, res: ResponseExtension, next: NextFunction) => {
    req.listQuery = {
        pageSize: formatter.tryToParseFloat(req.query.pageSize, 10),
        pageIndex: formatter.tryToParseFloat(req.query.pageIndex, 1),
        dateStart: formatter.tryParseToDate(req.query.dateStart, null),
        dateEnd: formatter.tryParseToDate(req.query.dateEnd, null),
        desc: req.query.desc == "1",
        orderField: req.query.orderField
    }

    next();
}
