$(".animateFrame").css("background-image", "url(img/skyfie01.png), url(img/easy02.PNG)");
$(".animateFrame").css("background-repeat", "no-repeat, no-repeat");
var worldScroll = 0;
var targetStart = $("#testTar").offset().top - $("#testTar").height()/2;
var targetEnd = targetStart + $("#testTar").height();
$(window).scroll(function (e) {
  var currentScroll = $(window).scrollTop();
  if ((e.timeStamp-worldScroll)>100) {
    //console.log("Current Scrolltop:" + currentScroll);
    worldScroll = e.timeStamp;
    //console.log("TargetScrollTop:" + targetStart+ ","+ targetEnd);
    if (currentScroll> targetStart && currentScroll < targetEnd) {

      console.log($("#testTar").css("background-position"));
      $("#testTar").animate({"backgroundPosition": "0px 100px"},"slow")
    }
  }
  if (Math.abs(currentScroll - targetStart) < 10) {
    console.log("trigger Start");
  }
  if (Math.abs(currentScroll - targetEnd) < 10) {
    console.log("trigger End");
  }
});
