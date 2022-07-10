import { NextFunction, Request, Response } from 'express'

/**
 * @description globalErrorHandler for express app
 * @param err error object
 * @param req express request object
 * @param res express response object
 * @param next express next function
 * @returns void
 */
export const errorHandler = (err: {
    stack: Array<string>
}, req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) {
        return next(err)
    }

    console.error(err.stack)
    res.status(500).send('Something broke!')
}