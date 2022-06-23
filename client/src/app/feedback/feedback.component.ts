import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Feedback } from '../model/feedback';
import { GraphqlService } from '../services/graphql/graphql.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  public feedback!: Feedback
  public bn!: String
  constructor(private activateRouter: ActivatedRoute,private graphqlService: GraphqlService) { 
  }

  ngOnInit(): void {
    const id = this.activateRouter.snapshot.queryParamMap.get('id');
    this.graphqlService.getFeedbackById(id!).subscribe(data => {
      this.feedback = data
    })
}
}
