$(function(){
	"use strict";

	var $window = $(window);
	var $body = $('body');
	var $header = $('#header');
	var $gNav = $('#gNav');
	var $btMenu = $('#btMenu');

	// sp nav

	$btMenu.on('click', function(ev){
		ev.preventDefault();
		$gNav.toggleClass('active');
	});

	$(window).on('resize', function(){
		$('a[href^=#]').not('.noScroll').smoothScroll({
			offset: 0 - $header.height(),
			beforeScroll: function(){
				$gNav.removeClass('active');
			}
		});
	}).trigger('resize');

	// scroll

	var $scroll = $('#scroll');
	var $page = $('.page', $scroll);
	var $pager = $('#pager a');

	var scrollDuration = 500;
	var mouseWheel = true;

	$('a.pager').on('click', function(ev){
		ev.preventDefault();
		var $target = $($(this).attr('href'));
		var pagingIndex = $page.index($target);

		$scroll.css({
			transform: 'translateY(-'+ (pagingIndex * 14.2857) + '%)'
		});

		$page.removeClass('active').eq(pagingIndex).addClass('active');
		$pager.removeClass('active').eq(pagingIndex).addClass('active');

		// if ($btMenu.is(':hidden')) {
		// 	$page.filter('.active').find('video').each(function(){
		// 		var v = this;
		// 		setTimeout(function(){
		// 			v.play();
		// 		}, scrollDuration);
		// 	});
		// 	$page.filter(':not(.active)').find('video').each(function(){
		// 		this.pause();
		// 	});
		// }

		if (pagingIndex > 0) {
			//$body.addClass('tinyHeader');
		} else {
			//$body.removeClass('tinyHeader');
		}

	});

	$('#wrap').imagesLoaded({ background: true }, function(){
		$pager.eq(0).trigger('click');
	});

	$scroll.on('mousewheel', function(eo, delta, deltaX, deltaY) {

		if (mouseWheel === true && $btMenu.is(':hidden')) {

			var currentPage = $pager.index($pager.filter('.active'));

			if (deltaY === -1 && currentPage < $pager.length - 1) {
				$pager.eq(++currentPage).trigger('click');
			} else if (deltaY === 1 && currentPage > 0) {
				$pager.eq(--currentPage).trigger('click');
			}

			mouseWheel = false;
			setTimeout(function(){
				mouseWheel = true;
			}, scrollDuration);
		}
	});
	$("#page07 > .bukken").on('mousewheel', function (eo, delta, deltaX, deltaY) {
		eo.stopPropagation();
	});
	//video
	var video = document.querySelector(".video_bg > video");
	var hadErr = false;
	var isPlayed = false;

	video.load();
	video.pause();
	$(video).css("opacity",0);
	video.addEventListener("play",function () {
		isPlayed = true;
	});
	video.addEventListener("pause",function () {
		isPlayed = false;
	});

	video.addEventListener("error",function(e) {
		console.log(e);
		$(this).css("opacity",0);
		hadErr = true;
	})
	video.addEventListener("canplay",function () {
		var promise = this.play();
		if (promise !== undefined) {
			promise.then(function () {
				$(video).css("opacity",1);
			}).catch(function (e) {
				$(video).css("opacity",0);
				console.log(e);
			})
		}
	});
	video.addEventListener("ended",function () {
		this.play();
	});
	video.addEventListener("click",function (e) {
		if (!hadErr) {
			$(video).css("opacity",1);
			isPlayed ? this.pause() : this.play();
		}

	})

	// sub

	var subDuration = 1000;

	$('a.sub').on('click', function(ev){
		ev.preventDefault();
		var $this = $(this);
		document.querySelector('#sub > .sub-close-btn').classList.toggle('active');
		if (!$btMenu.is(':hidden')) {
			$body.css('overflow','hidden');
		}

		$($this.attr('href')).addClass('active');
		$this.addClass('inActive');

		//if it is bukken slider show then create sync carousel
		if ($($this.attr('href')).has(".sync-slider-box")) {

			if (!($($this.attr('href')).children(".sync-slider-box").find(".slick-slider").length)) {


				$($($this.attr('href'))).ready(addSyncCarousel($($this.attr('href'))[0]));
				//addSyncCarousel($($this.attr('href'))[0]);
			}
		}
	});

	// $('section.sub .close span').on('click', function(ev){
	// 	ev.preventDefault();
	// 	var $sub = $(this).parent().parent().parent().parent();
	// 	if (!$btMenu.is(':hidden')) {
	// 		$body.css('overflow','scroll');
	// 	}
	// 	//$(document.querySelector('.main-sync-slides')).slick('unslick');
	// 	//$(document.querySelector('.sync-navigator')).slick('unslick');
	// 	$sub.removeClass('active');
	// 	$('a.sub.inActive').removeClass('inActive');
	// 	document.querySelector('#sub > .sub-close-btn').classList.remove('active');
	// 	setTimeout(function(){
	// 		$sub.scrollTop(0).find('.main').removeClass('active');
	// 	}, subDuration);
	// });
	$('#sub > .sub-close-btn').on('click', function(ev){
		ev.preventDefault();
		var $sub = $(".sub.active");
		if (!$btMenu.is(':hidden')) {
			$body.css('overflow','scroll');
		}
		//$(document.querySelector('.main-sync-slides')).slick('unslick');
		//$(document.querySelector('.sync-navigator')).slick('unslick');
		$sub.removeClass('active');
		$('a.sub.inActive').removeClass('inActive');
		document.querySelector('#sub > .sub-close-btn').classList.remove('active');
		setTimeout(function(){
			$sub.scrollTop(0).find('.main').removeClass('active');
		}, subDuration);

		//$('section.sub .close span').trigger('click');
	});

	$('section.sub').each(function(){
		var $this = $(this);

		$this.on('scroll', function(){
			if ($this.scrollTop() >= $window.height() / 2) {
				$this.find('.main').addClass('active');
			}
		});
	});
	$('#sub').on('mousewheel', function (eo, delta, deltaX, deltaY) {
		eo.stopPropagation();
		//console.log($(".sub.active").scrollTop());
		if ($btMenu.is(':hidden')) {

			if ($(".sub.active").scrollTop() > 100) {
				document.querySelector(".active.sub .lead").classList.remove("scrollAssist");

			}else {
				document.querySelector(".active.sub .lead").classList.add("scrollAssist");
			}
		}
	});

	ScrollTrigger.init();
});

//atomatic slick

$(document).ready(function () {
	let slideNum = $(".carousel").children().length;
  $(".carousel").slick({
    dots: true,
    slidesToShow: 6,
		slidesToScroll:1,
    prevArrow:$(".carousel-button:first-of-type"),
    nextArrow:$(".carousel-button:last-of-type"),
		dotsClass:"greenDots",
		infinite:true,
		//initialSlide: (slideNum - 1),
		appendDots:$(".carousel-box > .dots-box"),
	  responsive: [
			{
      breakpoint: 2000,
      settings: {
        slidesToShow: 5,
        dots: true
      }
    },
			{
      breakpoint: 1500,
      settings: {
        slidesToShow: 4,
        dots: true
      }
    },
			{
      breakpoint: 1290,
      settings: {
        slidesToShow: 3,
				slidesToScroll:1,
        dots: true
      }
    },
    {
      breakpoint: 420,
      settings: {
				initialSlide:1,
        slidesToShow: 1,
				slidesToScroll:1,
        dots: true
      }
    }
		]
  });
})
$("#nowSale .carousel-box .carousel-button").click(function (event) {
	event.preventDefault();
	$("#nowSale .carousel .panel").addClass("show-carousel");
})

//sync carousel
var addSyncCarousel = function (targetDom) {

	$(targetDom.querySelector('.main-sync-slides')).slick({
	  slidesToShow: 1,
	  slidesToScroll: 1,
		prevArrow:$("#"+ targetDom.id+" .sync-carousel-button:first-of-type"),
		nextArrow:$("#"+ targetDom.id+" .sync-carousel-button:last-of-type"),
	  fade: true,
	  asNavFor: ("#"+ targetDom.id+' .sync-navigator')
	});
	$(targetDom.querySelector('.sync-navigator')).slick({
	  slidesToShow: 6,
	  slidesToScroll: 1,
	  asNavFor: "#"+ targetDom.id+' .main-sync-slides',
	  dots: false,
		arrows:false,
	  centerMode: true,
	  focusOnSelect: true
	});
	$(targetDom.querySelector('.sync-navigator')).on('afterChange', function(event, slick, currentSlide, nextSlide){
	  var thumbs = targetDom.querySelectorAll('.sync-navigator .nav-thumb');
		for (var i = 0; i < thumbs.length; i++) {
			if (i === currentSlide) {
				thumbs[i].classList.add('selected');
			}else {
				thumbs[i].classList.remove('selected');
			}
		}
	});

}


//  manual slick
// var parentDoms;
// // var $slide = $('.bukken > .inner');
// // var $slideParent = $('.bukken');
// var winHeight = 0;
// var winWidth = 0;
// var offset = 0;
// var panelWidth = 478;
// var panelSpace =30;
// var hasButton = false;
// var hasInitial = false;
// var isAnimating = false;
// $(document).ready(function () {
//
// 	winHeight = $(window).height();
// 	winWidth = $(window).width();
// 	if (!hasInitial) {
// 		parentDoms = findTarget();
// 		hasInitial = true;
// 	}
//
// 	for (var i = 0; i < parentDoms.length; i++) {
// 		if(prepareSlideBox(parentDoms[i])){
// 			if (winWidth > 768) {
// 				if (!hasButton) {
// 					makeButton(parentDoms[i]);
// 					if (i == (parentDoms.length -1)) {
// 						hasButton = true
// 					}
// 				}
// 			}
// 		}
// 	}
//
// });
// //  add button when user start page with smaller size and resize to bigger size
// $(window).resize(function(){
// 	winHeight = $(window).height();
// 	winWidth = $(window).width();
// 	if (!hasInitial) {
// 		parentDoms = findTarget();
// 		hasInitial = true;
// 	}
// 	for (var i = 0; i < parentDoms.length; i++) {
// 		if(prepareSlideBox(parentDoms[i])){
// 			if (winWidth > 768) {
// 				if (!hasButton) {
// 					makeButton(parentDoms[i]);
// 					if (i == (parentDoms.length -1)) {
// 						hasButton = true
// 					}
// 				}
// 			}
// 		}
// 	}
//
// 	if (winWidth < 768) {
// 		for (var i = 0; i < parentDoms.length; i++) {
// 			var $tempOb = parentDoms[i].children('.inner');
// 			$tempOb.css("width","auto");
// 		}
// 	}
//
// });
//
// function findTarget() {
// 	var allSlide = $(document).find('.bukken');
// 	var domArray = new Array();
// 	for (var i = 0; i < allSlide.length; i++) {
// 		var $tempDom = $(allSlide[i]);
// 		// console.log($tempDom);
// 		// console.log($tempDom.attr("data-toggle"));
// 		if ($tempDom.attr("data-toggle") == "slide-object") {
// 			domArray.push($tempDom);
// 		}
// 	}
// 	// console.log("==Array==");
// 	// console.log(domArray);
// 	// console.log("---------");
// 	return domArray;
// }

// added button when resized, add button with parent dom
function makeButton($parentDom) {
	$parentDom.parent().append($("<button>",{
		class: "slick-button",
		type: "button",
		text: ">",
		id: "button-next",
		style: "right: 50px"
	}).click(function (e) {
		e.preventDefault();
		moveSlide(true, $parentDom.children('.inner'));
	}));
	$parentDom.parent().append($("<button>",{
		class: "slick-button",
		type: "button",
		text: "<",
		id:"button-prev",
		style: "left: 50px;"
	}).click(function(e){
		e.preventDefault();
		moveSlide(false, $parentDom.children('.inner'));
	}));
}

//
// function prepareSlideBox($parentDom) {
// 	var childNum = $parentDom.children('.inner').children('.panel').length;
// 	// console.log('start prepareing box with child: ' + childNum);
// 	if ((childNum > 4 && winWidth >= 1046) || (childNum > 2 && winWidth > 768 && winWidth < 1046)) {
// 		$parentDom.children('.inner').css("width",Math.round(childNum/2)*(panelWidth+30)+30+"px");
// 	}
// 	if (winWidth> 1046) {
// 		offset = (panelWidth+panelSpace)*2;
// 	}else if (winWidth < 1044 && winWidth > 768) {
// 		offset = panelWidth+panelSpace;
// 	}
// 	if (childNum > 4) {
// 		return true;
// 	}else {
// 		return false;
// 	}
// }
// // true --> next ; false --> prev
// // haven't finished : if moving can't enter this function
// function moveSlide(direction, $slide) {
// 	var currLeft = cutWord($slide.css("left"));
// 	if (direction) {
// 		if (($slide.width() - Math.abs(currLeft)) > (offset+panelSpace) && currLeft <= 0) {
// 			//console.log($slide.css("left"));
// 			if (!isAnimating) {
// 				isAnimating = true;
// 				$slide.animate({left: "-="+ offset},500,function () {
// 					isAnimating = false;
// 				});
// 			}
//
// 		}
// 		// console.log("move right "+ offset);
// 	}else{
// 		if (currLeft < 0) {
// 			// console.log($slide.css("left"));
// 			if (!isAnimating) {
// 				isAnimating = true;
// 				$slide.animate({left: "+="+ offset},500,function () {
// 					isAnimating = false;
// 				});
// 			}
//
// 		}
// 		// console.log("move left "+ offset);
// 	}
// }
//
// function cutWord(pxWord) {
// 	return parseInt(pxWord.substring(0,pxWord.length-2));
// }

//------------smart phone scroll ---------------------
let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
let allPage = document.querySelector(isSafari? 'body':'html');
window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
if (window.mobileAndTabletcheck) {
	let smartPager = new TouchPager({
		targetBody: allPage,
		targetDom: document.querySelector('#scroll'),
		pagers: ['page01', 'page02', 'page03', 'page04','page05','page06','page07']
	});
}
$('#nowSale .carousel-box').on('touchmove',function(e){
	e.stopPropagation();
});
$('#nowSale .carousel-box').on('touchend',function(e){
	e.stopPropagation();
});
