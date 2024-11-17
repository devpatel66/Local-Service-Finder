async function ErrorHandler(func){
    try{
        return await func()
    }
    catch(error){
        console.log("Error"+error.message);
        return {msg:error.message,statusCode:400}
        
    }

}

export default ErrorHandler