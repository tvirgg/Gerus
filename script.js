gsap.registerPlugin(Observer);

let sections = document.querySelectorAll("section"),
    images = document.querySelectorAll(".bg"),
    headings = gsap.utils.toArray(".section-heading"),
    outerWrappers = gsap.utils.toArray(".outer"),
    innerWrappers = gsap.utils.toArray(".inner"),
    currentIndex = -1,
    wrap = gsap.utils.wrap(0, sections.length),
    animating;

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
    console.log(`Going to section: ${index}, Direction: ${direction}`);
    index = wrap(index); // make sure it's valid
    if (!sections[index]) {
        console.error(`Section with index ${index} does not exist.`);
        return;
    }

    animating = true;
    let fromTop = direction === -1,
        dFactor = fromTop ? -1 : 1,
        tl = gsap.timeline({
            defaults: { duration: 0.85, ease: "power1.inOut" },
            onComplete: () => {
                animating = false;
                console.log(`Animation completed for section: ${index}`);
            }
        });

    if (currentIndex >= 0 && sections[currentIndex]) {
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
}

Observer.create({
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    onDown: () => {
        if (!animating) {
            let nextIndex = currentIndex - 1;
            if (nextIndex >= 0) {
                gotoSection(nextIndex, -1);
            }
        }
    },
    onUp: () => {
        if (!animating) {
            let nextIndex = currentIndex + 1;
            if (nextIndex < sections.length) {
                gotoSection(nextIndex, 1);
            }
        }
    },
    tolerance: 10,
    preventDefault: true
});

gotoSection(0, 1);

document.addEventListener('DOMContentLoaded', () => {
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
