import { Injectable } from '@angular/core';
import   { ConfigService} from '@igo2/core';

import * as introJs from 'intro.js/intro.js'

@Injectable({
  providedIn: 'root'
})
export class TourService {

  public introJS = introJs();
  constructor(
    private configService: ConfigService
  ) {}



  public startTour(){

    console.log('tour partie')

    this.introJS.oncomplete(function() {
      console.log("fin du tour ");
    });


    this.introJS.onexit( () =>  {
      console.log("le tour a ete fermé");
    });


    this.introJS.onbeforechange(targetElement => { 

      let tourNo = this.introJS._currentStep
      console.log('tourNo')
      console.log(tourNo)

      console.log(targetElement.className )

      // When the element doesn't exist when you start tour 
      // we need to set it when it exist
      if (targetElement.className.indexOf("introjsFloatingElement") !== -1) {
        console.log('target = elem doesnt exist');

        let currentStepConfig = this.configService.getConfig('introOptions').steps[tourNo]
        let currentElemConfig = currentStepConfig.element;
        let currentPositionElemConfig = currentStepConfig.position;

        let unElem:HTMLElement;
        unElem = document.getElementsByTagName(currentElemConfig)[0] as HTMLElement;
        
        // debugger;
        if(!unElem){
          console.log('elem est vide avec tagName');
          unElem = document.getElementsByClassName(currentElemConfig)[0] as HTMLElement;
          if(!unElem){
              console.log('elem est vide avec ClassName');
              unElem = document.querySelector(currentElemConfig);
              if(!unElem){
                console.log('elem est vide avec querySelector');
              }else{
                console.log('elem est OK avec QuerySelector');
                this.introJS._introItems[tourNo].element = unElem;
                this.introJS._introItems[tourNo].position = currentPositionElemConfig;
              }
              
          }else{
              console.log('elem est OK avec ClassName');
              this.introJS._introItems[tourNo].element = unElem;
              this.introJS._introItems[tourNo].position = currentPositionElemConfig;
          }

        }else{
          console.log('est OK avec tagName');
          this.introJS._introItems[tourNo].element = unElem;
          this.introJS._introItems[tourNo].position = currentPositionElemConfig;
        } 
      }
    })


    this.introJS.onchange(targetElement => {  
      let tourNo = this.introJS._currentStep
      if (tourNo){

        // problem with prev Button... if the user back on tour, another click is made and some time that not what you want
        // no solution found but disable prevButton on tour...
        let actionToMake = this.introJS._introItems[tourNo].action;

        if (actionToMake){
          // console.log("substr action") ;
          // console.log(actionToMake.substring(0,14))
          let element: HTMLElement;

          if (actionToMake == 'clickOnElem'){
              targetElement.click();
        
          }else if(actionToMake.substring(0,11) === 'clickOnTool'){

            let toolIndex = actionToMake.substring(11) ;
            element = document.getElementsByTagName('mat-list-item')[toolIndex] as HTMLElement;
            element.click();
            console.log('click ontool');

          }else if(actionToMake.substring(0,14) == 'clickOnContext'){
            let contextIndex = actionToMake.substring(14) ;
            element= document.getElementsByTagName('igo-context-item')[contextIndex] as HTMLElement;
            element.click();
            console.log('click onContext');
          }
        }
      }
    })

    this.introJS.onafterchange(targetElement => { 
    })
      
    this.introJS.setOptions(this.configService.getConfig('introOptions'));

    this.introJS.start();
  }



}
