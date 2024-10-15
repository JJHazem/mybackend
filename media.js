
function toggleMenu() {
    const leftNav = document.getElementById('left-nav');
    const mainContent = document.getElementById('main-content');
    const heroSlideshow = document.querySelector('.hero-slideshow');
    const hero = document.querySelector('.hero');
    const body = document.body;

    leftNav.classList.toggle('open');
    
    if (heroSlideshow) {
        heroSlideshow.classList.toggle('fade-out');
    }
    
    if (hero) {
        hero.classList.toggle('fade-out');
    }

    mainContent.classList.toggle('fade-out');

    if (leftNav.classList.contains('open')) {
        // Prevent scrolling and disable interactions
        leftNav.classList.add('allow-interaction');
        body.classList.add('no-scroll');
        body.classList.add('no-interaction');
        body.style.top = `-${window.scrollY}px`; // Preserve scroll position
    } else {
        // Allow scrolling and enable interactions
        const scrollY = body.style.top;
        body.classList.remove('no-scroll');
        body.classList.remove('no-interaction');
        body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1); // Restore scroll position
    }
}

document.addEventListener('click', function(event) {
    const leftNav = document.getElementById('left-nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const isClickInsideNav = leftNav.contains(event.target);
    const isClickOnToggle = menuToggle.contains(event.target);

    if (!isClickInsideNav && !isClickOnToggle && leftNav.classList.contains('open')) {
        toggleMenu(); // Close the menu
    }
});

window.addEventListener('scroll', function() {
    var header = document.querySelector('header');
    if (window.scrollY > 50) { // Adjust this value as needed
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Function to show main content after loading
    function showMainContent() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.animation = 'fadeOut 1s forwards';
        loadingScreen.addEventListener('animationend', function() {
            loadingScreen.style.display = 'none';
            const mainContent = document.getElementById('main-content');
            mainContent.classList.remove('hidden');
            mainContent.classList.add('visible');
        });
    }

    // Get the loading video and image
    const loadingVideo = document.getElementById('loading-video');
    const loadingImage = document.getElementById('loading-image');

    // Check screen width
    const isSmallScreen = window.innerWidth < 600;

    // If screen is small, hide the video and ensure the image is shown
    if (isSmallScreen) {
        if (loadingVideo) {
            loadingVideo.style.display = 'none'; // Hide the video
        }
        loadingImage.classList.remove('hidden'); // Ensure the image is visible
        showMainContent(); // Show main content directly
        return; // Exit the function
    }

    // Timeout duration in milliseconds
    const imageLoadTimeout = 8000; // 8 seconds

    // If the video is present, listen for when it ends
    if (loadingVideo) {
        loadingVideo.addEventListener('ended', showMainContent);
        loadingVideo.addEventListener('error', function() {
            console.error("Video failed to load.");
            loadingVideo.style.display = 'none';
            loadingImage.classList.remove('hidden'); // Show the loading image
            showMainContent(); // Proceed to show main content
        });
    }

    // Handle image loading
    loadingImage.addEventListener('load', showMainContent);
    loadingImage.addEventListener('error', function() {
        console.error("Failed to load the loading image.");
        showMainContent(); // Proceed to show main content
    });

    // Set up a timeout for image loading
    const timeoutId = setTimeout(function() {
        console.warn("Image loading timed out.");
        showMainContent(); // Show main content if image takes too long
    }, imageLoadTimeout);

    // Clear the timeout if the image loads successfully
    loadingImage.addEventListener('load', function() {
        clearTimeout(timeoutId);
    });

    // Also clear the timeout if the video ends
    if (loadingVideo) {
        loadingVideo.addEventListener('ended', function() {
            clearTimeout(timeoutId);
        });
    }
});



let slideIndex23 = 0;
let slideTimer23; // Add a timer variable
showSlides23(slideIndex23); // Pass the initial index

function plusSlides23(n) {
    clearTimeout(slideTimer23); // Clear the existing timeout when manually changing slides
    slideIndex23 += n;
    showSlides23(slideIndex23);
}

function currentSlide23(n) {
    clearTimeout(slideTimer23); // Clear the existing timeout when manually changing slides
    showSlides23(slideIndex23 = n);
}

function showSlides23(n) {
    let i;
    let slides23 = document.getElementsByClassName("mySlides23");
    let dots = document.getElementsByClassName("dot");

    // Handle the wrapping of the index
    if (n >= slides23.length) {
        slideIndex23 = 0;
    } else if (n < 0) {
        slideIndex23 = slides23.length - 1;
    } else {
        slideIndex23 = n;
    }

    // Hide all slides
    for (i = 0; i < slides23.length; i++) {
        slides23[i].style.display = "none";
    }

    // Remove active class from all dots
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    // Show the current slide and add active class to the corresponding dot
    slides23[slideIndex23].style.display = "block";
    dots[slideIndex23].className += " active";

    // Reset the timer
    slideTimer23 = setTimeout(() => showSlides23(slideIndex23 + 1), 5000); // Change slide every 5 seconds
}

// Initial call to set up the slideshow
showSlides23(slideIndex23);


window.addEventListener('scroll', () => {
    const hexes = document.querySelectorAll('.hex');
    hexes.forEach(hex => {
        if (isElementInViewport(hex)) {
            hex.classList.add('in-view');
        } else {
            hex.classList.remove('in-view');
        }
    });
});
document.addEventListener("DOMContentLoaded", function() {
    const getInTouchTab = document.getElementById("get-in-touch-tab");
    const contactForm = document.getElementById("contact-form");
    const footer = document.getElementById("footer");

    getInTouchTab.addEventListener("click", function() {
        if (contactForm.style.display === "none" || contactForm.style.display === "") {
            contactForm.style.display = "block";
            setTimeout(() => contactForm.classList.add("show"), 10); // Add a delay to trigger the animation
        } else {
            contactForm.style.display = "none";
            contactForm.classList.remove("show");
        }
    });

    window.addEventListener("scroll", function() {
        const footerRect = footer.getBoundingClientRect();
        const footerTop = footerRect.top + window.scrollY;
        const viewportHeight = window.innerHeight;
        const tabHeight = getInTouchTab.offsetHeight;
        const tabBottomSpace = 20; // Space between the tab and the footer

        const tabTopPosition = footerTop - tabHeight - tabBottomSpace;

        if (window.scrollY + viewportHeight >= tabTopPosition) {
            getInTouchTab.style.position = "absolute";
            getInTouchTab.style.bottom = `${viewportHeight - footerRect.top + tabBottomSpace}px`;
        } else {
            getInTouchTab.style.position = "fixed";
            getInTouchTab.style.bottom = "20px";
        }
    });
});
// Check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

    // Modal script
function openModal(src) {
    document.getElementById('myModal3').style.display = "block";
    document.getElementById('img23').src = src;
}

function closeModal() {
    document.getElementById('myModal3').style.display = "none";
}

document.addEventListener('DOMContentLoaded', function() {
    // Select the "Our Projects" nav item
    const ourProjectsNavItem = document.querySelector('#left-nav > ul > li:nth-child(3)'); // Adjust if needed

    if (ourProjectsNavItem) {
        const link = ourProjectsNavItem.querySelector('a');
        const subNav = ourProjectsNavItem.querySelector('.sub-nav');
        
        if (link && subNav) {
            link.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior
                
                // Toggle the expanded class to show/hide sub-nav
                const isExpanded = ourProjectsNavItem.classList.contains('expanded');
                
                // Hide all other sub-navs and remove expanded class
                document.querySelectorAll('#left-nav > ul > li').forEach(item => {
                    if (item !== ourProjectsNavItem) {
                        item.classList.remove('expanded');
                    }
                });
                
                // Toggle visibility of the clicked sub-nav
                ourProjectsNavItem.classList.toggle('expanded', !isExpanded);
            });
        }
    }

    // Optional: Close the sub-nav when clicking outside of it
    document.addEventListener('click', function(event) {
        if (!event.target.closest('#left-nav')) {
            document.querySelectorAll('#left-nav > ul > li').forEach(item => {
                item.classList.remove('expanded');
            });
        }
    });
});

