<?php

namespace App\Controllers;
use CodeIgniter\Controller;

class PersonalGradebook extends BaseController
{
    public function getstudent(){
        return view('personal_gradebook');
    }
}
