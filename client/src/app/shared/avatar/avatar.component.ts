import { Component, ViewEncapsulation, booleanAttribute, computed, input, resource } from '@angular/core';
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

  protected photoBlob = resource({
    params: () => this.photoUrl(),
    loader: async ({ params, abortSignal }) => {
      if (!params) {
        return undefined;
      }

      try {
        const photo = await fetch(params, { signal: abortSignal });
        if (!photo.ok) {
          throw new Error(); // Note: Google might respond "429 (Too Many Requests)"
        }
        return URL.createObjectURL(await photo.blob());
      } catch {
        console.warn('AvatarComponent: unable to fetch photo', this.photoUrl());
        return undefined;
      }
    },
  });

  protected hasPhoto = computed(() => this.photoBlob.isLoading() || this.photoBlob.hasValue());

  protected bgImage = computed(() => {
    const photoBlob = this.photoBlob.value();
    if (!photoBlob) {
      return undefined;
    }
    return `url(${photoBlob})`;
  });

  protected avatar = computed<Avatar | undefined>(() => {
    if (this.hasPhoto()) {
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
