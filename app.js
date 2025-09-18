// Portfolio Website JavaScript for Ajith Sankar

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');
    const contactMeBtn = document.getElementById('contact-me-btn');
    const linkedinBtn = document.getElementById('linkedin-btn');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
            document.body.style.overflow = 'hidden'; // Prevent body scroll
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
            document.body.style.overflow = ''; // Restore body scroll
        });
    }

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
            document.body.style.overflow = ''; // Restore body scroll
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('show-menu') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('show-menu');
            document.body.style.overflow = '';
        }
    });

    // Fix Contact Me button navigation
    if (contactMeBtn) {
        contactMeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = contactSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Enhanced LinkedIn button with better feedback
    if (linkedinBtn) {
        linkedinBtn.addEventListener('click', function(e) {
            // Show feedback notification
            showNotification('Opening LinkedIn profile in new tab...', 'info');
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    function highlightActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        const headerHeight = document.querySelector('.header').offsetHeight;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - headerHeight - 50;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    // Skill bar animations
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill__progress');
        
        skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            if (targetWidth && !bar.classList.contains('animate')) {
                bar.style.setProperty('--target-width', targetWidth + '%');
                bar.style.width = targetWidth + '%';
                bar.classList.add('animate');
            }
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate skill bars when about section is visible
                if (entry.target.id === 'about') {
                    setTimeout(animateSkillBars, 500);
                }
                
                // Animate project cards when projects section is visible
                if (entry.target.id === 'projects') {
                    animateProjectCards();
                }
            }
        });
    }, observerOptions);

    // Project card animations
    function animateProjectCards() {
        const projectCards = document.querySelectorAll('.project__card');
        projectCards.forEach((card, index) => {
            if (!card.classList.contains('animated')) {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    card.classList.add('animated');
                }, index * 150);
            }
        });
    }

    // Initialize project cards for animation
    const projectCards = document.querySelectorAll('.project__card');
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
    });

    // Observe sections for animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset previous error messages
            clearFormErrors();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const subject = formData.get('subject').trim();
            const message = formData.get('message').trim();

            // Validate form
            let isValid = true;

            if (!name) {
                showFormError('name-error', 'Name is required');
                isValid = false;
            }

            if (!email) {
                showFormError('email-error', 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showFormError('email-error', 'Please enter a valid email address');
                isValid = false;
            }

            if (!subject) {
                showFormError('subject-error', 'Subject is required');
                isValid = false;
            }

            if (!message) {
                showFormError('message-error', 'Message is required');
                isValid = false;
            } else if (message.length < 10) {
                showFormError('message-error', 'Message must be at least 10 characters long');
                isValid = false;
            }

            if (isValid) {
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                // Simulate form submission
                setTimeout(() => {
                    formSuccess.style.display = 'block';
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    // Show success notification
                    showNotification('Message sent successfully! I will get back to you soon.', 'success');
                    
                    // Hide success message after 8 seconds
                    setTimeout(() => {
                        formSuccess.style.display = 'none';
                    }, 8000);
                }, 1500);
            }
        });
    }

    // Form validation helpers
    function showFormError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function clearFormErrors() {
        const errorElements = document.querySelectorAll('.form-error');
        errorElements.forEach(element => {
            element.textContent = '';
        });
        
        if (formSuccess) {
            formSuccess.style.display = 'none';
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Resume download functionality
    function setupResumeDownload() {
        const downloadButtons = document.querySelectorAll('#download-resume, #resume-download');
        
        downloadButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Create a sample resume content
                const resumeContent = generateResumeContent();
                downloadResume(resumeContent, 'Ajith-Sankar-Resume.txt');
            });
        });
    }

    function generateResumeContent() {
        return `
AJITH SANKAR - SAP BUILD PROCESS AUTOMATION DEVELOPER
===================================================

PERSONAL INFORMATION
-------------------
Name: Ajith Sankar
Title: SAP Build Process Automation Developer
Location: Bengaluru, Karnataka
Email: ajithsankaras.007@gmail.com
Phone: +91-8129137064
LinkedIn: linkedin.com/in/ajith-sankar-b76273181

PROFESSIONAL SUMMARY
-------------------
Dynamic and skilled RPA Developer with a proven track record of successfully implementing 
automation solutions. Seeking a challenging position where I can utilize my technical 
expertise, problem-solving abilities, and strong analytical skills to contribute to the 
growth and success of the organization. Committed to delivering high-quality results and 
continuously improving processes through automation.

TECHNICAL SKILLS
---------------
Technology/Framework:
• SAP IRPA (95%)
• SAP BPA (90%)
• Cloud Studio, Desktop Studio
• UI Path (85%)
• Robotic Process Automation (90%)
• Project Management (Jira) (80%)

Languages:
• Python (80%)
• JavaScript (75%)
• HTML, CSS

PROFESSIONAL EXPERIENCE
----------------------

SAP IRPA/BPA Consultant | Accenture | Nov 2024 - Present
Bengaluru, Karnataka
• Currently working as SAP IRPA/BPA Consultant
• Focusing on advanced automation solutions and process optimization for enterprise clients

SAP IRPA/BPA Consultant | NTT DATA | Mar 2024 - Oct 2024
Bengaluru, Karnataka
• Designed, built, and deployed two bots for automating invoice processing tasks
• Resulting in significant increase in processing efficiency and reduction manual intervention
• Identified and resolved critical bugs in existing automation scripts

SAP IRPA/BPA Developer | Tata Consultancy Service | Aug 2021 - Mar 2024
Bengaluru, Karnataka
• Developed and successfully implemented 5+ SAP IRPA solutions
• Streamlined critical business processes
• Created reusable use cases in SAP BPA to publish in SAP BPA Store
• Provided expert technical support to end-users
• Conducted rigorous testing and debugging of SAP IRPA bots

FEATURED PROJECTS
----------------

1. Invoice Reprocessing Bot
   • Automates processing of incoming invoices received via email
   • Technologies: SAP IRPA, Email Processing, PDF Extraction, SAP MIRO
   • Significantly increased processing efficiency and reduced manual intervention

2. Job Offer Approvals (BPA)
   • Efficient solution to time-consuming HR hiring processes
   • Technologies: SAP BPA, Workflow Automation, HR Process
   • Streamlined HR hiring process and reduced approval delays

3. Mass Change of Bill of Materials (BPA)
   • Retrieves BOM data from SAP S4/HANA system
   • Technologies: SAP BPA, SAP S/4HANA, Excel Integration, Workflow
   • Significantly reduced manual data entry and lead time while enhancing data quality

4. FICA Job Monitoring Bot
   • Automated spool lookup and job log analysis
   • Technologies: SAP IRPA, Job Monitoring, Excel Reporting
   • Reduced manual effort by 80% and ensured timely, accurate insights

5. Email Routing Bot
   • Hourly monitoring and automated email routing
   • Technologies: SAP IRPA, Email Processing, Web Integration
   • Improved email sorting efficiency and reduced manual effort

6. Contract Approval Reminder Bot
   • Automated contract approval notifications
   • Technologies: SAP IRPA, SAP HANA Cloud, APIs, Email Notifications
   • Ensured prompt contract approvals and smooth contract management

EDUCATION
---------
B-Tech in Computer Science & Engineering | 2021 | CGPA 8.03
Jyothi Engineering College, Cheruthuruthy

Intermediate | 2017 | 89%
Higher Secondary School Sreekrishnapuram

High School | 2015 | 99%
Higher Secondary School Sreekrishnapuram

CERTIFICATIONS
--------------
• SAP Certified Citizen Developer Associate - SAP Build Low-code/No-code Applications and Automations
• RPA Developer Foundation learning path offered by UI Path

ACHIEVEMENTS
-----------
• On The Spot Award | Jun 2023 | For the quick conversion of Bots from IRPA version 1.0 to 2.0
• On The Spot Award | Dec 2022 | For managing a complex IRPA Bot and ensuring its smooth development

INTERESTS
---------
Process Automation, Technology Innovation, Continuous Learning, Problem Solving, Enterprise Solutions

CONTACT INFORMATION
------------------
For more information, please visit my portfolio website or contact me directly.
Email: ajithsankaras.007@gmail.com
Phone: +91-8129137064
LinkedIn: linkedin.com/in/ajith-sankar-b76273181

Generated on: ${new Date().toLocaleDateString()}
        `;
    }

    function downloadResume(content, filename) {
        const element = document.createElement('a');
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        // Show feedback
        showNotification('Resume downloaded successfully!', 'success');
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-${type === 'success' ? 'success' : type === 'info' ? 'info' : 'primary'});
            color: var(--color-btn-primary-text);
            padding: var(--space-12) var(--space-20);
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out forwards;
            max-width: 300px;
            font-size: var(--font-size-sm);
        `;
        notification.textContent = message;
        
        // Add animation styles if not already present
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Highlight active navigation
        highlightActiveNav();
        
        lastScrollTop = scrollTop;
    }

    // Throttled scroll handler
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16);
        }
    }

    // Card hover effects
    const cards = document.querySelectorAll('.project__card, .achievement__card, .education__item, .certification__item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('show-menu')) {
            navMenu.classList.remove('show-menu');
            document.body.style.overflow = '';
        }
    });

    // Focus management for accessibility
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('keyboard-focus');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('keyboard-focus');
        });
    });

    // Animate elements on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.achievement__card, .education__item');
        
        elements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !element.classList.contains('animated')) {
                element.style.animationDelay = `${index * 0.1}s`;
                element.classList.add('animated');
            }
        });
    }

    // Enhanced scroll animations
    function enhancedScrollAnimations() {
        const timelineItems = document.querySelectorAll('.timeline__item');
        
        timelineItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible && !item.classList.contains('timeline-animated')) {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                    item.classList.add('timeline-animated');
                }, index * 200);
            }
        });
    }

    // Initialize timeline items for animation
    const timelineItems = document.querySelectorAll('.timeline__item');
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.6s ease-out';
    });

    // Event listeners
    window.addEventListener('scroll', requestTick);
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('scroll', enhancedScrollAnimations);
    window.addEventListener('resize', highlightActiveNav);

    // Initialize components
    setupResumeDownload();
    
    // Initial setup
    highlightActiveNav();
    animateOnScroll();
    enhancedScrollAnimations();
    
    // Animate skill bars if about section is already in view
    setTimeout(() => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const rect = aboutSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                animateSkillBars();
            }
        }
    }, 1000);

    // Add smooth reveal animation for sections
    const sections_to_animate = document.querySelectorAll('.about, .experience, .projects, .education, .achievements');
    sections_to_animate.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease-out';
    });

    // Reveal sections on scroll
    function revealSections() {
        sections_to_animate.forEach(section => {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible && section.style.opacity === '0') {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }

    // Performance optimization - Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const debouncedRevealSections = debounce(revealSections, 50);
    window.addEventListener('scroll', debouncedRevealSections);
    
    // Initial reveal check
    debouncedRevealSections();

    // Ensure projects are visible on page load
    setTimeout(() => {
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            const rect = projectsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                animateProjectCards();
            }
        }
    }, 500);

    console.log('Ajith Sankar Portfolio website initialized successfully!');
});