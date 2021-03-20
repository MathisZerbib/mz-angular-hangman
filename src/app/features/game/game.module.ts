import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [GameComponent],
  imports: [SharedModule, GameRoutingModule]
})
export class GameModule {}