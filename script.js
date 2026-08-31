// Force scroll to top on page refresh/reload site-wide
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);

    // Suppress native browser tooltips site-wide
    document.querySelectorAll('form').forEach(form => {
        form.setAttribute('novalidate', 'novalidate');
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('invalid', (e) => {
                e.preventDefault();
            });
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    // Select all elements to animate
    const animateElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    animateElements.forEach(el => observer.observe(el));

    // Hamburger Mobile Menu Logic (Scroll Lock & Stay on Same Section on Close)
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navbarMenu = document.querySelector('.navbar');
    let savedScrollY = 0;

    if (mobileBtn && navbarMenu) {
        mobileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const isOpen = navbarMenu.classList.contains('menu-open');
            const icon = mobileBtn.querySelector('i');
            
            if (!isOpen) {
                // Save exact scroll position before locking
                savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
                navbarMenu.classList.add('menu-open');
                document.body.classList.add('menu-open');
                mobileBtn.classList.add('active');
                document.body.style.overflow = 'hidden'; // Stop background scrolling
                if (icon) { icon.classList.remove('ph-list'); icon.classList.add('ph-x'); }
            } else {
                // Close drawer and stay on the exact same section
                navbarMenu.classList.remove('menu-open');
                document.body.classList.remove('menu-open');
                mobileBtn.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
                if (icon) { icon.classList.remove('ph-x'); icon.classList.add('ph-list'); }
                
                // Instantly lock back to the section where hamburger was opened
                window.scrollTo(0, savedScrollY);
            }
        });

        // Close mobile menu on clicking nav link without top-scroll jump
        document.querySelectorAll('.navbar .nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (navbarMenu.classList.contains('menu-open')) {
                    navbarMenu.classList.remove('menu-open');
                    document.body.classList.remove('menu-open');
                    mobileBtn.classList.remove('active');
                    document.body.style.overflow = '';
                    const icon = mobileBtn.querySelector('i');
                    if (icon) { icon.classList.remove('ph-x'); icon.classList.add('ph-list'); }
                }
            });
        });
    }

    // Page Hero GSAP Animation (for About, Services, Blog)
    if (document.querySelector('.page-hero .hero-title')) {
        gsap.to('.page-hero .hero-title', {
            opacity: 1,
            letterSpacing: 'normal',
            duration: 1.5,
            ease: 'power4.out',
            delay: 0.2
        });
    }

    // Testimonial Slider
    const testImg = document.getElementById('test-img');
    const testQuote = document.getElementById('test-quote');
    const testName = document.getElementById('test-name');
    const testRole = document.getElementById('test-role');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (testImg && testQuote) {
        const testimonials = [
            {
                img: 'assets/images/testimonial_portrait_1782149618846.webp',
                quote: '"The best investment for our enterprise infrastructure. The sensor automation and telemetry are flawless and intuitive. I can\'t imagine operating any other way."',
                name: 'Sarah Jenkins',
                role: 'VP of Infrastructure, California'
            },
            {
                img: 'assets/images/smart_living_1782149473135.webp',
                quote: '"Exceptional service from start to finish. The team handled everything professionally and the smart IoT sensing ecosystem is a game changer for our operations."',
                name: 'Michael Chen',
                role: 'Lead IoT Architect, Seattle'
            },
            {
                img: 'assets/images/expert_2_1782207538178.webp',
                quote: '"Our IoT security and telemetry system gives us total operational visibility and peace of mind. Mobile and portal access is seamless and responsive."',
                name: 'Emma Thompson',
                role: 'Operations Director, NY'
            }
        ];

        let currentTestimonial = 0;
        let autoSlideInterval;

        const updateTestimonial = (index) => {
            gsap.to([testImg, testQuote, testName, testRole], {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    testImg.src = testimonials[index].img;
                    testQuote.innerHTML = testimonials[index].quote;
                    testName.innerHTML = testimonials[index].name;
                    testRole.innerHTML = testimonials[index].role;
                    gsap.to([testImg, testQuote, testName, testRole], {
                        opacity: 1,
                        duration: 0.3
                    });
                }
            });
        };

        const nextTestimonial = () => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            updateTestimonial(currentTestimonial);
            resetAutoSlide();
        };

        const prevTestimonial = () => {
            currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
            updateTestimonial(currentTestimonial);
            resetAutoSlide();
        };

        const resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextTestimonial, 5000);
        };

        if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
        if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);

        // Start auto slide
        autoSlideInterval = setInterval(nextTestimonial, 5000);
    }


    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => {
                i.classList.remove('active');
                const answer = i.querySelector('.faq-answer');
                if (answer) answer.style.maxHeight = null;
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) answer.style.maxHeight = (answer.scrollHeight + 60) + "px";
            }
        });
    });
});

