AOS.init({
	duration: 800,
	easing: 'slide',
	once: false
});

jQuery(document).ready(function ($) {

	"use strict";

	$(".loader").delay(1000).fadeOut("slow");
	$("#overlayer").delay(1000).fadeOut("slow");

	let hasTriedToSubmit = false;

	var siteMenuClone = function () {

		$('.js-clone-nav').each(function () {
			var $this = $(this);
			// $this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
		});


		setTimeout(function () {

			var counter = 0;
			$('.site-mobile-menu .has-children').each(function () {
				var $this = $(this);

				$this.prepend('<span class="arrow-collapse collapsed">');

				$this.find('.arrow-collapse').attr({
					'data-toggle': 'collapse',
					'data-target': '#collapseItem' + counter,
				});

				$this.find('> ul').attr({
					'class': 'collapse',
					'id': 'collapseItem' + counter,
				});

				counter++;

			});

		}, 1000);

		$('body').on('click', '.arrow-collapse', function (e) {
			var $this = $(this);
			if ($this.closest('li').find('.collapse').hasClass('show')) {
				$this.removeClass('active');
			} else {
				$this.addClass('active');
			}
			e.preventDefault();

		});

		$(window).resize(function () {
			var $this = $(this),
				w = $this.width();

			if (w > 768) {
				if ($('body').hasClass('offcanvas-menu')) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		})

		$('body').on('click', '.js-menu-toggle', function (e) {
			var $this = $(this);
			e.preventDefault();

			if ($('body').hasClass('offcanvas-menu')) {
				$('body').removeClass('offcanvas-menu');
				$this.removeClass('active');
			} else {
				$('body').addClass('offcanvas-menu');
				$this.addClass('active');
			}
		})

		// click outisde offcanvas
		$(document).mouseup(function (e) {
			var container = $(".site-mobile-menu");
			if (!container.is(e.target) && container.has(e.target).length === 0) {
				if ($('body').hasClass('offcanvas-menu')) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		});
	};
	siteMenuClone();

	var siteSticky = function () {
		$(".js-sticky-header").sticky({ topSpacing: 0 });
	};
	siteSticky();

	// navigation
	var OnePageNavigation = function () {
		var navToggler = $('.site-menu-toggle');

		$("body").on("click", ".main-menu li a[href^='#'], .smoothscroll[href^='#'], .site-mobile-menu .site-nav-wrap li a[href^='#'], #getInTouchBtn", function (e) {
			e.preventDefault();

			var hash = this.hash;

			$('html, body').animate({
				'scrollTop': $(hash).offset().top - 50
			}, 600, 'easeInOutExpo', function () {
				// window.location.hash = hash;

			});

		});
	};
	OnePageNavigation();

	var siteScroll = function () {



		$(window).scroll(function () {

			var st = $(this).scrollTop();

			if (st > 100) {
				$('.js-sticky-header').addClass('shrink');
			} else {
				$('.js-sticky-header').removeClass('shrink');
			}

		})

	};
	siteScroll();

	/** Navigation click */
	$(".site-nav-list a").click((e) => {
		$(".site-nav-list a.active").removeClass('active');
		$(e.target).addClass('active');
	});
	
	/** Contact us form submission logic */
	$("#contactUsSubmitBtn").click(() => {
		hasTriedToSubmit = true;
		$('#emailSuccessMsg').addClass('hidden');
		const firstName = $("#firstName");
		const lastName = $("#lastName");
		const emailAddress = $("#emailAddress");
		const messageContent = $("#messageContent");

		let hasError = false;
		if (isEmpty(firstName.val())) {
			hasError = true;
			firstName.siblings('.errMsg').removeClass('hidden').addClass('visible');
		}
		if (isEmpty(lastName.val())) {
			hasError = true;
			lastName.siblings('.errMsg').removeClass('hidden').addClass('visible');
		}
		if (isEmpty(emailAddress.val()) || !isEmailValid(emailAddress.val())) {
			hasError = true;
			emailAddress.siblings('.errMsg').removeClass('hidden').addClass('visible');
		}
		if (isEmpty(messageContent.val())) {
			hasError = true;
			messageContent.siblings('.errMsg').removeClass('hidden').addClass('visible');
		}

		console.log(firstName.val(), lastName.val(), emailAddress.val(), messageContent.val());

		if (hasError) return;
		$("#contactUsSubmitBtn .spinner").removeClass('hidden').addClass('visible');
		$("#contactUsSubmitBtn").prop('disabled', true);
		$.post("https://statixtech.herokuapp.com/contactUs",
			{
				firstName: firstName.val(),
				lastName: firstName.val(),
				email: emailAddress.val(),
				content: messageContent.val()
			},
			(data, status) => {
				$("#contactUsSubmitBtn .spinner").removeClass('visible').addClass('hidden');
				$("#contactUsSubmitBtn").prop('disabled', false);
				if (status === 'success') {
					$('#emailSuccessMsg').removeClass('hidden').addClass('visible');
					clearForm();
				}
			}
		);
	});

	$(".contact-form input.form-control, .contact-form textarea.form-control").keyup((e) => {
		if (!hasTriedToSubmit) return;
		// validate
		let hasError = false;
		if (isEmpty(e.target.value)) {
			hasError = true;
			$(e.target).siblings('.errMsg').removeClass('hidden').addClass('visible');
		} else {
			$(e.target).siblings('.errMsg').removeClass('visible').addClass('hidden');
		}
		if (!hasError && e.target.id === "emailAddress" && !isEmailValid(e.target.value)) {
			$(e.target).siblings('.errMsg').removeClass('hidden').addClass('visible');
		}
	});

	function isEmpty(value) {
		if ($.trim(value).length === 0) {
			return true;
		}
		return false;
	}

	function isEmailValid(email) {
		const pattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		return pattern.test(email);
	}

	function clearForm() {
		$("#firstName").val('');
		$("#lastName").val('');
		$("#emailAddress").val('');
		$("#messageContent").val('');
	}
});