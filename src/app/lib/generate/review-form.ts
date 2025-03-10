interface ReviewFormSectionProps {
    sectionTitle: string;
    colors: {
      mainTextColor: string;
      secondaryTextColor: string;
      mainBackgroundColor: string;
      secondaryBackgroundColor: string;
    };
  }
  
  export function generateReviewFormSection({
    sectionTitle,
    colors,
  }: ReviewFormSectionProps): string {
    const BaseUrl = process.env.NEXTAUTH_URL; // Use server-side environment variable
    return `
      <section class="overflow-hidden bg-white py-24 sm:py-32" id="review">
        <div class="mx-auto max-w-6xl md:px-6 lg:px-8">
          <div class="text-center">
            <h2 class="text-base font-semibold leading-7 ${colors.mainTextColor}">${sectionTitle}</h2>
          </div>
          <div class="mt-10 max-w-2xl mx-auto">
            <form class="grid grid-cols-1 gap-y-6" onsubmit="handleReviewSubmit(event)">
              <div>
                <input type="text" id="reviewer" placeholder="Your name" class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              </div>
              <div>
                <textarea id="review" rows="4" placeholder="Write your review here" class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
              </div>
              <div>
                <button type="submit" class="w-full px-6 py-3 text-white font-semibold rounded-lg shadow-md ${colors.mainBackgroundColor} hover:${colors.secondaryBackgroundColor}">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    
      <script>
        async function handleReviewSubmit(event) {
          event.preventDefault();
          // Extract the id on the client side from the URL
          const url = window.location.href;
          const id = url.split('/')[2].split('.')[0].split('-')[1];
    
          const reviewData = {
            id: id,
            reviewer: document.getElementById('reviewer').value,
            review: document.getElementById('review').value
          };
    
          // Make the base URL available on the client side
          const baseUrl = "${BaseUrl}";
    
          try {
            const response = await fetch(\`\${baseUrl}/api/review/\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(reviewData)
            });
    
            if (response.ok) {
              alert('Review submitted successfully!');
            } else {
              alert('Failed to submit review');
            }
          } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
          }
        }
      </script>
    `;
  }