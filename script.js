console.log(document.querySelectorAll('.bg')); // Или другие селекторы
gsap.registerPlugin(Observer);
document.addEventListener("DOMContentLoaded", () => {
    let sections = document.querySelectorAll("section"),
        images = document.querySelectorAll(".bg"),
        headings = gsap.utils.toArray(".section-heading"),
        outerWrappers = gsap.utils.toArray(".outer"),
        innerWrappers = gsap.utils.toArray(".inner"),
        currentIndex = -1,
        wrap = gsap.utils.wrap(0, sections.length),
        animating = false;

    gsap.set(outerWrappers, { yPercent: 100 });
    gsap.set(innerWrappers, { yPercent: -100 });

    function splitTextToChars(element) {
        let text = element.textContent;
        element.innerHTML = '';
        text.split('').forEach(char => {
            let span = document.createElement('span');
            span.textContent = char;
            element.appendChild(span);
        });
    }

    headings.forEach(splitTextToChars);

    function gotoSection(index, direction) {
        index = wrap(index);
        if (animating) return;
        animating = true;

        let fromTop = direction === -1,
            dFactor = fromTop ? -1 : 1,
            tl = gsap.timeline({
                defaults: { duration: 0.85, ease: "power1.inOut" },
                onComplete: () => {
                    animating = false;
                }
            });

        if (currentIndex >= 0) {
            gsap.set(sections[currentIndex], { zIndex: 0 });
            if (images[currentIndex]) {
                tl.to(images[currentIndex], { yPercent: -15 * dFactor })
                  .set(sections[currentIndex], { autoAlpha: 0 });
            }
        }

        gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
        tl.fromTo([outerWrappers[index], innerWrappers[index]], { 
            yPercent: i => i ? -100 * dFactor : 100 * dFactor
        }, { 
            yPercent: 0 
        }, 0)
        .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
        .fromTo(headings[index] ? headings[index].querySelectorAll('span') : [], { 
            autoAlpha: 0, 
            yPercent: 150 * dFactor
        }, {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1,
            ease: "power2",
            stagger: {
                each: 0.02,
                from: "random"
            }
        }, 0.2);

        currentIndex = index;
        Observer.create({
          type: "wheel,touch,pointer",
          wheelSpeed: -1,
          onDown: () => !animating && gotoSection(currentIndex - 1, -1),
          onUp: () => !animating && gotoSection(currentIndex + 1, 1),
          tolerance: 10,
          preventDefault: true
      });
    }
    gotoSection(0, 1);
    let hamburger = document.getElementById('hamburger');
    let sidebar = document.getElementById('sidebar');
    let body = document.body;

    function toggleSidebar() {
        sidebar.classList.toggle('open');
        hamburger.classList.toggle('is-open');
        body.classList.toggle('menu-open');
    }

    hamburger.addEventListener('click', toggleSidebar);
});

const slides = [
  {
    background: 'url("../images/Slider_info_fst.png")',
    title: 'Integration of AI into the company',
    text: 'Automation of customer service, including making appointments, processing orders, and answering frequently asked questions.',
    boxes: ['Coaching and training']
  },
  {
    background: 'url("../images/Slider_info_sec.png")',
    title: 'Coaching and training',
    text: 'Providing AI coaching and training to help your team utilize AI tools effectively.',
    boxes: ['Basic course and training', 'Advanced techniques']
  },
  {
    background: 'url("../images/Slider_info_third.png")',
    title: 'Basic course of using AI at work',
    text: 'A foundational course on implementing AI strategies in everyday business tasks.',
    boxes: ['Hands-on workshops', 'Real-world applications', 'Expert guidance']
  },
  {
    background: 'url("../images/Slider_info.png")',
    title: 'Advanced AI solutions',
    text: 'Explore advanced AI solutions tailored to your business needs.',
    boxes: ['Custom solutions', 'Innovative approaches']
  }
];

let currentSlide = 0;

function updateIndicators() {
  const indicators = document.querySelectorAll('.indicator');
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentSlide);
  });
}

function updateSlide(index) {
  const content = document.querySelector('.slider .content_fourth');
  const boxesContainer = document.querySelector('.fourth_boxes');
  const layers = document.querySelectorAll('.background-layer');
  
  if (currentSlide === index) return; // Предотвращаем повторную анимацию на том же слайде
  
  layers[currentSlide].classList.remove('visible');
  layers[currentSlide].classList.add('hidden');
  
  currentSlide = (index + slides.length) % slides.length;

  layers[currentSlide].classList.remove('hidden');
  layers[currentSlide].classList.add('visible');

  document.getElementById('slider-title').innerText = slides[currentSlide].title;
  document.getElementById('slider-text').innerText = slides[currentSlide].text;

  // Обновление блоков
  boxesContainer.innerHTML = ''; // Очистка контейнера
  slides[currentSlide].boxes.forEach(boxText => {
    const box = document.createElement('div');
    box.className = 'fourth_boxes__box';
    box.innerText = boxText;
    boxesContainer.appendChild(box);
  });

  content.classList.add('fade-in');
  content.classList.remove('fade-out');

  updateIndicators();
}

function nextSlide() {
  updateSlide(currentSlide + 1);
}

function prevSlide() {
  updateSlide(currentSlide - 1);
}

document.addEventListener("DOMContentLoaded", () => {
  updateSlide(currentSlide); // Initialize the first slide
  updateIndicators(); // Initialize indicators
});
