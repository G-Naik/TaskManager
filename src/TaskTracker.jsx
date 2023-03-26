import { useState,useRef, useEffect, } from "react";
import TaskData from "./TaskData";
import axios from "axios";
import { useParams } from "react-router-dom";
// import { useParams } from "react-router-dom";

const TaskTracker = () => {


    // let [task ,setNewTask] = useState("")
    // let [startDate,setStartDate] = useState("");
    // let [endDate,setEndDate] = useState("");
    let task1 = useRef("");
    let startDate1 = useRef("")
    let endDate1 = useRef("")
    let prior = useRef("")
    

    let handleSubmit = () => {
        
        let prirority = prior.current.value;
        let task = task1.current.value;
        let startDate = startDate1.current.value;
        let endDate = endDate1.current.value;

        let data = {task,startDate,endDate,prirority}



        if(task === "" || prirority === "" ){
            alert("please fill the Details")
        }else{
            axios.post("http://localhost:4000/tasks",data)
            .then(res => {
                alert(res.data.message)
            })
            .catch(err => {
                alert(err.data.message)
            })
        }
    }

    let [value,setvalue] = useState(false)
    let [number,setNumber] = useState("")

    let handleClick = (_id) => {
        axios.get(`http://localhost:4000/tasks/${_id}`)
        .then((response) => response.data)
        .then((alltask) =>{
           task1.current.value = alltask.task
        } )
        setvalue(true)
        setNumber(_id)
    }


    let handleUpdate = (number) => {
        
        let updateTask = {
            task:task1.current.value,
            startDate:startDate1.current.value,
            endDate:endDate1.current.value,
            prirority:prior.current.value,
        }
        console.log(updateTask)
        axios.put(`http://localhost:4000/tasks/${number}`,updateTask)
        .then((res) => {
            console.log("anfj")
        }).catch((err) => {
            console.log(err)
        })
        alert("handle save")
        setvalue(false)
    }


    return ( 
        <section className="container">
            <h1 className="text-center">Task Tracker</h1>
        <div className="contain-div text-light rounded-4">
            <form action=""  >
            <section className="d-flex justify-content-around pt-3 ">
                            <div>
                                <label htmlFor="" > TaskName : </label>
                                <input 
                                type="text" 
                                ref={task1} 
                                className="form-control"
                                />
                            </div>
                            <div>
                                <label htmlFor="" >Start Date & Time : </label>
                                <input
                                type="datetime-local"
                                ref={startDate1} 
                                className="form-control"
                                />
                            </div>
                            <div >
                                <label htmlFor=""  >End Date & Time : </label>
                                <input 
                                type="datetime-local" 
                                ref={endDate1} 
                                className="form-control"
                                />
                            </div>
                            <div>
                                <label htmlFor="" >Prirority : </label>
                                <div className="form-control">

                                <select  ref={prior} className="border-none" >
                                    <option value="0">High</option>
                                    <option value="1">Medium</option>
                                    <option value="2">Low</option>
                                </select>
                                </div>
                          </div>
                           
            </section>
                            <div className="d-flex justify-content-center p-3 mt-2 mb-2">
                                {
                                    value === false ? <button  onClick={() => handleSubmit()} className="w-25 bg-dark text-light"  >Add Task</button> :
                                    <button onClick={() => handleUpdate(number)} className="w-25 bg-dark text-light " >Save</button>
                                }
                            </div>
                </form>
        </div>
            <TaskData  data={handleClick}/>
        </section>
     );
}
 
export default TaskTracker;