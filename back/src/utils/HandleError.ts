import { Logger } from '../middlewares';  // Import du logger Winston
import type { ErrorObject } from '../types';

export class HandleError {
    /**
     * Ensure the error is an instance of Error.
     * @param {unknown} error - The error to ensure.
     * @returns {Error} The error instance.
     */
    public static ensureError(error: unknown): Error {
        if (error instanceof Error) return error;

        let stringify: string = 'Unable to stringify error.';

        try {
            stringify = JSON.stringify(error);
        } catch {}

        return new Error(`An unexpected error occurred: ${stringify}`);
    }



    /**
     * Handle an error object.
     * @param {ErrorObject} errorObject - The error object to handle.
     * @returns {Error} The error instance.
     */
    public static handle(errorObject: ErrorObject): Error {
        const errorInstance: Error = HandleError.ensureError(errorObject.error);

        const formattedError: string = [
            errorObject.file ?? '',
            errorObject.fn ? `.${errorObject.fn}` : '',
            errorObject.message ? ` - ${errorObject.message}` : '',
            `: ${errorInstance.message}`
        ].filter(Boolean).join('');

        Logger.error(formattedError, { stack: errorInstance.stack });

        return errorInstance;
    }
}
