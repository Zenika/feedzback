import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { loadingAnimations } from './loading.animations';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-loading',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
  animations: [loadingAnimations],
  encapsulation: ViewEncapsulation.None,
})
export class LoadingComponent {
  protected loading = inject(LoadingService).loading;
}
