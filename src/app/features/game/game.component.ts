import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { GameCoreService } from 'src/app/core/services/game-core/game-core.service';
import { PickedWord } from 'src/app/shared/models/PickedWord.model';
import { ApiService } from '../../core/services/api/api.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [GameCoreService]
})
export class GameComponent implements OnInit {
  words: Array<PickedWord> = [];
  letterForm: string = "";
  
form = this.fb.group({
    "letterForm": new FormControl('', [Validators.minLength(1), Validators.required])
  });
  constructor(private apiService: ApiService,private gameCore: GameCoreService, private fb: FormBuilder) {

   }
  ngOnInit() {
    /* Call Api from service  */
    this.apiService.getWordList("https://technical-exercice-stack-labs.s3.eu-west-3.amazonaws.com/hangman/technos/list").subscribe(response => {
      this.words = response;
      this.gameCore.initGame(this.words);
      this.gameCore.setEncryptWord();
      this.gameCore.getPickedWord();
      this.gameCore.getEncryptedWord();
    });
  };

public getRatio(){
  return this.gameCore.getRatio();
}
  /* Reactive from  */

  public onSubmit() {
    if (this.guessLetter) {
      this.guessLetter()
      this.form.reset()
    }
  }

  /* get game result from service  */

  public getResultStatus(): string {
    return this.gameCore.resultGameStatus();
  }
  /* get game status from service  */

  public getIsGameStopped(): boolean{
    return this.gameCore.isGameStopped();
  }
  /* get encrypted word from service */

  public getEncryptedWord (): string {
    return this.gameCore.encryptedWord;
  }

  /* get image from service in DOM */

 public getPickedWordImage(): string {
   return this.gameCore.pickedWord.image || '' 
  }

/* set fails from service in DOM */
 public getFails (): number {
   return this.gameCore.fails
 }

 /* Func reset the form & game value & game status */
  public resetGame() {
    this.gameCore.initGame(this.words);
    this.gameCore.setEncryptWord();
    this.form.value.letterForm = "";
    this.gameCore.setFail(0);
    this.gameCore.setAttempt(0);
    this.form.reset();
    this.form.enable();
  }

  /* Guessing the letter or word */
  private guessLetter() {

    /*Get current form value */
    this.form.value.letterForm = this.form.value.letterForm.toLowerCase();

    /* Set picked word lowercase*/
    this.gameCore.pickedWord.word = this.gameCore.getPickedWord().word.toLowerCase();

    /* Set incremental Attempts */
    this.gameCore.setAttempt(1);
    this.gameCore.getAttempt();

    /* Execute if letter or word is found from the current input form value */
    if (this.gameCore.pickedWord.word.includes(this.form.value.letterForm) && this.form.value.letterForm.length === 1) {
      var indices = [];
      for (var i = 0; i < this.gameCore.pickedWord.word.length; i++) {
        if (this.gameCore.pickedWord.word[i] === this.form.value.letterForm)
        /*Push position letter from input form value in Array  */
          indices.push(i + 1);
          indices.forEach(element => {
          this.gameCore.encryptedWord = this.gameCore.replaceAt(this.gameCore.encryptedWord, element - 1, this.form.value.letterForm);
        });
      }
      /* If user find the whole word */
    } else if (this.gameCore.pickedWord.word === this.form.value.letterForm) {
      this.gameCore.encryptedWord = this.gameCore.pickedWord.word;
    }
    else {
      /*Set incremental fails */
      this.gameCore.setFail(1);
      this.gameCore.getFail();
    }
    /* SetGamestatus disable form if win or loose */
    if (this.gameCore.resultGameStatus() === 'You win !' || this.gameCore.resultGameStatus() === 'You lose !') {
    this.gameCore.counterRatio();
    
      this.form.disable();
    }
  }

}
