

// Function to animate counting up to a target value
function animateCount(targetElement, duration) {
    const targetValue = parseInt(targetElement.getAttribute('data-target'));
    const startTime = performance.now(); // Get the start time
    const increment = targetValue / (duration / 16); // Calculate increment based on duration and frame rate (16ms per frame)

    // Function to update the value in each frame
    const updateValue = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        let currentValue = elapsedTime * increment / 16;

        if (currentValue >= targetValue) {
            targetElement.textContent = targetValue; // Set to target value when reaching it
        } else {
            targetElement.textContent = Math.ceil(currentValue); // Update the displayed value
            requestAnimationFrame(updateValue); // Call updateValue on the next animation frame
        }
    };

    requestAnimationFrame(updateValue); // Start the update process
}

// Function to start animations when the section comes into view
function animateOnScroll() {
    const factsFiguresSection = document.getElementById('facts-figures');
    const factItems = factsFiguresSection.querySelectorAll('strong');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                factItems.forEach(item => animateCount(item, 2000)); // Animate each item with a duration of 2000ms
                observer.disconnect(); // Stop observing after animation starts
            }
        });
    }, observerOptions);

    observer.observe(factsFiguresSection);
}

// Start the scroll animation observer
document.addEventListener('DOMContentLoaded', animateOnScroll);



document.addEventListener('DOMContentLoaded', () => {
    function setActiveNav(navId) {
        const navItems = document.querySelectorAll('.small-nav a');
        navItems.forEach(navItem => {
            if (navItem.id === navId) {
                navItem.classList.add('active');
            } else {
                navItem.classList.remove('active');
            }
        });
    }

    function showSection(sectionId) {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });
    }

    // About nav click
    document.getElementById('about-nav').addEventListener('click', (event) => {
        event.preventDefault();
        showSection('about-text');
        setActiveNav('about-nav');
    });

    // Team nav click
    document.getElementById('team-nav').addEventListener('click', (event) => {
        event.preventDefault();
        showSection('team-grid');
        setActiveNav('team-nav');
    });

    // Optionally, set an initial active nav item if needed
    setActiveNav('about-nav'); // Assuming you want 'About Us' active by default
    showSection('about-text'); // Display About Us by default
});

document.querySelectorAll('.location').forEach(location => {
    location.addEventListener('mouseover', function() {
        const popup = document.getElementById('location-popup');
        const info = this.getAttribute('data-info');
        const rect = this.getBoundingClientRect();
        const mapRect = document.querySelector('.map-container').getBoundingClientRect();
        const top = rect.top - mapRect.top;
        const left = rect.left - mapRect.left;

        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;
        popup.innerHTML = info;
        popup.classList.add('active');
    });

    location.addEventListener('mouseout', function() {
        const popup = document.getElementById('location-popup');
        popup.classList.remove('active');
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
document.addEventListener('DOMContentLoaded', () => {
    // Check if the screen width is at least 600px
    if (window.innerWidth < 600) {
        return; // Exit the function if the width is less than 600px
    }

    const sections = document.querySelectorAll('.section');

    const options = {
        threshold: 0.1 // Trigger when 10% of the section is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible'); // Add visible class
            } else {
                entry.target.classList.remove('section-visible'); // Remove visible class
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section); // Observe each section
    });
});

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
    const imageLoadTimeout = 500000; // 8 seconds

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


function handleNavClick(event) {
    // Prevent default behavior
    event.preventDefault();

    // Remove the 'clicked' class from all links
    const navLinks = document.querySelectorAll('.left-nav ul li a');
    navLinks.forEach(link => link.classList.remove('clicked'));

    // Add 'clicked' class to the clicked link
    event.target.classList.add('clicked');

    // Optionally, navigate to the link's href
    window.location.href = event.target.href; // Uncomment this if you want to navigate
}

// Attach click event to all links in the left navigation
document.querySelectorAll('.left-nav ul li a').forEach(link => {
    link.addEventListener('click', handleNavClick);
});

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



let slideIndex0 = 0;

const slides = document.querySelectorAll('.hero-slide');
const totalSlides = slides.length; // Dynamically get the total number of slides

// Function to show the current slide and hide others
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');  // Remove 'active' class from all slides
        if (i === index) {
            slide.classList.add('active');  // Add 'active' class to the current slide
        }
    });
}

// Show the first slide initially
showSlide(slideIndex0);

// Automatically switch slides every 7 seconds
setInterval(nextSlide, 7000); 

// Function to go to the next/previous slide
function plusSlides2(n) {
    slideIndex0 = (slideIndex0 + n + totalSlides) % totalSlides; // Handle negative indices
    showSlide(slideIndex0);
}

// Function to automatically go to the next slide
function nextSlide() {
    slideIndex0 = (slideIndex0 + 1) % totalSlides; // Wrap around correctly
    showSlide(slideIndex0);
}

// Change slide every 5 seconds
function setLanguage(lang) {
    const leftNav = document.getElementById('left-nav');
    if (lang === 'ar') {
        leftNav.classList.add('right-nav135'); // Move to right
    } else {
        leftNav.classList.remove('right-nav135'); // Move back to left
    }
}


let slideIndex1 = 0;
showSlides1(slideIndex1);

function plusSlides1(n) {
    showSlides1(slideIndex1 += n);
}

function showSlides1(n) {
    let i;
    let slides1 = document.getElementsByClassName("slide1");
    if (n >= slides1.length) {slideIndex1 = 0}
    if (n < 0) {slideIndex1 = slides1.length - 1}
    for (i = 0; i < slides1.length; i++) {
        slides1[i].style.display = "none";
    }
    slides1[slideIndex1].style.display = "block";
}
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const action = form.action;
    
    fetch(action, {
        method: 'POST',
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            alert('Your message has been sent successfully.');
            form.reset();
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    alert(data["errors"].map(error => error["message"]).join(", "));
                } else {
                    alert('There was an error sending your message.');
                }
            });
        }
    }).catch(error => {
        alert('There was an error sending your message.');
    });
});
document.addEventListener('DOMContentLoaded', () => {
    showLocation('head-office');
});

function showLocation(locationId) {
    const locations0 = document.querySelectorAll('.location0');
    locations0.forEach(location0 => {
        location0.classList.remove('active');
    });

    const activeLocation = document.getElementById(locationId);
    if (activeLocation) {
        activeLocation.classList.add('active');
    }
}
 

  


// Initially show the first location


