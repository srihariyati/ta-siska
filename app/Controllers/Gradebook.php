<?php

namespace App\Controllers;
use CodeIgniter\Controller;

class Gradebook extends BaseController
{
    public function gradebook()
    {
        return view('gradebook');
    }

    public function edit_gradebook_all()
    {
        return view('edit_gradebook_all');
    }
}