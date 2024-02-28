import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NoManagerDialogComponent } from './no-manager-dialog/no-manager-dialog.component';
import { LayoutModule } from './shared/ui/layout';
import { VersionComponent } from './version/version.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent, LayoutModule, NoManagerDialogComponent, VersionComponent],
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  readonly hasManagerFeature = environment.featureFlipping.manager;

  readonly hasAppVersionFeature = environment.featureFlipping.appVersion;
}
