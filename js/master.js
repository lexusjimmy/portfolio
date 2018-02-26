var scrollControl;


function tweenCreate(mainDom, trigger, startEndA, startEndB) {
  var animTimeline = new TimelineMax()
  .add(
    [
      TweenMax.fromTo(mainDom + " .imgA",1,{top:$(mainDom + " .imgA").height()},{top:0,ease:Linear.easeOut}),
      TweenMax.fromTo(mainDom + " .imgB",1,{top:$(mainDom + " .imgB").height()/2},{top:0,ease:Linear.easeOut})
    ]
  );
  var picScene= new ScrollScene({triggerElement:trigger,duration:window.innerHeight});
	picScene.setTween(animTimeline)
			.addTo(scrollControl);
}

$(document).ready(function () {
  if( !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ) {
    scrollControl = new ScrollMagic();
    tweenCreate("#BDSScene", "#triggerA");
    tweenCreate("#RWDScene", "#triggerB");
}
});
