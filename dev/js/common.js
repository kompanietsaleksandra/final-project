var headSlider = new Swiper ('.swiper-container', {
    direction: 'horizontal',
    loop: true,
    pagination: {
        el: '.swiper-pagination',
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    }
});
var postSlider = new Swiper ('.post-slider', {
    direction: 'horizontal',
    pagination: {
        el: '.swiper-pagination',
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    slidesPerView: 3,
    breakpoints: {
        1199: {
            slidesPerView: 2
        },
        768: {
            slidesPerView: 1
        }
    }
});
var cardSlider = new Swiper ('.card-post-image', {
    direction: 'horizontal',
    loop: true,
    pagination: {
        el: '.swiper-pagination',
    },
    slidesPerView: 1,
    paginationClickable: true,
    spaceBetween: 50,
    nested: true
});
