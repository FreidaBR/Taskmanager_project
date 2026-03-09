import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appOverdue]',
  standalone: true
})
export class OverdueDirective implements OnInit {
  @Input('appOverdue') dueDate: string = '';
  @Input() status: string = '';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.applyStyle();
  }

  private applyStyle() {
    if (!this.dueDate || this.status === 'completed') return;
    const isOverdue = new Date(this.dueDate) < new Date();
    if (isOverdue) {
      this.el.nativeElement.style.borderLeft = '4px solid #ef4444';
      this.el.nativeElement.style.background = 'rgba(239,68,68,0.05)';
    }
  }
}