// helper to detect mobile width at time of action
function isMobile() { return document.documentElement.clientWidth < 700; }


// =============================
// Product image preview & thumbnails (HTML-based)
// =============================

// Get the preview image element and all thumbnail images
const previewImg = document.createElement('img');
previewImg.className = 'main-preview-img';
previewImg.alt = 'product';
const previewHolder = document.querySelector('.product .preview');
const thumbnailsList = document.querySelector('.product .thumbnails');
const thumbnailDivs = thumbnailsList.querySelectorAll('.thumbnail');

// Insert the preview image at the top of the preview area
previewHolder.insertBefore(previewImg, thumbnailsList);

// Helper: get the main image src from a thumbnail img src
function getMainImgSrcFromThumb(thumbSrc) {
        return thumbSrc.replace('-thumbnail', '');
}

// Set initial preview image to the first thumbnail
function setInitialPreview() {
        if (!thumbnailDivs || thumbnailDivs.length === 0) return;
        const firstThumbImg = thumbnailDivs[0].querySelector('img');
        previewImg.src = getMainImgSrcFromThumb(firstThumbImg.getAttribute('src'));
        thumbnailDivs[0].classList.add('focus-thumbnail');
}

// Click handler for thumbnails
function onThumbnailClick(e) {
        // Remove highlight from all
        thumbnailDivs.forEach(div => div.classList.remove('focus-thumbnail'));
        // Highlight clicked
        const clickedDiv = e.currentTarget;
        clickedDiv.classList.add('focus-thumbnail');
        // Set preview image
        const thumbImg = clickedDiv.querySelector('img');
        previewImg.src = getMainImgSrcFromThumb(thumbImg.getAttribute('src'));
}

// Add click event to all thumbnails
thumbnailDivs.forEach(div => {
        div.addEventListener('click', onThumbnailClick);
});

setInitialPreview();


// =============================
// Lightbox logic
// =============================
const lightboxModal = document.querySelector('.lightbox-modal');
const lightboxOverlay = document.querySelector('.lightbox-overlay');
const lightboxContent = document.querySelector('.lightbox-content');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxMainImg = document.querySelector('.lightbox-main-img');
const lightboxThumbs = document.querySelectorAll('.lightbox-thumbnails .thumbnail');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

let currentLightboxIndex = 0;
const lightboxImgList = [
        'images/image-product-1.jpg',
        'images/image-product-2.jpg',
        'images/image-product-3.jpg',
        'images/image-product-4.jpg',
];

function openLightbox(index) {
        currentLightboxIndex = index;
        updateLightboxImg();
        lightboxModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
}

function closeLightbox() {
        lightboxModal.style.display = 'none';
        document.body.style.overflow = '';
}

function updateLightboxImg() {
        lightboxMainImg.src = lightboxImgList[currentLightboxIndex];
        lightboxThumbs.forEach((thumb, i) => {
                if (i === currentLightboxIndex) {
                        thumb.classList.add('focus-thumbnail');
                } else {
                        thumb.classList.remove('focus-thumbnail');
                }
        });
}

function showPrevImg() {
        currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImgList.length) % lightboxImgList.length;
        updateLightboxImg();
}

function showNextImg() {
        currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImgList.length;
        updateLightboxImg();
}

// Open lightbox when main preview image is clicked
previewImg.addEventListener('click', function () {
        if (isMobile()) return; // don't open lightbox on mobile
        // Find which image is currently shown
        const src = previewImg.src;
        let idx = lightboxImgList.findIndex(img => src.includes(img));
        if (idx === -1) idx = 0;
        openLightbox(idx);
});

// =============================
// Mobile preview navigation (prev/next) and hamburger sidebar
// =============================
const previewPrevBtn = document.querySelector('.preview-prev');
const previewNextBtn = document.querySelector('.preview-next');

// Keep a list of main images (same as lightbox list)
const previewImgList = lightboxImgList.slice();
let currentPreviewIndex = previewImgList.findIndex(i => previewImg.src.includes(i));
if (currentPreviewIndex === -1) currentPreviewIndex = 0;

function showPreviewAtIndex(idx) {
        currentPreviewIndex = (idx + previewImgList.length) % previewImgList.length;
        previewImg.src = previewImgList[currentPreviewIndex];
        // sync thumbnails focus
        thumbnailDivs.forEach((div, i) => {
                if (i === currentPreviewIndex) div.classList.add('focus-thumbnail'); else div.classList.remove('focus-thumbnail');
        });
}

function showPreviewPrev() { showPreviewAtIndex(currentPreviewIndex - 1); }
function showPreviewNext() { showPreviewAtIndex(currentPreviewIndex + 1); }

// Attach preview handlers but only act when on mobile (defensive)
if (previewPrevBtn) previewPrevBtn.addEventListener('click', function (e) { e.stopPropagation(); if (isMobile()) showPreviewPrev(); });
if (previewNextBtn) previewNextBtn.addEventListener('click', function (e) { e.stopPropagation(); if (isMobile()) showPreviewNext(); });

// Hamburger & mobile sidebar
const hamburgerBtn = document.querySelector('.hamburger');
// create overlay and sidebar elements if not present in DOM
let mobileOverlay = document.querySelector('.mobile-sidebar-overlay');
let mobileSidebar = document.querySelector('.mobile-sidebar');
if (!mobileOverlay) {
        mobileOverlay = document.createElement('div');
        mobileOverlay.className = 'mobile-sidebar-overlay';
        document.body.appendChild(mobileOverlay);
}
if (!mobileSidebar) {
        mobileSidebar = document.createElement('nav');
        mobileSidebar.className = 'mobile-sidebar';
        mobileSidebar.innerHTML = `
                <button class="hamburger-close" aria-label="Close menu"><img src="images/icon-close.svg" alt="close"></button>
                <a href="#">Collections</a>
                <a href="#">Men</a>
                <a href="#">Women</a>
                <a href="#">About</a>
                <a href="#">Contact</a>
        `;
        document.body.appendChild(mobileSidebar);
}

function openSidebar() {
        mobileSidebar.classList.add('open');
        mobileOverlay.style.display = 'block';
}

function closeSidebar() {
        mobileSidebar.classList.remove('open');
        mobileOverlay.style.display = 'none';
}

if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                openSidebar();
        });
}

// Guard overlay and close button (they should exist after creation above)
if (mobileOverlay) mobileOverlay.addEventListener('click', closeSidebar);
const hamburgerClose = mobileSidebar && mobileSidebar.querySelector('.hamburger-close');
if (hamburgerClose) hamburgerClose.addEventListener('click', closeSidebar);

// Close lightbox
lightboxClose.addEventListener('click', closeLightbox);
lightboxOverlay.addEventListener('click', closeLightbox);

// Next/Prev
lightboxPrev.addEventListener('click', showPrevImg);
lightboxNext.addEventListener('click', showNextImg);

// Thumbnail click in lightbox
lightboxThumbs.forEach((thumb, i) => {
        thumb.addEventListener('click', function () {
                currentLightboxIndex = i;
                updateLightboxImg();
        });
});




// =============================
// Product price (placeholder for future logic)
// =============================


// =============================
// Item count logic (plus/minus buttons)
// =============================

let counter = document.querySelector('.counter'); // counter container
let minusIcon = counter.children[0]; // minus button
let countSpan = document.querySelector(".counter span");
// Load count from localStorage if available
let count = parseInt(localStorage.getItem('cartCount')) || 0; // initialize count as number
let plusIcon = counter.children[2]; // plus button

// Function to update the count value
function counting(n) {
        if (isNaN(count)) {
                alert("THERE IS A EXTENTION STOPING THE PAGE FROM WORK");
                // RELOAD
                return;
        }
        count = Math.max(0, count + n);
        countSpan.innerHTML = count;
        // Save to localStorage
        localStorage.setItem('cartCount', count);
}
// Add correct event listeners
minusIcon.addEventListener("click", function () { counting(-1); });
plusIcon.addEventListener("click", function () { counting(1); });



// =============================
// Basket dropdown logic
// =============================
const basketIcon = document.querySelector('.basket-icon');
const basketList = document.querySelector('.basket-list');
const basketCount = document.querySelector('.basket-icon .count');
const basketItems = document.querySelector('.basket-list .items');

// Helper: update basket count badge
function updateBasketCount() {
        if (count > 0) {
                basketCount.textContent = count;
                basketCount.style.display = 'inline-block';
        } else {
                basketCount.textContent = '';
                basketCount.style.display = 'none';
        }
}

// Helper: update basket dropdown content
function updateBasketDropdown() {
        basketItems.innerHTML = '';
        if (count > 0) {
                // Example cart item (static, can be dynamic later)
                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';
                itemDiv.innerHTML = `
                        <div class="thumbnail in-cart"><img src="images/image-product-1-thumbnail.jpg" alt="thumb"></div>
                        <div class="desc in-cart">
                                <span class="cart-title">Fall Limited Edition Sneakers</span>
                                <span class="cart-price">$125.00 x ${count} <b class="cart-sum">$${(125 * count).toFixed(2)}</b></span>
                        </div>
                        <img src="images/icon-delete.svg" alt="delete" class="delete-item">
                `;
                basketItems.appendChild(itemDiv);
                // Checkout button
                const checkoutBtn = document.createElement('a');
                checkoutBtn.href = '#';
                checkoutBtn.className = 'checkout';
                checkoutBtn.textContent = 'Checkout';
                basketItems.appendChild(checkoutBtn);
        } else {
                // Empty cart label
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'cart-empty-label';
                emptyDiv.textContent = 'Your cart is empty';
                basketItems.appendChild(emptyDiv);
        }
}

// Toggle basket dropdown
basketIcon.addEventListener('click', function (e) {
        e.stopPropagation();
        if (basketList.style.display === 'none' || basketList.style.display === '') {
                updateBasketDropdown();
                basketList.style.display = 'block';
        } else {
                basketList.style.display = 'none';
        }
});

// Hide basket dropdown when clicking outside
document.addEventListener('click', function (e) {
        if (!basketList.contains(e.target) && !basketIcon.contains(e.target)) {
                basketList.style.display = 'none';
        }
});

// Delete item from basket
basketItems.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-item')) {
                count = 0;
                countSpan.innerHTML = count;
                // Remove from localStorage
                localStorage.setItem('cartCount', count);
                updateBasketCount();
                updateBasketDropdown();
        }
});

// Add to cart button logic
const addToCartBtn = document.querySelector('.buying-field > button');
addToCartBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (count > 0) {
                updateBasketCount();
                updateBasketDropdown();
                basketList.style.display = 'block';
        }
});

// Initial state
updateBasketCount();
updateBasketDropdown();
// Set initial count in UI
countSpan.innerHTML = count;
