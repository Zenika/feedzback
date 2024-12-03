import { Component, ViewEncapsulation, booleanAttribute, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DEFAULT_COLOR } from './avatar.config';
import { Avatar } from './avatar.types';
import { buildAvatarBgColor, buildAvatarInitial } from './avatar.utils';

@Component({
  selector: 'app-avatar',
  host: {
    class: 'app-avatar',
    '[class.app-avatar--small]': 'small()',
    '[style.background-image]': 'bgImage()',
    '[style.background-color]': 'avatar()?.bgColor',
  },
  imports: [MatIconModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AvatarComponent {
  photoUrl = input<string>();

  name = input<string>();

  small = input(false, { transform: booleanAttribute });

  bgImage = computed(() => {
    if (!this.photoUrl()) {
      return undefined;
    }
    return `url(${this.photoUrl()})`;
  });

  avatar = computed<Avatar | undefined>(() => {
    if (this.photoUrl()) {
      return undefined;
    }
    const name = this.name();
    if (!name) {
      return { bgColor: DEFAULT_COLOR };
    }
    return {
      bgColor: buildAvatarBgColor(name),
      initial: buildAvatarInitial(name),
    };
  });
}
