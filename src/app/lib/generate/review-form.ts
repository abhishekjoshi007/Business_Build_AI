interface ReviewFormSectionProps {
  sectionTitle: string;
  colors: {
    mainTextColor: string;
    secondaryTextColor: string;
    mainBackgroundColor: string;
    secondaryBackgroundColor: string;
  };
}

export function generateReviewSection({
  sectionTitle,
  colors,
}: ReviewFormSectionProps): string {
  const reviews = [
    { name: "Alice", rating: 5, review: "This product exceeded my expectations! Highly recommend." },
    { name: "Bob", rating: 4, review: "Good quality and fast delivery. Could improve the packaging." },
    { name: "Charlie", rating: 3, review: "Average experience. The product is decent but there is room for improvement." },
  ];

  return `
    <section class="py-16 bg-gray-50" id="review">
      <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-center text-3xl font-bold ${colors.mainTextColor} mb-12">${sectionTitle}</h2>
        <div class="space-y-8">
          ${reviews
            .map(review => `
              <div class="bg-white shadow-md rounded-lg p-6">
                <div class="flex items-center mb-4">
                  <span class="text-xl font-semibold ${colors.secondaryTextColor}">${review.name}</span>
                  <div class="ml-auto flex space-x-1">
                    ${Array.from({ length: review.rating })
                      .map(() => `
                        <svg class="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/>
                        </svg>
                      `)
                      .join('')}
                    ${Array.from({ length: 5 - review.rating })
                      .map(() => `
                        <svg class="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/>
                        </svg>
                      `)
                      .join('')}
                  </div>
                </div>
                <p class="text-gray-600">${review.review}</p>
              </div>
            `)
            .join('')}
        </div>
      </div>
    </section>
  `;
}