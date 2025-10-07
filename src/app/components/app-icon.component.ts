import { Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="flex flex-col items-center">
      <div
        class="mb-2 bg-white border-[8px] w-[112px] h-[112px] text-center rounded-[32px] flex items-center justify-center"
        [style.border-color]="borderColor"
      >
        <lucide-icon
          [name]="name"
          [size]="size"
          [style.color]="color"
        ></lucide-icon>
      </div>
      <label>{{ label }}</label>
    </div>
  `,
})
export class AppIconComponent {
  @Input() name!: string;
  @Input() label!: string;
  @Input() borderColor: string = '#EEECE7';
  @Input() color: string = '#EEECE7';
  @Input() size: number = 80;
}
