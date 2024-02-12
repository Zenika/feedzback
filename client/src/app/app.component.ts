import { Component, ViewEncapsulation, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { LayoutModule } from './shared/ui/layout/layout.module';
import { VersionComponent } from './version/version.component';
import { VersionService } from './version/version.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet, FooterComponent, HeaderComponent, LayoutModule, MaintenanceComponent, VersionComponent],
})
export class AppComponent {
  readonly hasAppVersionFeature = environment.featureFlipping.appVersion;

  readonly serverVersionMatches = this.hasAppVersionFeature ? inject(VersionService).serverVersionMatches : true;
}
