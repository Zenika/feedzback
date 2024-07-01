import { Component, ViewEncapsulation, booleanAttribute, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DEFAULT_COLOR } from './avatar.config';
import { buildInitial } from './avatar.utils';

@Component({
  selector: 'app-avatar',
  host: {
    class: 'app-avatar',
    '[class.app-avatar--small]': 'small()',
    '[style.background-image]': 'bgImage()',
    '[style.background-color]': 'bgColor()',
  },
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AvatarComponent {
  photoUrl = input<string>();

  initial = input(undefined, { alias: 'name', transform: (name?: string) => (name ? buildInitial(name) : undefined) });

  small = input(false, { transform: booleanAttribute });

  bgImage = computed(() => (this.photoUrl() ? `url(${this.photoUrl()})` : undefined));

  bgColor = computed(() => (this.photoUrl() ? undefined : this.initial()?.color ?? DEFAULT_COLOR));
}
