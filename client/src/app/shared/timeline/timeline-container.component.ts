import { coerceNumberProperty } from '@angular/cdk/coercion';
import { BreakpointObserver, LayoutModule } from '@angular/cdk/layout';
import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { outputFromObservable, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, of, switchMap } from 'rxjs';
import { TimelineItemComponent } from './timeline-item.component';
import { TIMELINE_BREAKPOINT } from './timeline.token';
import { TimelineDirection, TimelineItem, TimelineLineSize } from './timeline.types';

@Component({
  selector: 'app-timeline-container',
  host: {
    class: 'app-timeline',

    '[class.app-timeline--bullet-points]': 'bulletPoints()',
    '[class.app-timeline--reverse]': 'reverse()',
    '[class.app-timeline--horizontal]': '!computedVertical()',
    '[class.app-timeline--vertical]': 'computedVertical()',

    '[style.--app-timeline-vertical-content-size]': 'verticalContentSize()',
    '[style.--app-timeline-line-size-horizontal]': 'lineSize().horizontal',
    '[style.--app-timeline-line-size-vertical]': 'lineSize().vertical',
    '[style.--app-timeline-background-color]': 'bgColor()',
  },
  imports: [NgTemplateOutlet, LayoutModule],
  templateUrl: './timeline-container.component.html',
  styleUrl: './timeline-container.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TimelineContainerComponent {
  itemsAsContent = contentChildren(TimelineItemComponent);

  /** The list of items to display. */
  items = input<string[]>([]);

  protected computedItems = computed<TimelineItem[]>(() => {
    if (this.itemsAsContent().length) {
      return this.itemsAsContent().map(
        ({ contentTemplate, iconDirective }) =>
          ({
            contentTemplate: contentTemplate(),
            iconTemplate: iconDirective()?.template,
          }) satisfies TimelineItem,
      );
    }

    return this.items().map((content) => ({ content }) satisfies TimelineItem);
  });

  protected trackByItem(_: number, item: TimelineItem) {
    return item.contentTemplate ?? item.content;
  }

  /** Display the items as pending from the specified index. */
  pendingFromIndex = input(undefined, {
    transform: (value: number | string | undefined) => coerceNumberProperty(value, null) ?? undefined,
  });

  /** Display bullet points as small dots. */
  bulletPoints = input(false, { transform: booleanAttribute });

  /** Reverse the bullet and content positions. */
  reverse = input(false, { transform: booleanAttribute });

  /**
   * Determines the size of the line between bullets.
   *
   * @example
   * { horizontal: 10 }
   * { vertical: 2 }
   * { horizontal: 10, vertical: 2 }
   */
  lineSize = input<TimelineLineSize>({});

  /** Indicates the background color of the timeline. */
  bgColor = input<string>();

  /**
   * Switch between vertical and horizontal timeline based on a breakpoint.
   *
   * @example
   * // Use provided breakpoint (`TIMELINE_BREAKPOINT` injection token)
   * // or default breakpoint (`TIMELINE_BREAKPOINT_DEFAULT` which is `768px`).
   * true
   *
   * // Use specified breakpoint.
   * '768px'
   */
  breakpoint = input(false, {
    // Note: Like the `booleanAttribute()` function, if `value` is '' then `true` is returned
    transform: (value: string | boolean) => (value === '' ? true : value),
  });

  private defaultBreakpoint = inject(TIMELINE_BREAKPOINT);

  private breakpointObserver = inject(BreakpointObserver);

  private verticalBreakpoint = toSignal(
    toObservable(this.breakpoint).pipe(
      switchMap((value) => {
        if (!value) {
          return of(undefined);
        }
        const minWidth = value === true ? this.defaultBreakpoint : value;
        return this.breakpointObserver
          .observe(`(min-width: ${minWidth})`)
          .pipe(map(({ matches: isHorizontal }) => !isHorizontal));
      }),
    ),
  );

  /** Display timeline in horizontal or vertical direction. */
  vertical = input(false, { transform: booleanAttribute });

  protected computedVertical = computed(() => this.verticalBreakpoint() ?? this.vertical());

  /** Computed timeline direction from current `vertical` and `breakpoint` inputs */
  direction = outputFromObservable<TimelineDirection>(
    toObservable(this.computedVertical).pipe(map((vertical) => (vertical ? 'vertical' : 'horizontal'))),
  );

  /** Limit the content width (in `em`) when the timeline is in vertical direction. */
  verticalContentSize = input(undefined, {
    transform: (value: number | string | undefined) => {
      const width = coerceNumberProperty(value, 0);
      return width ? `${width}em` : undefined;
    },
  });
}
