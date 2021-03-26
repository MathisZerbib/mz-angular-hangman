import { AfterViewInit } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export class GameComponent implements OnInit, AfterViewInit {
  urlStackLabs: string = "https://technical-exercice-stack-labs.s3.eu-west-3.amazonaws.com/hangman/technos/list";
  words: Array<PickedWord> = [];
  letterForm: string = "";
  alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
    'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
    't', 'u', 'v', 'w', 'x', 'y', 'z'];

  cx: CanvasRenderingContext2D | null | undefined ;
  canvas = { width: 150, height: 250 };

  form = this.fb.group({
    "letterForm": new FormControl('', [Validators.minLength(1), Validators.pattern(/^[a-zA-Z\s]+$/), Validators.required])
  });

  @ViewChild("myCanvas", { static: false })
  myCanvas!: ElementRef;
  letters = document.createElement('div');

  constructor(private apiService: ApiService, private gameCore: GameCoreService, private fb: FormBuilder, private el: ElementRef) { }

  // create alphabet
  public createAlphabet() {

    for (let i = 0; i < this.alphabet.length; i++) {
      this.letters.id = 'alphabet';
      let list = document.createElement('span');
      list.id = 'letter-' + i;
      list.style.margin = '5px';
      list.style.fontSize = '25px';
      list.style.cursor = 'pointer'
      list.innerHTML = this.alphabet[i];
      list.onclick = () => {
        this.form.controls['letterForm'].setValue(list.innerHTML); 
        this.onSubmit();
      }
      document.querySelector("#wrapper-alphabet")!.appendChild(this.letters);
      this.letters.appendChild(list);
    }
  }



  ngOnInit() {
    /* Call Api from service  */
    this.apiService.getWordList(this.urlStackLabs).subscribe(response => {
      this.words = response;
      this.gameCore.initGame(this.words);
      this.gameCore.setEncryptWord();
      this.gameCore.getPickedWord();
      this.gameCore.getEncryptedWord();
      this.createAlphabet();
    });
  };

  /* create canvas  */

  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.myCanvas.nativeElement;
    this.cx = canvasEl.getContext("2d");

  }

  /* Get alphabet position on letterForm  */

  public alphabetPosition(text: string): number {
    let result = "";
    for (let i = 0; i < text.length; i++) {
      let code = text.toUpperCase().charCodeAt(i)
      if (code > 64 && code < 91) result += (code - 64) + " ";
    }
    return parseInt(result.slice(0, result.length - 1)) - 1;
  }

    /* set letter style  */


  public setColorLetter(int: number, color: string) {
    let letterPicked = document.querySelector<HTMLInputElement>('#letter-' + int);
    letterPicked!.style.color = color;
    letterPicked!.style.fontWeight = "bold";

  }
  
  /* reset letter style  */

  public resetColorLetter() {
    for (let i = 0; i < this.alphabet.length; i++) {
      let letterPicked = document.querySelector<HTMLInputElement>('#letter-' + i);
      if (letterPicked) {
        letterPicked.style.color = '';
        letterPicked.style.fontWeight = '';
      }
    }
  }


  
  /* get game result from win and looses  */
  public getRatio() {
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

  public getIsGameStopped(): boolean {
    return this.gameCore.isGameStopped();
  }
  /* get encrypted word from service */

  public getEncryptedWord(): string {
    return this.gameCore.encryptedWord;
  }

  /* get image from service in DOM */

  public getPickedWordImage(): string {
    return this.gameCore.pickedWord.image || ''
  }

  /* set fails from service in DOM */
  public getFails(): number {
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
    this.resetColorLetter();
    if(this.cx)
    this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
      let indices = [];
      for (let i = 0; i < this.gameCore.pickedWord.word.length; i++) {
        if (this.gameCore.pickedWord.word[i] === this.form.value.letterForm)
          /*Push position letter from input form value in Array  */
          indices.push(i + 1);
        indices.forEach(element => {
          this.gameCore.encryptedWord = this.gameCore.replaceAt(this.gameCore.encryptedWord, element - 1, this.form.value.letterForm);
          this.setColorLetter(this.alphabetPosition(this.form.value.letterForm), 'green');
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
      this.Draw(this.gameCore.getFail())
      if (this.form.value.letterForm.length === 1) {
        this.setColorLetter(this.alphabetPosition(this.form.value.letterForm), 'red');
      }
    }
    /* SetGamestatus disable form if win or loose */
    if (this.gameCore.resultGameStatus() === 'You win !' || this.gameCore.resultGameStatus() === 'You lose !') {
      this.gameCore.counterRatio();
      this.form.disable();
    }
  }


  /* Draw hangman if the user fails */
  public Draw = (int: number) => {
    if(this.cx)
    switch (int) {
      case 1:
        this.cx.strokeStyle = '#444';
        this.cx.lineWidth = 10;
        this.cx.beginPath();
        this.cx.moveTo(175, 225);
        this.cx.lineTo(5, 225);
        this.cx.moveTo(40, 225);
        this.cx.lineTo(25, 5);
        this.cx.lineTo(100, 5);
        this.cx.lineTo(100, 25);
        this.cx.stroke();
        break;

      case 2:
        this.cx.lineWidth = 5;
        this.cx.beginPath();
        this.cx.arc(100, 50, 25, 0, Math.PI * 2, true);
        this.cx.closePath();
        this.cx.stroke();
        break;

      case 3:
        this.cx.beginPath();
        this.cx.moveTo(100, 75);
        this.cx.lineTo(100, 140);
        this.cx.stroke();
        break;

      case 4:
        this.cx.beginPath();
        this.cx.moveTo(100, 85);
        this.cx.lineTo(60, 100);
        this.cx.stroke();
        this.cx.beginPath();
        this.cx.moveTo(100, 85);
        this.cx.lineTo(140, 100);
        this.cx.stroke();
        break;

      case 5:
        this.cx.beginPath();
        this.cx.moveTo(100, 140);
        this.cx.lineTo(80, 190);
        this.cx.stroke();
        this.cx.beginPath();
        this.cx.moveTo(82, 190);
        this.cx.lineTo(70, 185);
        this.cx.stroke();
        break;

      case 6:
        this.cx.beginPath();
        this.cx.moveTo(100, 140);
        this.cx.lineTo(125, 190);
        this.cx.stroke();
        this.cx.beginPath();
        this.cx.moveTo(122, 190);
        this.cx.lineTo(135, 185);
        this.cx.stroke();
        break;
    }
  }


}
