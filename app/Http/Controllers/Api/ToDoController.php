<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ToDo;
use App\Http\Requests\StoreToDoRequest;
use App\Http\Requests\UpdateToDoRequest;
use App\Http\Resources\ToDoResource;

class ToDoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ToDoResource::collection(
            ToDo::query()->orderBy('created_at', 'desc')->paginate(20)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreToDoRequest $request)
    {
        $data = $request->validated();
        $toDo = ToDo::create($data);
        return response(new ToDoResource($toDo), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ToDo $toDo)
    {
        return new ToDoResource($toDo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateToDoRequest $request, ToDo $toDo)
    {
        $data = $request->validated();

        $toDo->update($data);

        return new ToDoResource($toDo);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ToDo $toDo)
    {
        $toDo->delete();
        return response('Todo deleted', 204);
    }
}
