import HeroSection from '../components/home/HeroSection'
import CategoryHierarchyGrid from '../components/home/CategoryHierarchyGrid'
import FeaturedCollection from '../components/home/FeaturedCollection'
import BrandStoryBanner from '../components/home/BrandStoryBanner'
import LookbookHotspots from '../components/home/LookbookHotspots'
import LuxuryMarquee from '../components/common/LuxuryMarquee'
import BundleUpsellCard from '../components/shop/BundleUpsellCard'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LuxuryMarquee />
      <div id="categories" className="scroll-mt-28">
        <CategoryHierarchyGrid />
      </div>
      <FeaturedCollection />
      <div id="lookbook" className="scroll-mt-28">
        <LookbookHotspots />
      </div>
      <section
        id="collector-bundle"
        className="mx-auto max-w-7xl scroll-mt-28 px-4 pb-20 lg:px-6 lg:pb-28"
      >
        <BundleUpsellCard />
      </section>
      <div id="brand-story" className="scroll-mt-28">
        <BrandStoryBanner />
      </div>
    </>
  )
}
