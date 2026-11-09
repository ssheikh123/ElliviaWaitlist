import { Nav } from './components/Nav.tsx'
import { Footer } from './components/Footer.tsx'
import { FinalCta, Hero, HowItWorks, TrustPrivacy, WhyEllivia } from './components/Sections.tsx'

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-navy-900 px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <HowItWorks />
        <WhyEllivia />
        <TrustPrivacy />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
