import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-status-card',
  styleUrls: ['./status-card.component.scss'],
  template: `
    <nb-card class="{{cardClass && cardClass.length > 0 ? cardClass: ''}}" [ngClass]="{'off': !on}">
      <div class="icon-container">
        <div class="icon status-{{ type }}">
          <ng-content></ng-content>
        </div>
      </div>

      <div class="details">
        <div class="title h6">{{ title }}</div>
        <div *ngIf="!subtitle || subtitle.length == 0" class="status paragraph-2">{{ on ? 'ON' : 'OFF' }}</div>
        <div *ngIf="subtitle && subtitle.length > 0" class="status paragraph-2">{{ subtitle }}</div>
      </div>
    </nb-card>
  `,
})
export class StatusCardComponent {

  @Input() title: string;
  @Input() titleClass: string;
  @Input() subtitle: string;
  @Input() type: string;
  @Input() on = true;
  @Input() cardClass: string;

}
