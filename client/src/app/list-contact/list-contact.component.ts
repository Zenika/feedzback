import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Contact } from '../model/contact';

@Component({
  selector: 'app-list-contact',
  templateUrl: './list-contact.component.html',
  styleUrls: ['./list-contact.component.css']
})
export class ListContactComponent implements OnInit {

  @Input() contacts!: Contact[]
  @ViewChild('list', {static:false}) list!: ElementRef
  @Output() contactEvent: EventEmitter<Contact> = new EventEmitter();
  emailList!: boolean
  contactIndex: number = 0
  constructor() {
    
   }

  ngOnInit(): void {
  }
  ngAfterViewChecked(): void {
    this.list.nativeElement.addEventListener('keydown', this.onKeyDown)
    this.list.nativeElement.val
  }
  onKeyDown = (e:any) => {
    console.log(e)
  }
  arrowDown() {
    this.contactIndex++;
  }
  arrowUp() {
    this.contactIndex--;
  }
  selectContact(contact: Contact) {
    this.emailList = false
    this.contactEvent.emit(contact);
  }
}
