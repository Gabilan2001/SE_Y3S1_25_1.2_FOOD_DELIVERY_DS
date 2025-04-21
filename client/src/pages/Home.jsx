import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <header className="bg-blue-500 text-white py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-4">What We Do</h2>
          <p className="text-lg text-center mb-8">
            We provide solutions that help businesses grow and thrive in the digital age.
          </p>

          {/* Sample Card Section */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Service One</h3>
              <p>We offer top-notch web development services tailored to your business needs.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Service Two</h3>
              <p>Our team excels in providing data analytics and business intelligence solutions.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Service Three</h3>
              <p>We provide exceptional customer support and ongoing digital marketing strategies.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-blue-500 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Your Company. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
