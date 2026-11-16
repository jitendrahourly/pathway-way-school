import { Directive, ElementRef, HostListener, OnInit, OnDestroy, inject } from '@angular/core';

@Directive({
  selector: '[appTiltCard]',
  standalone: true,
})
export class TiltCardDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private reducedMotion = false;
  private finePointer = true;

  ngOnInit(): void {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    this.el.nativeElement.style.transformStyle = 'preserve-3d';
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.reducedMotion || !this.finePointer) return;
    const host = this.el.nativeElement;
    const rect = host.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const rotY = x * 12;
    const rotX = -y * 10;
    host.style.transform = `perspective(1000px) translateY(-5px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
    host.style.boxShadow = '0 18px 40px rgba(36, 24, 70, 0.16)';
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    const host = this.el.nativeElement;
    host.style.transform = '';
    host.style.boxShadow = '';
  }

  ngOnDestroy(): void {
    const host = this.el.nativeElement;
    host.style.transform = '';
    host.style.boxShadow = '';
  }
}
