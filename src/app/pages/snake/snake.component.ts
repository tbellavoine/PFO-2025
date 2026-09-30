import { Component, computed, effect, HostListener, OnDestroy, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
interface Position {
  x: number;
  y: number;
}
@Component({
  selector: 'app-snake',
  imports: [
    NgClass,
    FormsModule,
    FaIconComponent
  ],
  templateUrl: './snake.component.html',
})
export class SnakeComponent implements OnDestroy {
  public snake = signal<Position[]>([{ x: 10, y: 10 }]);
  public direction = signal<Position>({ x: 0, y: -1 });
  public food = signal<Position>({ x: 15, y: 15 });
  public gameOver = signal(false);
  public score = signal(0);
  public highScore = signal(0);
  public isPlaying = signal(false);
  public showDebug = signal(false);

  // Constantes du jeu
  public readonly gridSize = 20;
  private readonly initialSpeed = 150;
  private readonly minSpeed = 50;
  private readonly speedIncrement = 2;
  private readonly pointsPerFood = 10;

  // Propriétés du jeu
  private gameSpeed: number = this.initialSpeed;
  private gameInterval: number | null = 0;

  // Signaux computés
  gameGrid = computed(() => Array(this.gridSize * this.gridSize).fill(0));

  isNewRecord = computed(() =>
    this.score() === this.highScore() && this.score() > 0
  );

  constructor() {
    this.generateFood();

    effect(() => {
      const currentScore = this.score();
      if (currentScore > this.highScore()) {
        this.highScore.set(currentScore);
      }
    });

    effect(() => {
      if (!this.isPlaying() && this.gameInterval) {
        clearInterval(this.gameInterval);
        this.gameInterval = null;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
    }
  }

  /**
   * Gérer les événements de pression des touches
   * @param event
   */
  @HostListener('window:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent): void {
    if (!this.isPlaying() || this.gameOver()) return;

    if (event.key === ' ') {
      event.preventDefault();
      this.toggleGame();
      return;
    }

    if (event.key === 'F12') {
      event.preventDefault();
      this.showDebug.set(!this.showDebug());
      return;
    }

    this.handleDirectionChange(event.key);
  }

  /**
   * Toggle the game state (play/pause)
   */
  public toggleGame(): void {
    if (this.gameOver()) return;

    this.isPlaying.set(!this.isPlaying());

    if (this.isPlaying()) {
      this.startGame();
    } else {
      this.stopGame();
    }
  }

  /**
   * Reset the game to initial state
   */
  public resetGame(): void {
    this.stopGame();
    this.snake.set([{ x: 10, y: 10 }]);
    this.direction.set({ x: 0, y: -1 });
    this.score.set(0);
    this.gameOver.set(false);
    this.isPlaying.set(false);
    this.gameSpeed = this.initialSpeed;
    this.generateFood();
  }

  /**
   * Vérifier si l'index correspond à la tête du serpent
   * @param index
   */
  public isSnakeHead(index: number): boolean {
    const currentSnake = this.snake();
    if (currentSnake.length === 0) return false;
    const head = currentSnake[0];
    return this.getIndex(head.x, head.y) === index;
  }

  /**
   * Vérifier si l'index correspond au corps du serpent
   * @param index
   */
  public isSnakeBody(index: number): boolean {
    const currentSnake = this.snake();
    return currentSnake.slice(1).some(segment =>
      this.getIndex(segment.x, segment.y) === index
    );
  }

  /**
   * Vérifier si l'index correspond à la nourriture
   * @param index
   */
  public isFood(index: number): boolean {
    const currentFood = this.food();
    return this.getIndex(currentFood.x, currentFood.y) === index;
  }

  /**
   * Gérer les changements de direction du serpent
   * @param key
   * @private
   */
  private handleDirectionChange(key: string): void {
    const currentDirection = this.direction();
    const directionMap = this.getDirectionMap();

    if (directionMap.has(key)) {
      const newDirection = directionMap.get(key)!;

      // Empêcher le serpent de se retourner sur lui-même
      if (this.isValidDirectionChange(currentDirection, newDirection)) {
        this.direction.set(newDirection);
      }
    }
  }

  /**
   * Obtenir la map des directions
   * @private
   */
  private getDirectionMap(): Map<string, Position> {
    return new Map([
      ['z', { x: 0, y: -1 }],
      ['Z', { x: 0, y: -1 }],
      ['s', { x: 0, y: 1 }],
      ['S', { x: 0, y: 1 }],
      ['q', { x: -1, y: 0 }],
      ['Q', { x: -1, y: 0 }],
      ['d', { x: 1, y: 0 }],
      ['D', { x: 1, y: 0 }]
    ]);
  }

  /**
   * Vérifier si le changement de direction est valide (ne pas se retourner)
   * @param current
   * @param newDir
   * @private
   */
  private isValidDirectionChange(current: Position, newDir: Position): boolean {
    return !(current.x === -newDir.x && current.y === -newDir.y);
  }

  /**
   * Démarrer le jeu
   * @private
   */
  private startGame(): void {
    this.gameInterval = setInterval(() => {
      this.moveSnake();
    }, this.gameSpeed);
  }

  /**
   * Arrêter le jeu
   * @private
   */
  private stopGame(): void {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }
  }

  /**
   * Déplacer le serpent
   * @private
   */
  private moveSnake(): void {
    const currentSnake = this.snake();
    const currentDirection = this.direction();
    const currentFood = this.food();

    const newSnake = [...currentSnake];
    const head = { ...newSnake[0] };

    // Nouvelle position de la tête
    head.x += currentDirection.x;
    head.y += currentDirection.y;

    // Vérifier les collisions avec les murs
    if (this.isOutOfBounds(head)) {
      this.endGame();
      return;
    }

    // Vérifier les collisions avec le corps
    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      this.endGame();
      return;
    }

    newSnake.unshift(head);

    // Vérifier si le serpent mange la nourriture
    if (head.x === currentFood.x && head.y === currentFood.y) {
      this.score.update(score => score + this.pointsPerFood);
      this.generateFood();
      this.increaseSpeed();
    } else {
      newSnake.pop();
    }

    this.snake.set(newSnake);
  }

  /**
   * Générer une nouvelle position pour la nourriture
   * @private
   */
  private generateFood(): void {
    const currentSnake = this.snake();
    let newFood: Position;

    do {
      newFood = {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

    this.food.set(newFood);
  }

  /**
   * Terminer le jeu
   * @private
   */
  private endGame(): void {
    this.gameOver.set(true);
    this.isPlaying.set(false);
    this.stopGame();
  }

  /**
   * Mettre à jour la vitesse du jeu
   * @private
   */
  private updateGameSpeed(): void {
    if (this.isPlaying()) {
      this.stopGame();
      this.startGame();
    }
  }

  /**
   * Vérifier si la position est hors des limites de la grille
   * @param position
   * @private
   */
  private isOutOfBounds(position: Position): boolean {
    const isXOutOfBounds = position.x < 0 || position.x >= this.gridSize;
    const isYOutOfBounds = position.y < 0 || position.y >= this.gridSize;

    return isXOutOfBounds || isYOutOfBounds;
  }

  /**
   * Augmenter la vitesse du jeu
   * @private
   */
  private increaseSpeed(): void {
    if (this.gameSpeed > this.minSpeed) {
      this.gameSpeed = Math.max(this.minSpeed, this.gameSpeed - this.speedIncrement);
      this.updateGameSpeed();
    }
  }

  /**
   * Obtenir l'index dans la grille à partir des coordonnées x et y
   * @param x
   * @param y
   * @private
   */
  private getIndex(x: number, y: number): number {
    return y * this.gridSize + x;
  }
}
