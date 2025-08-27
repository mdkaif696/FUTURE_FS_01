// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section'); // Assuming all main sections are <section> tags

    const activateNavLink = () => {
        let currentActive = 'home';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Adjust for fixed header
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentActive = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active'); // Remove active from all
            if (link.dataset.target === currentActive) {
                link.classList.add('active'); // Add active to current
            }
        });
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor jump
            const targetId = event.target.dataset.target;
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initial activation and scroll listener for navigation
    activateNavLink();
    window.addEventListener('scroll', activateNavLink);


    // Scroll to projects button handler
    const scrollToProjectsButton = document.querySelector('.scroll-to-projects');
    if (scrollToProjectsButton) {
        scrollToProjectsButton.addEventListener('click', () => {
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                window.scrollTo({
                    top: projectsSection.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    }

    // Contact form submission handler (Client-side only)
    const contactForm = document.getElementById('contactForm');
    const submitButton = document.getElementById('submitButton');
    const submissionMessage = document.getElementById('submissionMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            submissionMessage.textContent = '';
            submissionMessage.classList.remove('text-green-600', 'text-red-600');

            // Simulate a network request delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Basic client-side validation
            if (name && email && message) {
                submissionMessage.textContent = '🎉 Your message has been sent successfully! (This is a demo message, no actual email was sent.)';
                submissionMessage.classList.add('text-green-600');
                contactForm.reset(); // Clear the form
            } else {
                submissionMessage.textContent = 'Please fill out all fields.';
                submissionMessage.classList.add('text-red-600');
            }

            submitButton.textContent = 'Send Message';
            submitButton.disabled = false;
        });
    }
});