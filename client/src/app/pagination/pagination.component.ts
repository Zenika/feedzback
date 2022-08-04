import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Input() current: number = 0
  @Input() total: number = 0
  public pages: number[] = []

  @Output() onChangePage: EventEmitter<number> = new EventEmitter<number>()

  constructor() { }

  ngOnInit(): void {
  }
  public onGoTo(page: number) : void {
    this.onChangePage.emit(page)
  }
  public onNext(page: number) : void {
    this.onChangePage.emit(page +1)
  }
  public onPrevious(page: number): void {
    this.onChangePage.emit(page -1)
  }
  private getPages(current: number, total: number): number[] {
    if(total <=7)
    return [...Array(total).keys()].map(x => ++x)
    else if(current > 5) {
      if(current >= total - 4)
      return [1, -1, total -4, total - 3, total -2, total -1, total]
      else
      return [1, -1, current -1, current, current +1, -1, total]
    } 
    else
    return [1, 2, 3, 4, 5, -1, total]
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(
      (changes['current'] && changes['current'].currentValue) ||
      (changes['total'] && changes['total'].currentValue)
    )
    this.pages = this.getPages(this.current, this.total)
  }
}
