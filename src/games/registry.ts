import { GameDefinition } from '../types';
import { RegisteredGame } from './sdk';
import { MemoryMatchDefinition } from './MemoryMatch/definition';
import { MemoryMatchGame } from './MemoryMatch/MemoryMatchGame';
import { ReactionRushDefinition } from './ReactionRush/definition';
import { ReactionRushGame } from './ReactionRush/ReactionRushGame';
import { ColorClashDefinition } from './ColorClash/definition';
import { ColorClashGame } from './ColorClash/ColorClashGame';
import { TargetTapDefinition } from './TargetTap/definition';
import { TargetTapGame } from './TargetTap/TargetTapGame';
import { CatchChickenDefinition } from './CatchChicken/definition';
import { CatchChickenGame } from './CatchChicken/CatchChickenGame';
import { SlidingPuzzleDefinition } from './SlidingPuzzle/definition';
import { SlidingPuzzleGame } from './SlidingPuzzle/SlidingPuzzleGame';

class GameRegistryClass {
  private games: Map<string, RegisteredGame> = new Map();

  constructor() {
    // Register the 6 default commercial games
    this.register({
      definition: MemoryMatchDefinition,
      Component: MemoryMatchGame
    });

    this.register({
      definition: ReactionRushDefinition,
      Component: ReactionRushGame
    });

    this.register({
      definition: ColorClashDefinition,
      Component: ColorClashGame
    });

    this.register({
      definition: TargetTapDefinition,
      Component: TargetTapGame
    });

    this.register({
      definition: CatchChickenDefinition,
      Component: CatchChickenGame
    });

    this.register({
      definition: SlidingPuzzleDefinition,
      Component: SlidingPuzzleGame
    });
  }

  public register(game: RegisteredGame): void {
    this.games.set(game.definition.id, game);
  }

  public getGame(id: string): RegisteredGame | undefined {
    return this.games.get(id);
  }

  public getAllGames(): RegisteredGame[] {
    return Array.from(this.games.values());
  }

  public getAllDefinitions(): GameDefinition[] {
    return Array.from(this.games.values()).map((g) => g.definition);
  }

  public getEnabledDefinitions(): GameDefinition[] {
    return this.getAllDefinitions().filter((d) => d.enabled);
  }
}

export const GameRegistry = new GameRegistryClass();
