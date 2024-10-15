

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



window.addEventListener('scroll', function() {
    var header = document.querySelector('header');
    if (window.scrollY > 50) { // Adjust this value as needed
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});


let currentProjectElement = null;

async function showProjects(cityName) {
    const projectsNav = document.getElementById('projects-nav');
    projectsNav.innerHTML = ''; // Clear previous projects
    showStaticCityDetails(cityName);
    try {
        const response = await fetch(`https://it-eg.org/units/${cityName}`);
        
        if (!response.ok) {
            throw new Error(`http error! status: ${response.status}`);
        }
        
        const cityData = await response.json();
        console.log('City data fetched:', cityData);
        
        const projects = cityData.projects;
        if (!projects || projects.length === 0) {
            console.warn('No projects found for this city');
            return;
        }

        // Ensure that no projects are added multiple times
        projects.forEach(project => {
            const projectItem = document.createElement('li');
            const projectLink = document.createElement('a');
            projectLink.href = '#'; // Set actual links to the projects if needed
            projectLink.textContent = project.name;

            // Original onclick for handling background and section display
            projectLink.onclick = () => {
                // Set the background image for the overview section
                const backgroundImageUrl = project.imageUrl; // Adjust this to match the actual property name for the image URL
                
                // Call functions to change background and show section
                changeBackground('overview', backgroundImageUrl);
                showSection('overview');
                
                // Additional project details
                showProjectDetails(cityData, project);
                resetSideNavToOverview();
                
            };

            // Separate onclick to handle the active state
            projectLink.addEventListener('click', () => {
                // Clear previous "active" class
                if (currentProjectElement) {
                    currentProjectElement.classList.remove('active');
                }
                
                // Mark this project as selected
                projectLink.classList.add('active');
                currentProjectElement = projectLink; // Store the current project element
            });

            projectItem.appendChild(projectLink);
            projectsNav.appendChild(projectItem);
        });

        // Reset side navigation and display overview
        resetSideNav();
        resetSideNavToOverview();
        showSection('overview'); // Default section when a city is selected
        currentCity = cityName; // Correct assignment of cityName
    } catch (error) {
        console.error('Error fetching city data:', error);
    }
}
/*let currentProjectElement = null;

// Static city data for New Cairo
const city = {
    "new-cairo": {
        name: "New Cairo",
        projects: [
            {
                name: "EAST POINT 1",
                overview: "East Point 1 is a strategically located development in the 1st district of New Cairo, near As-Salam International Hospital in the 5th Settlement. Spanning 2,400 square meters, this project, designed by IEC, features a G+3 structure offering commercial spaces, administrative offices, and clinics. With its proximity to a major healthcare facility, East Point 1 is ideal for businesses and medical services, providing easy access to a growing community. The project blends modern architecture with functional design, ensuring a professional and inviting environment for tenants and visitors. Its prime location in one of Cairo’s most sought-after districts makes it an attractive destination for commercial and administrative ventures.",
                masterplanImage: "eastpointmaster.png",
                imageUrl: "interior point11 FINAL (1)_Page_04.jpg",
                amenitiesImages: [
                    "parking.jpeg",
                    "fiber.jpeg",
                    "bike.jpeg"
                ],
                constructionImages: [
                    "4.RGB_color.jpg",
                    "2.RGB_color.jpg",
                    "3.RGB_color.jpg",
                    "7.RGB_color.jpg"
                ],
                constructionVideo: "East Point 1 Mall.mp4",
                brochure: "3.RGB_color.jpg",
                units: [
                    {
                        id: 1,
                        type: "commercial",
                        rooms: 0,
                        area: 0,
                        image: "commercial.webp",
                        modal1: "interior point11 FINAL (1)_Page_03.jpg",
                        modal2: "interior point11 FINAL (1)_Page_04.jpg",
                        modal3: "interior point11 FINAL (1)_Page_02.jpg",
                        name: "Modern Commercial",
                        details: "A spacious commercial."
                    },
                    {
                        id: 2,
                        type: "admin",
                        rooms: 0,
                        area: 0,
                        image: "interior point11 FINAL (1)_Page_09.jpg",
                        modal1: "interior point11 FINAL (1)_Page_10.jpg",
                        modal2: "admin22.jpg",
                        modal3: "admin23.jpg",
                        name: "Modern Admin",
                        details: "A modern admin with city view."
                    },
                    {
                        id: 3,
                        type: "clinics",
                        rooms: 0,
                        area: 0,
                        image: "interior point11 FINAL (1)_Page_12.jpg",
                        modal1: "interior point11 FINAL (1)_Page_11.jpg",
                        modal2: "clinic23.jpg",
                        modal3: "clinic22.jpg",
                        name: "Modern Clinics",
                        details: "A modern clinics with city view."
                    }
                ]
            },
            {
                name: "LA COLINA EAST",
                overview: "Lacolina East is a comprehensive mixed-use development spanning 34 feddans in the East View Zone of Beit Al-Watan, New Cairo. Designed by HAFEZ, this project features a G+4 structure, offering a combination of residential units, commercial spaces, administrative offices, and clinics. The development aims to provide a modern and self-sustaining community, with residential options supported by essential services and commercial facilities. Its strategic location in Beit Al-Watan, a highly sought-after area of New Cairo, ensures that Lacolina offers both tranquility and connectivity. The project is designed to cater to the needs of families and businesses alike, blending comfort, functionality, and contemporary living with high-end amenities.",
                masterplanImage: "lacolina-east.png",
                imageUrl: "pool shot 01.jpg",
                amenitiesImages: [
                    "parking.jpeg",
                    "fiber.jpeg",
                    "bike.jpeg"
                ],
                constructionImages: [
                    "shot 01.jpg",
                    "shot 02.jpg",
                    "landscape shot 03.png",
                    "landscape shot 02 - n .png"
                ],
                constructionVideo: "",
                brochure: "CAPITAL HILLS CODED LAYOUT01.pdf",
                units: [
                    {
                        id: 1,
                        type: "residential",
                        rooms: 3,
                        area: 350,
                        image: "Flaying App..jpg",
                        modal1: "garden day.jpg",
                        modal2: "street.jpg",
                        modal3: "pool shot.jpg",
                        name: "Luxury Residential",
                        details: "A spacious Residential with a garden and swimming pool."
                    },
                    {
                        id: 2,
                        type: "commercial",
                        rooms: 0,
                        area: 0,
                        image: "commercial.webp",
                        modal1: "interior point11 FINAL (1)_Page_03.jpg",
                        modal2: "interior point11 FINAL (1)_Page_04.jpg",
                        modal3: "interior point11 FINAL (1)_Page_02.jpg",
                        name: "Modern Commercial",
                        details: "A spacious commercial."
                    },
                    {
                        id: 3,
                        type: "admin",
                        rooms: 0,
                        area: 0,
                        image: "interior point11 FINAL (1)_Page_09.jpg",
                        modal1: "interior point11 FINAL (1)_Page_10.jpg",
                        modal2: "admin22.jpg",
                        modal3: "admin23.jpg",
                        name: "Modern Admin",
                        details: "A modern admin with city view."
                    },
                    {
                        id: 4,
                        type: "clinics",
                        rooms: 0,
                        area: 0,
                        image: "interior point11 FINAL (1)_Page_12.jpg",
                        modal1: "interior point11 FINAL (1)_Page_11.jpg",
                        modal2: "clinic23.jpg",
                        modal3: "clinic22.jpg",
                        name: "Modern Clinics",
                        details: "A modern clinics with city view."
                    }
                ]
            }
        ]
    },
    "new-capital": {
        name: "New Capital",
        projects: [
            {
                "name": "POINT9",
                "overview": "POINT9 Located in the heart of the New Administrative Capital, the MU1/14 project spans 2,400 square meters in the bustling Downtown district. This mixed-use development, designed by ARCPLAN, offers a strategic blend of commercial spaces, administrative offices, and clinics. The project features a G+8 structure, providing a modern and functional environment for businesses, health services, and corporate offices. With its prime location in one of Egypt’s fastest-growing urban areas, the MU1/14 development is set to become a key hub for commerce and administration in the New Capital.",
                "masterplanImage": "masterplan.jpg",
                "imageUrl": "04-CAPITAL HILLS NIGHT 2.jpg",
                "amenitiesImages": [
                    "parking.jpeg",
                    "fiber.jpeg",
                    "bike.jpeg"
                ],
                "constructionImages": [
                    "04-CAPITAL HILLS NIGHT 2.jpg",
                    "03-CAPITAL HILLS NIGHT.jpg",
                    "02-CAPITAL HILLS  DAY  2.jpg",
                    "01- CAPITAL HILLS  DAY  .jpg"
                ],
                "constructionVideo": "",
                "brochure": "04-CAPITAL HILLS NIGHT 2.pdf",
                "units": [
                    {
                        "id": 1,
                        "type": "commercial",
                        "rooms": 0,
                        "area": 0,
                        "image": "commercial.webp",
                        "modal1": "interior point11 FINAL (1)_Page_03.jpg",
                        "modal2": "interior point11 FINAL (1)_Page_04.jpg",
                        "modal3": "interior point11 FINAL (1)_Page_02.jpg",
                        "name": "Modern Commercial",
                        "details": "A spacious commercial."
                    },
                    {
                        "id": 2,
                        "type": "admin",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_09.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_10.jpg",
                        "modal2": "admin22.jpg",
                        "modal3": "admin23.jpg",
                        "name": "Modern Admin",
                        "details": "A modern admin with city view."
                    },
                    {
                        "id": 3,
                        "type": "clinics",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_12.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_11.jpg",
                        "modal2": "clinic23.jpg",
                        "modal3": "clinic22.jpg",
                        "name": "Modern Clinics",
                        "details": "A modern clinic with city view."
                    }
                ]
            },
            {
                "name": "POINT11",
                "overview": "The POINT11 project, located in the dynamic MU2 district of the New Administrative Capital, covers an expansive area of 2,400 square meters. Designed by ARKAN, this high-rise development consists of commercial spaces, administrative offices, and clinics, housed in a G+10 structure. The project offers a well-integrated environment for businesses, healthcare facilities, and administrative functions, catering to a diverse range of tenants. Positioned in the rapidly developing New Capital, MU2/45 provides excellent accessibility and visibility, making it a prime choice for companies and service providers looking to establish themselves in this emerging economic center.",
                "masterplanImage": "masterplan.jpg",
                "imageUrl": "WhatsApp Image 2021-04-28 at 12.42.52 PM (1).jpeg",
                "amenitiesImages": [
                    "parking.jpeg",
                    "fiber.jpeg",
                    "bike.jpeg"
                ],
                "constructionImages": [
                    "WhatsApp Image 2021-04-28 at 12.42.52 PM (1).jpeg",
                    "WhatsApp Image 2021-04-28 at 12.42.51 PM.jpeg",
                    "interior point11 FINAL (1)_Page_01.jpg",
                    "interior point11 FINAL (1)_Page_05.jpg"
                ],
                "constructionVideo": "",
                "brochure": "interior point11 FINAL (1).pdf",
                "units": [
                    {
                        "id": 1,
                        "type": "commercial",
                        "rooms": 0,
                        "area": 0,
                        "image": "commercial.webp",
                        "modal1": "interior point11 FINAL (1)_Page_03.jpg",
                        "modal2": "interior point11 FINAL (1)_Page_04.jpg",
                        "modal3": "interior point11 FINAL (1)_Page_02.jpg",
                        "name": "Modern Commercial",
                        "details": "A spacious commercial."
                    },
                    {
                        "id": 2,
                        "type": "admin",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_09.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_10.jpg",
                        "modal2": "admin22.jpg",
                        "modal3": "admin23.jpg",
                        "name": "Modern Admin",
                        "details": "A modern admin with city view."
                    },
                    {
                        "id": 3,
                        "type": "clinics",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_12.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_11.jpg",
                        "modal2": "clinic23.jpg",
                        "modal3": "clinic22.jpg",
                        "name": "Modern Clinics",
                        "details": "A modern clinic with city view."
                    }
                ]
            },
            {
                "name": "PARK POINT",
                "overview": "Park Point, located in the prestigious MU5/14 district of the New Administrative Capital, is a large-scale mixed-use development spanning 9,100 square meters. Designed by DMA, this G+14 structure offers a unique combination of commercial spaces, administrative offices, and luxurious hotel apartments. The project is designed to cater to a diverse clientele, offering top-tier amenities for businesses, corporate offices, and hospitality services. With its high-rise design and premium location, Park Point stands as a landmark development, providing modern facilities and exceptional convenience for professionals and visitors alike. Its strategic placement within the rapidly evolving New Capital enhances its appeal, making it a key destination for commerce, business, and upscale living.",
                "masterplanImage": "masterplan.jpg",
                "imageUrl": "CAMERA 07 - UPDATE02.jpg",
                "amenitiesImages": [
                    "parking.jpeg",
                    "fiber.jpeg",
                    "bike.jpeg"
                ],
                "constructionImages": [
                    "CAMERA 07 - UPDATE02.jpg",
                    "CAMERA 06 - UPDATED.jpg",
                    "CAMERA 05 - UPDATED.jpg",
                    "CAMERA 02 - UPDATED (2).jpg"
                ],
                "constructionVideo": "ParkPoint.mp4",
                "brochure": "Download Brochure content for Project A3",
                "units": [
                    {
                        "id": 1,
                        "type": "commercial",
                        "rooms": 0,
                        "area": 0,
                        "image": "commercial.webp",
                        "modal1": "interior point11 FINAL (1)_Page_03.jpg",
                        "modal2": "interior point11 FINAL (1)_Page_04.jpg",
                        "modal3": "interior point11 FINAL (1)_Page_02.jpg",
                        "name": "Modern Commercial",
                        "details": "A spacious commercial."
                    },
                    {
                        "id": 2,
                        "type": "admin",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_09.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_10.jpg",
                        "modal2": "admin22.jpg",
                        "modal3": "admin23.jpg",
                        "name": "Modern Admin",
                        "details": "A modern admin with city view."
                    },
                    {
                        "id": 3,
                        "type": "hotel apartments",
                        "rooms": 0,
                        "area": 0,
                        "image": "CAMERA 05 - UPDATED.jpg",
                        "modal1": "hotel1.jpg",
                        "modal2": "hotel2.jpg",
                        "modal3": "hotel3.jpg",
                        "name": "Modern Hotel Apartments",
                        "details": "A modern hotel apartments with city view."
                    }
                ]
            }
        ]
    },
    "october-city": {
        name: "6th of October City",
        projects: [
            {
                "name": "PARK YARD 1",
                "overview": "Park Yard 1 is a major mixed-use development located at the bustling Al-Hossary Square in 6th of October, Giza. Spanning 12,000 square meters, this G+3 project, designed collaboratively by RAY and IEC, offers a range of commercial spaces, administrative offices, and clinics. Situated in one of the most vibrant areas of 6th of October, Park Yard 1 benefits from high visibility and accessibility, making it an ideal location for businesses and medical services. The development’s modern architecture and well-planned layout are designed to meet the diverse needs of tenants and visitors, providing a professional and dynamic environment. With its prime location and comprehensive facilities, Park Yard 1 stands as a key hub for commerce and administration in the area.",
                "masterplanImage": "masterplan.jpg",
                "imageUrl": "PY Shots_Page_1.jpg",
                "amenitiesImages": [
                    "parking.jpeg",
                    "fiber.jpeg",
                    "bike.jpeg"
                ],
                "constructionImages": [
                    "PY Shots_Page_1.jpg",
                    "07.jpg",
                    "CAMERA 01 - FINAL B.jpg",
                    "09.jpg"
                ],
                "constructionVideo": "ParkYard AC_no number.mp4",
                "brochure": "03.jpg",
                "units": [
                    {
                        "id": 1,
                        "type": "commercial",
                        "rooms": 0,
                        "area": 0,
                        "image": "commercial.webp",
                        "modal1": "interior point11 FINAL (1)_Page_03.jpg",
                        "modal2": "interior point11 FINAL (1)_Page_04.jpg",
                        "modal3": "interior point11 FINAL (1)_Page_02.jpg",
                        "name": "Modern Commercial",
                        "details": "A spacious commercial."
                    },
                    {
                        "id": 2,
                        "type": "admin",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_09.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_10.jpg",
                        "modal2": "admin22.jpg",
                        "modal3": "admin23.jpg",
                        "name": "Modern Admin",
                        "details": "A modern admin with city view."
                    },
                    {
                        "id": 3,
                        "type": "clinics",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_12.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_11.jpg",
                        "modal2": "clinic23.jpg",
                        "modal3": "clinic22.jpg",
                        "name": "Modern Clinics",
                        "details": "A modern clinic with city view."
                    }
                ]
            },
            {
                "name": "PARK YARD 2",
                "overview": "Park Yard 2 is an expansive mixed-use development covering 24,000 square meters, located in the prominent Al-Hossary Square in 6th of October, Giza. Designed by ADC, this G+2 project offers a versatile mix of commercial spaces, administrative offices, and clinics. Building on the success of its predecessor, Park Yard 1, this development provides additional space for businesses, healthcare services, and corporate offices in one of 6th of October’s most central and well-known areas. The project’s low-rise design ensures ease of access, while its modern facilities are tailored to meet the needs of both professionals and visitors. With its prime location and ample commercial opportunities, Park Yard 2 is set to become a major commercial and administrative landmark in 6th of October.",
                "masterplanImage": "park yard2-maaster.png",
                "imageUrl": "parkyard2.png",
                "amenitiesImages": [
                    "parking.jpeg",
                    "fiber.jpeg",
                    "bike.jpeg"
                ],
                "constructionImages": [
                    "S13.jpg",
                    "S9.jpg",
                    "IN01.effectsResult.jpg",
                    "S16.jpg"
                ],
                "constructionVideo": "",
                "brochure": "3d py2.pdf",
                "units": [
                    {
                        "id": 1,
                        "type": "commercial",
                        "rooms": 0,
                        "area": 0,
                        "image": "commercial.webp",
                        "modal1": "interior point11 FINAL (1)_Page_03.jpg",
                        "modal2": "interior point11 FINAL (1)_Page_04.jpg",
                        "modal3": "interior point11 FINAL (1)_Page_02.jpg",
                        "name": "Modern Commercial",
                        "details": "A spacious commercial."
                    },
                    {
                        "id": 2,
                        "type": "admin",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_09.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_10.jpg",
                        "modal2": "admin22.jpg",
                        "modal3": "admin23.jpg",
                        "name": "Modern Admin",
                        "details": "A modern admin with city view."
                    },
                    {
                        "id": 3,
                        "type": "clinics",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_12.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_11.jpg",
                        "modal2": "clinic23.jpg",
                        "modal3": "clinic22.jpg",
                        "name": "Modern Clinics",
                        "details": "A modern clinic with city view."
                    }
                ]
            },
            {
                "name": "CAPITAL TOWER 1",
                "overview": "Capital Tower 1 is a prominent mixed-use development situated along the Gamal Abdelnasser Axis, near Mall of Arabia in 6th of October, Giza. Covering 3,250 square meters, this G+6 tower, designed by ADC, features a blend of commercial spaces, administrative offices, and clinics. With its strategic location near one of the largest shopping destinations in the area, Capital Tower 1 offers excellent visibility and access to a thriving commercial hub. The modern G+6 structure is designed to accommodate a variety of businesses and healthcare services, providing a professional and efficient environment. Its proximity to major landmarks and transportation routes makes Capital Tower 1 a key destination for commerce and administration in 6th of October.",
                "masterplanImage": "Capital Towers.jpg",
                "imageUrl": "Binder3_Page_11.jpg",
                "amenitiesImages": [
                    "parking.jpeg",
                    "fiber.jpeg",
                    "bike.jpeg"
                ],
                "constructionImages": [
                    "Binder3_Page_05.jpg",
                    "2 (1).jpg",
                    "4.jpg",
                    "3.jpg"
                ],
                "constructionVideo": "Capital Tower video final.mp4",
                "brochure": "5 1-0000.png",
                "units": [
                    {
                        "id": 1,
                        "type": "commercial",
                        "rooms": 0,
                        "area": 0,
                        "image": "commercial.webp",
                        "modal1": "interior point11 FINAL (1)_Page_03.jpg",
                        "modal2": "interior point11 FINAL (1)_Page_04.jpg",
                        "modal3": "interior point11 FINAL (1)_Page_02.jpg",
                        "name": "Modern Commercial",
                        "details": "A spacious commercial."
                    },
                    {
                        "id": 2,
                        "type": "admin",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_09.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_10.jpg",
                        "modal2": "admin22.jpg",
                        "modal3": "admin23.jpg",
                        "name": "Modern Admin",
                        "details": "A modern admin with city view."
                    },
                    {
                        "id": 3,
                        "type": "clinics",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_12.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_11.jpg",
                        "modal2": "clinic23.jpg",
                        "modal3": "clinic22.jpg",
                        "name": "Modern Clinics",
                        "details": "A modern clinic with city view."
                    }
                ]
            },
            {
                "name": "CAPITAL TOWER 2",
                "overview": "Capital Tower 2 is a mixed-use development strategically located on the Gamal Abdelnasser Axis, near Mall of Arabia in 6th of October, Giza. Covering 4,000 square meters, this G+6 building, designed by IEC, offers a versatile mix of commercial spaces, administrative offices, and clinics. As an extension of the successful Capital Tower 1, this development provides additional space for businesses and healthcare services in one of 6th of October's busiest areas. Its modern design and functional layout ensure a professional atmosphere, catering to the needs of various industries. The prime location near a major commercial center enhances its accessibility and appeal, making Capital Tower 2 a prime destination for companies and service providers in the area.",
                "masterplanImage": "Capital Towers.jpg",
                "imageUrl": "Binder3_Page_10.jpg",
                "amenitiesImages": [
                    "parking.jpeg",
                    "fiber.jpeg",
                    "bike.jpeg"
                ],
                "constructionImages": [
                    "Binder3_Page_05.jpg",
                    "2 (1).jpg",
                    "4.jpg",
                    "3.jpg"
                ],
                "constructionVideo": "Capital Tower video final.mp4",
                "brochure": "5 1-0000.png",
                "units": [
                    {
                        "id": 1,
                        "type": "commercial",
                        "rooms": 0,
                        "area": 0,
                        "image": "commercial.webp",
                        "modal1": "interior point11 FINAL (1)_Page_03.jpg",
                        "modal2": "interior point11 FINAL (1)_Page_04.jpg",
                        "modal3": "interior point11 FINAL (1)_Page_02.jpg",
                        "name": "Modern Commercial",
                        "details": "A spacious commercial."
                    },
                    {
                        "id": 2,
                        "type": "admin",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_09.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_10.jpg",
                        "modal2": "admin22.jpg",
                        "modal3": "admin23.jpg",
                        "name": "Modern Admin",
                        "details": "A modern admin with city view."
                    },
                    {
                        "id": 3,
                        "type": "clinics",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_12.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_11.jpg",
                        "modal2": "clinic23.jpg",
                        "modal3": "clinic22.jpg",
                        "name": "Modern Clinics",
                        "details": "A modern clinic with city view."
                    }
                ]
            },
            {
                "name": "CAPITAL TOWER 3",
                "overview": "Capital Tower 3 is a mixed-use G+6 development located along the prominent Gamal Abdelnasser Axis in 6th of October, Giza. Spanning 4,000 square meters, this project, designed by IEC, offers a range of commercial spaces, administrative offices, and clinics. Building on the success of Capital Towers 1 and 2, Capital Tower 3 provides additional modern facilities for businesses and healthcare services, ensuring a professional and efficient working environment. Positioned in a key commercial area near Mall of Arabia, the project enjoys excellent connectivity and visibility, making it an attractive destination for enterprises and service providers looking to establish a presence in the thriving 6th of October district.",
                "masterplanImage": "Capital Towers.jpg",
                "imageUrl": "Binder3_Page_12.jpg",
                "amenitiesImages": [
                    "parking.jpeg",
                    "fiber.jpeg",
                    "bike.jpeg"
                ],
                "constructionImages": [
                    "Binder3_Page_05.jpg",
                    "2 (1).jpg",
                    "4.jpg",
                    "3.jpg"
                ],
                "constructionVideo": "Capital Tower video final.mp4",
                "brochure": "5 1-0000.png",
                "units": [
                    {
                        "id": 1,
                        "type": "commercial",
                        "rooms": 0,
                        "area": 0,
                        "image": "commercial.webp",
                        "modal1": "interior point11 FINAL (1)_Page_03.jpg",
                        "modal2": "interior point11 FINAL (1)_Page_04.jpg",
                        "modal3": "interior point11 FINAL (1)_Page_02.jpg",
                        "name": "Modern Commercial",
                        "details": "A spacious commercial."
                    },
                    {
                        "id": 2,
                        "type": "admin",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_09.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_10.jpg",
                        "modal2": "admin22.jpg",
                        "modal3": "admin23.jpg",
                        "name": "Modern Admin",
                        "details": "A modern admin with city view."
                    },
                    {
                        "id": 3,
                        "type": "clinics",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_12.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_11.jpg",
                        "modal2": "clinic23.jpg",
                        "modal3": "clinic22.jpg",
                        "name": "Modern Clinics",
                        "details": "A modern clinic with city view."
                    }
                ]
            },
            {
                "name": "CAPITAL TOWER 4",
                "overview": "Capital Tower 4 is a modern mixed-use development situated along the bustling Gamal Abdelnasser Axis in 6th of October, Giza. Covering 3,500 square meters, this G+6 project, designed by IEC, features a diverse mix of commercial spaces, administrative offices, and clinics. This development complements the existing Capital Towers, providing an additional venue for businesses and healthcare providers in a prime location. With its contemporary design and strategic positioning near key commercial centers, Capital Tower 4 offers excellent visibility and accessibility. The project is designed to foster a professional atmosphere, making it an ideal choice for companies and services looking to thrive in the vibrant 6th of October area.",
                "masterplanImage": "Capital Towers.jpg",
                "imageUrl": "Binder3_Page_02.jpg",
                "amenitiesImages": [
                    "parking.jpeg",
                    "fiber.jpeg",
                    "bike.jpeg"
                ],
                "constructionImages": [
                    "Binder3_Page_05.jpg",
                    "2 (1).jpg",
                    "4.jpg",
                    "3.jpg"
                ],
                "constructionVideo": "Capital Tower video final.mp4",
                "brochure": "5 1-0000.png",
                "units": [
                    {
                        "id": 1,
                        "type": "commercial",
                        "rooms": 0,
                        "area": 0,
                        "image": "commercial.webp",
                        "modal1": "interior point11 FINAL (1)_Page_03.jpg",
                        "modal2": "interior point11 FINAL (1)_Page_04.jpg",
                        "modal3": "interior point11 FINAL (1)_Page_02.jpg",
                        "name": "Modern Commercial",
                        "details": "A spacious commercial."
                    },
                    {
                        "id": 2,
                        "type": "admin",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_09.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_10.jpg",
                        "modal2": "admin22.jpg",
                        "modal3": "admin23.jpg",
                        "name": "Modern Admin",
                        "details": "A modern admin with city view."
                    },
                    {
                        "id": 3,
                        "type": "clinics",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_12.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_11.jpg",
                        "modal2": "clinic23.jpg",
                        "modal3": "clinic22.jpg",
                        "name": "Modern Clinics",
                        "details": "A modern clinic with city view."
                    }
                ]
            },
            {
                "name": "CAPITAL TOWER 5",
                "overview": "Capital Tower 5 is an expansive mixed-use development located on the bustling Gamal Abdelnasser Axis in 6th of October, Giza. Spanning 5,200 square meters, this G+9 project, designed by IEC, offers a unique combination of commercial spaces, administrative offices, clinics, and hotel apartments. The tower’s modern design caters to a diverse range of tenants, providing an ideal environment for businesses and healthcare services alongside hospitality options. Its strategic location near major shopping and entertainment hubs enhances its appeal, offering excellent visibility and accessibility. Capital Tower 5 stands as a key landmark in the area, promising a dynamic and integrated experience for residents, professionals, and visitors alike.",
                "masterplanImage": "Capital Towers.jpg",
                "imageUrl": "Binder3_Page_09.jpg",
                "amenitiesImages": [
                    "parking.jpeg",
                    "fiber.jpeg",
                    "bike.jpeg"
                ],
                "constructionImages": [
                    "Binder3_Page_05.jpg",
                    "2 (1).jpg",
                    "4.jpg",
                    "3.jpg"
                ],
                "constructionVideo": "Capital Tower video final.mp4",
                "brochure": "5 1-0000.png",
                "units": [
                    {
                        "id": 1,
                        "type": "commercial",
                        "rooms": 0,
                        "area": 0,
                        "image": "commercial.webp",
                        "modal1": "interior point11 FINAL (1)_Page_03.jpg",
                        "modal2": "interior point11 FINAL (1)_Page_04.jpg",
                        "modal3": "interior point11 FINAL (1)_Page_02.jpg",
                        "name": "Modern Commercial",
                        "details": "A spacious commercial."
                    },
                    {
                        "id": 2,
                        "type": "admin",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_09.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_10.jpg",
                        "modal2": "admin22.jpg",
                        "modal3": "admin23.jpg",
                        "name": "Modern Admin",
                        "details": "A modern admin with city view."
                    },
                    {
                        "id": 3,
                        "type": "clinics",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_12.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_11.jpg",
                        "modal2": "clinic23.jpg",
                        "modal3": "clinic22.jpg",
                        "name": "Modern Clinics",
                        "details": "A modern clinic with city view."
                    },
                    {
                        "id": 4,
                        "type": "hotel apartments",
                        "rooms": 0,
                        "area": 0,
                        "image": "CAMERA 05 - UPDATED.jpg",
                        "modal1": "hotel1.jpg",
                        "modal2": "hotel2.jpg",
                        "modal3": "hotel3.jpg",
                        "name": "Modern Hotel Apartments",
                        "details": "A modern hotel apartments with city view."
                    }
                ]
            },
            {
                "name": "WIN PLAZA",
                "overview": "Win Plaza is an impressive mixed-use development situated in the Italian District of Hadayak October, Giza, covering an expansive area of 17,700 square meters. Designed by IEC, this G+2 project features a blend of commercial spaces, administrative offices, and clinics. With its modern architectural design, Win Plaza aims to create a vibrant and functional environment that caters to a diverse range of tenants. The project is strategically located to provide excellent accessibility and visibility, making it an ideal destination for businesses and healthcare services. Win Plaza stands to enhance the commercial landscape of Hadayak October, fostering a dynamic community for professionals and visitors alike.",
                "masterplanImage": "TOP.RGB_color.0099.jpg",
                "imageUrl": "winplaza.jpg",
                "amenitiesImages": [
                    "parking.jpeg",
                    "fiber.jpeg",
                    "bike.jpeg"
                ],
                "constructionImages": [
                    "1.jpg",
                    "7.jpg",
                    "5.jpg",
                    "3.jpg"
                ],
                "constructionVideo": "",
                "brochure": "6.jpg",
                "units": [
                    {
                        "id": 1,
                        "type": "commercial",
                        "rooms": 0,
                        "area": 0,
                        "image": "commercial.webp",
                        "modal1": "interior point11 FINAL (1)_Page_03.jpg",
                        "modal2": "interior point11 FINAL (1)_Page_04.jpg",
                        "modal3": "interior point11 FINAL (1)_Page_02.jpg",
                        "name": "Modern Commercial",
                        "details": "A spacious commercial."
                    },
                    {
                        "id": 2,
                        "type": "admin",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_09.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_10.jpg",
                        "modal2": "admin22.jpg",
                        "modal3": "admin23.jpg",
                        "name": "Modern Admin",
                        "details": "A modern admin with city view."
                    },
                    {
                        "id": 3,
                        "type": "clinics",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_12.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_11.jpg",
                        "modal2": "clinic23.jpg",
                        "modal3": "clinic22.jpg",
                        "name": "Modern Clinics",
                        "details": "A modern clinic with city view."
                    }
                ]
            }
        ]
    },
    "sheikh-zayed": {
        name: "Sheikh Zayed City",
        projects: [
            {
                "name": "LA COLINA",
                "overview": "La Colina is a large-scale mixed-use development situated in Old Zayed, Giza, covering 19 feddans. Designed by YBA and HAFEZ, this G+5 project offers a harmonious blend of residential units, commercial spaces, administrative offices, and clinics. This development aims to create a self-sustaining community, providing residents with convenient access to essential services and amenities. With its thoughtful design and modern architecture, La Colina fosters a vibrant lifestyle, catering to the diverse needs of its inhabitants. Its strategic location in Old Zayed enhances connectivity and accessibility, making La Colina an attractive destination for both living and business opportunities in the region.",
                "masterplanImage": "lacolina-master.png",
                "imageUrl": "lacolina.jpg",
                "amenitiesImages": [
                    "parking.jpeg",
                    "fiber.jpeg",
                    "bike.jpeg"
                ],
                "constructionImages": [
                    "CAM 01.effectsResult-1.jpg",
                    "CAM 03.effectsResult-1.jpg",
                    "CAM 04 - Night Terrace.effectsResult.jpg",
                    "20231212-Top Roof Shots -1.png"
                ],
                "constructionVideo": "",
                "brochure": "LA COLINA Brochure.pdf",
                "units": [
                    {
                        "id": 1,
                        "type": "residential",
                        "rooms": 2,
                        "area": 120,
                        "image": "Flaying App..jpg",
                        "modal1": "garden day.jpg",
                        "modal2": "street.jpg",
                        "modal3": "pool shot.jpg",
                        "name": "Luxury Residential",
                        "details": "A spacious Residential TYPE 1 with a garden and two bedrooms."
                    },
                    {
                        "id": 2,
                        "type": "residential",
                        "rooms": 3,
                        "area": 150,
                        "image": "Private Garden.png",
                        "modal1": "CAM 03.effectsResult-1.jpg",
                        "modal2": "CAM 06 - REV 2.effectsResult.jpg",
                        "modal3": "CAM 01.effectsResult-1.jpg",
                        "name": "Luxury Residential",
                        "details": "A spacious Residential TYPE 2 with a garden and three bedrooms."
                    },
                    {
                        "id": 3,
                        "type": "residential",
                        "rooms": 3,
                        "area": 200,
                        "image": "CAM 02.effectsResult.jpg",
                        "modal1": "Roof 01.png",
                        "modal2": "20231212-Top Roof Shots -2.png",
                        "modal3": "CAM 04 - Night Terrace.effectsResult.jpg",
                        "name": "Luxury Residential",
                        "details": "A spacious Residential TYPE 3 with a garden, three bedrooms, and a terrace."
                    },
                    {
                        "id": 4,
                        "type": "commercial",
                        "rooms": 0,
                        "area": 0,
                        "image": "commercial.webp",
                        "modal1": "interior point11 FINAL (1)_Page_03.jpg",
                        "modal2": "interior point11 FINAL (1)_Page_04.jpg",
                        "modal3": "interior point11 FINAL (1)_Page_02.jpg",
                        "name": "Modern Commercial",
                        "details": "A spacious commercial."
                    },
                    {
                        "id": 5,
                        "type": "admin",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_09.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_10.jpg",
                        "modal2": "admin22.jpg",
                        "modal3": "admin23.jpg",
                        "name": "Modern Admin",
                        "details": "A modern admin with city view."
                    },
                    {
                        "id": 6,
                        "type": "clinics",
                        "rooms": 0,
                        "area": 0,
                        "image": "interior point11 FINAL (1)_Page_12.jpg",
                        "modal1": "interior point11 FINAL (1)_Page_11.jpg",
                        "modal2": "clinic23.jpg",
                        "modal3": "clinic22.jpg",
                        "name": "Modern Clinics",
                        "details": "A modern clinic with city view."
                    }
                ]
            },
            {
                "name": "CAPITAL GREEN",
                "overview": "Capital Green is a charming residential development located in Old Zayed, Giza, encompassing 5 feddans of beautifully designed living spaces. This G+1 project, developed by IEC, offers a serene environment that emphasizes community living and green spaces. With a focus on quality and comfort, Capital Green features thoughtfully designed residential units that cater to families and individuals seeking a tranquil lifestyle. The development’s layout promotes connectivity among residents while providing access to essential amenities. Its prime location in Old Zayed offers a peaceful retreat within easy reach of urban conveniences, making Capital Green an ideal choice for those looking to enjoy modern living in a picturesque setting.",
                "masterplanImage": "masterplan.jpg",
                "imageUrl": "capitalgreen.png",
                "amenitiesImages": [
                    "parking.jpeg",
                    "fiber.jpeg",
                    "bike.jpeg"
                ],
                "constructionImages": [
                    "green1.png",
                    "green2.png",
                    "green3.png",
                    "green4.png"
                ],
                "constructionVideo": "",
                "brochure": "3d shots.pdf",
                "units": [
                    {
                        "id": 1,
                        "type": "residential",
                        "rooms": 3,
                        "area": 350,
                        "image": "Flaying App..jpg",
                        "modal1": "garden day.jpg",
                        "modal2": "street.jpg",
                        "modal3": "pool shot.jpg",
                        "name": "Luxury Residential",
                        "details": "A spacious Residential with a garden and swimming pool."
                    }
                ]
            }
        ]
    }
    
};*/

/*// Modify showProjects function
function showProjects(cityName) {
    const projectsNav = document.getElementById('projects-nav');
    projectsNav.innerHTML = ''; // Clear previous projects
    showStaticCityDetails(cityName);
    
    const cityData = city[cityName];

    if (!cityData) {
        console.warn(`No data found for city: ${cityName}`);
        return;
    }
    
    const projects = cityData.projects;
    if (!projects || projects.length === 0) {
        console.warn('No projects found for this city');
        return;
    }

    // Ensure that no projects are added multiple times
    projects.forEach(project => {
        const projectItem = document.createElement('li');
        const projectLink = document.createElement('a');
        projectLink.href = '#'; // Set actual links to the projects if needed
        projectLink.textContent = project.name;

        // Original onclick for handling background and section display
        projectLink.onclick = () => {
            // Set the background image for the overview section
            const backgroundImageUrl = project.imageUrl; // Adjust this to match the actual property name for the image URL
            
            // Call functions to change background and show section
            changeBackground('overview', backgroundImageUrl);
            showSection('overview');
            
            // Additional project details
            showProjectDetails(cityData, project);
            resetSideNavToOverview();
        };

        // Separate onclick to handle the active state
        projectLink.addEventListener('click', () => {
            // Clear previous "active" class
            if (currentProjectElement) {
                currentProjectElement.classList.remove('active');
            }
            
            // Mark this project as selected
            projectLink.classList.add('active');
            currentProjectElement = projectLink; // Store the current project element
        });

        projectItem.appendChild(projectLink);
        projectsNav.appendChild(projectItem);
    });

    // Reset side navigation and display overview
    resetSideNav();
    resetSideNavToOverview();
    showSection('overview'); // Default section when a city is selected
    currentCity = cityName; // Correct assignment of cityName
}*/

// The rest of your existing code...


const cities = {
    'new-capital': {
        overview: 'The fully-fledged city will cover an area of 170,000 feddans split into several residential areas, equipped with an international airport, parks, electric train, medical facilities, schools and colleges, and an infrastructure that is set to meet current as well as future standards.',
        masterplan:  'masterplan.jpg',
        imageUrl: 'CAMERA 07 - UPDATE02.jpg'
    },
    'new-cairo': {
        overview: 'New Cairo is a satellite city in the Eastern Area of Cairo, Egypt, administered by the New Urban Communities Authority. The city was established in the year 2000 by merging three new towns, (The First, Third and Fifth Settlements), originally on an area of about 67,000 acres which had grown to 85,000 acres by 2016. New Cairo is built in the Eastern Desert to the east of the Cairo Ring Road, strategically located between Maadi & Heliopolis, two of the most affluent residential districts in Greater Cairo.',
        masterplan: 'masterplan.jpg',
        imageUrl: 'garden day.jpg'
    },
    'october-city': {
        overview: '6th of October City is located in Giza governorate in Egypt and was established in 1995. It is 28 kilometers away from the heart of Egyptâ€™s capital, Cairo, and comprises a large number of residential, administrative & commercial complexes.',
        masterplan: 'masterplan.jpg',
        imageUrl: '07.jpg'
    },
    'sheikh-zayed': {
        overview: 'Sheikh Zayed City is located in Giza governorate in Egypt and was established in 1995. It is 28 kilometers away from the heart of Egyptâ€™s capital, Cairo, and comprises a large number of residential, administrative & commercial complexes.',
        masterplan: 'masterplan.jpg',
        imageUrl: 'CAM 03.effectsResult-1.jpg'
    }
};
function formatCityName(cityKey) {
    return cityKey.split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
}

function showStaticCityDetails(cityKey) {
    const cityData = cities[cityKey];
    
    if (!cityData) {
        console.error('City data not found for key:', cityKey);
        return;
    }

    const overviewContent = document.getElementById('overview');
    const masterplanImage = document.getElementById('masterplan-image'); // Correctly targeting the img element
    
    if (overviewContent) {
        // Clear the existing content
        overviewContent.innerHTML = '';

        // Create a header for the overview
        const header = document.createElement('h2');
        header.textContent = formatCityName(cityKey);

        // Create a paragraph for the city overview text
        const overviewText = document.createElement('p');
        overviewText.textContent = cityData.overview;
// Apply styles directly in JavaScript
        overviewText.style.fontSize = '1.25em'; // Adjust size as needed
        overviewText.style.lineHeight = '1.6'; // Increase line spacing for readability
        overviewText.style.color = '#fff'; // White color for the text
        overviewText.style.margin = '1em 0'; // Margin to space out paragraphs
        overviewText.style.padding = '0 1em'; // Padding to add space inside the paragraph
        overviewText.style.textAlign = 'justify'; // Justify text for a cleaner look
        overviewText.style.backgroundColor = 'transparent'; // Transparent background
        overviewText.style.borderRadius = '5px'; // Rounded corners for the background
        overviewText.style.boxShadow = 'none';
                // Append the header and the overview text to the overviewContent
        overviewContent.appendChild(header);
        overviewContent.appendChild(overviewText);
    } else {
        console.error('Element with id "overview" not found');
    }

    if (masterplanImage) {
        // Set the image src to the masterplan image URL
        masterplanImage.src = cityData.masterplan;
        masterplanImage.alt = `Master Plan of ${cityKey.replace('-', ' ').toUpperCase()}`; // Optional alt text
    } else {
        console.error('Element with id "masterplan-image" not found');
    }

    // Set background image for the overview section
    changeBackground('overview', cityData.imageUrl);

    // Display the masterplan section
    document.getElementById('masterplan').style.display = 'block';

    // Display the overview section
    showSection('overview');
    const overviewLink = document.querySelector(`.tree-nav li a[data-section="overview"][data-city-key="${cityKey}"]`);
    if (overviewLink) {
        selectNavItem(overviewLink);
    }

}

// Function to reset side navigation
function resetSideNav() {
    document.getElementById('units-link').style.display = 'none';
    document.getElementById('amenities-link').style.display = 'none';
    document.getElementById('construction-link').style.display = 'none';
    document.getElementById('brochure-link').style.display = 'none';
    document.getElementById('back-btn').style.display = 'none';
}

// Function to go back to default state (New Capital City)
function goBack() {
    showProjects(currentCity);
    hideFilterToggleButton();
}

// Function to set default projects (New Capital City)

function changeBackground(section, imageUrl) {
    document.body.style.backgroundImage = `url('${imageUrl}')`;
    document.body.style.backgroundSize = 'cover'; // Ensure the image covers the whole viewport
    document.body.style.backgroundPosition = 'center'; // Center the background image
    document.body.style.backgroundRepeat = 'no-repeat'; // Prevent repeating the background image
    document.body.style.backgroundAttachment = 'fixed'; // Keep the background image fixed
    
    showSection(section); // Call function to display the specified section
}


// Function to show project content
function showProjectDetails(city, project) {
    // Clear previous project content
    clearProjectDetails();  
    resetSideNavToOverview()
    console.log('City:', city);  // Check that the correct city is being passed
    console.log('Project:', project);  // Check that the correct project is being passed

    if (!project || !project.name) {
        console.error('Invalid project object:', project);
        return;
    }

    currentProject = project.name;
    console.log('Current project is now:', currentProject);

    // Display the project overview
    document.getElementById('overview').textContent = project.overview || 'No overview available';

    // Display master plan image with hover effect
    if (project.masterplanImage) {
        const masterplanImg = document.createElement('img');
        masterplanImg.src = project.masterplanImage;
        masterplanImg.alt = "Master Plan";

        // Inline styles for masterplan image with hover effect
        masterplanImg.style.maxWidth = "100%";
        masterplanImg.style.maxHeight = "650px";
        masterplanImg.style.display = "block";
        masterplanImg.style.margin = "0 auto";
        masterplanImg.style.border = "1px solid #ccc";
        masterplanImg.style.padding = "10px";
        masterplanImg.style.transition = "transform 0.5s ease-in-out";
        masterplanImg.onmouseover = function() {
            masterplanImg.style.transform = "scale(1.1) rotate(1deg)";
        };
        masterplanImg.onmouseout = function() {
            masterplanImg.style.transform = "scale(1) rotate(0deg)";
        };

        document.getElementById('masterplan').innerHTML = '';
        document.getElementById('masterplan').appendChild(masterplanImg);
    } else {
        document.getElementById('masterplan').textContent = 'No masterplan available';
    }

    // Function to create slideshow for images and video
    function createSlideshow(itemsArray, containerId, autoSlide = false) {
        let slideIndex = 0;
    
        const container = document.getElementById(containerId);
        container.innerHTML = ''; // Clear the container
    
        const slideshowContainer = document.createElement('div');
        slideshowContainer.classList.add('slideshow-container');
        container.appendChild(slideshowContainer);
    
        itemsArray.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.classList.add('mySlides');
            slide.style.display = index === 0 ? 'block' : 'none'; // Show only the first item initially
    
            if (item.type === 'image') {
                const img = document.createElement('img');
                img.src = item.url;
                img.alt = "Slide Image";
                img.style.width = "100%";
                img.style.maxHeight = "600px";
                img.loading = 'lazy';
                slide.appendChild(img);
            } else if (item.type === 'video') {
                const video = document.createElement('video');
                video.controls = true;
                video.style.width = "100%";
                video.preload = 'metadata';
                video.style.maxHeight = "600px";
                video.innerHTML = `<source src="${item.url}" type="video/mp4">Your browser does not support the video tag.`;
                slide.appendChild(video);
            }
    
            slideshowContainer.appendChild(slide);
        });
    
        // Create Previous and Next buttons
        const prevBtn = document.createElement('a');
        prevBtn.classList.add('prev15');
        prevBtn.textContent = "❮";
        prevBtn.onclick = function () {
            pauseAllVideos(containerId);
            showSlides(-1);
        };
    
        const nextBtn = document.createElement('a');
        nextBtn.classList.add('next15');
        nextBtn.textContent = "❯";
        nextBtn.onclick = function () {
            pauseAllVideos(containerId);
            showSlides(1);
        };
    
        container.appendChild(prevBtn);
        container.appendChild(nextBtn);
    
        // Function to show slides
        function showSlides(n) {
            const slides = container.getElementsByClassName('mySlides');
            slideIndex += n;
    
            if (slideIndex >= slides.length) { slideIndex = 0; }
            if (slideIndex < 0) { slideIndex = slides.length - 1; }
    
            for (let i = 0; i < slides.length; i++) {
                slides[i].style.display = "none"; // Hide all slides
            }
            slides[slideIndex].style.display = "block"; // Show the current slide
        }
    
        // Auto-slide functionality if enabled
        if (autoSlide) {
            function autoSlideFunction() {
                showSlides(1);  // Move to the next slide
                setTimeout(autoSlideFunction, 5000);  // Change slide every 5 seconds
            }
    
            // Start auto-slide
            setTimeout(autoSlideFunction, 5000);  // First change after 5 seconds
        }
    }
    
    // Function to pause all videos
    function pauseAllVideos(containerId) {
        const container = document.getElementById(containerId);
        const videos = container.getElementsByTagName('video');
        for (let i = 0; i < videos.length; i++) {
            videos[i].pause();
        }
    }
    

    // Display amenities images as a slideshow with responsive image handling
    if (project.amenitiesImages && project.amenitiesImages.length > 0) {
        const amenitiesArray = project.amenitiesImages.map(imageUrl => ({
            type: 'image',
            url: imageUrl,
            loading: 'lazy' 
        }));
        createSlideshow(amenitiesArray, 'amenities', true); // Enable auto-slide for amenities
    } else {
        document.getElementById('amenities').textContent = 'No amenities available';
    }

    // Display construction updates as a manual slideshow
    if (project.constructionImages && project.constructionImages.length > 0) {
        const constructionArray = project.constructionImages.map(imageUrl => ({
            type: 'image',
            url: imageUrl,
            loading: 'lazy'
        }));

        // Add the video to the slideshow if available
        if (project.constructionVideo) {
            constructionArray.push({
                type: 'video',
                url: project.constructionVideo,
                preload: 'metadata' 
            });
        }

        createSlideshow(constructionArray, 'construction', false); // Manual slide for construction
    }

    // Display brochure download link
    const brochureLinkElement = document.getElementById('brochure-link');
    const brochureDownloadLink = document.getElementById('brochure-download-link');

    if (project.brochure) {
        brochureDownloadLink.href = project.brochure;  // Set the brochure URL dynamically
        brochureLinkElement.style.display = 'block';   // Show the brochure link
    } else {
        brochureLinkElement.style.display = 'none';    // Hide the brochure link if not available
    }

    // Show relevant UI links
    document.getElementById('units-link').style.display = 'block';
    document.getElementById('amenities-link').style.display = 'block';
    document.getElementById('construction-link').style.display = 'block';
    document.getElementById('brochure-link').style.display = 'block';
    document.getElementById('back-btn').style.display = 'block';

    // Fetch and display units for the selected project
    fetchUnits(city._id, project.name);  // Pass the correct project name and city ID
}
// Function to show project content
function showProjectDetails(city, project) {
    // Clear previous project content
    clearProjectDetails();  
    resetSideNavToOverview();
    console.log('City:', city);  // Check that the correct city is being passed
    console.log('Project:', project);  // Check that the correct project is being passed

    if (!project || !project.name) {
        console.error('Invalid project object:', project);
        return;
    }

    currentProject = project.name;
    console.log('Current project is now:', currentProject);

    // Display the project overview
    document.getElementById('overview').textContent = project.overview || 'No overview available';

    // Display master plan image with hover effect
    if (project.masterplanImage) {
        const masterplanImg = document.createElement('img');
        masterplanImg.src = project.masterplanImage;
        masterplanImg.alt = "Master Plan";

        // Inline styles for masterplan image with hover effect
        masterplanImg.style.maxWidth = "100%";
        masterplanImg.style.maxHeight = "650px";
        masterplanImg.style.display = "block";
        masterplanImg.style.margin = "0 auto";
        masterplanImg.style.border = "1px solid #ccc";
        masterplanImg.style.padding = "10px";
        masterplanImg.style.transition = "transform 0.5s ease-in-out";
        masterplanImg.onmouseover = function() {
            masterplanImg.style.transform = "scale(1.1) rotate(1deg)";
        };
        masterplanImg.onmouseout = function() {
            masterplanImg.style.transform = "scale(1) rotate(0deg)";
        };

        document.getElementById('masterplan').innerHTML = '';
        document.getElementById('masterplan').appendChild(masterplanImg);
    } else {
        document.getElementById('masterplan').textContent = 'No masterplan available';
    }

    // Function to create slideshow for images and video
    function createSlideshow(itemsArray, containerId, autoSlide = false) {
        let slideIndex = 0;

        const container = document.getElementById(containerId);
        container.innerHTML = ''; // Clear the container

        const slideshowContainer = document.createElement('div');
        slideshowContainer.classList.add('slideshow-container');
        container.appendChild(slideshowContainer);

        itemsArray.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.classList.add('mySlides');
            slide.style.display = index === 0 ? 'block' : 'none'; // Show only the first item initially

            if (item.type === 'image') {
                const img = document.createElement('img');
                img.src = item.url;
                img.alt = "Slide Image";
                img.style.width = "100%";
                img.style.maxHeight = "600px";
                img.loading = 'lazy';
                slide.appendChild(img);
            } else if (item.type === 'video') {
                const video = document.createElement('video');
                video.controls = true;
                video.preload = 'metadata';
                video.style.width = "100%";
                video.style.maxHeight = "600px";
                video.innerHTML = `<source src="${item.url}" type="video/mp4">Your browser does not support the video tag.`;
                slide.appendChild(video);
            }

            slideshowContainer.appendChild(slide);
        });

        // Create Previous and Next buttons
        const prevBtn = document.createElement('a');
        prevBtn.classList.add('prev15');
        prevBtn.textContent = "❮";
        prevBtn.onclick = function () {
            pauseAllVideos(containerId);
            showSlides(-1);
        };

        const nextBtn = document.createElement('a');
        nextBtn.classList.add('next15');
        nextBtn.textContent = "❯";
        nextBtn.onclick = function () {
            pauseAllVideos(containerId);
            showSlides(1);
        };

        container.appendChild(prevBtn);
        container.appendChild(nextBtn);

        // Function to show slides
        function showSlides(n) {
            const slides = container.getElementsByClassName('mySlides');
            slideIndex += n;

            if (slideIndex >= slides.length) { slideIndex = 0; }
            if (slideIndex < 0) { slideIndex = slides.length - 1; }

            for (let i = 0; i < slides.length; i++) {
                slides[i].style.display = "none"; // Hide all slides
            }
            slides[slideIndex].style.display = "block"; // Show the current slide
        }

        // Auto-slide functionality if enabled
        if (autoSlide) {
            function autoSlideFunction() {
                showSlides(1);  // Move to the next slide
                setTimeout(autoSlideFunction, 5000);  // Change slide every 5 seconds
            }

            // Start auto-slide
            setTimeout(autoSlideFunction, 5000);  // First change after 5 seconds
        }
    }

    // Function to pause all videos
    function pauseAllVideos(containerId) {
        const container = document.getElementById(containerId);
        const videos = container.getElementsByTagName('video');
        for (let i = 0; i < videos.length; i++) {
            videos[i].pause();
        }
    }

    // Display amenities images as a slideshow with responsive image handling
    if (project.amenitiesImages && project.amenitiesImages.length > 0) {
        const amenitiesArray = project.amenitiesImages.map(imageUrl => ({
            type: 'image',
            url: imageUrl,
            loading:'lazy'
            
        }));
        createSlideshow(amenitiesArray, 'amenities', true); // Enable auto-slide for amenities
    } else {
        document.getElementById('amenities').textContent = 'No amenities available';
    }

    // Display construction updates as a slideshow with responsive image handling
    if (project.constructionImages && project.constructionImages.length > 0) {
        const constructionArray = project.constructionImages.map(imageUrl => ({
            type: 'image',
            url: imageUrl,
            loading:'lazy'
             // Use the responsive image element
        }));

        // Add the video to the slideshow if available
        if (project.constructionVideo) {
            constructionArray.push({
                type: 'video',
                url: project.constructionVideo,
                preload: 'metadata' 
            });
        }

        createSlideshow(constructionArray, 'construction', false); // Manual slide for construction
    }


    // Display brochure download link
    const brochureLinkElement = document.getElementById('brochure-link');
    const brochureDownloadLink = document.getElementById('brochure-download-link');

    if (project.brochure) {
        brochureDownloadLink.href = project.brochure;  // Set the brochure URL dynamically
        brochureLinkElement.style.display = 'block';   // Show the brochure link
    } else {
        brochureLinkElement.style.display = 'none';    // Hide the brochure link if not available
    }

    // Show relevant UI links
    document.getElementById('units-link').style.display = 'block';
    document.getElementById('amenities-link').style.display = 'block';
    document.getElementById('construction-link').style.display = 'block';
    document.getElementById('brochure-link').style.display = 'block';
    document.getElementById('back-btn').style.display = 'block';

    // Fetch and display units for the selected project from static data
    if (project.units && project.units.length > 0) {
        displayUnits(project.units);  // Call the function to display the units directly
    } else {
        document.getElementById('units').textContent = 'No units available'; // Handle no units case
    }
}
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
function toggleLeftNav() {
    const leftNav = document.getElementById('left-nav2');
    if (leftNav) {
        leftNav.classList.toggle('open'); // Toggle 'open' class
        console.log("Left Navigation Toggled!"); // Log successful toggle
    } else {
        console.error("Left Navigation element not found!"); // Error message
    }
}

// Close the left navigation after clicking any link
function closeLeftNav() {
    const leftNav = document.getElementById('left-nav2');
    if (leftNav && leftNav.classList.contains('open')) {
        leftNav.classList.remove('open'); // Remove 'open' class to close the nav
    }
}




// Adding styles for slideshow container and controls
document.querySelectorAll('.slideshow-container').forEach(container => {
    container.style.position = "relative";
    container.style.maxWidth = "100%";
    container.style.margin = "auto";
    container.style.overflow = "hidden";
});

document.querySelectorAll('.mySlides').forEach(slide => {
    slide.style.display = "none"; // Hide all slides initially
    slide.style.position = "relative";
});

document.querySelectorAll('.prev, .next').forEach(btn => {
    btn.style.cursor = "pointer";
    btn.style.position = "absolute";
    btn.style.top = "50%"; // Aligns vertically at the center of the slideshow
    btn.style.transform = "translateY(-50%)"; // Adjust to ensure proper centering vertically
    btn.style.width = "auto";
    btn.style.padding = "5px";
    btn.style.color = "white";
    btn.style.fontWeight = "bold";
    btn.style.fontSize = "18px";
    btn.style.transition = "0.6s ease";
    btn.style.userSelect = "none";
    btn.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    btn.style.borderRadius = "3px";
});

// Positioning of Next button
document.querySelectorAll('.prev').forEach(prevBtn => {
    prevBtn.style.left = "150px"; // Adjust to move button towards the left side
    prevBtn.style.borderRadius = "3px 0 0 3px";
});

document.querySelectorAll('.next').forEach(nextBtn => {
    nextBtn.style.right = "35%"; // Adjust to move button towards the right side
    nextBtn.style.borderRadius = "0 3px 3px 0";
});

// Hover effects for buttons
document.querySelectorAll('.prev, .next').forEach(btn => {
    btn.onmouseover = function () { btn.style.backgroundColor = "rgba(0,0,0,1)"; };
    btn.onmouseout = function () { btn.style.backgroundColor = "rgba(0,0,0,0.8)"; };
});



function clearProjectDetails() {
    document.getElementById('overview').textContent = '';  // Clear previous overview
    document.getElementById('masterplan').textContent = '';  // Clear previous masterplan
    document.getElementById('amenities').textContent = '';  // Clear previous amenities
    document.getElementById('construction').textContent = '';  // Clear previous construction
    document.getElementById('brochure').textContent = '';  // Clear previous brochure
}
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}
function handleDestinationClick(destination) {
    showProjects(destination);
}
document.addEventListener('DOMContentLoaded', () => {
    // Get the city key from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const cityKey = urlParams.get('city') || 'new-capital'; // Default to 'new-capital' if no city is provided

    // Show the city and projects based on the city key from the URL
    showStaticCityDetails(cityKey);
    showProjects(cityKey);
    

    });

    
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cityKey = urlParams.get('city');

    if (cityKey) {
        // Call the function to show city details and projects based on the city key
        showStaticCityDetails(cityKey);
    } else {
        console.error('No city key provided in the query string');
    }
});

// Scroll functionality for left and right arrows
function scrollNav(direction) {
    const container = document.querySelector('.nav-container');
    const itemWidth = 200; // Width of each project item, adjust if necessary

    if (direction === 'left') {
        container.scrollLeft -= itemWidth;
    } else if (direction === 'right') {
        container.scrollLeft += itemWidth;
    }
}

// Ensure the nav-container starts from the first project
window.onload = function () {
    const container = document.querySelector('.nav-container');
    container.scrollLeft = 0; // Reset scroll position to ensure the first project is visible
};


async function fetchProjects(cityName) {
    try {
        const response = await fetch(`https://it-eg.org/units/${cityName}`);
        const cityData = await response.json();

        cityData.projects.forEach(async (project) => {
            await fetchProjectDetails(cityName, project.name);
            await fetchUnits(cityName, project.name);
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}







async function fetchUnits(cityName, projectName) {
    try {
        const response = await fetch(`https://it-eg.org/units/${cityName}/projects/${projectName}`);
        const projectData = await response.json();
        displayUnits(projectData.units);
    } catch (error) {
        console.error(`Error fetching units for project ${projectName}:`, error);
    }
}
/*// Fetch projects function
function fetchProjects(cityName) {
    // Get the projects from static data
    const projects = city[cityName]?.projects;

    if (!projects) {
        console.error('No projects found for the specified city.');
        return;
    }

    // Loop through projects and display details
    for (const projectName in projects) {
        const project = projects[projectName];
        displaySectionContent('overview', project.overview);
        displaySectionContent('masterplan', project.masterplan);
        displaySectionContent('amenities', project.amenities);
        displaySectionContent('construction', project.construction);
        displaySectionContent('brochure', project.brochure);
        
        // Show the units section if it contains units
        if (project.units && project.units.length > 0) {
            document.getElementById('units').style.display = 'block'; // Make units section visible
            displayUnits(project.units); // Call the function to display the units
        }
    }
}*/

/*// Fetch project details function
function fetchProjectDetails(cityName, projectName) {
    // Accessing the project data
    const projectData = city[cityName]?.projects[projectName];

    if (!projectData) {
        console.error(`No data found for project: ${projectName}`);
        return;
    }

    // Display section content
    displaySectionContent('overview', projectData.overview);
    displaySectionContent('masterplan', projectData.masterplan);
    displaySectionContent('amenities', projectData.amenities);
    displaySectionContent('construction', projectData.construction);
    displaySectionContent('brochure', projectData.brochure);
    
    // Show the units section if it contains units
    if (projectData.units && projectData.units.length > 0) {
        document.getElementById('units').style.display = 'block'; // Make units section visible
        displayUnits(projectData.units); // Call the function to display the units
    }
}*/


async function fetchProjectDetails(cityName, projectName) {
    try {
        const response = await fetch(`https://it-eg.org/units/${cityName}/projects/${projectName}`);
        const projectData = await response.json();

        // Save project data in a global object or similar for access when needed
        window.currentProjectDetails = projectData;

        displaySectionContent('overview', projectData.overview);
        displaySectionContent('masterplan', projectData.masterplan);
        displaySectionContent('amenities', projectData.amenities);
        displaySectionContent('construction', projectData.construction);
        displaySectionContent('brochure', projectData.brochure);
    } catch (error) {
        console.error(`Error fetching details for project ${projectName}:`, error);
    }
}

function displayUnits(units) {
    console.log('Units:', units); // Log the units to verify
    const unitsList = document.getElementById('units-list');
    unitsList.innerHTML = ''; // Clear previous units

    if (!units || units.length === 0) {
        unitsList.innerHTML = '<p>No units available.</p>'; // Display a message if no units
        return;
    }

    units.forEach(unit => {
        const unitCard = document.createElement('div');
        unitCard.className = 'unit-card';
        unitCard.setAttribute('data-type', unit.type);
        unitCard.setAttribute('data-rooms', unit.rooms);
        unitCard.setAttribute('data-area', unit.area);

        // Apply inline styles
        unitCard.style.width = '300px'; // Adjust width
        unitCard.style.borderRadius = '10px'; // Rounded corners
        unitCard.style.overflow = 'hidden'; // Ensure content stays inside rounded corners
        unitCard.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'; // Soft shadow
        unitCard.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        unitCard.style.backgroundColor = '#fff';
        unitCard.style.position = 'relative';
        unitCard.addEventListener('mouseover', () => {
            unitCard.style.transform = 'scale(1.05)'; // Slightly enlarge on hover
            unitCard.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.2)'; // Stronger shadow on hover
            unitCard.style.backgroundColor = '#f0f8ff'; // Light background color on hover
        });
        unitCard.addEventListener('mouseout', () => {
            unitCard.style.transform = 'scale(1)'; // Reset to original size
            unitCard.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'; // Reset shadow
            unitCard.style.backgroundColor = '#fff'; // Reset background color
        });
        const image = document.createElement('img');
        image.src = unit.image;
        image.alt = unit.name;
        image.style.width = '100%';
        image.style.height = '200px'; // Adjust height
        image.style.objectFit = 'cover'; // Ensure image covers the area
        image.style.borderBottom = '3px solid rgb(124,166,170)'; // Thin border below image
        unitCard.appendChild(image);

        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.textContent = `${unit.rooms} Rooms`;
        overlay.style.position = 'absolute';
        overlay.style.top = '12px';
        overlay.style.left = '12px';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.color = '#fff';
        overlay.style.padding = '8px 14px';
        overlay.style.borderRadius = '5px';
        overlay.style.fontSize = '1rem';
        overlay.style.fontWeight = 'bold';
        overlay.style.textTransform = 'uppercase';
        unitCard.appendChild(overlay);

        const unitInfo = document.createElement('div');
        unitInfo.className = 'unit-info';
        unitInfo.style.padding = '20px';
        unitInfo.style.textAlign = 'left';

        const title = document.createElement('h3');
        title.textContent = unit.name;
        title.style.fontSize = '1.4rem';
        title.style.fontWeight = 'bolder';
        title.style.marginBottom = '10px';
        title.style.color = 'rgb(124,166,170)'; // Bright blue for unit name
        unitInfo.appendChild(title);

        const details = document.createElement('p');
        details.textContent = unit.details;
        details.style.fontSize = '1rem';
        details.style.color = '#333'; // Darker color for better readability
        details.style.margin = '8px 0';
        details.style.lineHeight = '1.6';
        unitInfo.appendChild(details);

        const location = document.createElement('div');
        location.className = 'location';
        location.style.display = 'flex';
        location.style.alignItems = 'center';
        location.style.fontSize = '0.9rem';
        location.style.color = 'rgb(124,166,170)';
        location.style.marginTop = '12px';
        location.innerHTML = `<i class="icon-class" style="color: rgb(124,166,170);"></i> ${unit.type}`;
        unitInfo.appendChild(location);

        unitCard.appendChild(unitInfo);

        const area = document.createElement('div');
        area.className = 'area';
        area.textContent = `${unit.area} m²`;
        area.style.position = 'absolute';
        area.style.bottom = '12px';
        area.style.right = '12px';
        area.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        area.style.color = '#fff';
        area.style.padding = '8px 12px';
        area.style.borderRadius = '5px';
        area.style.fontSize = '0.9rem';
        area.style.fontWeight = 'bold';
        area.style.textTransform = 'uppercase';
        unitCard.appendChild(area);
        unitCard.addEventListener('click', () => {
            showUnitDetails(unit.modal1, unit.modal2, unit.modal3);
        });
        unitsList.appendChild(unitCard);
    });
}
// Function to show unit details and enable fullscreen option
function showUnitDetails(modal1, modal2, modal3) {
    const modalContent = document.querySelector('.modal-content');
    
    // Update modal content with slideshow and fullscreen option
    modalContent.innerHTML = `
        <span class="close" onclick="closeModal()">×</span>
        <div class="slideshow-container">
            <div class="slides fade">
                <img src="${modal1}" alt="Unit Image 1" class="modal-image" />
            </div>
            <div class="slides fade">
                <img src="${modal2}" alt="Unit Image 2" class="modal-image" />
            </div>
            <div class="slides fade">
                <img src="${modal3}" alt="Unit Image 3" class="modal-image" />
            </div>
            <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
            <a class="next" onclick="plusSlides(1)">&#10095;</a>
        </div>
        <button class="fullscreen" onclick="toggleFullscreen()">Fullscreen</button>
    `;
    
    document.getElementById('unit-details-modal').style.display = 'flex'; // Show modal
    currentSlide = 1;
    showSlides(currentSlide);
}

// Fullscreen toggle function
function toggleFullscreen() {
    const modal = document.getElementById('unit-details-modal');

    if (!document.fullscreenElement) {
        // Enter fullscreen mode
        if (modal.requestFullscreen) {
            modal.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
            });
        } else if (modal.mozRequestFullScreen) { // For Firefox
            modal.mozRequestFullScreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
            });
        } else if (modal.webkitRequestFullscreen) { // For Chrome, Safari, and Opera
            modal.webkitRequestFullscreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
            });
        } else if (modal.msRequestFullscreen) { // For IE/Edge
            modal.msRequestFullscreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
            });
        }
    } else {
        // Exit fullscreen mode
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // For Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // For Chrome, Safari, and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // For IE/Edge
            document.msExitFullscreen();
        }
    }
}

let currentSlide = 1;

function showSlides(n) {
    const slides = document.querySelectorAll('.slides');
    if (n > slides.length) { currentSlide = 1; }
    if (n < 1) { currentSlide = slides.length; }
    slides.forEach((slide, index) => {
        slide.style.display = (index + 1 === currentSlide) ? 'block' : 'none';
    });
}

function plusSlides(n) {
    showSlides(currentSlide += n);
}

function closeModal() {
    document.getElementById('unit-details-modal').style.display = 'none';
}

function displaySectionContent(sectionId, content) {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement && content) {
        sectionElement.innerHTML = content;
        sectionElement.style.display = 'none'; // Keep sections hidden initially
    }
}
function showSections(sectionIds) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show the requested sections
    sectionIds.forEach(sectionId => {
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
            sectionElement.style.display = 'block';
        }
    });
}
function showBothSections() {
    showSections(['filter', 'units']);  // Show both filter and units sections
}
function filterUnits() {
    const type = document.getElementById('type-select').value;
    const rooms = document.getElementById('rooms-select').value;
    const area = parseFloat(document.getElementById('area-slider').value); // Area slider value

    // Only filter units that are currently displayed in the units list (specific to current project)
    const units = document.querySelectorAll('.unit-card');
    
    units.forEach(unit => {
        const unitType = unit.getAttribute('data-type');
        const unitRooms = unit.getAttribute('data-rooms');
        const unitArea = parseFloat(unit.getAttribute('data-area'));

        const typeMatches = (type === 'all' || unitType === type);
        const roomsMatches = (rooms === 'all' || unitRooms === rooms);
        const areaMatches = (unitArea <= area);

        if (typeMatches && roomsMatches && areaMatches) {
            unit.style.display = 'block'; // Show matching units
        } else {
            unit.style.display = 'none'; // Hide non-matching units
        }
    });
}

// Update the displayed area value when the slider changes
function updateAreaValue(value) {
    document.getElementById('area-value').textContent = `${value}m²`;
}

function showUnitsSection() {
    showSection('filter');  // Show filter section
    showSection('units');   // Show units section

    // Show the button in the units section
    const unitsButton = document.getElementById('filter-toggle');
    if (unitsButton) {
        unitsButton.style.display = 'block'; // Show the button
        unitsButton.textContent = 'Hide Filters'; // Set default text to 'Hide Filters'
    }
}

// Event listener for document ready state
function setSlideshowBackground(sectionId, images) {
    let index = 0;
    const section = document.getElementById(sectionId);

    // Apply the first image initially
    section.style.backgroundImage = `url('${images[index]}')`;

    // Change the background image at intervals (e.g., every 5 seconds)
    setInterval(() => {
        index = (index + 1) % images.length;  // Loop back to the first image when done
        section.style.backgroundImage = `url('${images[index]}')`;
    }, 5000);  // 5000ms = 5 seconds
}
function selectNavItem(element) {
    // Remove active class from all items
    var items = document.querySelectorAll('.tree-nav li');
    items.forEach(function(item) {
        item.classList.remove('active');
    });

    // Add active class to the clicked item
    element.parentElement.classList.add('active');
}
function resetSideNavToOverview() {
    // Remove 'active' class from all side navigation items
    const sideNavItems = document.querySelectorAll('.tree-nav li');
    sideNavItems.forEach(item => {
        item.classList.remove('active');
    });

    // Find and activate the "Overview" section link
    const overviewNavItem = document.querySelector('.tree-nav li a[data-section="overview"]');
    if (overviewNavItem) {
        overviewNavItem.parentElement.classList.add('active');
        showSection('overview'); // Ensure "Overview" section is visible
    }
}
// Initialize the correct button text based on filter visibility
// Initialize the correct button text based on filter visibility

function toggleFilter() {
    const filterSection = document.getElementById('filter');
    const toggleButton = document.getElementById('filter-toggle');

    // Toggle the filter section visibility
    if (filterSection.style.display === 'block') {
        filterSection.style.display = 'none';   // Hide the filter section
        toggleButton.textContent = 'Show Filters';  // Change button text to 'Show Filters'
    } else {
        filterSection.style.display = 'block';  // Show the filter section
        toggleButton.textContent = 'Hide Filters';  // Change button text to 'Hide Filters'
    }
}
// Function to show the filter toggle button
function showFilterToggleButton() {
    const filterToggleButton = document.getElementById('filter-toggle');
    
    if (filterToggleButton) {
        filterToggleButton.style.display = 'block'; // Show the button
    }
}



function showFilterToggleButton() {
    const filterToggleButton = document.getElementById('filter-toggle');
    if (filterToggleButton) {
        filterToggleButton.style.display = 'block'; // Show the button
    }
}

// Add event listener to the units-link (to show filter toggle button)
document.getElementById('units-link').addEventListener('click', function() {
    showFilterToggleButton();  // Show the filter toggle button when the units section is clicked
});

// Add event listeners to hide the filter toggle button for other sections
document.getElementById('amenities-link').addEventListener('click', hideFilterToggleButton);
document.getElementById('construction-link').addEventListener('click', hideFilterToggleButton);
document.getElementById('brochure-link').addEventListener('click', hideFilterToggleButton);

// Hide the filter button when "Overview" is clicked
document.querySelector('[data-section="overview"]').addEventListener('click', function() {
    hideFilterToggleButton();
    showSection('overview');  // Ensure the section is shown
    closeLeftNav();           // Optionally close the navigation if needed
});

// Hide the filter button when "Master Plan" is clicked
document.querySelector('a[href="#"][onclick*="masterplan"]').addEventListener('click', function() {
    hideFilterToggleButton();
    showSection('masterplan');  // Ensure the section is shown
    closeLeftNav();             // Optionally close the navigation if needed
});
// Function to hide the filter toggle button
function hideFilterToggleButton() {
    const filterToggleButton = document.getElementById('filter-toggle');
    if (filterToggleButton) {
        filterToggleButton.style.display = 'none'; // Hide the filter button
    }
}

// Add event listener to the #projects-nav for dynamically added project links
const projectsNav = document.getElementById('projects-nav');

// Event delegation to handle clicks on any project link within the #projects-nav
projectsNav.addEventListener('click', function(event) {
    if (event.target.tagName === 'A') {
        hideFilterToggleButton();  // Hide the filter toggle button when a project is clicked
    }
});