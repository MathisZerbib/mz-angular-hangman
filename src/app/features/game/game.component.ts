import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { GameCoreService } from 'src/app/core/services/game-core/game-core.service';
import { PickedWord } from 'src/app/shared/models/PickedWord.model';
import { ApiService } from '../../core/services/api/api.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickedWord: PickedWord = {
    image: "",
    word: "",
  };
  words: Array<PickedWord> = [];
  letterForm: string = "";
  encryptedWord: string = "";
  attempts: number = 0;
  fails: number = 0;
  // isGameStopped: boolean = this.gameCoreService.isGameStopped();
  // resultGameStatus: string = this.gameCoreService.resultGameStatus();
  
  isGameStopped = () => {
    return this.fails >= 6 || this.encryptedWord.indexOf('_') === -1;
  }
  resultGameStatus = () => {
    return this.fails >= 6 ? "You lose !" : this.encryptedWord.indexOf('_') === -1 ? "You win !" : "";
  };

  form = this.fb.group({
    "letterForm": new FormControl('', [Validators.minLength(1), Validators.required])
  });
  constructor(private apiService: ApiService, private gameCoreService: GameCoreService, private fb: FormBuilder) {

   }
  ngOnInit() {
   
    this.apiService.getwordList("https://technical-exercice-stack-labs.s3.eu-west-3.amazonaws.com/hangman/technos/list").subscribe(response => {
      this.words = response;
      this.gameCoreService.initGame(this.words);
      this.gameCoreService.setEncryptWord();
      this.attempts = this.gameCoreService.getAttempt();
      this.fails = this.gameCoreService.getFail();
      this.pickedWord = this.gameCoreService.pickedWord;  
      this.encryptedWord = this.gameCoreService.getEncryptedWord();
    });
  };
  
  public onSubmit() {
    if (this.guessLetter) {
      this.guessLetter()
      this.form.reset()
    }
  }

  // private initGame(): string {


  //   let i: number = this.getRandomInt(this.words.length);
  //   this.pickedWord = this.words[i];
  //   console.log('Yay you\'re smart:', this.gameCoreService.getPickedWord())
  //   return this.gameCoreService.getPickedWord();
  // }

  public resetGame() {
    this.pickedWord = this.gameCoreService.initGame(this.words);
    this.encryptedWord = this.gameCoreService.setEncryptWord();
    this.form.value.letterForm = "";
    console.log(this.encryptedWord, "This encrypted words")
    console.log('Reset Game:', this.form.value.letterForm)
    this.fails = 0;
    this.attempts = 0;
    this.form.reset();
    this.form.enable();

  }

  public replaceAt(str: string, index: number, chr: string): string {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
  }


  private guessLetter() {
    console.log("This form value", this.form.value.letterForm)
    this.form.value.letterForm = this.form.value.letterForm.toLowerCase();
    this.pickedWord.word = this.pickedWord.word.toLowerCase();
    this.attempts = this.attempts + 1;
    if (this.pickedWord.word.includes(this.form.value.letterForm) && this.form.value.letterForm.length === 1) {
      var indices = [];
      for (var i = 0; i < this.pickedWord.word.length; i++) {
        if (this.pickedWord.word[i] === this.form.value.letterForm)
          indices.push(i + 1);
          indices.forEach(element => {
          this.encryptedWord = this.gameCoreService.replaceAt(this.encryptedWord, element - 1, this.form.value.letterForm);
        });
      }
    } else if (this.pickedWord.word.toLowerCase() === this.form.value.letterForm) {
      this.encryptedWord = this.pickedWord.word;
    }
    else {
      this.fails += 1;
    }
    if (this.resultGameStatus() == 'You win !' || this.resultGameStatus() == 'You lose !') {
      this.form.disable();
    }
  }

}
