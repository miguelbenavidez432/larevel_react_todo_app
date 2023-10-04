/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { UseStateContext } from "../Contexts/ContextProvider"
import axiosClient from "../axios";
import { ListBulletIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";


export default function ToDo() {

    const { currentUser } = UseStateContext();
    const [todos, setTodos] = useState([]);
    const [editing, setEditing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [updateTodo, setUpdateTodo] = useState({
        id: '',
        title: '',
        description: '',
        id_user: currentUser.id,
        completed: 0,
    })
    const [id, setId] = useState(0);
    const navigate = useNavigate()

    useEffect(() => {
        axiosClient.get(`/todo?page=${currentPage}`)
            .then(({ data }) => {
                const todoFiltered = data.data.filter(t => t.id_user === currentUser.id)
                setTodos(todoFiltered);
                setUpdateTodo({ ...updateTodo, id_user: currentUser.id });
                setTotalPages(data.meta.last_page);
            })

    }, [])

    const onDelete = (todo) => {
        if (!window.confirm('Are you sure you want to delete this to-do?')) {
            return
        }
        console.log(todo)
        axiosClient.delete(`/todo/${todo.id}`)
            .then(() => {
                navigate('/dashboard')
            })
            .catch(() => {

            })
    }

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };


    const onCompleted = (todo) => {
        axiosClient
            .put(`/todo/${todo.id}`, { ...todo, completed: 1 })
            .then(() => {
                axiosClient.get('/todo').then(({ data }) => {
                    const todoFiltered = data.data.filter(t => t.id_user === currentUser.id);
                    setTodos(todoFiltered);
                });
            })
            .catch(() => { });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log(updateTodo)
        await axiosClient.put(`/todo/${updateTodo.id}`, updateTodo)
            .then(() => {
                setEditing(false)
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    'Updated fail'
                }
            })
    }

    return (
        <>
            <div>
                {currentPage > 1 && (
                    <button className="btn-add" onClick={handlePrevPage}>Página anterior</button>
                )}&nbsp;&nbsp;
                {currentPage < totalPages && (
                    <button className='btn-add' onClick={handleNextPage}>Página siguiente</button>
                )}
            </div>
            <ul role="list" className="divide-y divide-gray-100 mx-8 my-4">
                {todos.map((todo) => (
                    <li key={todo.id} className="flex justify-between gap-x-6 py-5">

                        <div className="flex min-w-0 gap-x-8">
                            <ListBulletIcon className="w-8 h-8" />
                            <div className="min-w-0 flex-auto">
                                <p className="text-base font-semibold leading-6 text-black">{todo.title}</p>
                                <p className="mt-1 truncate text-xs leading-5 text-gray-800">{todo.description}</p>
                            </div>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                            <Link
                                type="button"
                                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                to={'/create-todo/' + todo.id}>Edit</Link>
                            &nbsp;
                            <button
                                onClick={() => onCompleted(todo)}
                                className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Complete
                            </button>
                            &nbsp;
                            <button
                                onClick={e => onDelete(todo)}
                                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Delete
                            </button>
                            <p className="text-sm leading-6 text-gray-900">{todo.id}</p>
                            {todo.completed === 0 ? (
                                <div className="mt-1 flex items-center gap-x-1.5">
                                    <div className="flex-none rounded-full bg-red-500/20 p-1">
                                        <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                    </div>
                                    <p className="text-xs leading-5 text-gray-500">Incomplete</p>


                                </div>
                            ) : (
                                <div className="mt-1 flex items-center gap-x-1.5">
                                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    </div>
                                    <p className="text-xs leading-5 text-gray-500">Complete</p>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}
