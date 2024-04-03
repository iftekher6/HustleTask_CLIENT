import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context, server } from "../main";
import { toast } from "react-hot-toast";
import TodoItem from "../components/TodoItem";
import { Navigate } from "react-router-dom";
import TaskList from "../components/TaskListing";


const Home = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [currentPage,setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [limit]= useState(3)
  const [tasks, setTasks]= useState([])
  const { isAuthenticated } = useContext(Context);

  const updateHandler = async (id) => {
    try {
      const { data } = await axios.put(
        `${server}/tasks/${id}`,
        {},
        {
          withCredentials: true,
        }
      );

      toast.success(data.message);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const deleteHandler = async (id) => {
    try {
      const { data } = await axios.delete(`${server}/tasks/${id}`, {
        withCredentials: true,
      });

      toast.success(data.message);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${server}/tasks/new`,
        {
          title,
          description,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setTitle("");
      setDescription("");
      toast.success(data.message);
      
      setLoading(false);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
      
    }
  };

  useEffect(() => {
   
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${server}/tasks/getasks?page=${currentPage}&limit=${limit}`,{
          withCredentials: true,
        });
          setLoading(false)
          setTasks(response?.data?.tasks);
       
          setTotalCount(response?.data?.totalCount)

        
          
      
       
      } catch (error) {
        toast.error(error.response.data.message);
        setLoading(false)
      }
    };

    fetchTasks();
  
  }, [refresh,currentPage]);

  const nextPageHandler = () => {
    
    if(tasks.length < totalCount){
      setCurrentPage(prevPage => prevPage + 1);
    }else {
      toast.error('no more tasks')
    }
     
   
  };

  const prevPageHandler = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  if (!isAuthenticated) return <Navigate to={"/login"} />;

  return (
    <div className="container">
      <div className="login">
        <section>
          <form onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button disabled={loading} type="submit">
              Add Task
            </button>
          </form>
        </section>
      </div>

      <section className="todosContainer">
        {tasks.map((task) => (
          <TodoItem
            title={task.title}
            description={task.description}
            iCompleted={task.isCompleted}
             updateHandler={updateHandler}
            deleteHandler={deleteHandler}
            id={task._id}
            key={task._id}
           
           
          />
          
        ))}
        
        {tasks.length > 0  &&  (
         <TaskList
             nextPageHandler= {nextPageHandler}
             prevPageHandler= {prevPageHandler}
             currentPage={currentPage}
             
            
           

         
             /> )}

    
        
      </section>
  
     
    </div>
  );
};

export default Home;


