import { useEffect, useState } from "react";
import axios from "axios";



const TaskData = (props) => {

    let handleClick = props.data

    const [taskData, setTaskData] = useState([]);
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage, setTasksPerPage] = useState(10);

    var cd = new Date()

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get("http://localhost:4000/tasks-post");
            const data = await res.data; 
            let d = [...data];
            d = d.map((task)=>{ 
                let result = ""
                if(new Date(task.startDate) >  cd){
                    result = "Not yet"
                }else if(new Date(task.startDate) < new Date(task.endDate) &&  new Date(task.endDate) > cd){
                    result =" in progress";
                }else{
                    result = "Completed"
                }

            return {...task , status :  result }});
            setTaskData(d);
        };
        fetchData();
    }, [taskData]);



    


    const handleDelete = (_id) => {
        if(window.confirm("Do you really want to delete it")){
            axios.delete(`http://localhost:4000/tasks/${_id}`);
        }
    }

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = taskData
        .filter((item) => item.task.toLowerCase().includes(query))
        .slice(indexOfFirstTask, indexOfLastTask);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(taskData.length / tasksPerPage); i++) {
        pageNumbers.push(i);
    }


    const displayNextData = () => {
        if (currentPage < pageNumbers.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const displayPrevData = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    let priorities = {
        0 : "High",
        1 : "Medium",
        2 : "low"
    }

    return (
        <div className="contain-new-div">
            <section>
                <div className="container">
                    <h1 className="text-secondary">Task Data</h1>
                </div>
                <div  className="container">
                    <input type="text" placeholder="search here"  className="form-control mb-3" value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
            </section>
            <section className="container">
                <table className="table  table-striped table-bordered ">
                    <thead className="bg-secondary" >
                        <tr>
                            <th>Sl No</th>
                            <th>Task Name</th>
                            <th>Start Date & Time</th>
                            <th>End Date & Time</th>
                            <th>Prirority</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className=" bg-secondary-subtle">
                        {currentTasks.map(({ task, startDate, endDate, prirority, _id ,status}, i) => (
                            <tr key={_id}>
                                <td>{i + 1}</td>
                                <td>{task}</td>
                                <td>{startDate}</td>
                                <td>{endDate}</td>
                                <td>{priorities[prirority]}</td>
                                <td>{status}</td>
                                <td>
                                        
                                        { (status !== "Completed" || status === "Not yet" )  &&   <button onClick={() => handleClick(_id)} className="btn btn-warning m-1 rounded-0">Edit</button>}
                                        {(status !== "Completed" && status !== "Not yet" || status === "in progress") &&<button onClick={() => handleDelete(_id) } className="btn btn-danger m-1 rounded-0" >Delete</button>}
                                        
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            <div className="d-flex justify-content-around">
                <button className="btn btn-dark m-3 rounded-0" onClick={() => displayPrevData()}>Prev</button>
                <button  className="btn btn-dark m-3 rounded-0"  onClick={() => displayNextData()}>Next</button>
            </div>
        </div>
     );
}
 
export default TaskData;