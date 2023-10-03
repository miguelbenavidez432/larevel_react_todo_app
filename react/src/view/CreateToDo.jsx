/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { UseStateContext } from "../Contexts/ContextProvider"
import axiosClient from "../axios"
import { useNavigate, useParams } from "react-router-dom"


export default function CreateToDo() {

    const { id } = useParams();
    const { currentUser } = UseStateContext();
    const [errors, setErrors] = useState(null);
    const [todo, setTodo] = useState({
        title: '',
        description: '',
        completed: 0,
        id_user: ''
    });
    const navigate = useNavigate();

    if (id) {
        useEffect(() => {
            axiosClient.get(`/todo/${id}`)
                .then(({ data }) => {
                    console.log(data)
                    setTodo(data)
                })
                .catch(() => {
                })
        }, [])
    } else {
        useEffect(() => {
            setTodo({
                ...todo,
                id_user: currentUser.id
            })
        }, [])
    }


    const onSubmit = (e) => {
        e.preventDefault();
        if (todo.id) {
            axiosClient.put(`/todo/${todo.id}`, todo)
                .then(() => {
                    navigate('/todo-list')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        } else {
            axiosClient.post(`/todo`, todo)
                .then(() => {
                    navigate('/todo-list')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        }
    }

    return (
        <>
            {todo.id && <h1>Update to-do: {todo.title}</h1>}
            {!todo.id && <h1>New To-do</h1>}
            <div className='mx-8 my-4'>
                {errors &&
                    <div className="alert">
                        {Object.keys(errors).map(key => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                }

                <form onSubmit={onSubmit}>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Create new To-do</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                You can create a new to-do element
                            </p>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-4">
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Title
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                            <span
                                                className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                                            <input
                                                type="text"
                                                name="title"
                                                id="title"
                                                autoFocus
                                                value={todo.title}
                                                onChange={e => setTodo({ ...todo, title: e.target.value })}
                                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                placeholder="Title"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-full">
                                    <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                                        Description
                                    </label>
                                    <div className="mt-2">
                                        <textarea
                                            id="about"
                                            name="about"
                                            rows={4}
                                            value={todo.description}
                                            onChange={e => setTodo({ ...todo, description: e.target.value })}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-gray-600">Write a description of the to-do.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="mt-6 flex items-center justify-start gap-x-6">
                        <button type="button" className="text-sm font-semibold leading-6 bg-slate-200 px-3 py-2 text-gray-900 hover:bg-slate-400 rounded-md">
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
            </div>
        </>
    )
}

