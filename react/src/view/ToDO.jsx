/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { UseStateContext } from "../Contexts/ContextProvider"
import axiosClient from "../axios";
import { ListBulletIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";


export default function ToDo() {

    const { currentUser } = UseStateContext();
    const [todos, setTodos] = useState([]);
    const [editing, setEditing] = useState(false);
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
        axiosClient.get('/todo')
            .then(({ data }) => {
                const todoFiltered = data.data.filter(t => t.id_user === currentUser.id)
                setTodos(todoFiltered)
                setUpdateTodo({ ...updateTodo, id_user: currentUser.id });
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
        <ul role="list" className="divide-y divide-gray-100 mx-8 my-4">
            {todos.map((todo) => (
                <li key={todo.id} className="flex justify-between gap-x-6 py-5">
                    {editing
                        ? <form
                            onSubmit={onSubmit}>
                            <div
                                className="space-y-12">
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Title
                                </label>
                                <div
                                    className="mt-2">
                                    <div
                                        className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                        <span
                                            className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                                        <input
                                            type="text"
                                            autoFocus
                                            value={updateTodo.title}
                                            onChange={e => setUpdateTodo({ ...updateTodo, title: e.target.value })}
                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                            placeholder="Title"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                                        Description
                                    </label>
                                    <div className="mt-2">
                                        <textarea
                                            rows={4}
                                            value={updateTodo.description}
                                            onChange={e => setUpdateTodo({ ...updateTodo, description: e.target.value })}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex items-center justify-start gap-x-6">
                                <button
                                    type="button"
                                    className="text-sm font-semibold leading-6 bg-slate-200 px-3 py-2 text-gray-900 hover:bg-slate-400 rounded-md"
                                    onClick={() => setEditing(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                        :
                        <div className="flex min-w-0 gap-x-8">
                            <ListBulletIcon className="w-8 h-8" />
                            <div className="min-w-0 flex-auto">
                                <p className="text-base font-semibold leading-6 text-black">{todo.title}</p>
                                <p className="mt-1 truncate text-xs leading-5 text-gray-800">{todo.description}</p>
                            </div>
                        </div>}
                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                        <button
                            onClick={() => {
                                setEditing(true);
                                setId(parseInt(todo.id));
                                setUpdateTodo({
                                    id: todo.id,
                                    title: todo.title,
                                    description: todo.description,
                                    id_user: currentUser.id
                                });
                            }}

                            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onCompleted(todo)}
                            className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Complete
                        </button>
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
    )
}
