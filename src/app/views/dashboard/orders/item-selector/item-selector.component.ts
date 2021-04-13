import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-item-selector',
  templateUrl: './item-selector.component.html',
  styleUrls: ['./item-selector.component.scss']
})
export class ItemSelectorComponent implements OnInit {
   //   <app-item-selector [items]="items" (selectedItemDoneEventEmitter)="itemSelected($event)">
  @Input() items: any[];
  @Output() selectedItemDoneEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }
  selectItem(item) {
    this.selectedItemDoneEventEmitter.emit(item);
  }
}
