import { Component, ViewEncapsulation, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-brand-name',
  host: {
    class: 'app-brand-name',
    '[attr.aria-label]': '"FeedZback"',
  },
  imports: [MatIconModule],
  templateUrl: './brand-name.component.html',
  styleUrl: './brand-name.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BrandNameComponent {
  textTransform = input<'lowercase' | 'capitalize' | 'uppercase'>('lowercase');

  protected config = computed(() => {
    const textTransform = this.textTransform();
    switch (textTransform) {
      case 'lowercase':
        return { feed: 'feed', back: 'back' };

      case 'capitalize':
        return { feed: 'Feed', back: 'back' };

      case 'uppercase':
        return { feed: 'FEED', back: 'BACK' };
    }
  });
}
