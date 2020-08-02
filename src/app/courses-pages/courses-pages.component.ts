import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-courses-pages',
  templateUrl: './courses-pages.component.html',
  styleUrls: ['./courses-pages.component.scss']
})
export class CoursesPagesComponent implements OnInit {


  constructor() { 
    console.log("works")
  }

  ngOnInit(): void {
  }

}
