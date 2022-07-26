import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Contact } from '../model/contact';

@Component({
  selector: 'app-list-contact',
  templateUrl: './list-contact.component.html',
  styleUrls: ['./list-contact.component.css']
})
export class ListContactComponent implements OnInit {

  @Input() contacts!: Contact[]
  @Input() isEmailList!: boolean
  @Output() contactEvent: EventEmitter<Contact> = new EventEmitter()
  contactIndex: number = 0
  constructor() {
    
   }

  ngOnInit(): void {
  }
  arrowDown() {
   if(this.contactIndex < this.contacts.length)
     this.contactIndex++;
     return this.contacts[this.contactIndex]
  }
  arrowUp() {
    if(this.contactIndex > 0)
    this.contactIndex--;
    return this.contacts[this.contactIndex]
  }
  selectContact(contact: Contact) {
    this.contactEvent.emit(contact);
  }
}
