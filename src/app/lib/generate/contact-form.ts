interface ContactFormSectionProps {
    sectionTitle: string;
    colors: {
        mainTextColor: string
        secondaryTextColor: string
        mainBackgroundColor: string
        secondaryBackgroundColor: string
      },
  }

  export function generateContactFormSection({
    sectionTitle,
    colors,
  }: ContactFormSectionProps): string {
    return `
    <section class="overflow-hidden bg-white py-24 sm:py-32" id="contact">
        <div class="mx-auto max-w-6xl md:px-6 lg:px-8">
          <div class="text-center">
            <h2 class="text-base font-semibold leading-7 ${colors.mainTextColor}">${sectionTitle}</h2>
          </div>
          <div class="mt-10 max-w-2xl mx-auto">
            <form class="grid grid-cols-1 gap-y-6" onsubmit="handleSubmit(event)">
              <div>
                <input type="text" id="name" placeholder="Enter your name" class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              </div>
              <div>
                <input type="email" id="email" placeholder="Enter your email" class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              </div>
              <div>
                <textarea id="message" rows="4" placeholder="Write your message here" class="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
              </div>
              <div>
                <button type="submit" class="w-full px-6 py-3 text-white font-semibold rounded-lg shadow-md ${colors.mainBackgroundColor} hover:${colors.secondaryBackgroundColor}">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
  
      <script>
        async function handleSubmit(event) {
          event.preventDefault();
          const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
          };
  
          try {
            const response = await fetch('https://your-api-endpoint.com/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData)
            });
  
            if (response.ok) {
              alert('Message sent successfully!');
            } else {
              alert('Failed to send message');
            }
          } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
          }
        }
      </script>
    `;
  }
  