import { Request, Response, NextFunction } from 'express';

export function wrappedResponse(req: Request, res: Response, next: NextFunction): void {
    res.success = function (data: any, meta: Record<string, any> = {}) {
        res.status(200).json({ success: true, data, meta });
    };

    res.fail = function (message: string, status = 400) {
        res.status(status).json({ success: false, error: message });
    };

    next();
}

declare global {
    namespace Express {
        interface Response {
            success: (data: any, meta?: Record<string, any>) => void;
            fail: (message: string, status?: number) => void;
        }
    }
}
