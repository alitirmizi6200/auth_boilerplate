class ErrorResponse extends Error{
    private statusCode: number; 
    private error: any[]; 
    private successs: boolean;

    constructor(statusCode: number,message: string, error: any[],stack: string = "", success: false){
        super(message),
        this.statusCode = statusCode, 
        this.error = error,
        this.successs = success;

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ErrorResponse}