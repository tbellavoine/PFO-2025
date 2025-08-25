import { Component, computed, effect, HostListener, signal } from '@angular/core';
import { NgClass } from '@angular/common';

interface Cell {
  value: number;
  id: number;
  merged?: boolean;
  isNew?: boolean;
}

interface GameState {
  board: Cell[][];
  score: number;
  moves: number;
  canUndo: boolean;
}
@Component({
  selector: 'app-twenty-forty-eight',
  imports: [
    NgClass
  ],
  templateUrl: './twenty-forty-eight.component.html',
})
export class TwentyFortyEightComponent {
  public board = signal<Cell[][]>(this.createEmptyBoard());
  public score = signal(0);
  public bestScore = signal(0);
  public moves = signal(0);
  public gameOver = signal(false);
  public gameWon = signal(false);
  public isPlaying = signal(false);
  public showDebug = signal(false);
  public animating = signal(false);
  public readonly gridSize = 4;
  public readonly winTile = 2048;
  private readonly animationDuration = 150;
  private readonly newTileDelay = 100;
  private previousState: GameState | null = null;
  private cellIdCounter = 0;
  public flatBoard = computed(() => this.board().flat());
  public hasEmptyCell = computed(() =>
    this.flatBoard().some(cell => cell.value === 0)
  );

  public canMove = computed(() => {
    if (this.hasEmptyCell()) return true;
    return this.hasAvailableMoves();
  });

  public isGameOver = computed(() =>
    !this.canMove() && !this.gameWon()
  );

  public highestTile = computed(() =>
    Math.max(...this.flatBoard().map(cell => cell.value))
  );

  constructor() {
    this.loadBestScore();
    this.initializeGame();

    // Effect pour surveiller les changements de score
    effect(() => {
      const currentScore = this.score();
      if (currentScore > this.bestScore()) {
        this.bestScore.set(currentScore);
        this.saveBestScore();
      }
    });

    // Effect pour détecter la fin de jeu
    effect(() => {
      if (this.isGameOver()) {
        this.gameOver.set(true);
        this.isPlaying.set(false);
      }
    });

    // Effect pour détecter la victoire
    effect(() => {
      if (!this.gameWon() && this.highestTile() >= this.winTile) {
        this.gameWon.set(true);
      }
    });
  }

  /**
   * Gérer les événements de pression des touches
   * @param event
   */
  @HostListener('window:keydown', ['$event'])
  public handleKeyPress(event: KeyboardEvent): void {
    if (!this.isPlaying() || this.animating()) return;

    this.handleGameControls(event);
  }

  /**
   * Toggle the game state (play/pause)
   */
  public toggleGame(): void {
    this.isPlaying.set(!this.isPlaying());
  }

  /**
   * Initialiser une nouvelle partie
   */
  public initializeGame(): void {
    this.board.set(this.createEmptyBoard());
    this.addRandomTile();
    this.addRandomTile();
    this.isPlaying.set(true);
  }

  /**
   * Réinitialiser le jeu
   */
  public resetGame(): void {
    this.score.set(0);
    this.moves.set(0);
    this.gameOver.set(false);
    this.gameWon.set(false);
    this.previousState = null;
    this.cellIdCounter = 0;
    this.initializeGame();
  }

  /**
   * Déplacer les tuiles dans une direction donnée
   * @param direction
   */
  public move(direction: 'up' | 'down' | 'left' | 'right'): void {
    if (!this.canMove() || this.animating()) return;

    this.saveCurrentState();
    const moved = this.performMove(direction);

    if (moved) {
      this.animating.set(true);
      this.moves.update(m => m + 1);

      setTimeout(() => {
        this.addRandomTile();
        this.animating.set(false);
      }, this.newTileDelay);
    }
  }

  /**
   * Annuler le dernier mouvement
   */
  public undoMove(): void {
    if (!this.previousState || this.animating()) return;

    this.board.set(this.copyBoard(this.previousState.board));
    this.score.set(this.previousState.score);
    this.moves.set(this.previousState.moves);
    this.previousState = null;
  }

  /**
   * Ajouter une nouvelle tuile aléatoire (2 ou 4) sur le plateau
   */
  public addRandomTile(): void {
    const emptyCells = this.getEmptyCells();
    if (emptyCells.length === 0) return;

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newValue = Math.random() < 0.9 ? 2 : 4;

    const newBoard = this.copyBoard(this.board());
    newBoard[randomCell.row][randomCell.col] = {
      value: newValue,
      id: this.getNextCellId(),
      isNew: true
    };

    this.board.set(newBoard);

    // Retirer le flag isNew après l'animation
    setTimeout(() => {
      const currentBoard = this.copyBoard(this.board());
      currentBoard[randomCell.row][randomCell.col].isNew = false;
      this.board.set(currentBoard);
    }, this.animationDuration);
  }

  /**
   * Obtenir la liste des cellules vides sur le plateau
   * @returns
   */
  public getEmptyCells(): { row: number; col: number }[] {
    const emptyCells: { row: number; col: number }[] = [];
    const currentBoard = this.board();

    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        if (currentBoard[row][col].value === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    return emptyCells;
  }

  /**
   * Vérifier si l'annulation est possible
   * @returns
   */
  public canUndo(): boolean {
    return this.previousState !== null && !this.animating();
  }

  /**
   * Formater le score avec des séparateurs de milliers
   * @param score
   */
  public formatScore(score: number): string {
    return score.toLocaleString();
  }

  /**
   * Obtenir la classe CSS pour une tuile en fonction de sa valeur
   * @param value
   * @returns
   */
  public getTileColor(value: number): string {
    const colors: { [key: number]: string } = {
      0: 'bg-primary',
      2: 'bg-primary-darken text-light',
      4: 'bg-grey text-light',
      8: 'bg-orange-200 text-orange-900',
      16: 'bg-orange-300 text-orange-900',
      32: 'bg-red-300 text-red-900',
      64: 'bg-red-400 text-white',
      128: 'bg-yellow-300 text-yellow-900',
      256: 'bg-yellow-400 text-yellow-900',
      512: 'bg-yellow-500 text-white',
      1024: 'bg-purple-500 text-white',
      2048: 'bg-purple-600 text-white',
      4096: 'bg-pink-500 text-white'
    };

    return colors[value] || 'bg-pink-600 text-white';
  }

  /**
   * Gérer les contrôles du jeu via le clavier
   * @param event
   * @private
   */
  private handleGameControls(event: KeyboardEvent): void {
    const moveMap = new Map([
      ['ArrowUp', () => this.move('up')],
      ['ArrowDown', () => this.move('down')],
      ['ArrowLeft', () => this.move('left')],
      ['ArrowRight', () => this.move('right')],
      ['w', () => this.move('up')],
      ['s', () => this.move('down')],
      ['a', () => this.move('left')],
      ['d', () => this.move('right')]
    ]);

    const action = moveMap.get(event.key);
    if (action) {
      event.preventDefault();
      action();
      return;
    }

    this.handleSpecialKeys(event);
  }

  /**
   * Gérer les touches spéciales pour les actions du jeu
   * @param event
   * @private
   */
  private handleSpecialKeys(event: KeyboardEvent): void {
    switch (event.key) {
      case ' ':
        event.preventDefault();
        this.toggleGame();
        break;
      case 'r':
      case 'R':
        event.preventDefault();
        this.resetGame();
        break;
      case 'u':
      case 'U':
        event.preventDefault();
        this.undoMove();
        break;
      case 'F12':
        event.preventDefault();
        this.showDebug.set(!this.showDebug());
        break;
    }
  }

  /**
   * Effectuer le déplacement dans la direction spécifiée
   * @param direction
   * @returns
   */
  private performMove(direction: 'up' | 'down' | 'left' | 'right'): boolean {
    const currentBoard = this.board();
    const newBoard = this.copyBoard(currentBoard);

    const moveStrategies = {
      left: () => this.moveLeft(newBoard),
      right: () => this.moveRight(newBoard),
      up: () => this.moveUp(newBoard),
      down: () => this.moveDown(newBoard)
    };

    const result = moveStrategies[direction]();

    if (result.moved) {
      this.board.set(newBoard);
      this.score.update(s => s + result.scoreGain);
    }

    return result.moved;
  }

  /**
   * Déplacer les tuiles vers la gauche
   * @param board
   * @private
   */
  private moveLeft(board: Cell[][]): { moved: boolean; scoreGain: number } {
    let moved = false;
    let scoreGain = 0;

    for (let row = 0; row < this.gridSize; row++) {
      const result = this.processRow(board[row]);

      if (result.moved) {
        moved = true;
      }

      scoreGain += result.scoreGain;
      board[row] = result.newRow;
    }

    return { moved, scoreGain };
  }

  /**
   * Traiter une ligne pour le déplacement et la fusion
   * @param row
   * @private
   */
  private processRow(row: Cell[]): { newRow: Cell[]; moved: boolean; scoreGain: number } {
    const filteredRow = this.filterNonEmptyCells(row);
    const mergeResult = this.mergeRow(filteredRow);
    const paddedRow = this.padRowWithEmptyCells(mergeResult.mergedRow);

    return {
      newRow: paddedRow,
      moved: this.hasRowChanged(row, paddedRow),
      scoreGain: mergeResult.scoreGain
    };
  }

  /**
   * Filtrer les cellules non vides d'une ligne
   * @param row
   * @private
   */
  private filterNonEmptyCells(row: Cell[]): Cell[] {
    return row.filter(cell => cell.value !== 0);
  }

  /**
   * Fusionner les cellules adjacentes de même valeur dans une ligne
   * @param row
   * @private
   */
  private mergeRow(row: Cell[]): { mergedRow: Cell[]; scoreGain: number } {
    const newRow: Cell[] = [];
    let scoreGain = 0;

    for (let i = 0; i < row.length; i++) {
      const current = row[i];
      const next = row[i + 1];

      if (next && current.value === next.value && !current.merged && !next.merged) {
        const mergedCell: Cell = {
          value: current.value * 2,
          id: this.getNextCellId(),
          merged: true
        };
        newRow.push(mergedCell);
        scoreGain += mergedCell.value;
        i++; // Skip next cell
      } else {
        newRow.push({ ...current, merged: false });
      }
    }

    return { mergedRow: newRow, scoreGain };
  }

  /**
   * Compléter une ligne avec des cellules vides pour atteindre la taille de la grille
   * @param row
   * @private
   */
  private padRowWithEmptyCells(row: Cell[]): Cell[] {
    const paddedRow = [...row];
    while (paddedRow.length < this.gridSize) {
      paddedRow.push({ value: 0, id: this.getNextCellId() });
    }
    return paddedRow;
  }

  /**
   * Vérifier si une ligne a changé après un déplacement ou une fusion
   * @param originalRow
   * @param newRow
   * @private
   */
  private hasRowChanged(originalRow: Cell[], newRow: Cell[]): boolean {
    return JSON.stringify(originalRow) !== JSON.stringify(newRow);
  }

  /**
   * Déplacer les tuiles vers la droite
   * @param board
   * @private
   */
  private moveRight(board: Cell[][]): { moved: boolean; scoreGain: number } {
    // Inverser, déplacer à gauche, puis inverser à nouveau
    this.reverseRows(board);
    const result = this.moveLeft(board);
    this.reverseRows(board);
    return result;
  }

  /**
   * Déplacer les tuiles vers le haut
   * @param board
   * @private
   */
  private moveUp(board: Cell[][]): { moved: boolean; scoreGain: number } {
    this.transpose(board);
    const result = this.moveLeft(board);
    this.transpose(board);
    return result;
  }

  /**
   * Déplacer les tuiles vers le bas
   * @param board
   * @private
   */
  private moveDown(board: Cell[][]): { moved: boolean; scoreGain: number } {
    this.transpose(board);
    this.reverseRows(board);
    const result = this.moveLeft(board);
    this.reverseRows(board);
    this.transpose(board);
    return result;
  }

  /**
   * Créer un plateau vide
   * @private
   */
  private createEmptyBoard(): Cell[][] {
    return Array(this.gridSize).fill(null).map(() =>
      Array(this.gridSize).fill(null).map(() => ({
        value: 0,
        id: this.getNextCellId()
      }))
    );
  }

  /**
   * Copier un plateau
   * @param board
   * @private
   */
  private copyBoard(board: Cell[][]): Cell[][] {
    return board.map(row =>
      row.map(cell => ({ ...cell }))
    );
  }

  /**
   * Vérifier s'il y a des mouvements disponibles
   * @private
   */
  private hasAvailableMoves(): boolean {
    const currentBoard = this.board();

    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const current = currentBoard[row][col].value;

        // Vérifier les cellules adjacentes
        if (
          (col < this.gridSize - 1 && current === currentBoard[row][col + 1].value) ||
          (row < this.gridSize - 1 && current === currentBoard[row + 1][col].value)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Transposer le plateau (échanger lignes et colonnes)
   * @param board
   * @private
   */
  private transpose(board: Cell[][]): void {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = i + 1; j < this.gridSize; j++) {
        [board[i][j], board[j][i]] = [board[j][i], board[i][j]];
      }
    }
  }

  /**
   * Inverser les lignes du plateau
   * @param board
   * @private
   */
  private reverseRows(board: Cell[][]): void {
    board.forEach(row => row.reverse());
  }

  /**
   * Sauvegarder l'état actuel pour permettre l'annulation
   * @private
   */
  private saveCurrentState(): void {
    this.previousState = {
      board: this.copyBoard(this.board()),
      score: this.score(),
      moves: this.moves(),
      canUndo: true
    };
  }

  /**
   * Obtenir le prochain ID unique pour une cellule
   * @private
   */
  private getNextCellId(): number {
    return ++this.cellIdCounter;
  }

  /**
   * Charger le meilleur score depuis le stockage local
   * @private
   */
  private loadBestScore() {
    const saved = localStorage.getItem('2048BestScore');
    this.bestScore.set(saved ? parseInt(saved) : 0);
  }

  /**
   * Sauvegarder le meilleur score dans le stockage local
   * @private
   */
  private saveBestScore() {
    localStorage.setItem('2048BestScore', this.bestScore().toString());
  }
}
