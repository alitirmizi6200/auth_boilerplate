class APIResponse<T>{
    private statusCode : number;
    private data: T; 
    private message: string; 
    private success: boolean; 
    
    constructor(statusCode: number, data: T, message: "success", success: true){
        this.statusCode = statusCode; 
        this.data = data;
        this.message = message; 
        this.success = success; 
    }
}

export {APIResponse}