/* eslint-disable no-unused-vars */
import { Navigate, createBrowserRouter } from "react-router-dom";
import Dashboard from "./view/Dashboard";
import ToDo from "./view/ToDO";
import Login from "./view/Login";
import Signup from "./view/SignUp";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import CreateToDo from "./view/CreateToDo";

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout/>,
        children: [
            {
                path: '/',
                element: <Navigate to='/dashboard'></Navigate>
            },
            {
                path: '/dashboard',
                element: <Dashboard/>
            },
            {
                path: '/todo-list',
                element: <ToDo/>
            },
            {
                path: '/create-todo/new',
                element: <CreateToDo key='todoCreate'/>
            },
            {
                path: '/create-todo/:id',
                element: <CreateToDo key='todoUpdate'/>
            },
        ]
    },
    {
        path: '/',
        element: <GuestLayout/>,
        children: [
            {
                path: '/login',
                element: <Login/>
            },
            {
                path: '/signup',
                element: <Signup/>
            },
        ]
    }
])

export default router;
