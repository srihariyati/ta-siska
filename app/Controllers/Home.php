<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index()
    {
        return view('login');
    }
    
    public function tabel_kuis()
    {
        return view('tbl_kuis');
    }
    public function tabel_tugas()
    {
        return view('tbl_tugas');
    }
  
    public function visdat_kuis()
    {
        return view('visdat_kuis');
    }
    public function visdat_tugas()
    {
        return view('visdat_tugas');
    }
    public function gradebook_personal()
    {
        return view('gradebook_personal');
    }
    public function edit_grade_personal()
    {
        return view('edit_grade_personal');
    }
    

}
