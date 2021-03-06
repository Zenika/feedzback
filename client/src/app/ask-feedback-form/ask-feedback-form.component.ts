import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { getFormControlError } from '../get-form-control-error';
import { Apollo, gql } from 'apollo-angular';
import { FeedbackRequest } from '../model/feedbackRequest';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment.prod';


@Component({
  selector: 'app-ask-feedback-form',
  templateUrl: './ask-feedback-form.component.html',
  styleUrls: ['./ask-feedback-form.component.css']
})
export class AskFeedbackFormComponent implements OnInit {
  userEmail? : string
  userName? : string
  constructor(private apollo: Apollo, private activatedRoute: ActivatedRoute, private router: Router, private authService:AuthService) {
   let user =  this.authService.getUserDetails();
   this.userEmail = user?.email!;
   this.userName  = user?.displayName!;  
     
   }

  private queryParams = this.activatedRoute.snapshot.queryParamMap;
  public getFormControlError = getFormControlError

  private mutation = gql`
  mutation Mutation($askFeedback: AskFeedback!) {
    sendFeedbackRequest(askFeedback: $askFeedback)
  }
  `

  public form = new FormGroup({
    receverEmail: new FormControl(this.queryParams.get('receverEmail'), [Validators.required, Validators.email]),
    receverName: new FormControl(this.queryParams.get('receverName'), Validators.required),
    message: new FormControl(''),
  });

  get senderEmail() { return this.form.get('senderEmail') }
  get senderName() { return this.form.get('senderName') }
  get receverEmail() { return this.form.get('receverEmail') }
  get receverName() { return this.form.get('receverName') }
  get message() { return this.form.get('message') }

  ngOnInit(): void {}

  

  onSubmit() {
    console.log(environment.serverApi + "api")
    const token = sessionStorage.getItem('token');
    this.form.markAllAsTouched()
    if (this.form.valid) {
      this.apollo.mutate({
        mutation: this.mutation,
        variables: {
          askFeedback: new FeedbackRequest(
            token!,
            this.userName,
            this.userEmail,
            this.receverName?.value,
            this.receverEmail?.value,
            this.message?.value
          ),
        },
      }).subscribe((data: any) => {
        let result = data.data.sendFeedbackRequest;
        if (result === 'sent') {
          result = "F??licitations! Votre demande vient d?????tre envoy??e ?? : " + this.receverName?.value;
          this.router.navigate(['/result', { result: 'success' ,message:result}])
        } else {
          result = "D??sol?? ! Votre demande n???a pas ??t?? envoy??e ?? cause d???un probl??me technique...  Veuillez r??essayer."
          this.router.navigate(['/result', { result: 'askFailed', message: result }])
        }
      })
    }
  }
}
