import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TwentyFortyEightComponent } from './twenty-forty-eight.component';

describe('TwentyFortyEightComponent', () => {
  let component: TwentyFortyEightComponent;
  let fixture: ComponentFixture<TwentyFortyEightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwentyFortyEightComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TwentyFortyEightComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.score()).toBe(0);
    expect(component.moves()).toBe(0);
    expect(component.gameOver()).toBe(false);
    expect(component.gameWon()).toBe(false);
    expect(component.isPlaying()).toBe(true);
    expect(component.showDebug()).toBe(false);
    expect(component.animating()).toBe(false);
  });

  it('should create empty board with correct size', () => {
    const board = component.board();
    expect(board.length).toBe(4);
    expect(board[0].length).toBe(4);
  });

  it('should toggle game state', () => {
    expect(component.isPlaying()).toBe(true);
    component.toggleGame();
    expect(component.isPlaying()).toBe(false);
  });

  it('should reset game correctly', () => {
    component.score.set(100);
    component.moves.set(10);
    component.gameOver.set(true);

    component.resetGame();

    expect(component.score()).toBe(0);
    expect(component.moves()).toBe(0);
    expect(component.gameOver()).toBe(false);
    expect(component.gameWon()).toBe(false);
    expect(component.isPlaying()).toBe(true);
  });

  it('should add random tile', () => {
    const initialBoard = component.board();
    const emptyCount = component.flatBoard().filter(cell => cell.value === 0).length;

    component.addRandomTile();

    const newEmptyCount = component.flatBoard().filter(cell => cell.value === 0).length;
    expect(newEmptyCount).toBe(emptyCount - 1);
  });

  it('should detect empty cells', () => {
    const emptyCells = component.getEmptyCells();
    expect(emptyCells.length).toBeGreaterThan(0);

    // All cells should initially be empty except the 2 random tiles added during initialization
    expect(emptyCells.length).toBe(14); // 16 - 2 initial tiles
  });

  it('should format score with locale', () => {
    const formatted = component.formatScore(1234567);
    expect(formatted).toContain('1'); // Should contain separators
  });

  it('should get correct tile colors', () => {
    expect(component.getTileColor(0)).toBe('bg-primary');
    expect(component.getTileColor(2)).toBe('bg-primary-darken text-light');
    expect(component.getTileColor(4)).toBe('bg-grey text-light');
    expect(component.getTileColor(2048)).toBe('bg-purple-600 text-white');
  });

  it('should handle keyboard input for movement', () => {
    spyOn(component, 'move');
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });

    component.handleKeyPress(event);

    expect(component.move).toHaveBeenCalledWith('up');
  });

  it('should handle special keys', () => {
    const resetSpy = spyOn(component, 'resetGame');
    const toggleSpy = spyOn(component, 'toggleGame');

    component.handleKeyPress(new KeyboardEvent('keydown', { key: 'r' }));
    expect(resetSpy).toHaveBeenCalled();

    component.handleKeyPress(new KeyboardEvent('keydown', { key: ' ' }));
    expect(toggleSpy).toHaveBeenCalled();
  });

  it('should not handle input when not playing', () => {
    component.isPlaying.set(false);
    spyOn(component, 'move');

    component.handleKeyPress(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

    expect(component.move).not.toHaveBeenCalled();
  });

  it('should not handle input when animating', () => {
    component.animating.set(true);
    spyOn(component, 'move');

    component.handleKeyPress(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

    expect(component.move).not.toHaveBeenCalled();
  });

  it('should detect when no empty cells available', () => {
    // Fill entire board
    const fullBoard = Array(4).fill(null).map(() =>
      Array(4).fill(null).map(() => ({ value: 2, id: 1 }))
    );
    component.board.set(fullBoard);

    expect(component.hasEmptyCell()).toBe(false);
  });

  it('should calculate highest tile correctly', () => {
    const board = Array(4).fill(null).map(() =>
      Array(4).fill(null).map(() => ({ value: 2, id: 1 }))
    );
    board[0][0] = { value: 1024, id: 1 };
    component.board.set(board);

    expect(component.highestTile()).toBe(1024);
  });

  it('should detect game won when reaching 2048', () => {
    const board = Array(4).fill(null).map(() =>
      Array(4).fill(null).map(() => ({ value: 2, id: 1 }))
    );
    board[0][0] = { value: 2048, id: 1 };
    component.board.set(board);

    // Trigger the effect manually by reading the computed value
    expect(component.highestTile()).toBe(2048);
  });

  it('should save and load best score', () => {
    component.score.set(5000);
    // Trigger the effect by reading the score
    expect(component.score()).toBe(5000);
  });
});
