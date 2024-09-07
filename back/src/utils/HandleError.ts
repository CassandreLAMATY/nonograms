import type { ErrorObject } from '../types';

export class HandleError {
    public static ensureError(error: unknown): Error {
        if(error instanceof Error) return error;

        let stringify: string = 'Unable to stringify error.';

        try {
            stringify = JSON.stringify(error);
        } catch {}

        return new Error(`An unexpected error occurred: ${stringify}`);
    }

    public static handle(errorObject: ErrorObject): Error {
        const errorInstance: Error = HandleError.ensureError(errorObject.error);

        const formattedError: string = [
            errorObject.file ?? '',
            errorObject.fn ? `.${errorObject.fn}` : '',
            errorObject.message ? ` - ${errorObject.message}` : '',
            `: ${errorInstance.message}`
        ].filter(Boolean).join('');

        return errorInstance;
    }
}