import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LayoutModule } from './layout';
import { NoManagerDialogComponent } from './no-manager-dialog/no-manager-dialog.component';
import { VersionComponent } from './version/version.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent, LayoutModule, NoManagerDialogComponent, VersionComponent],
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {}
