
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="bg-red-100 text-red-700 text-sm font-bold px-4 py-1.5 rounded-full">
                SAVE 75% • WAS £200 NOW £50
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Start Your ESG Journey<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                For Just £50
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              ESG & Sustainability Readiness Assessment — Your first step to certification
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-4 border-green-500">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    ESG Readiness Assessment
                  </h3>
                  <p className="text-gray-600">
                    Benchmark your ESG performance against GRI standards
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-gray-400 line-through text-lg">£200</div>
                  <div className="text-5xl font-bold text-green-600">£50</div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  'Complete ESG performance analysis',
                  'Benchmark against GRI standards',
                  'Identify strengths, risks, and improvement areas',
                  'Practical recommendations for ESG strategy',
                  '1:1 consultation with UK-leading ESG consultant',
                  'Recommended first step for B Corp and EcoVadis certification',
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-md hover:shadow-lg scale-100 w-full text-lg py-6">
                Book Your £50 Assessment Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              See How We Help Businesses Like Yours
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Watch our story and discover how ESG Pro makes sustainability accessible for every business
            </p>
          </div>

          <div className="relative w-full max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 aspect-video">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube-nocookie.com/embed/YPTWG0MZqAA?rel=0&modestbranding=1"
                title="ESG Pro - How We Help"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Carbon Footprint Reports */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Carbon Footprint Reports
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              GHG Protocol compliant reports covering Scope 1, 2, and 3 (Business Travel)
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'CFR-1', employees: '1-10 employees', price: '£1,380', popular: false },
              { name: 'CFR-2', employees: '11-25 employees', price: '£1,840', popular: true },
              { name: 'CFR-3', employees: '26-100 employees', price: '£2,300', popular: false },
              { name: 'CFR-4', employees: '101-250 employees', price: '£2,760', popular: false },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`bg-white rounded-xl shadow-lg p-6 relative ${
                  tier.popular ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{tier.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{tier.employees}</p>
                <div className="text-3xl font-bold text-green-600 mb-6">{tier.price}</div>
                <button className="py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 border shadow-md hover:shadow-lg scale-100 w-full">
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B Corp & EcoVadis Certification - WITH £2,400 INTRODUCTORY BUNDLE */}
      <section className="px-4 py-16 bg-gradient-to-br from-gray-50 to-blue-50" data-version="2.0.0-updated-pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              B Corp & EcoVadis Certification
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Prove your ESG credentials and win more contracts
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* B Corp Certification Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                B Corp Certification
              </h3>
              
              <div className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
                INTRODUCTORY BUNDLE
              </div>
              
              <p className="text-gray-600 mb-6">
                Complete B Corp certification support with 100% first-time success rate
              </p>

              <div className="space-y-2 mb-6">
                {[
                  'Full impact assessment preparation',
                  'Documentation and policy templates',
                  'Gap analysis and improvement roadmap',
                  'Score optimization guidance',
                  'Initial submission support',
                  '3-6 months typical timeline'
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-1">Introductory Bundle</div>
                <div className="text-4xl font-bold text-gray-900">£2,400</div>
                <div className="text-sm text-gray-500 mt-1">Full certification: £6,270+</div>
              </div>

              <a
                className="block text-center px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700"
                href="/thank-you"
              >
                Book Free Consultation
              </a>
            </div>

            {/* EcoVadis Certification Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                EcoVadis Certification
              </h3>
              
              <div className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
                INTRODUCTORY BUNDLE
              </div>
              
              <p className="text-gray-600 mb-6">
                Achieve Bronze or Silver rating with an EcoVadis Approved Training Partner
              </p>

              <div className="space-y-2 mb-6">
                {[
                  'Assessment preparation and strategy',
                  'Evidence gathering templates',
                  'Response optimization',
                  'Documentation review',
                  'Submission guidance',
                  'Bronze/Silver achievement (Gold: £10K-£14K)'
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-1">Introductory Bundle</div>
                <div className="text-4xl font-bold text-gray-900">£2,400</div>
                <div className="text-sm text-gray-500 mt-1">Full certification: £6,210+</div>
              </div>

              <a
                className="block text-center px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700"
                href="/thank-you"
              >
                Book Free Consultation
              </a>
            </div>
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Why Choose ESG Pro?
            </h3>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">✓</div>
                <div className="font-semibold text-gray-900 mb-1">Certified B Corp</div>
                <div className="text-sm text-gray-600">We practice what we preach</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">⭐</div>
                <div className="font-semibold text-gray-900 mb-1">EcoVadis Gold</div>
                <div className="text-sm text-gray-600">Top-tier rating ourselves</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">🎓</div>
                <div className="font-semibold text-gray-900 mb-1">Approved Training Partner</div>
                <div className="text-sm text-gray-600">Official EcoVadis recognition</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                <div className="font-semibold text-gray-900 mb-1">First-Time Success Rate</div>
                <div className="text-sm text-gray-600">Full team, not one-man band</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accreditations Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Accreditations & Certifications
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by businesses worldwide. Backed by industry-leading certifications and partnerships.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 text-center border-2 border-yellow-200">
              <div className="text-4xl mb-3">🥇</div>
              <h3 className="font-bold text-gray-900 mb-2">EcoVadis Gold</h3>
              <p className="text-sm text-gray-700">Top 5% Sustainability Rating</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center border-2 border-green-200">
              <div className="text-4xl mb-3">Ⓑ</div>
              <h3 className="font-bold text-gray-900 mb-2">Certified B Corp</h3>
              <p className="text-sm text-gray-700">Meeting highest standards</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center border-2 border-blue-200">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="font-bold text-gray-900 mb-2">Approved Partner</h3>
              <p className="text-sm text-gray-700">EcoVadis Training Partner</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center border-2 border-purple-200">
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="font-bold text-gray-900 mb-2">Global Standards</h3>
              <p className="text-sm text-gray-700">GHG Protocol & SBTi</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-gradient-to-br from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Book your £50 ESG Readiness Assessment today and take the first step to certification
          </p>
          <button className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-lg font-semibold transition-all duration-300">
            Start Free Chat Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-4 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm opacity-75">© 2025 ESG Pro. All rights reserved.</p>
          <p className="text-xs opacity-50 mt-2">
            B Corp Certified • EcoVadis Gold • EcoVadis Approved Training Partner
          </p>
        </div>
      </footer>
    </div>
  )
}
