import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnakeComponent } from './snake.component';

describe('SnakeComponent', () => {
  let component: SnakeComponent;
  let fixture: ComponentFixture<SnakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnakeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SnakeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.snake()).toEqual([{ x: 10, y: 10 }]);
    expect(component.direction()).toEqual({ x: 0, y: -1 });
    expect(component.gameOver()).toBe(false);
    expect(component.score()).toBe(0);
    expect(component.isPlaying()).toBe(false);
    expect(component.showDebug()).toBe(false);
  });

  it('should toggle game state', () => {
    expect(component.isPlaying()).toBe(false);

    component.toggleGame();
    expect(component.isPlaying()).toBe(true);

    component.toggleGame();
    expect(component.isPlaying()).toBe(false);
  });

  it('should reset game to initial state', () => {
    component.score.set(100);
    component.gameOver.set(true);
    component.isPlaying.set(true);

    component.resetGame();

    expect(component.snake()).toEqual([{ x: 10, y: 10 }]);
    expect(component.direction()).toEqual({ x: 0, y: -1 });
    expect(component.score()).toBe(0);
    expect(component.gameOver()).toBe(false);
    expect(component.isPlaying()).toBe(false);
  });

  it('should detect snake head position', () => {
    component.snake.set([{ x: 5, y: 5 }, { x: 5, y: 6 }]);

    const headIndex = 5 * component.gridSize + 5; // y * gridSize + x
    expect(component.isSnakeHead(headIndex)).toBe(true);
    expect(component.isSnakeHead(0)).toBe(false);
  });

  it('should detect snake body position', () => {
    component.snake.set([{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }]);

    const bodyIndex = 6 * component.gridSize + 5;
    expect(component.isSnakeBody(bodyIndex)).toBe(true);

    const headIndex = 5 * component.gridSize + 5;
    expect(component.isSnakeBody(headIndex)).toBe(false);
  });

  it('should detect food position', () => {
    component.food.set({ x: 10, y: 10 });

    const foodIndex = 10 * component.gridSize + 10;
    expect(component.isFood(foodIndex)).toBe(true);
    expect(component.isFood(0)).toBe(false);
  });

  it('should handle direction changes with keyboard', () => {
    const event = new KeyboardEvent('keydown', { key: 'z' });
    component.isPlaying.set(true);

    component.handleKeyPress(event);
    expect(component.direction()).toEqual({ x: 0, y: -1 });
  });

  it('should not change direction when game is not playing', () => {
    const initialDirection = component.direction();
    const event = new KeyboardEvent('keydown', { key: 'd' });
    component.isPlaying.set(false);

    component.handleKeyPress(event);
    expect(component.direction()).toEqual(initialDirection);
  });

  it('should toggle debug mode with F12', () => {
    const event = new KeyboardEvent('keydown', { key: 'F12' });
    component.isPlaying.set(true);

    expect(component.showDebug()).toBe(false);
    component.handleKeyPress(event);
    expect(component.showDebug()).toBe(true);
  });

  it('should prevent snake from reversing direction', () => {
    component.direction.set({ x: 1, y: 0 }); // moving right
    component.isPlaying.set(true);

    const event = new KeyboardEvent('keydown', { key: 'q' }); // try to go left
    component.handleKeyPress(event);

    expect(component.direction()).toEqual({ x: 1, y: 0 }); // should stay right
  });

  it('should detect new record', () => {
    component.score.set(100);
    component.highScore.set(100);

    expect(component.isNewRecord()).toBe(true);

    component.score.set(50);
    expect(component.isNewRecord()).toBe(false);
  });
});
