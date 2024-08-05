document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(Observer);
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
  }

  Observer.create({
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onDown: () => !animating && gotoSection(currentIndex - 1, -1),
      onUp: () => !animating && gotoSection(currentIndex + 1, 1),
      tolerance: 10,
      preventDefault: true
  });

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

  // Обработчики кликов для элементов меню
  const menuItems = document.querySelectorAll('.sidebar-menu a');
  menuItems.forEach((menuItem, index) => {
      menuItem.addEventListener('click', (e) => {
          e.preventDefault();
          gotoSection(index, 1); // Переход к соответствующему слайду
          toggleSidebar(); // Закрытие бокового меню
      });
  });
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
function updateBoxes() {
  const boxesContainer = document.querySelector('.fourth_boxes');
  boxesContainer.innerHTML = ''; // Очистка контейнера
  slides[currentSlide].boxes.forEach(boxText => {
    const box = document.createElement('div');
    box.className = 'fourth_boxes__box';
    box.innerText = boxText;
    boxesContainer.appendChild(box);
    setTimeout(() => {
      box.classList.add('visible');
    }, 100); // Задержка для плавного появления
  });
}
function updateSlide(index) {
  const content = document.querySelector('.slider .content_fourth');
  const layers = document.querySelectorAll('.background-layer');

  if (currentSlide === index) return; // Предотвращаем повторную анимацию на том же слайде

  layers[currentSlide].classList.remove('visible');
  layers[currentSlide].classList.add('hidden');

  currentSlide = (index + slides.length) % slides.length;

  layers[currentSlide].classList.remove('hidden');
  layers[currentSlide].classList.add('visible');

  document.getElementById('slider-title').innerText = slides[currentSlide].title;
  document.getElementById('slider-text').innerText = slides[currentSlide].text;

  updateBoxes(); // Обновление блоков

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

/*********
 * made by Matthias Hurrle (@atzedent)
 *
 * Based on the work of: @noirsociety
 * "Responsive Image Carousel (Animation)"
 * https://codepen.io/noirsociety/pen/ZEwLGXB
 *
 * This implementation adds the following features:
 * - background images rendered from GLSL shaders (two versions: low and full resolution)
 * - play/pause button to start/stop the shader animation
 * - swipe gestures on mobile
 * - keyboard navigation (left/right arrow keys) and spacebar to play/pause
 *
 * Some less obvious changes:
 * - despite paused, run animation on resize to adjust to the new resolution
 * - regenerate the images with full resolution on orientation change
 *
 */
document.addEventListener("DOMContentLoaded", () => {
  updateSlide(currentSlide); // Initialize the first slide
  updateIndicators(); // Initialize indicators
  updateBoxes(); // Initialize boxes
});
let dpr = Math.max(1, window.devicePixelRatio);

const vertexSource = `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

in vec4 position;

void main(void) {
    gl_Position = position;
}
`;

function compile(shader, source) {
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
  }
}

let canvas,
  gl,
  shaders = [],
  programs = [],
  vertices,
  buffer;

function setup() {
  canvas = document.createElement("canvas");

  gl = canvas.getContext("webgl2");
  const vs = gl.createShader(gl.VERTEX_SHADER);

  compile(vs, vertexSource);

  shaders = Array.from(
    document.querySelectorAll("script[type='x-shader/x-fragment']")
  );
  programs = shaders.map(() => gl.createProgram());

  for (let i = 0; i < shaders.length; i++) {
    let addr = gl.createShader(gl.FRAGMENT_SHADER);
    let program = programs[i];

    compile(addr, shaders[i].textContent);
    gl.attachShader(program, vs);
    gl.attachShader(program, addr);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
    }
  }

  vertices = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];

  buffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  for (const program of programs) {
    const position = gl.getAttribLocation(program, "position");

    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    // uniforms come here...
    program.resolution = gl.getUniformLocation(program, "resolution");
    program.time = gl.getUniformLocation(program, "time");
  }
}

function draw(now, program) {
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // uniforms come here...
  gl.uniform2f(program.resolution, canvas.width, canvas.height);
  gl.uniform1f(program.time, now * 1e-3);

  gl.drawArrays(gl.TRIANGLES, 0, vertices.length * 0.5);
}

let running = false,
  then = 0,
  af = null;

function loop(now, index) {
  if (running) {
    draw(now + then, programs[index]);
    af = requestAnimationFrame((t) => loop(t, index));
  } else {
    then = now;
    cancelAnimationFrame(af);
  }
}

function removeCanvas() {
  const canvas = document.querySelector("canvas");
  running = false;

  if (canvas) {
    canvas.remove();
  }
}

function setXOff(slider, value) {
  if (!slider) {
    slider = document.querySelector(".slider");
  }

  slider.style.setProperty("--x-off", `${value}%`);
}

function hookEvents() {
  const slider = document.querySelector(".slider");

  // The primary navigation buttons
  function activate(e) {
    const items = document.querySelectorAll(".slide");
    if (e.target.closest(".nav")) {
      setXOff(slider, 0);

      setTimeout(
        () => {
          e.target.matches(".next") && slider.append(items[0]);
          e.target.matches(".prev") && slider.prepend(items[items.length - 1]);

          // Cleanup
          removeCanvas();
        },
        running ? 1000 : 0
      );
    }
  }

  // Allow swiping on mobile
  let sliding = false;
  let origX = 0;

  function slide(e) {
    if (!sliding) return;

    const { touches } = e;
    const first = touches[0];
    const val = first.screenX - origX;

    setXOff(slider, Math.max(-50, Math.min(50, val)));

    if (val < -50) {
      sliding = false;
      setXOff(slider, 0);
      document.querySelector(".next").click();
    } else if (val > 50) {
      sliding = false;
      setXOff(slider, 0);
      document.querySelector(".prev").click();
    }
  }

  document.addEventListener("click", activate);
  document.addEventListener("touchmove", slide);
  document.addEventListener("touchstart", (e) => {
    if (running) return;
    sliding = true;
    origX = e.touches[0].screenX;
  });
  document.addEventListener("touchend", () => {
    if (running) return;
    sliding = false;
    setXOff(null, 0);
  });

  document.addEventListener("keydown", (e) => {
    const items = document.querySelectorAll(".slide");

    if (e.key === "ArrowRight") {
      document.querySelector(".next").click();
    } else if (e.key === "ArrowLeft") {
      document.querySelector(".prev").click();
    }
  });
}

async function init() {
  console.clear();
  hookEvents();
  setup();
  resize();

  // Render the shaders to background images of the slides
  return new Promise((resolve) => {
    for (let i = 0; i < programs.length; i++) {
      // Decrease the resolution of all but the first two shaders to improve performance
      if (i > 1) {
        dpr = Math.max(1, 0.25 * window.devicePixelRatio);
        resize();
      }
      draw(0, programs[i]);
      const img = canvas.toDataURL();
      const slide = document.querySelectorAll(".slide")[i];
      slide.style.backgroundImage = `url(${img})`;
      slide.dataset.shaderIndex = i;
      slide.dataset.rerendered = `${canvas.width}x${canvas.height}`;
      slide.querySelector(".title").textContent = shaders[i].dataset.title;
    }

    // Reset the resolution to full
    dpr = Math.max(1, window.devicePixelRatio);
    // When the images are loaded, regenerate the images with full resolution
    setTimeout(async () => {
      await regenerateImagesWithFullResolution();
      setCustomImage(0, 'https://wallpapercave.com/wp/wp4854080.jpg'); // Добавляем эту строку
      resolve();
    }, 2000);
  });
}

async function regenerateImagesWithFullResolution(all = false) {
  return new Promise((resolve) => {
    const slides = document.querySelectorAll(".slide");

    resize();

    for (const slide of slides) {
      const shaderIndex = slide.dataset.shaderIndex;

      // Skip the first two shaders in the initial run (if all is false)
      // since they are already rendered with full resolution
      if (!all && shaderIndex < 2) continue;
      requestAnimationFrame(() => renderBackground(slide));
    }

    resolve();
  });
}

function renderBackground(slide) {
  const shaderIndex = slide.dataset.shaderIndex;

  draw(0, programs[shaderIndex]);

  const img = canvas.toDataURL();

  slide.style.backgroundImage = `url(${img})`;
  slide.dataset.rerendered = `${canvas.width}x${canvas.height}`;
  slide.classList.toggle("rerendered"); // help certain browsers to update the background image
}

function size(width, height) {
  canvas.width = width;
  canvas.height = height;

  gl.viewport(0, 0, width, height);
}

function resizeInner() {
  const { innerWidth: width, innerHeight: height } = window;

  size(width * dpr, height * dpr);
}

function resize() {
  const { width, height } = window.screen;

  size(width * dpr, height * dpr);
}

window.onresize = () => {
  resizeInner();

  if (running) return;

  // Run the shader animation on the current slide in order to
  // adjust to the new resolution
  document.querySelectorAll(".slide").forEach((slide) => {
    if (slide.querySelector("canvas")) {
      running = true;
      loop(0, slide.dataset.shaderIndex);
      running = false;
    }
  });
};

window.onorientationchange = async () => {
  // Regenerate the images with the new resolution
  resize();
  await regenerateImagesWithFullResolution(true);
};

window.addEventListener("load", async () => await init());

function setCustomImage(slideIndex, imageUrl) {
  // Находим все слайды
  let slides = document.querySelectorAll('.slider .slide');
  // Выбираем первый слайд (индекс 0)
  let slide = slides[slideIndex];
  
  // Создаем новый элемент img и загружаем в него изображение
  let img = new Image();
  img.onload = function() {
    // Когда изображение загружено, устанавливаем его как фоновое изображение для слайда
    slide.style.backgroundImage = `url(${imageUrl})`;
  };
  
  // Указываем путь к изображению
  img.src = imageUrl;
}

function updateTexture(gl, texture, imageUrl) {
  const img = new Image();
  img.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindTexture(gl.TEXTURE_2D, null);
  };
  img.crossOrigin = ""; // Если изображение с другого домена
  img.src = imageUrl;
}

let texture = gl.createTexture();
updateTexture(gl, texture, 'https://wallpapercave.com/wp/wp4854080.jpg');
