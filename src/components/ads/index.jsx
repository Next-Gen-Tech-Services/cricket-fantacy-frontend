import SimpleBanner from './SimpleBanner';
import Ads1 from "../../assets/ads/2.png";
import MobileAds from "../../assets/ads/3.png";
// ============= HORIZONTAL AD PLACEMENTS =============

// Large horizontal banner (like newspaper style)
export const HorizontalBannerLarge = ({
  imageUrl = Ads1,
  redirectUrl = "#",
  className = ""
}) => (
  <div className={`my-6 flex justify-center ${className}`}>
    <SimpleBanner
      imageUrl={imageUrl}
      redirectUrl={redirectUrl}
      orientation="horizontal"
      size="xlarge"
      alt="Large Horizontal Advertisement"
    />
  </div>
);

// Medium horizontal banner
export const HorizontalBannerMedium = ({
  imageUrl = Ads1,
  redirectUrl = "#",
  className = ""
}) => (
  <div className={`my-4 flex justify-center ${className}`}>
    <SimpleBanner
      imageUrl={imageUrl}
      redirectUrl={redirectUrl}
      orientation="horizontal"
      size="medium"
      alt="Medium Horizontal Advertisement"
    />
  </div>
);

// Small horizontal banner
export const HorizontalBannerSmall = ({
  imageUrl = Ads1,
  redirectUrl = "#",
  className = ""
}) => (
  <div className={`my-2 flex justify-center ${className}`}>
    <SimpleBanner
      imageUrl={imageUrl}
      redirectUrl={redirectUrl}
      orientation="horizontal"
      size="small"
      alt="Small Horizontal Advertisement"
    />
  </div>
);

// ============= VERTICAL AD PLACEMENTS =============

// Large vertical banner (sidebar)
export const VerticalBannerLarge = ({
  imageUrl = Ads1,
  redirectUrl = "#",
  className = ""
}) => (
  <div className={`${className}`}>
    <SimpleBanner
      imageUrl={imageUrl}
      redirectUrl={redirectUrl}
      orientation="vertical"
      size="xlarge"
      alt="Large Vertical Advertisement"
    />
  </div>
);

// Medium vertical banner
export const VerticalBannerMedium = ({
  imageUrl = Ads1,
  redirectUrl = "#",
  className = ""
}) => (
  <div className={`${className}`}>
    <SimpleBanner
      imageUrl={imageUrl}
      redirectUrl={redirectUrl}
      orientation="vertical"
      size="medium"
      alt="Medium Vertical Advertisement"
    />
  </div>
);

// Small vertical banner
export const VerticalBannerSmall = ({
  imageUrl = Ads1,
  redirectUrl = "#",
  className = ""
}) => (
  <div className={`${className}`}>
    <SimpleBanner
      imageUrl={imageUrl}
      redirectUrl={redirectUrl}
      orientation="vertical"
      size="small"
      alt="Small Vertical Advertisement"
    />
  </div>
);

// ============= STRATEGIC PLACEMENTS =============

// Between content sections (horizontal)
export const ContentSeparatorAd = ({
  imageUrl = Ads1,
  redirectUrl = "#",
  className = ""
}) => (
  <HorizontalBannerMedium
    imageUrl={imageUrl}
    redirectUrl={redirectUrl}
    className={className}
  />
);

// Sidebar ad (vertical, desktop only)
export const SidebarAd = ({
  imageUrl = Ads1,
  redirectUrl = "#",
  className = ""
}) => (
  <div className={`hidden lg:block ${className}`}>
    <VerticalBannerMedium
      imageUrl={imageUrl}
      redirectUrl={redirectUrl}
    />
  </div>
);

// Footer area ad (horizontal)
export const FooterAreaAd = ({
  imageUrl = Ads1,
  redirectUrl = "#",
  className = ""
}) => (
  <div className={`py-6 ${className}`}>
    <div className="max-w-6xl mx-auto px-4">
      <HorizontalBannerLarge
        imageUrl={imageUrl}
        redirectUrl={redirectUrl}
      />
    </div>
  </div>
);

// Between list items
export const ListItemAd = ({
  index,
  frequency = 5,
  imageUrl = Ads1,
  redirectUrl = "#",
  className = ""
}) => {
  if ((index + 1) % frequency !== 0) return null;

  return (
    <HorizontalBannerSmall
      imageUrl={imageUrl}
      redirectUrl={redirectUrl}
      className={className}
    />
  );
};

// Mobile bottom banner (horizontal)
export const MobileBottomBanner = ({
  imageUrl = MobileAds,
  redirectUrl = "#",
  className = ""
}) => (
  <div className={`md:hidden fixed bottom-16 left-0 right-0 z-30 p-2 ${className}`}>
    <SimpleBanner
      imageUrl={imageUrl}
      redirectUrl={redirectUrl}
      orientation="horizontal"
      size="small"
      className="mx-auto"
      alt="Mobile Advertisement"
    />
  </div>
);

export { SimpleBanner };