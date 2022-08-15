'use strict'
class client{
    clientsave(){
        try{
            return
            throw new Error("Try block")

        }catch(err){
            console.log("Catch=========>",err);
        }finally{
            console.log("Finally");
        }
    }
    
    savedata(){
        try{
            throw new Error("Try block")

        }catch(err){
            console.log("Catch=========>",err);
        }finally{
            console.log("Finally");
        }
    }
    
}
module.exports=client
