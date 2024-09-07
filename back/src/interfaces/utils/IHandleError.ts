import type { ErrorObject } from '../../types';

export interface IHandleError {
    ensureError(error: unknown): Error;
    handle(errorObject: ErrorObject): Error;
}