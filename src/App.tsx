import React, { useState } from 'react';

// ====================================================================
// 1. SCROLL UTILITY FUNCTION
// Functie helper pentru a naviga lin catre o sectiune, folosind ID-ul ei.
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// ====================================================================
// 2. TYPES AND INTERFACES (TypeScript)
// Definirea tipurilor pentru a asigura siguranta codului
type SectionName = 'Acasa' | 'Chei' | 'Ascutire Cutite' | 'Contact';
type AnchorId = 'hero' | 'gallery' | 'sharpening' | 'contact' | 'keys-intro';

interface NavItem {
  name: SectionName;
  id: AnchorId;
}

interface NavBarProps {
  onNavigate: (id: AnchorId) => void;
}

// ====================================================================
// 3. NAV BAR COMPONENT
// Gestioneaza navigatia, logo-ul si meniul hamburger (responsive)

const NAV_ITEMS: NavItem[] = [
  { name: 'Acasa', id: 'hero' },
  { name: 'Chei', id: 'gallery' },
  { name: 'Ascutire Cutite', id: 'sharpening' },
  { name: 'Contact', id: 'contact' },
];

const NavBar: React.FC<NavBarProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
     <nav className="fixed top-0 left-0 w-full bg-slate-900 bg-opacity-95 shadow-xl z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Left: Logo (keeps left alignment on all sizes) */}
          {/* <div className="flex items-center flex-1 md:flex-none">
            <button
              onClick={() => onNavigate('hero')}
              className="text-2xl font-extrabold tracking-wider text-teal-700 hover:text-teal-300 transition duration-300 focus:outline-none"
            >
              MASTER KEY & BLADE
            </button>
          </div> */}

          {/* Center: Desktop nav (centered) */}
          <div className="hidden md:flex flex-1 justify-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="text-white hover:bg-slate-700 px-6 py-3 rounded-lg text-lg font-semibold transition duration-200"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Right: Hamburger on mobile */}
          <div className="flex items-center justify-end flex-1 md:flex-none">
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                type="button"
                className="inline-flex items-center justify-center p-3 rounded-lg text-teal-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-teal-400"
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-7 w-7`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-7 w-7`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Meniu Mobil (Se extinde cand e deschis) */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsMenuOpen(false); // Inchide meniul dupa click
              }}
              className="block w-full text-left text-white hover:bg-slate-700 px-4 py-3 rounded-lg text-lg font-semibold transition duration-200"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

// ====================================================================
// 4. SECTION COMPONENTS (PLACEHOLDERS)
// Fiecare sectiune are un ID care corespunde butoanelor din Nav Bar

interface SectionProps {
  id: AnchorId;
  title: string;
  children: React.ReactNode;
  bgClass: string;
}

const Section: React.FC<SectionProps> = ({ id, title, children, bgClass }) => (
  <section id={id} className={`py-24 md:py-32 min-h-screen ${bgClass} text-slate-800`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-teal-700">{title}</h2>
      {children}
    </div>
  </section>
);

// --- Hero Section ---
const HeroSection: React.FC = () => (
  <Section
    id="hero"
    title="Master Key & Blade - Solutii de Precizie"
    bgClass="relative bg-cover bg-center flex items-center pt-16"
  >
    {/* Background image from public folder (keys ai.png) */}
    <div
      className="absolute inset-0 bg-center bg-cover"
      style={{ backgroundImage: "url('/keys%20ai.png')", filter: 'contrast(0.9) brightness(0.45)' }}
      aria-hidden="true"
    />

    {/* Overlay to improve text readability */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" aria-hidden="true" />

    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-24 md:py-32 text-center">
        <h3 className="text-4xl md:text-5xl font-extrabold mb-4 text-teal-700">Partenerul tau de incredere pentru siguranta.</h3>
        <p className="text-xl md:text-2xl mb-6 text-slate-200 max-w-3xl mx-auto">
          De peste un deceniu, oferim servicii de copiere chei, sisteme de securitate si ascutire profesionala a lamelor. Calitate, rapiditate si precizie garantata.
        </p>
      </div>
    </div>
  </Section>
);

// --- Key Gallery Section ---
const PhotoGallerySection: React.FC = () => (
  <Section id="gallery" title="Galerie Chei & Securitate" bgClass="bg-white">
    {/* Intro block for keys (moved from KeysIntroSection) */}
    <div className="max-w-4xl mx-auto mb-12">
      <div className="lg:flex lg:items-center lg:gap-12">
        <div className="lg:w-1/2">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Chei pentru orice nevoie</h3>
          <p className="text-lg text-slate-700 mb-6">
            Oferim o gamă completă de servicii: copiere chei, chei auto cu cip, chei de înaltă securitate și personalizări.
            Folosim echipamente moderne pentru precizie și verificare.
          </p>
          <ul className="list-disc list-inside text-lg text-slate-700 space-y-2">
            <li>Copiere rapidă pentru chei standard și chei speciale</li>
            <li>Soluții de organizare și depozitare pentru chei</li>
          </ul>
        </div>
        <div className="lg:w-1/2 mt-8 lg:mt-0">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img src="/preturWhatsapp.jpg" alt="Key rack" className="w-full h-80 object-cover" />
          </div>
        </div>
      </div>
    </div>

    <p className="text-center text-xl mb-10 text-slate-600">
      De la chei simple, la sisteme de acces complexe. Precizia ne definește.
    </p>
    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
      {/* Placeholder Images for Keys */}
      <div className="rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-[1.02]">
        <img
          src="/keys%20ai.png"
          alt="Chei de inalta securitate"
          className="w-full h-64 object-cover"
          onError={(e) => { e.currentTarget.src = '/keys%20ai.png'; }}
        />
        <p className="p-3 text-center font-semibold text-slate-700">Chei</p>
      </div>
      <div className="rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-[1.02]">
        <img
          src="/organizatorChei.png"
          alt="Panou cu chei organizate"
          className="w-full h-64 object-cover"
          onError={(e) => { e.currentTarget.src = '/organizatorChei.png'; }}
        />
        <p className="p-3 text-center font-semibold text-slate-700">Organizator Chei</p>
      </div>
    </div>
  </Section>
);

// (Keys intro moved into PhotoGallerySection above)

// --- Sharpening Section ---
const SharpeningSection: React.FC = () => (
  <Section id="sharpening" title="Ascutire Profesionala a Cutitelor" bgClass="bg-gray-100">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="h-96 w-full rounded-xl shadow-2xl overflow-hidden">
        <img
          src="/asscutit%20cutite.png"
          alt="Ascutire cutite"
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = '/asscutit%20cutite.png'; }}
        />
      </div>
      <div className="text-slate-700">
        <h3 className="text-3xl font-bold mb-4 text-slate-900">Adu-ți Lamele la Viață!</h3>
        <p className="text-lg mb-4">
          Un cutit bine ascutit nu doar ca usureaza munca, dar este si mult mai sigur. Oferim servicii de ascutire pentru o gama larga de lame, inclusiv:
        </p>
        <ul className="list-disc list-inside space-y-2 text-lg font-medium pl-4">
          <li>Cuțite de bucătărie (oțel și ceramică)</li>
          <li>Foarfece profesionale</li>
        </ul>
        <p className="text-lg mt-4 font-semibold text-teal-700">
          Folosim echipamente de inalta precizie pentru a restabili unghiul perfect al taisului.
        </p>
        <p className="text-lg mt-4 font-semibold text-red-600">
          Pretul pentru ascutirea cutitelor variaza intre 7 si 12 lei in functie de tipul si dimensiunea lamei.
        </p>
      </div>
    </div>
  </Section>
);

// --- Contact Section ---
const ContactSection: React.FC = () => (
  <Section id="contact" title="Contacteaza-ne" bgClass="bg-white">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">


      {/* Formular de Contact */}
      {/* <div className="p-6 rounded-xl shadow-2xl bg-slate-50 border border-slate-200">
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Numele Tău"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            required
          />
          <textarea
            placeholder="Mesajul Tău (descrie serviciul dorit)"
            rows={5}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg shadow-md transition duration-300"
          >
            Trimite Mesajul
          </button>
        </form>
      </div> */}

      {/* Location Map on Desktop/Tablet */}
      <div className="lg:order-2 order-1 h-96 w-full rounded-xl shadow-2xl overflow-hidden border-4 border-slate-300">
        <h4 className="text-center bg-teal-600 text-white py-2 font-semibold">Locatia Noastră</h4>
        {/* Placeholder Map - In production, replace with real Google Maps embed */}
        <iframe
          src="https://www.google.com/maps?q=Strada+Câmpului+17,+Cluj-Napoca&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          title="Shop Location"
        ></iframe>
      </div>

      {/* Detalii Contact & Program */}
      <div className="space-y-6 text-lg text-slate-700 p-6">
        <h3 className="text-2xl font-bold text-teal-700 mb-4">Detalii și Program</h3>

        <div className="space-y-2">
          <p className="font-semibold text-slate-900">Adresa:</p>
          <p>Strada Câmpului 17, Cluj-Napoca</p>
        </div>

        {/* <div className="space-y-2">
          <p className="font-semibold text-slate-900">Telefon:</p>
          <p>+40 700 XXX XXX</p>
        </div> */}

        <div className="space-y-2">
          <p className="font-semibold text-slate-900">Email:</p>
          <p>contact@masterkeyblade.ro</p>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-slate-900">Program de Lucru:</p>
          <ul className="list-none space-y-1">
            <li>Luni - Joi: 10:00 - 16:00</li>
            <li>Vineri: 10:00 - 14:00</li>
            <li>Sâmbătă: Închis</li>
            <li>Duminică: Închis</li>
          </ul>
        </div>
      </div>
    </div>
  </Section>
);

// ====================================================================
// 5. MAIN APPLICATION COMPONENT
// ====================================================================

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* Tailwind should be imported via CSS (index.css) and configured in tailwind.config.js */}
      
      {/* 5.2. Bara de Navigare */}
      <NavBar onNavigate={scrollToSection} />

      <main className="pt-16"> {/* Adauga padding pentru a nu fi acoperit de Nav Bar */}
        {/* 5.3. Secțiunile Paginilor */}
          <HeroSection />
          <PhotoGallerySection />
        <SharpeningSection />
        <ContactSection />
      </main>

      {/* Footer simplu */}
      <footer className="bg-slate-900 text-center text-sm py-4 text-slate-400">
        &copy; {new Date().getFullYear()} Master Key & Blade. Toate drepturile rezervate.
      </footer>
    </div>
  );
};

export default App;
