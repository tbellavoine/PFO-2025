import { Component, computed, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsService } from '@services/tabs.service';
import { Tab } from '@models/tab.model';
import { Path } from '@enums/path.enum';
import { ImageAssetsMap } from '@components/explorer/assets-images.const';

@Component({
  selector: 'app-image-viewer',
  imports: [],
  templateUrl: './image-viewer.component.html',
  host: {
    class: 'h-full w-full overflow-hidden',
  }
})
export class ImageViewerComponent implements OnInit, OnDestroy {
  private static readonly INITIAL_ZOOM = 1;
  private static readonly MIN_ZOOM_ABSOLUTE = 0.1;
  private static readonly MAX_ZOOM = 5;
  private static readonly ZOOM_STEP = 1.2;
  private static readonly ZOOM_WHEEL_FACTOR_IN = 1.1;
  private static readonly ZOOM_WHEEL_FACTOR_OUT = 0.9;
  @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;
  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;
  public imageName = signal<string | undefined>('');
  public imagePath = computed(() => '/assets/images/' + this.imageName());
  public zoomLevel = signal<number>(ImageViewerComponent.INITIAL_ZOOM);
  public minZoomLevel = signal<number>(ImageViewerComponent.MIN_ZOOM_ABSOLUTE);
  public panX = signal<number>(0);
  public panY = signal<number>(0);
  public isPanning = signal<boolean>(false);
  public showOverlay = signal<boolean>(false);
  public isImageLoaded = signal<boolean>(false);
  public originalImageSize = signal<{ width: number, height: number }>({ width: 0, height: 0 });
  public lastPanPoint = signal<{ x: number, y: number }>({ x: 0, y: 0 });

  private readonly activatedRoute = inject(ActivatedRoute);
  public imageTab = signal<Tab>(new Tab(
    this.imageName(),
    ['fas', 'image'],
    'text-blue-300',
    this.imageName(),
    [Path.PREVIEW, this.activatedRoute.snapshot.params['imageName']]
  ));
  private readonly tabsService = inject(TabsService);

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.imageName.set(ImageAssetsMap.get(params.get('imageName') as string));
      this.imageTab.set(new Tab(
        this.imageName(),
        ['fas', 'image'],
        'text-blue-300',
        this.imageName(),
        [Path.PREVIEW, this.activatedRoute.snapshot.params['imageName']]
      ));
      this.tabsService.addTab(this.imageTab());
      this.resetView();
    });
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  /**
   * Cleans up event listeners when the component is destroyed.
   */
  ngOnDestroy() {
    document.removeEventListener('keydown', this.onKeyDown.bind(this));
  }

  /**
   * Handles the image load event, setting the original image size and adjusting zoom and pan settings.
   */
  public onImageLoad(): void {
    const img = this.imageElement.nativeElement;
    this.originalImageSize.set({
      width: img.naturalWidth,
      height: img.naturalHeight
    });

    this.calculateMinZoom();
    this.fitToScreen();
    this.isImageLoaded.set(true);
  }

  /**
   * Zooms in the image by a predefined step.
   */
  public zoomIn(): void {
    this.setZoom(this.zoomLevel() * ImageViewerComponent.ZOOM_STEP);
  }

  /**
   * Zooms out the image by a predefined step.
   */
  public zoomOut(): void {
    this.setZoom(this.zoomLevel() / ImageViewerComponent.ZOOM_STEP);
  }

  /**
   * Resets the zoom level to the minimum zoom level and centers the image.
   */
  public resetZoom(): void {
    this.setZoom(this.minZoomLevel());
    this.resetPan();
  }

  /**
   * Handles window resize events to recalculate minimum zoom and adjust current zoom if necessary.
   */
  public onResize(): void {
    this.calculateMinZoom();
    if (this.zoomLevel() < this.minZoomLevel()) {
      this.setZoom(this.minZoomLevel());
    }
  }

  /**
   * Fits the image to the screen by adjusting the zoom level and centering the image.
   */
  public fitToScreen(): void {
    if (!this.imageContainer || !this.originalImageSize().width) return;

    const container = this.imageContainer.nativeElement;
    const containerRect = container.getBoundingClientRect();

    const scaleX = containerRect.width / this.originalImageSize().width;
    const scaleY = containerRect.height / this.originalImageSize().height;
    const scale = Math.min(scaleX, scaleY);

    this.setZoom(scale);
    this.resetPan();
  }

  /**
   * Initiates the panning process when the user starts dragging the image.
   * @param event
   */
  public startPan(event: MouseEvent): void {
    if (this.zoomLevel() <= this.minZoomLevel()) {
      return;
    }

    this.isPanning.set(true);
    this.lastPanPoint.set({ x: event.clientX, y: event.clientY });
    event.preventDefault();
  }

  /**
   * Handles the panning movement as the user drags the image.
   * @param event
   */
  public onPan(event: MouseEvent): void {
    if (!this.isPanning()) return;

    const deltaX = event.clientX - this.lastPanPoint().x;
    const deltaY = event.clientY - this.lastPanPoint().y;

    this.panX.set(this.panX() + deltaX);
    this.panY.set(this.panY() + deltaY);

    this.lastPanPoint.set({ x: event.clientX, y: event.clientY });
    event.preventDefault();
  }

  /**
   * Stops the panning process when the user releases the mouse button.
   */
  public stopPan(): void {
    this.isPanning.set(false);
    this.updateCursor();
  }

  /**
   * Handles zooming in and out using the mouse wheel, centering the zoom on the mouse position.
   * @param event
   */
  public onWheel(event: WheelEvent): void {
    event.preventDefault();

    const delta = event.deltaY;
    const zoomFactor = delta > 0
      ? ImageViewerComponent.ZOOM_WHEEL_FACTOR_OUT
      : ImageViewerComponent.ZOOM_WHEEL_FACTOR_IN;

    const oldZoom = this.zoomLevel();
    const targetZoom = oldZoom * zoomFactor;
    const willReachMinZoom = targetZoom <= this.minZoomLevel();

    this.setZoom(targetZoom);
    const newZoom = this.zoomLevel();

    if (willReachMinZoom && newZoom === this.minZoomLevel()) {
      this.resetPan();
      return;
    }

    if (newZoom !== oldZoom && newZoom > this.minZoomLevel()) {
      this.zoomToMousePosition(event, oldZoom, newZoom);
    }
  }

  /**
   * Handles keyboard shortcuts for zooming and toggling the overlay.
   * @param event
   */
  public onKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) {
      this.handleZoomKeyboardShortcuts(event);
    }

    if (event.key === 'i' || event.key === 'I') {
      this.showOverlay.set(!this.showOverlay());
    }
  }

  /**
   * Generates the CSS transform string for the image based on current pan and zoom levels.
   * @returns string
   */
  public getTransform(): string {
    return `translate(${this.panX()}px, ${this.panY()}px) scale(${this.zoomLevel()})`;
  }

  /**
   * Calculates the minimum zoom level based on the container size and original image dimensions.
   * @private
   */
  private calculateMinZoom(): void {
    if (!this.imageContainer || !this.originalImageSize().width) return;

    const container = this.imageContainer.nativeElement;
    const containerRect = container.getBoundingClientRect();

    const scaleX = containerRect.width / this.originalImageSize().width;
    const scaleY = containerRect.height / this.originalImageSize().height;
    const minScale = Math.min(scaleX, scaleY);

    this.minZoomLevel.set(Math.max(ImageViewerComponent.MIN_ZOOM_ABSOLUTE, minScale));
  }

  /**
   * Sets the zoom level, ensuring it stays within defined bounds, and updates the cursor style.
   * @param level
   * @private
   */
  private setZoom(level: number): void {
    const min = this.minZoomLevel();
    const max = ImageViewerComponent.MAX_ZOOM;
    const newZoom = Math.max(min, Math.min(max, level));

    if (newZoom === min && this.zoomLevel() !== min) {
      this.resetPan();
    }

    this.zoomLevel.set(newZoom);

    if (this.imageContainer) {
      this.updateCursor();
    }
  }

  /**
   * Resets the entire view including zoom level, pan position, and image load state.
   * @private
   */
  private resetView(): void {
    this.zoomLevel.set(ImageViewerComponent.INITIAL_ZOOM);
    this.resetPan();
    this.isImageLoaded.set(false);
  }

  /**
   * Updates the cursor style based on the current interaction state (panning or zoom level).
   * @private
   */
  private updateCursor(): void {
    if (!this.imageContainer) return;

    let cursor: string;
    if (this.isPanning()) {
      cursor = 'grabbing';
    } else if (this.zoomLevel() > this.minZoomLevel()) {
      cursor = 'grab';
    } else {
      cursor = 'default';
    }

    this.imageContainer.nativeElement.style.cursor = cursor;
  }

  /**
   * Adjusts the pan position to keep the zoom centered around the mouse position.
   * @param event
   * @param oldZoom
   * @param newZoom
   * @private
   */
  private zoomToMousePosition(event: WheelEvent, oldZoom: number, newZoom: number): void {
    const rect = this.imageContainer.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const relativeMouseX = mouseX - centerX;
    const relativeMouseY = mouseY - centerY;

    const zoomRatio = newZoom / oldZoom;

    const newPanX = this.panX() + relativeMouseX * (1 - zoomRatio);
    const newPanY = this.panY() + relativeMouseY * (1 - zoomRatio);

    this.panX.set(newPanX);
    this.panY.set(newPanY);
  }

  /**
   * Handles keyboard shortcuts for zooming in, zooming out, and resetting zoom.
   * @param event
   * @private
   */
  private handleZoomKeyboardShortcuts(event: KeyboardEvent): void {
    switch (event.key) {
      case '+':
      case '=':
        event.preventDefault();
        this.zoomIn();
        break;
      case '-':
        event.preventDefault();
        this.zoomOut();
        break;
      case '0':
        event.preventDefault();
        this.resetZoom();
        break;
    }
  }

  /**
   * Resets the pan position to the origin (0,0).
   * @private
   */
  private resetPan(): void {
    this.panX.set(0);
    this.panY.set(0);
  }
}
