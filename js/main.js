// wait for the dom to load
document.addEventListener("DOMContentLoaded", function() {
    // mobile navigation toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');

    mobileMenu.addEventListener('click', function() {
        navList.classList.toggle('active');
    });

    // smooth scrolling for anchors
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 60, // Adjust for fixed nav height
                    behavior: 'smooth'
                });
            }
            // Close mobile menu if open
            if(navList.classList.contains('active')){
                navList.classList.remove('active');
            }
        });
    });

    // contact form submission 
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formMessage = document.getElementById('form-message');
        formMessage.innerText = 'Thank you for your message! We will get back to you soon.';
        formMessage.classList.add('sent');
        // Reset the form and message after 3 seconds
        setTimeout(() => {
            form.reset();
            formMessage.innerText = '';
            formMessage.classList.remove('sent');
        }, 3000);
    });

    // scroll animation
    const observerOptions = {
        threshold: 0.1,
    };


    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // watching sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // portfolio images
    const portfolioIllustrations = [
        'https://images.unsplash.com/photo-1518606374853-6fa02acb29d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
    ];
    const portfolioImages = document.querySelectorAll('.portfolio-item img');
    portfolioImages.forEach((img, index) => {
        if (portfolioIllustrations[index]) {
            img.src = portfolioIllustrations[index];
        }
    });

    // new hero slider functionality 
    const slider = document.querySelector('.hero-slider');
    const slides = document.querySelectorAll('.slide');
    let currentIndex = 0;
    const slideCount = slides.length;

    function updateSlider(){
        slider.style.transform = `translateX(-${currentIndex * 100}vw)`;
    }

    function nextSlide(){
        currentIndex = (currentIndex + 1) % slideCount;
        updateSlider();
    }

    function prevSlide(){
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateSlider();
    }

    let autoSlideInterval = setInterval(nextSlide, 5000);

    // swipe on phone
    let startX = 0;
    let isSwiping = false;

    slider.addEventListener("touchstart", (e) => {
        clearInterval(autoSlideInterval);
        startX = e.touches[0].clientX;
        isSwiping = true;
    });

    slider.addEventListener("touchmove", (e) => {
        if (!isSwiping) return;
        let currentX = e.touches[0].clientX;
        let diff = currentX - startX;
        let percentage = diff / window.innerWidth * 100;
        slider.style.transform = `translateX(-${currentIndex * 100 - percentage}%)`;
    });

    slider.addEventListener("touchend", (e) => {
        isSwiping = false;
        let endX = e.changedTouches[0].clientX;
        let diff = endX - startX;
        if (Math.abs(diff) > 50) {
            if (diff < 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        } else {
            updateSlider();
        }
        autoSlideInterval = setInterval(nextSlide, 5000);
    });

    // go back up
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // statistics 
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-count');
                const count = +counter.innerText;
                const increment = target / 2000; // Adjust this value to control speed
                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }

            };
            updateCount();
        });
    }

    const statsSection = document.getElementById('statistics');
    let statsAnimated = false;
    const statsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                animateCounters();
                statsAnimated = true;
                statsObserver.unobserve(statsSection);
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // donut chart 
    const chartCanvas = document.getElementById('doughnutChart');
    if (chartCanvas) {
      const doughnutChart = new Chart(chartCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Projects', 'Clients', 'Awards'],
          datasets: [{
            data: [150, 120, 10],
            backgroundColor: ['#007BFF', '#28a745', '#ffc107'],
            borderColor: 'transparent',  // Remove white outline
            borderWidth: 0               // Set border width to 0 for a cleaner look
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: 'bottom',
          },
          cutoutPercentage: 60  // Adjust the doughnut thickness
        }
      });
    }

    // stonks chart 
    const stonksCanvas = document.getElementById('stonksChart');
    if (stonksCanvas) {
      const stonksCtx = stonksCanvas.getContext("2d");
      // Create a vertical gradient for the fill
      let gradientFill = stonksCtx.createLinearGradient(0, 0, 0, stonksCanvas.height);
      gradientFill.addColorStop(0, "rgba(220, 53, 69, 0.5)"); // semi-transparent red
      gradientFill.addColorStop(1, "rgba(220, 53, 69, 0)");
      
      const stonksChart = new Chart(stonksCanvas, {
        type: 'line',
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          datasets: [{
            label: 'Stonks',
            data: [10, 20, 30, 120, 80, 150, 100],
            borderColor: "#dc3545",
            borderWidth: 3,
            fill: true,                   // Enable fill for a modern effect
            backgroundColor: gradientFill, // Use gradient fill
            tension: 0.4,
            pointRadius: 0,             // Remove point markers for a cleaner look
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: false },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0,0,0,0.05)" // light grid line for y-axis
              }
            },
            x: {
              grid: {
                display: false // hide x-axis grid
              }
            }
          }
        }
      });
    }
}); 