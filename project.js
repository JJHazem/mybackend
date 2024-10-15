
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
    const imageLoadTimeout = 10000; // 8 seconds

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


document.addEventListener('DOMContentLoaded', function () {
    // Function to show locations based on the query parameter
    function showLocationFromQueryParam() {
        const urlParams = new URLSearchParams(window.location.search);
        const location = urlParams.get('location');

        if (location === 'west') {
            document.getElementById('west-locations').classList.remove('hidden');
            document.getElementById('west-locations').classList.add('fade-in');
            document.getElementById('east-locations').classList.add('hidden');
            document.getElementById('east-locations').classList.remove('fade-in');

            document.querySelector('.nav-west button').classList.add('active');
            document.querySelector('.nav-east button').classList.remove('active');
        } else {
            document.getElementById('east-locations').classList.remove('hidden');
            document.getElementById('east-locations').classList.add('fade-in');
            document.getElementById('west-locations').classList.add('hidden');
            document.getElementById('west-locations').classList.remove('fade-in');

            document.querySelector('.nav-east button').classList.add('active');
            document.querySelector('.nav-west button').classList.remove('active');
        }
    }

    // Call the function to show the location based on the URL parameter
    showLocationFromQueryParam();
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
document.addEventListener('DOMContentLoaded', function () {
    // Function to update the URL

    document.querySelector('.nav-west button').addEventListener('click', function () {
        document.getElementById('west-locations').classList.remove('hidden');
        document.getElementById('west-locations').classList.add('fade-in');
        document.getElementById('east-locations').classList.add('hidden');
        document.getElementById('east-locations').classList.remove('fade-in');

        // Add active class to West button and remove from East
        this.classList.add('active');
        document.querySelector('.nav-east button').classList.remove('active');

        // Update URL to reflect the West view
    
    });

    // Show East locations and hide West locations
    document.querySelector('.nav-east button').addEventListener('click', function () {
        document.getElementById('east-locations').classList.remove('hidden');
        document.getElementById('east-locations').classList.add('fade-in');
        document.getElementById('west-locations').classList.add('hidden');
        document.getElementById('west-locations').classList.remove('fade-in');

        // Add active class to East button and remove from West
        this.classList.add('active');
        document.querySelector('.nav-west button').classList.remove('active');

        // Update URL to reflect the East view
     
    });

    // Show West locations and hide East locations

    // Trigger the click event on the East button to make it the default selection
  
});
function showWestLocation() {
    // Update the content to show West locations
    document.getElementById('east-locations').classList.remove('hidden');
    document.getElementById('east-locations').classList.add('fade-in');
    document.getElementById('west-locations').classList.add('hidden');
    document.getElementById('west-locations').classList.remove('fade-in');


}
function showEastLocation() {
    // Update the content to show East locations
    document.getElementById('west-locations').classList.remove('hidden');
    document.getElementById('west-locations').classList.add('fade-in');
    document.getElementById('east-locations').classList.add('hidden');
    document.getElementById('east-locations').classList.remove('fade-in');

   
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
 