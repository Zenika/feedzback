import { Subscription } from 'rxjs';

import { BooleanInput, coerceBooleanProperty, coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { BreakpointObserver, LayoutModule } from '@angular/cdk/layout';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  HostBinding,
  inject,
  Input,
  OnDestroy,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';

import { TimelineItemComponent } from './timeline-item.component';
import { TIMELINE_BREAKPOINT_DEFAULT } from './timeline.config';
import { TIMELINE_BREAKPOINT } from './timeline.token';
import { TimelineItem, TimelineLineSize } from './timeline.types';

@Component({
  selector: 'app-timeline-container',
  imports: [NgIf, NgFor, NgTemplateOutlet, LayoutModule],
  templateUrl: './timeline-container.component.html',
  styleUrl: './timeline-container.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TimelineContainerComponent implements AfterContentInit, OnDestroy {
  protected _items: TimelineItem[] = [];

  /** The list of items to display. */
  @Input() set items(items: string[]) {
    this._items = items.map((content) => ({ content }) as TimelineItem);
  }

  protected _pendingFromIndex?: number;

  /** Display the items as pending from the specified index. */
  @Input() set pendingFromIndex(value: NumberInput) {
    this._pendingFromIndex = coerceNumberProperty(value, null) ?? undefined;
  }

  protected _bulletPoints = false;

  /** Display bullet points instead of bullet content. */
  @Input() set bulletPoints(value: BooleanInput) {
    this._bulletPoints = coerceBooleanProperty(value);
  }

  /** Reverse the bullet and content positions. */
  @Input() reverse: BooleanInput = false;

  /** Display timeline in horizontal or vertical direction. */
  @Input() vertical: BooleanInput = false;

  protected _verticalContentSize?: string;

  /** Limit the size (width) of the content when the timeline is vertical. */
  @Input() set verticalContentSize(value: NumberInput) {
    const number = coerceNumberProperty(value, null);
    this._verticalContentSize = number !== null ? `${number}em` : undefined;
  }

  /**
   * Determines the size of the line between bullets.
   *
   * @example
   * { horizontal: 10 }
   * { vertical: 2 }
   * { horizontal: 10, vertical: 2 }
   */
  @Input() lineSize: TimelineLineSize = {};

  /** Indicates the background color of the timeline. */
  @Input() bgColor?: string;

  @HostBinding('class.av-timeline') hasCss = true;

  @HostBinding('class.av-timeline--bullet-points') get hasBulletPointsCss() {
    return coerceBooleanProperty(this._bulletPoints);
  }

  @HostBinding('class.av-timeline--reverse') get hasReverseCss() {
    return coerceBooleanProperty(this.reverse);
  }

  @HostBinding('class.av-timeline--horizontal') get hasHorizontalCss() {
    return !coerceBooleanProperty(this.vertical);
  }

  @HostBinding('class.av-timeline--vertical') get hasVerticalCss() {
    return coerceBooleanProperty(this.vertical);
  }

  @HostBinding('style.--av-timeline-vertical-content-size') get hasVerticalContentSizeStyle() {
    return this._verticalContentSize;
  }

  @HostBinding('style.--av-timeline-line-size-horizontal') get hasLineSizeHorizontalStyle() {
    return this.lineSize.horizontal;
  }

  @HostBinding('style.--av-timeline-line-size-vertical') get hasLineSizeVerticalStyle() {
    return this.lineSize.vertical;
  }

  @HostBinding('style.--av-timeline-background-color') get hasBgColorStyle() {
    return this.bgColor;
  }

  protected trackByItem(_: number, item: TimelineItem) {
    return item.contentTemplate ?? item.content;
  }

  private itemsQueryListSubscription?: Subscription;

  @ContentChildren(TimelineItemComponent) itemsQueryList!: QueryList<TimelineItemComponent>;

  ngAfterContentInit() {
    // Items from the `QueryList` have priority over those from the `@Input`.
    // Therefore, always subscribe to changes...
    this.itemsQueryListSubscription = this.itemsQueryList?.changes.subscribe(() => this.setItemsFromQueryList());

    // ...but initially, the `QueryList` is taken into account only if it is not empty.
    if (this.itemsQueryList?.length) {
      this.setItemsFromQueryList();
    }
  }

  private setItemsFromQueryList() {
    this._items =
      this.itemsQueryList?.map(({ contentTemplate, iconTemplate }) => ({ contentTemplate, iconTemplate })) ?? [];
    this.changeDetectorRef.markForCheck();
  }

  private BREAKPOINT_DEFAULT = inject(TIMELINE_BREAKPOINT, { optional: true });

  private breakpointObserver = inject(BreakpointObserver);

  private changeDetectorRef = inject(ChangeDetectorRef);

  private breakpointSubscription?: Subscription;

  /**
   * Switch between vertical and horizontal timeline based on a breakpoint.
   *
   * @example
   * // Use provided breakpoint (`TIMELINE_BREAKPOINT` injection token)
   * // or default breakpoint (`TIMELINE_BREAKPOINT_DEFAULT` which is `1024px`).
   * true
   *
   * // Use specified breakpoint.
   * '768px'
   */
  @Input() set breakpoint(value: string | boolean | null) {
    this.breakpointSubscription?.unsubscribe();
    if (!value) {
      return;
    }
    const minWidth = value === true ? (this.BREAKPOINT_DEFAULT ?? TIMELINE_BREAKPOINT_DEFAULT) : value;
    this.breakpointSubscription = this.breakpointObserver
      .observe(`(min-width: ${minWidth})`)
      .subscribe(({ matches: isDesktop }) => {
        this.vertical = !isDesktop;
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.itemsQueryListSubscription?.unsubscribe();
    this.breakpointSubscription?.unsubscribe();
  }
}
