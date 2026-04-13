// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            const isOpen = navMenu.classList.toggle('open');
            hamburger.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
        });
    }

    // Smooth scroll — only for same-page anchor links (#...)
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // Close mobile menu on any nav link click
            if (navMenu && hamburger) {
                navMenu.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            }

            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    const contactForm = document.getElementById('contact-form');
    const errorMessage = document.getElementById('error-message');
    const clientContactInput = document.getElementById('client-contact');
    const messageDetailsInput = document.getElementById('message-details');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Clear previous error message
            errorMessage.classList.remove('show');
            errorMessage.textContent = '';

            // Get form values
            const clientContact = clientContactInput.value.trim();
            const messageDetails = messageDetailsInput.value.trim();

            // Validate fields
            if (!clientContact || !messageDetails) {
                errorMessage.textContent = 'Must fill all the fields';
                errorMessage.classList.add('show');
                return;
            }

            // Send email via EmailJS
            sendEmail(clientContact, messageDetails);
        });

        // Remove error message when user starts typing
        clientContactInput.addEventListener('input', function() {
            if (this.value.trim() || messageDetailsInput.value.trim()) {
                errorMessage.classList.remove('show');
            }
        });

        messageDetailsInput.addEventListener('input', function() {
            if (this.value.trim() || clientContactInput.value.trim()) {
                errorMessage.classList.remove('show');
            }
        });
    }

    function sendEmail(clientContact, messageDetails) {
        // Using EmailJS service to send email
        const serviceID = 'service_xxxxxxx'; // You'll need to create this
        const templateID = 'template_xxxxxxx'; // You'll need to create this
        const userID = 'your_public_key'; // You'll need to create this

        const emailParams = {
            to_email: 'eileen.begelman@gmail.com',
            client_contact: clientContact,
            message_details: messageDetails,
            reply_to: clientContact
        };

        // Send using fetch API
        fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service_id: serviceID,
                template_id: templateID,
                user_id: userID,
                template_params: emailParams
            })
        })
        .then(response => {
            if (response.ok) {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            } else {
                errorMessage.textContent = 'Error sending message. Please try again.';
                errorMessage.classList.add('show');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = 'Error sending message. Please try again.';
            errorMessage.classList.add('show');
        });
    }
});