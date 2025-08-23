import { Component, computed, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-tic-tac-toe.component',
  imports: [
    NgClass,
    FaIconComponent
  ],
  templateUrl: './tic-tac-toe.component.html'
})
export class TicTacToeComponent {
  board = signal<string[]>(Array(9).fill(''));
  currentPlayer = signal<'X' | 'O'>('X');
  gameOver = signal(false);
  winner = signal<string | null>(null);
  isDraw = signal(false);
  stats = signal({
    X: 0,
    O: 0,
    draws: 0
  });
  totalGames = computed(() => {
    const stats = this.stats();
    return stats.X + stats.O + stats.draws;
  });
  private readonly winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ] as const;

  makeMove(index: number): void {
    if (this.board()[index] !== '' || this.gameOver()) {
      return;
    }

    this.board.update(board => {
      const newBoard = [...board];
      newBoard[index] = this.currentPlayer();
      return newBoard;
    });

    if (this.checkWinner()) {
      this.gameOver.set(true);
      this.winner.set(this.currentPlayer());

      this.stats.update(stats => ({
        ...stats,
        [this.currentPlayer()]: stats[this.currentPlayer() as keyof typeof stats] + 1
      }));
      return;
    }

    if (this.board().every(cell => cell !== '')) {
      this.gameOver.set(true);
      this.isDraw.set(true);
      this.stats.update(stats => ({
        ...stats,
        draws: stats.draws + 1
      }));
      return;
    }

    this.currentPlayer.update(player => player === 'X' ? 'O' : 'X');
  }

  resetGame(): void {
    this.board.set(Array(9).fill(''));
    this.currentPlayer.set('X');
    this.gameOver.set(false);
    this.winner.set(null);
    this.isDraw.set(false);
  }

  resetStats(): void {
    this.stats.set({
      X: 0,
      O: 0,
      draws: 0
    });
    this.resetGame();
  }

  private checkWinner(): boolean {
    const board = this.board();
    return this.winningCombinations.some(combination => {
      const [a, b, c] = combination;
      return board[a] !== '' &&
        board[a] === board[b] &&
        board[b] === board[c];
    });
  }
}
