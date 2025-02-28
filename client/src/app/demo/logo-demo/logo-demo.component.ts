import { Component } from '@angular/core';
import { BackgroundSymbolsComponent } from '../../shared/background-symbols/background-symbols.component';
import { LogoBrandComponent } from '../../shared/logo-brand';

@Component({
  selector: 'app-logo-demo',
  imports: [BackgroundSymbolsComponent, LogoBrandComponent],
  templateUrl: './logo-demo.component.html',
  styleUrl: './logo-demo.component.scss',
})
export class LogoDemoComponent {}
