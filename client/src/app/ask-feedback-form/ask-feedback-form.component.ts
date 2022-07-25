import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { getFormControlError } from '../get-form-control-error';
import { Apollo, gql, Query } from 'apollo-angular';
import { FeedbackRequest } from '../model/feedbackRequest';
import { AuthService } from '../services/auth.service';
import { Contact } from '../model/contact';
import { ListContactComponent } from '../list-contact/list-contact.component';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-ask-feedback-form',
  templateUrl: './ask-feedback-form.component.html',
  styleUrls: ['./ask-feedback-form.component.css']
})
export class AskFeedbackFormComponent implements OnInit {
  userEmail? : string
  userName? : string
  emailList : boolean = false
  contactList!: Contact[]
  @ViewChild(ListContactComponent) listContact!: ListContactComponent

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
          result = "Félicitations! Votre demande vient d’être envoyée à : " + this.receverName?.value;
          this.router.navigate(['/result', { result: 'success' ,message:result}])
        } else {
          result = "Désolé ! Votre demande n’a pas été envoyée à cause d’un problème technique...  Veuillez réessayer."
          this.router.navigate(['/result', { result: 'askFailed', message: result }])
        }
      })
    }
  }
  getGoogleContact(event?:KeyboardEvent) {
    let key = event?.key
    let query = this.receverEmail?.value
    let code = event?.code
    
    if(this.isArrowOrEnter(code!))
    return
    if(code === 'Backspace')
      {
        this.backSpaceKey(query);
      }
    else if(query !== null)
    {
      if(key)
        query = query + key;
      this.authService.fetchGoogleUser(query).then((contacts: Contact[]) => {
        this.contactList = contacts
      })
    } 
    else 
      this.authService.fetchGoogleUser(key!).then((contacts: Contact[]) => {
        this.contactList = contacts
      })
    }

    backSpaceKey(query: string) {
      this.showEmailList();
      query = query.substring(0, query.length - 1);
      if (query.length === 0)
        this.authService.fetchGoogleUser('a').then((contacts: Contact[]) => {
          this.contactList = contacts;
        });
      else
        this.authService.fetchGoogleUser(query).then((contacts: Contact[]) => {
          this.contactList = contacts;
        });
    }
    isArrowOrEnter(code: String) {
      if(code === 'ArrowDown')
      {
        this.listContact.arrowDown()
        return true
      }
      else if(code === 'ArrowUp')
      {
        this.listContact.arrowUp()
        return true
      } else if(code === 'Enter')
      {
      this.receverEmail?.setValue(
        this.contactList[this.listContact.contactIndex].email)
        this.emailList = false
        return true;
      }
      return false
    }
    showEmailList() {
      this.emailList = true
    }
    blurInput() {
    setTimeout(()=> {
      this.emailList = false
    },200)
    }
    selectContact(event:any) {
      this.receverEmail?.setValue(event.email)
    }
}
