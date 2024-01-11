import { Component, HostBinding, Input, ViewEncapsulation, booleanAttribute } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DEFAULT_COLOR } from './avatar.config';
import { AvatarFromName } from './avatar.types';
import { buildAvatarFromName } from './avatar.utils';

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
    return this.small;
  }

  @HostBinding('style.background-color') get bgColor() {
    return this.name?.color ?? DEFAULT_COLOR;
  }

  @HostBinding('style.background-image') get bgImage() {
    return this.photoUrl ? `url(${this.photoUrl})` : undefined;
  }

  @Input({ transform: booleanAttribute }) small = false;

  @Input() photoUrl?: string;

  @Input({ transform: (name: string | undefined) => (name ? buildAvatarFromName(name) : undefined) })
  name?: AvatarFromName;
}
