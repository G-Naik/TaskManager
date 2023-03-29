import { useEffect, useRef, useState} from "react";
import axios from "axios";




const TaskData = (props) => {

    let handleClick = props.data

    const [taskData, setTaskData] = useState([]);
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage, setTasksPerPage] = useState(10);

    let [simpleData,updateSimpleData] = useState("0")

    var cd = new Date()
    let prior = useRef("")

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
    }, [prior,simpleData]);

    


    // Data Deletion

    const handleDelete = (_id) => {
        if(window.confirm("Do you really want to delete it")){
            axios.delete(`http://localhost:4000/tasks/${_id}`);
        }
        updateSimpleData(simpleData + 1)
    }

    
    let submit = (e) =>{ 
        e.preventDefault()
        let sortedData = [...taskData]
        if(prior.current.value === "high"){
            sortedData.sort((a,b) => b.prirority - a.prirority)
        }else{
            sortedData.sort((a,b) => a.prirority - b.prirority)
        }
        setTaskData(sortedData)
    }

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    let currentTasks = taskData
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
        <div className="contain-new-div mt-5">
            <section>
                <div className="container">
                    <h1 className="text-secondary">Task Data</h1>
                </div>
                <section className="d-flex justify-content-center " >

                        <input type="text" placeholder="search here"  className="form-control mb-3 me-0 w-50 rounded-5 " value={query} onChange={(e) => setQuery(e.target.value)} />


                        <div onChange={submit} className="ms-3" >
                            <select ref={prior}>
                                <option value="low" >High to low</option>
                                <option  value="high"  >low to high</option>
                            </select>
                        </div>
                   
                    
                </section> 
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
                            <th>Added On</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className=" bg-secondary-subtle">
                        {currentTasks.map(({ task, startDate, endDate, prirority, _id ,status,addedon}, i) => (
                            <tr key={_id}>
                                <td>{i + 1}</td>
                                <td>{task}</td>
                                <td>{new Date(startDate).toLocaleString()}</td>
                                <td>{new Date(endDate).toLocaleString()}</td>
                                <td>{priorities[prirority]}</td>
                                <td>{status}</td>
                                <td>{addedon}</td>
                                <td>
                                        
                                        { (status !== "Completed" || status === "Not yet" || status === "in progress")  &&   <button onClick={() => handleClick(_id)} ><i className="fa-regular fa-pen-to-square text-primary"></i></button>}
                                        {(status !== "Completed" && status === "Not yet" ) &&<button onClick={() => handleDelete(_id) } ><i className="fa-solid fa-trash-can  text-danger"></i></button>}
                                        
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