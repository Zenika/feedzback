import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-demande-envoye',
  templateUrl: './demande-envoye.component.html',
  styleUrls: ['./demande-envoye.component.css']
})
export class DemandeEnvoyeComponent {

  result!: string
  constructor(private router: ActivatedRoute) {
    this.result = this.router.snapshot.paramMap.get('result')!
   }
}
