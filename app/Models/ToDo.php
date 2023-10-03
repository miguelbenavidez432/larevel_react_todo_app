<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ToDo extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'title',
        'description',
        'id_user',
        'completed',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}

