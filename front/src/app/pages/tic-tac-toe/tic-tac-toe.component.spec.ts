import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicTacToeComponent } from './tic-tac-toe.component';

describe('TicTacToeComponent', () => {
  let component: TicTacToeComponent;
  let fixture: ComponentFixture<TicTacToeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicTacToeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TicTacToeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.board()).toEqual(Array(9).fill(''));
    expect(component.currentPlayer()).toBe('X');
    expect(component.gameOver()).toBe(false);
    expect(component.winner()).toBeNull();
    expect(component.isDraw()).toBe(false);
    expect(component.stats()).toEqual({ X: 0, O: 0, draws: 0 });
    expect(component.totalGames()).toBe(0);
  });

  it('should make a move and switch player', () => {
    component.makeMove(0);

    expect(component.board()[0]).toBe('X');
    expect(component.currentPlayer()).toBe('O');
  });

  it('should not allow move on occupied cell', () => {
    component.makeMove(0);
    component.makeMove(0); // Try to play on same cell

    expect(component.board()[0]).toBe('X');
    expect(component.currentPlayer()).toBe('O'); // Should still be O's turn
  });

  it('should not allow move when game is over', () => {
    component.gameOver.set(true);
    component.makeMove(0);

    expect(component.board()[0]).toBe('');
  });

  it('should detect winner - horizontal line', () => {
    component.makeMove(0); // X
    component.makeMove(3); // O
    component.makeMove(1); // X
    component.makeMove(4); // O
    component.makeMove(2); // X wins

    expect(component.gameOver()).toBe(true);
    expect(component.winner()).toBe('X');
    expect(component.stats().X).toBe(1);
  });

  it('should detect winner - vertical line', () => {
    component.makeMove(0); // X
    component.makeMove(1); // O
    component.makeMove(3); // X
    component.makeMove(2); // O
    component.makeMove(6); // X wins

    expect(component.gameOver()).toBe(true);
    expect(component.winner()).toBe('X');
  });

  it('should detect winner - diagonal line', () => {
    component.makeMove(0); // X
    component.makeMove(1); // O
    component.makeMove(4); // X
    component.makeMove(2); // O
    component.makeMove(8); // X wins

    expect(component.gameOver()).toBe(true);
    expect(component.winner()).toBe('X');
  });

  it('should detect draw', () => {
    // Fill board without winner
    const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
    moves.forEach(move => component.makeMove(move));

    expect(component.gameOver()).toBe(true);
    expect(component.isDraw()).toBe(true);
    expect(component.winner()).toBeNull();
    expect(component.stats().draws).toBe(1);
  });

  it('should reset game', () => {
    component.makeMove(0);
    component.gameOver.set(true);
    component.winner.set('X');

    component.resetGame();

    expect(component.board()).toEqual(Array(9).fill(''));
    expect(component.currentPlayer()).toBe('X');
    expect(component.gameOver()).toBe(false);
    expect(component.winner()).toBeNull();
    expect(component.isDraw()).toBe(false);
  });

  it('should reset stats and game', () => {
    component.stats.set({ X: 5, O: 3, draws: 2 });
    component.makeMove(0);

    component.resetStats();

    expect(component.stats()).toEqual({ X: 0, O: 0, draws: 0 });
    expect(component.board()).toEqual(Array(9).fill(''));
    expect(component.totalGames()).toBe(0);
  });

  it('should calculate total games correctly', () => {
    component.stats.set({ X: 5, O: 3, draws: 2 });

    expect(component.totalGames()).toBe(10);
  });

  it('should update O wins when O wins', () => {
    component.currentPlayer.set('O');
    component.makeMove(0); // O
    component.makeMove(1); // X
    component.makeMove(3); // O
    component.makeMove(2); // X
    component.makeMove(6); // O wins

    expect(component.winner()).toBe('O');
    expect(component.stats().O).toBe(1);
  });
});
