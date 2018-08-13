
  'use strict';
  class TouchPager {
    constructor(setting) {
      this.targetDom = setting.targetDom;
      this.targetBody = setting.targetBody;
      this.directionDetect= [];
      this.pagerArray = setting.pagers;
      this.currentPage = 0;
      this.targetDom.addEventListener('touchstart',this._recordStart.bind(this));
      this.targetDom.addEventListener('touchmove',this._record.bind(this));
      this.targetDom.addEventListener('touchend',this._recordEnd.bind(this));
      this.startDetect = false;
      this.offset = 40;
    }
    _recordStart(e){
      e.preventDefault();
      this.directionDetect = [];
      var minVal = 500;
      for (var i = 0; i < this.pagerArray.length; i++) {
        let tmp = document.querySelector('#'+ this.pagerArray[i]);
        let curVal = Math.abs($(this.targetBody).scrollTop() - $(tmp).position().top);
        //console.log($(window).scrollTop());
        if (curVal< minVal) {
          minVal = curVal;
          //console.log(i);
          this.currentPage = i;

        }

      }
    }
    _record(e){
      e.preventDefault();
      if(this.directionDetect.length > 0){
        $(this.targetBody).scrollTop( $(this.targetBody).scrollTop()-(e.changedTouches[0].clientY-this.directionDetect[this.directionDetect.length-1].valY));
      }
      //

      this.directionDetect.push({timeStamp: e.timeStamp, valY: e.changedTouches[0].clientY});
      this.startDetect = true;
    }
    _recordEnd(e){
      e.preventDefault();

      if (this.startDetect) {
        switch (this._checkDirection()) {
          case 1:
            this.scrollPrev();
            break;
          case 0:
            this.backToCurrentPage()
            break;
          case -1:
            this.scrollNext();
            break;
          default:
            break;
        }
        this.startDetect = false;
      }

    }
    _checkDirection(){
      // console.log('=====all-------');
      // console.log(this.directionDetect);
      let diffTimestamp = this.directionDetect[this.directionDetect.length-1].timeStamp - this.directionDetect[this.directionDetect.length-2].timeStamp;
      if (diffTimestamp < 500 ) {

        if (this.directionDetect.length >= 5) {
          return this._touchAnalyze(5);
        }else{
          return this._touchAnalyze(this.directionDetect.length);
        }
      }else {
        return 0;
      }
    }
    _touchAnalyze(sampleNum){
      var diffArr = [];
      var dAna = 0;
      // console.log('==========');
      for (var i = this.directionDetect.length; i > this.directionDetect.length - sampleNum + 1 ; i--) {
        let afterV = this.directionDetect[i-1];
        let beforeV = this.directionDetect[i-2];
        diffArr.push(afterV.valY - beforeV.valY);
        // console.log(beforeV);
      }
      for (var j = 0; j < diffArr.length; j++) {
        dAna += diffArr[j];
        // console.log(dAna);
      }
      if (dAna > 0) {
        return 1;
      }else if (dAna < 0) {
        return -1;
      }else {
        return 0;
      }
    }
    addPager(pagerName){
      this.pagerArray.push(pagerName);
    }
    flyTo(pagerName){
      var scrollTarget = document.querySelector('#'+pagerName);
      $(this.targetBody).animate({"scrollTop": $(scrollTarget).position().top- this.offset},"fast");
      for (var i = 0; i < this.pagerArray.length; i++) {
        if(this.pagerArray[i] === pagerName){
          this.currentPage = i;
        }
      }
    }
    backToCurrentPage(){
      //console.log('stay');
      var scrollTarget = document.querySelector('#'+this.pagerArray[this.currentPage]);
      $(this.targetBody).animate({"scrollTop": $(scrollTarget).position().top- this.offset},"fast");
    }
    scrollNext(){
      //console.log('next');
      if (this.currentPage < this.pagerArray.length -1) {
        this.currentPage++;
        var scrollTarget = document.querySelector('#'+this.pagerArray[this.currentPage]);
        //console.log(this.targetBody);
        $(this.targetBody).animate({"scrollTop": $(scrollTarget).position().top- this.offset},"fast");
        //console.log($(scrollTarget).position().top);

      }
    }
    scrollPrev(){
      //console.log('prev');
      if (this.currentPage > 0) {
        //console.log('enterPrev');
        this.currentPage--;
        var scrollTarget = document.querySelector('#'+this.pagerArray[this.currentPage]);

        $(this.targetBody).animate({"scrollTop": $(scrollTarget).position().top-this.offset},"fast");

      }
    }
  }
