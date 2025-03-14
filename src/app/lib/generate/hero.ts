export function generateHeroSection({
  title,
  heroTitle,
  heroContent,
  aboutUsTitle,
  aboutUsContent,
  colors,
}: {
  title: string;
  heroTitle: string;
  heroContent: string;
  aboutUsTitle?: string;
  aboutUsContent?: string;
  colors: {
    mainTextColor: string;
    secondaryTextColor: string;
    mainBackgroundColor: string;
    secondaryBackgroundColor: string;
    // Optional gradient colors if needed:
    gradientFromColor?: string;
    gradientToColor?: string;
  };
}): string {
  // Build a dynamic banners array: first slide always uses hero content.
  const banners = [
    {
      title: heroTitle,
      content: heroContent,
      background: colors.mainBackgroundColor || "#1f2937",
    },
  ];                                                                                                                                                                                                                                            
  // If About Us content is provided, add it as a slide.                                                                                                                                                                                                                             
  if (aboutUsTitle && aboutUsContent) {
    banners.push({
      title: aboutUsTitle,
      content: aboutUsContent,
      background: colors.secondaryBackgroundColor || "#374151",
    });
  }
  // Ensure there are at least two slides for the carousel.
  if (banners.length === 1) {
    banners.push({
      title: "Experience Excellence",
      content: "Our expertise drives innovation and quality!",
      background: colors.secondaryBackgroundColor || "#374151",
    });
  }

  return `
  <div class="relative overflow-hidden">
    <div class="carousel-inner">
      ${banners
        .map(
          (banner, idx) => `
        <div class="carousel-item ${idx === 0 ? "active" : ""} p-8 text-center" 
             style="background-color: ${banner.background}; display: ${idx === 0 ? "block" : "none"};">
          <h1 class="text-4xl font-bold text-${colors.mainTextColor}">${banner.title}</h1>
          <p class="mt-4 text-xl text-${colors.secondaryTextColor}">${banner.content}</p>
        </div>
      `
        )
        .join("")}
    </div>
    <button class="carousel-control prev absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded">
      Prev
    </button>
    <button class="carousel-control next absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded">
      Next
    </button>
  </div>
  <script>
    (function() {
      const carousel = document.querySelector('.carousel-inner');
      const items = carousel.querySelectorAll('.carousel-item');
      let activeIndex = 0;
      function showSlide(index) {
        items.forEach((item, i) => {
          item.style.display = i === index ? 'block' : 'none';
        });
      }
      document.querySelector('.next').addEventListener('click', () => {
        activeIndex = (activeIndex + 1) % items.length;
        showSlide(activeIndex);
      });
      document.querySelector('.prev').addEventListener('click', () => {
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        showSlide(activeIndex);
      });
      // Auto-rotate every 5 seconds
      setInterval(() => {
        activeIndex = (activeIndex + 1) % items.length;
        showSlide(activeIndex);
      }, 5000);
      showSlide(activeIndex);
    })();
  </script>
  `;
}
