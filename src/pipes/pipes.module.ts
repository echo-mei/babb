import { NgModule } from '@angular/core';
import { HighLightPipe } from './high-light/high-light';
import { RedMinusPipe } from './red-minus/red-minus';
@NgModule({
	declarations: [HighLightPipe,
    RedMinusPipe],
	imports: [],
	exports: [HighLightPipe,
    RedMinusPipe]
})
export class PipesModule {}
