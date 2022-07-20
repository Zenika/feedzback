import { Component, ElementRef, ViewChild } from '@angular/core';
import { CheckboxControlValueAccessor } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FeedZback';
  isNavbarOpen: boolean = false; 

  @ViewChild('checkBox',{static:true}) checkBox!:ElementRef
  @ViewChild('menu',{static: true}) menu!: ElementRef

  constructor(public authService: AuthService, private router: Router) {
  }
  ngOnInit(): void {
    console.log(this.menu.nativeElement.focus = true + ' vallueaaavallueaaavallueaaavallueaaavallueaaavallueaaa')
    if(this.checkBox.nativeElement.checked)
    this.menu.nativeElement.focus =true
  }
  signOut() {
    this.authService.signOut();
  }
  isLogged() {
    return this.authService.isLogged();
  }
  ask() {
    this.router.navigate(['/ask'])
  }
  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen
  }
}
