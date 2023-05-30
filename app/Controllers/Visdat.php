<?php

namespace App\Controllers;

class Visdat extends BaseController
{
    public function showdata($courseid)
    {
        echo $courseid;
        //return view('visdat');
    }
}