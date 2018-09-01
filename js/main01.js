(function() {
  class ActionBtn {
    constructor(settings) {
      this.btnDom = settings.targetDom;
      this.triggerDom = settings.modalDom;
      this.btnGenre = this.btnDom.getAttribute('action-toggle');
      this.linkURL = "";
      for (var i = 0; i< this.btnDom.childNodes.length ; i++) {
        var element = this.btnDom.childNodes[i];
        if (element.tagName === "A") {
          this.linkURL = element.href;
        }
      }
      switch (this.btnGenre) {
        case 'modal':
          this.btnDom.addEventListener('click',this._openModal.bind(this));
          // for (var i = 0; i< this.btnDom.childNodes.length ; i++) {
          //   var element = this.btnDom.childNodes[i];
          //   if (element.tagName === "A") {
          //     this.linkURL = element.href;
          //   }
          // }
          break;
        case 'link':
          this.btnDom.addEventListener('click',this._openWindow.bind(this));
          break;
        default:

      }
    }
    _openModal(e){
      e.preventDefault();
      switch (this.btnGenre) {
        case 'modal':
          this.triggerDom.querySelector("iframe").src = this.linkURL;
          break;
        default:

      }
      this.triggerDom.classList.remove('modal--hide');
      this.triggerDom.classList.add('modal--center');
    }
    _openWindow(e){
      e.preventDefault();
      if (this.btnGenre === 'link') {
        window.open(this.linkURL, '_blank');
      }
    }
  }
  class Modal {
    constructor(settings) {
      this.modalDom = settings.targetModal;
      this.closeBtn = this.modalDom.getElementsByClassName('modal__close-btn')[0];
      this.closeBtn.addEventListener('click',this._closeModal.bind(this));
    }
    _closeModal(e){
      e.preventDefault()
      this.modalDom.classList.remove('modal--center');
      this.modalDom.classList.add('modal--hide');
    }
  }
  class ListNavi {
    constructor(listName, targetArea, targetList, allPage) {
      this.naviBody = targetArea;
      this.pagers = this.naviBody.querySelectorAll(listName);
      this.navi = targetList;
      //this.waypoints = [];
      this._addWaypoint();
      this._addListClickEvent();
      this.targetBody = allPage;
      //console.log(this.pagers);
      //this.pagers.waypoint({handler: this.changeDecorate.bind(this)});
    }
    _addListClickEvent(){
      for (var i = 0; i < this.navi.childNodes.length; i++) {
        if (this.navi.childNodes[i] instanceof HTMLElement) {
          this.navi.childNodes[i].addEventListener('click', this._listClickHandler.bind(this));
        }
      }
    }
    _addWaypoint(){
      for (var i = 0; i < this.pagers.length; i++) {
        var things = this._clone(this);
        things.element = this.pagers[i];
        if (i === 0) {
          (new Waypoint ({element: this.pagers[i], handler: this.changeDecorate.bind(things), offset: '-50%'}));
        }else{
          (new Waypoint ({element: this.pagers[i], handler: this.changeDecorate.bind(things)}));
        }

      }
    }
    changeDecorate(direction){
      for (var i = 0; i < this.navi.childNodes.length; i++) {
        if (this.navi.childNodes[i] instanceof HTMLElement) {
          let defi = this.navi.childNodes[i].textContent;
          if (defi === this.element.getAttribute("data-toggle")) {
            this.navi.childNodes[i].classList.remove('nav__option');
            this.navi.childNodes[i].classList.add('nav__option--selected');
          }else{
            this.navi.childNodes[i].classList.add('nav__option');
            this.navi.childNodes[i].classList.remove('nav__option--selected');
          }
        }
      }
    }
    scrollTo(pagerName){
      for (var i = 0; i < this.pagers.length; i++) {
        if(this.pagers[i].getAttribute('data-toggle') === pagerName){
          $(this.targetBody).animate({"scrollTop": $(this.pagers[i]).position().top},"fast");
        }
      }
    }
    _listClickHandler(e){
      e.preventDefault();
      this.scrollTo(e.target.textContent);
    }
    _clone(src) {
      let target = {};
      for (let prop in src) {
        if (src.hasOwnProperty(prop)) {
          target[prop] = src[prop];
        }
      }
      return target;
    }

  }
  class LanguagePack {
    constructor(settings) {
      this.currentLang = settings.language;
      this._languageData= {};
    }
    set languageData(val){

      if (val.hasOwnProperty('en')&& val.hasOwnProperty('jp')) {
        this._languageData = val;
      }
    }
  }
  let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  let allPage = document.querySelector(isSafari? 'body':'html');
  let langManager = new LanguagePack({'language':'en'});

  document.querySelectorAll('.btn__action').forEach(function (element) {
    new ActionBtn({targetDom: element, modalDom: document.getElementById('video-modal')});

  });
  document.querySelectorAll('.modal').forEach(function (element) {
    new Modal({targetModal: element});
  });
  new ListNavi('section', document.querySelector('.container'), document.getElementById("navi"), allPage);

  fetch('language.json',{method: 'get'})
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }else{
      throw new Error(response.statusText);
    }
  }).then(function (j) {
    langManager.languageData = j;
  }).catch(function (err) {
    console.log(err);
  })

}())
