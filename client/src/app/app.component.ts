import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LayoutModule } from './shared/ui/layout';
import { VersionComponent } from './version/version.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet, FooterComponent, HeaderComponent, LayoutModule, VersionComponent],
})
export class AppComponent {
  readonly hasAppVersionFeature = environment.featureFlipping.appVersion;
}
