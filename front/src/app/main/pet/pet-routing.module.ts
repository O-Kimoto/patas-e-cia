import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PetComponent } from './pet.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PetComponent }
	])],
	exports: [RouterModule]
})
export class PetRoutingModule { }
