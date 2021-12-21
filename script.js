const body = document.querySelector('body');
const menu = document.querySelector('.menu');
const openIcon = document.querySelector('.open_icon');
const homeIcon = document.querySelector('.home_icon');
const favoritesIcon = document.querySelector('.favorites_icon');
const iconSubtitles = Array.from(document.querySelectorAll('.menu span'));
const mainImages = Array.from(document.querySelectorAll('.gallery_img'));
const likeIconImgs = Array.from(document.querySelectorAll('.like_icon'));
const modal = document.querySelector('.modal');
const modalImg = document.querySelector('.zoom_img');
const likeModal = document.querySelector('.like_icon_modal');
const btnPrevious = document.querySelector('.btn_previous');
const btnNext = document.querySelector('.btn_next');
const closeModal = document.querySelector('.modal_close');

const favPage = document.querySelector('.favorites_page');
const mainPage = document.querySelector('.main_page');

const mainGalleryDivs = Array.from(document.querySelectorAll('.main_gallery_img'));
const favGallery = document.querySelector('.main_favorites_gallery');

let menuOpen = false;
let favoritesClicked = false;
let indexMain;
let indexFav;

let hasLike = [];
hasLike.length = mainImages.length;

const btnTheme = document.querySelector('.theme_icon');
const btnThemeImg = document.querySelector('.btn_theme');
const themeTitle = document.querySelector('.theme_icon span')
const stdTheme = localStorage.getItem('theme');

btnThemeImg.src = stdTheme === 'light' ? './assets/light-mode.svg' : './assets/dark-mode.svg';
themeTitle.textContent = stdTheme === 'light' ? 'Light theme' : 'Dark theme';
body.style.setProperty('--background-color', stdTheme === 'light' ? '#FFF' : '#505050');
body.style.setProperty('--prim-text-color', stdTheme === 'light' ? '#000' : '#FFF');
body.style.setProperty('--time-text-color', stdTheme === 'light' ? '#5C5C5C' : '#d6d6d6');

btnTheme.addEventListener('click', () => {
    localStorage.setItem('theme', stdTheme === 'light' ? 'dark' : 'light');

    const changeBackground = body.style.getPropertyValue('--background-color') === '#FFF' ? '#505050' : '#FFF';
    body.style.setProperty('--background-color', changeBackground);
    const changeFontColor = body.style.getPropertyValue('--background-color') === '#FFF' ? '#000' : '#FFF';
    body.style.setProperty('--prim-text-color', changeFontColor);
    const changeTimeColor = body.style.getPropertyValue('--background-color') === '#FFF' ? '#5C5C5C' : '#d6d6d6';
    body.style.setProperty('--time-text-color', changeTimeColor);
    themeTitle.textContent = body.style.getPropertyValue('--background-color') === '#FFF' ? 'Light theme' : 'Dark theme';

    btnThemeImg.src = body.style.getPropertyValue('--background-color') === '#FFF' ? './assets/light-mode.svg' : './assets/dark-mode.svg';
});

openIcon.addEventListener('click', () => {
    menuOpen = menuOpen === false ? true : false;
    openIcon.src = menuOpen === true ? './assets/open-menu.svg' : './assets/closed-menu.svg';

    menu.classList.toggle('open');
    iconSubtitles.forEach(icon => icon.classList.toggle('hidden'));
});

favoritesIcon.addEventListener('click', () => {
    favoritesClicked = true;
    favPage.classList.remove('hidden');
    favoritesIcon.classList.add('brightness');
    mainPage.classList.add('hidden');
    homeIcon.classList.remove('brightness');
});

homeIcon.addEventListener('click', () => {
    favoritesClicked = false;
    mainPage.classList.remove('hidden');
    homeIcon.classList.add('brightness');
    favPage.classList.add('hidden');
    favoritesIcon.classList.remove('brightness');
});

function hideArrows(index, arrayImgs) {
    btnPrevious.style.opacity = 1;
    btnNext.style.opacity = 1;
    if (index === 0) {
        btnPrevious.style.opacity = 0;
    }
    if (index === arrayImgs.length - 1) {
        btnNext.style.opacity = 0;
    }
}

mainImages.forEach(image => {
    image.addEventListener('click', () => {
        modal.classList.remove('hidden');
        modalImg.src = image.src;
        indexMain = mainImages.indexOf(image);
        hideArrows(indexMain, mainImages);
        checkLikeModal();
    });
});


modalImg.addEventListener('click', event => {
    event.stopPropagation();
});

function checkLikeModal() {
    if (!favoritesClicked) {
        if (!hasLike[indexMain]) {
            likeModal.classList.add('hidden');
        }
        else {
            likeModal.classList.remove('hidden');
        }
    }
    else {
        likeModal.classList.add('hidden');
    }
}

modalImg.addEventListener('dblclick', () => {
    if (!favoritesClicked) {
        if (!hasLike[indexMain]) {
            hasLike[indexMain] = true;
            likeIconImgs[indexMain].classList.remove('hidden');
            const divFav = mainGalleryDivs[indexMain].cloneNode(true);
            divFav.classList.add('fav_gallery_img');
            divFav.classList.remove('main_gallery_img');
            divFav.removeChild(divFav.firstElementChild);
            favGallery.append(divFav);
            favPage.append(favGallery);
        }
        else {
            hasLike[indexMain] = false;
            likeIconImgs[indexMain].classList.add('hidden');
            Array.from(favGallery.children).filter(div => {
                if (div.dataset.id === mainGalleryDivs[indexMain].dataset.id) {
                    favGallery.removeChild(div);
                }
            });
        }
        checkLikeModal();
    }
    const arrayFavImgs = Array.from(favGallery.children);
    arrayFavImgs.forEach(favImg => {
        favImg.addEventListener('click', () => {
            modal.classList.remove('hidden');
            modalImg.src = favImg.firstElementChild.src;
            indexFav = arrayFavImgs.indexOf(favImg);
            hideArrows(indexFav, arrayFavImgs);
            checkLikeModal();
        });
    });
});


modal.addEventListener('click', () => {
    modal.classList.add('hidden');
});

btnPrevious.addEventListener('click', event => {
    event.stopPropagation();
    if (!favoritesClicked) {
        indexMain--;
        if (indexMain <= 0) {
            indexMain = 0;
        }
        modalImg.src = mainImages[indexMain].src;
        hideArrows(indexMain, mainImages);
    }
    else {
        const arrayFavImgs = Array.from(favGallery.children);
        indexFav--;
        if (indexFav <= 0) {
            indexFav = 0;
        }
        modalImg.src = arrayFavImgs[indexFav].firstElementChild.src;
        hideArrows(indexFav, arrayFavImgs);
    }
    checkLikeModal();
});

btnNext.addEventListener('click', event => {
    event.stopPropagation();
    if (!favoritesClicked) {
        indexMain++;
        if (indexMain >= mainImages.length - 1) {
            indexMain = mainImages.length - 1;
        }
        modalImg.src = mainImages[indexMain].src;
        hideArrows(indexMain, mainImages);
    }
    else {
        const arrayFavImgs = Array.from(favGallery.children);
        indexFav++;
        if (indexFav >= arrayFavImgs.length - 1) {
            indexFav = arrayFavImgs.length - 1;
        }
        modalImg.src = arrayFavImgs[indexFav].firstElementChild.src;
        hideArrows(indexFav, arrayFavImgs);
    }
    checkLikeModal();
});