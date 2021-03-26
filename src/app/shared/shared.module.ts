import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [],
  imports: [
    // vendor
    CommonModule,
    RouterModule,

    // Material 
    MaterialModule,

    // Flex-layout
    FlexLayoutModule,
    // form
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    // vendor
    CommonModule,
    RouterModule,

    // Material 
    MaterialModule,

    // Flex-layout
    FlexLayoutModule,
    
    // Form
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {}