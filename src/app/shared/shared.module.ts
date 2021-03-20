import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    // vendor
    CommonModule,
    RouterModule,

    // material
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    // vendor
    CommonModule,
    RouterModule,

    // material
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {}