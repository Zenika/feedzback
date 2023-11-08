import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Feedback} from '../model/feedback';
import {AuthService} from '../services/auth.service';
import {GraphqlService} from '../services/graphql/graphql.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})
export class FeedbackComponent implements OnInit {
  feedback!: Feedback;

  type = this.activateRouter.snapshot.paramMap.get('type');

  constructor(
    private activateRouter: ActivatedRoute,
    private authService: AuthService,
    private graphqlService: GraphqlService,
  ) {}

  ngOnInit(): void {
    this.getFeedbackById();
  }

  private async getFeedbackById() {
    const id = this.activateRouter.snapshot.paramMap.get('id')!;
    const token = await this.authService.getUserTokenId();

    this.graphqlService.getFeedbackById({id, token}).subscribe((data) => {
      this.feedback = data;
    });
  }
}
