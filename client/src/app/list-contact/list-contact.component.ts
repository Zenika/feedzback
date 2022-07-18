import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Contact } from '../model/contact';

@Component({
  selector: 'app-list-contact',
  templateUrl: './list-contact.component.html',
  styleUrls: ['./list-contact.component.css']
})
export class ListContactComponent implements OnInit {

  @Input() contacts!: Contact[]
  @Output() emailEvent: EventEmitter<boolean> = new EventEmitter()
  emailList!: boolean
  constructor() { }

  ngOnInit(): void {
  }
  selectContact(contact: Contact) {
    console.log('awa  ' + contact)
    this.emailList = false
    this.emailEvent.emit(this.emailList)
  }
}
