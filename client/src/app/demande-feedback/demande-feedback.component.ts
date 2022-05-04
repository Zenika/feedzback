import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AskFeedbackRequest } from '../model/AskFeedbackRequest';


@Component({
  selector: 'app-demande-feedback',
  templateUrl: './demande-feedback.component.html',
  styleUrls: ['./demande-feedback.component.css']
})
export class DemandeFeedbackComponent implements OnInit {

  askFeedbackRequest!: AskFeedbackRequest

  @ViewChild('feedbackForm', {static: false})
  askFeedback!: NgForm;

  constructor() { }

  ngOnInit(): void {
    this.askFeedbackRequest= new AskFeedbackRequest();
  }
  onSubmit(){
    console.log("hey")
  }

}
