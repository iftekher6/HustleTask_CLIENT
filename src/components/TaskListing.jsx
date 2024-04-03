import { useContext } from "react";
import { Context } from "../main";

const TaskList = ({prevPageHandler,nextPageHandler,currentPage}) => {
    
     const {loading} = useContext(Context)
   

    return (
      
      <>
      
       <button onClick={nextPageHandler} className="btns">{loading? 'loading..':'Load More..'}</button>
      
      
     
      {currentPage > 1 && 
      <button  className="btns" onClick={prevPageHandler}>Go back</button>   
      }
      
    
     </>
    
         
 
       
    

       
        
   
      
     
        
      
    );
  };
  
export default TaskList