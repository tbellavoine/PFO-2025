import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageViewerComponent } from './image-viewer.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { TabsService } from '@services/tabs.service';
import { ImageAssetsMap } from '@components/explorer/assets-images.const';

describe('ImageViewerComponent', () => {
  let component: ImageViewerComponent;
  let fixture: ComponentFixture<ImageViewerComponent>;
  let tabsService: MockedObject<TabsService>;
  let paramMapSubject: BehaviorSubject<ParamMap>;

  beforeEach(async () => {
    // Mock ImageAssetsMap
    vi.spyOn(ImageAssetsMap, 'get').mockReturnValue('test-image.png');

    tabsService = {
      addTab: vi.fn().mockName('TabsService.addTab'),
    } as unknown as MockedObject<TabsService>;

    paramMapSubject = new BehaviorSubject<ParamMap>({
      get: (key: string) => 'test-image',
      getAll: () => [],
      has: () => true,
      keys: [] as string[],
    });

    const mockActivatedRoute = {
      paramMap: paramMapSubject.asObservable(),
      snapshot: {
        params: { imageName: 'test-image' },
      },
    };

    await TestBed.configureTestingModule({
      imports: [ImageViewerComponent],
      providers: [
        { provide: TabsService, useValue: tabsService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.zoomLevel()).toBe(1);
    expect(component.panX()).toBe(0);
    expect(component.panY()).toBe(0);
    expect(component.isPanning()).toBe(false);
    expect(component.showOverlay()).toBe(false);
    expect(component.isImageLoaded()).toBe(false);
  });

  it('should handle zoom in', () => {
    const initialZoom = component.zoomLevel();
    component.zoomIn();
    expect(component.zoomLevel()).toBeGreaterThan(initialZoom);
  });

  it('should handle zoom out', () => {
    component.zoomLevel.set(2);
    const initialZoom = component.zoomLevel();
    component.zoomOut();
    expect(component.zoomLevel()).toBeLessThan(initialZoom);
  });

  it('should handle panning', () => {
    component.zoomLevel.set(2);
    const mockEvent = new MouseEvent('mousedown', {
      clientX: 100,
      clientY: 100,
    });

    component.startPan(mockEvent);
    expect(component.isPanning()).toBe(true);
    expect(component.lastPanPoint()).toEqual({ x: 100, y: 100 });

    const panEvent = new MouseEvent('mousemove', {
      clientX: 150,
      clientY: 150,
    });

    component.onPan(panEvent);
    expect(component.panX()).toBe(50);
    expect(component.panY()).toBe(50);

    component.stopPan();
    expect(component.isPanning()).toBe(false);
  });

  it('should handle keyboard shortcuts', () => {
    const zoomInEvent = new KeyboardEvent('keydown', {
      key: '+',
      ctrlKey: true,
    });

    const initialZoom = component.zoomLevel();
    component.onKeyDown(zoomInEvent);
    expect(component.zoomLevel()).toBeGreaterThan(initialZoom);

    const overlayEvent = new KeyboardEvent('keydown', {
      key: 'i',
    });

    component.onKeyDown(overlayEvent);
    expect(component.showOverlay()).toBe(true);
  });

  it('should update route parameters', () => {
    paramMapSubject.next({
      get: (key: string) => 'new-image',
      getAll: () => [],
      has: () => true,
      keys: [] as string[],
    });

    fixture.detectChanges();
    expect(ImageAssetsMap.get).toHaveBeenCalledWith('new-image');
    expect(tabsService.addTab).toHaveBeenCalled();
  });

  it('should cleanup event listeners on destroy', () => {
    const removeEventListenerSpy = vi
      .spyOn(document, 'removeEventListener')
      .mockReturnValue(undefined);
    component.ngOnDestroy();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});
