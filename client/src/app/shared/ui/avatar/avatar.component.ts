import { Component, HostBinding, ViewEncapsulation, booleanAttribute, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DEFAULT_COLOR } from './avatar.config';
import { buildInitial } from './avatar.utils';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AvatarComponent {
  @HostBinding('class.app-avatar') hasCss = true;

  @HostBinding('class.app-avatar--small') get cssSmall() {
    return this.small();
  }

  @HostBinding('style.background-image') get bgImage() {
    return this.photoUrl() ? `url(${this.photoUrl()})` : undefined;
  }

  @HostBinding('style.background-color') get bgColor() {
    return this.photoUrl() ? undefined : this.initial()?.color ?? DEFAULT_COLOR;
  }

  small = input(false, { transform: booleanAttribute });

  photoUrl = input<string>();

  name = input<string>();

  protected initial = computed(() => (this.name() ? buildInitial(this.name()!) : undefined));
}
