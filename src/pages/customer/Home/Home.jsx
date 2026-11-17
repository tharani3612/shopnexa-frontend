
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Shirt,
  Footprints,
  BriefcaseBusiness,
  Watch,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Truck,
  RotateCcw,
  ShieldCheck,
  Heart,
  ChevronLeft,
} from "lucide-react";

import MovingProducts from "./MovingProducts";
import "./Home.css";

/* =========================================
   HERO SLIDER IMAGES
========================================= */

const heroSlides = [
  {
    eyebrow: "STEP INTO SOMETHING NEW",
    title: "Style From Head to Toe.",
    description:
      "Find your favourite footwear and accessories at amazing prices.",
    offer: "UP TO 50% OFF",
    button: "EXPLORE COLLECTION",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1800&q=90",
    position: "center",
  },
  {
    eyebrow: "DISCOVER YOUR STYLE",
    title: "Fashion That Defines You.",
    description:
      "Explore the latest trends and create your own everyday style.",
    offer: "UP TO 70% OFF",
    button: "SHOP FASHION",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=90",
    position: "center",
  },
  {
    eyebrow: "EVERYDAY ESSENTIALS",
    title: "Carry Your Style Everywhere.",
    description:
      "Discover stylish bags and accessories made for every moment.",
    offer: "UP TO 60% OFF",
    button: "EXPLORE ACCESSORIES",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1800&q=90",
    position: "center",
  },
  {
    eyebrow: "THE PERFECT FINISH",
    title: "Details Make The Difference.",
    description:
      "Complete your look with timeless watches and beautiful accessories.",
    offer: "UP TO 50% OFF",
    button: "DISCOVER MORE",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1800&q=90",
    position: "center",
  },
];

/* =========================================
   CATEGORY SIDEBAR
========================================= */

const heroCategories = [
  {
    title: "Women's Wear",
    filter: "Fashion",
    icon: Shirt,
  },
  {
    title: "Men's Fashion",
    filter: "Fashion",
    icon: Shirt,
  },
  {
    title: "Footwear",
    filter: "Footwear",
    icon: Footprints,
  },
  {
    title: "Bags & Backpacks",
    filter: "Accessories",
    icon: BriefcaseBusiness,
  },
  {
    title: "Watches",
    filter: "Accessories",
    icon: Watch,
  },
  {
    title: "Beauty & Grooming",
    filter: "Accessories",
    icon: Sparkles,
  },
];

/* =========================================
   PRODUCT CATEGORIES
========================================= */

const categories = [
  {
    title: "Women's Wear",
    filter: "Fashion",
    offer: "40–80% OFF",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=85",
  },
  {
    title: "Men's Fashion",
    filter: "Fashion",
    offer: "UP TO 70% OFF",
    image:
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=85",
  },
  {
    title: "Footwear",
    filter: "Footwear",
    offer: "UP TO 60% OFF",
    image:
      "https://m.media-amazon.com/images/I/61d6jEjOUNL._AC_UY1000_.jpg",
  },
  {
    title: "Bags & Backpacks",
    filter: "Accessories",
    offer: "30–70% OFF",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=85",
  },
  {
    title: "Watches",
    filter: "Accessories",
    offer: "UP TO 50% OFF",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=85",
  },
  {
    title: "Beauty & Grooming",
    filter: "Accessories",
    offer: "UP TO 60% OFF",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=85",
  },
  {
    title: "Jewellery",
    filter: "Accessories",
    offer: "UP TO 70% OFF",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&q=85",
  },
  {
    title: "Eyewear",
    filter: "Accessories",
    offer: "UP TO 50% OFF",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=85",
  },
  {
    title: "Home & Living",
    filter: "Accessories",
    offer: "UP TO 60% OFF",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=85",
  },
  {
    title: "Ethnic Collection",
    filter: "Fashion",
    offer: "UP TO 70% OFF",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=85",
  },
  {
    title: "Casual Styles",
    filter: "Fashion",
    offer: "40–70% OFF",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=85",
  },
  {
    title: "Sneakers",
    filter: "Footwear",
    offer: "UP TO 50% OFF",
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=600&q=85",
  },
];

/* =========================================
   BRAND OFFERS
========================================= */

const brands = [
  {
    name: "STYLE STUDIO",
    offer: "FLAT 40% OFF",
    description: "Everyday fashion",
  },
  {
    name: "URBAN EDGE",
    offer: "UP TO 60% OFF",
    description: "Modern streetwear",
  },
  {
    name: "LUXE LIVING",
    offer: "UP TO 50% OFF",
    description: "Style meets comfort",
  },
  {
    name: "TREND HOUSE",
    offer: "BUY MORE, SAVE MORE",
    description: "Trending collections",
  },
];

/* =========================================
   HOME COMPONENT
========================================= */

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Footwear");

  /* Automatic slider */

  useEffect(() => {
    const sliderInterval = setInterval(() => {
      setCurrentSlide((previous) => {
        return (previous + 1) % heroSlides.length;
      });
    }, 5000);

    return () => clearInterval(sliderInterval);
  }, []);

  /* Previous slide */

  const previousSlide = () => {
    setCurrentSlide((previous) =>
      previous === 0 ? heroSlides.length - 1 : previous - 1
    );
  };

  /* Next slide */

  const nextSlide = () => {
    setCurrentSlide((previous) =>
      (previous + 1) % heroSlides.length
    );
  };

  const slide = heroSlides[currentSlide];

  return (
    <main className="shop-home">

      {/* =====================================
          PROMOTIONAL STRIP
      ====================================== */}

      <div className="home-promo-strip">
        <span>MEGA STYLE SALE</span>
        <span>UP TO 80% OFF</span>

        <Link to="/products">
          SHOP NOW <ArrowRight size={14} />
        </Link>
      </div>

      {/* =====================================
          HERO SECTION
      ====================================== */}

      <section className="home-hero-slider" id="home">

        {/* LEFT CATEGORY SIDEBAR */}

        <aside className="hero-category-sidebar">

          <div className="hero-sidebar-heading">

            <div className="hero-sidebar-brand">
              <span className="hero-sidebar-brand-icon">
                <ShoppingBag size={20} />
              </span>

              <span>EXPLORE SHOPNEXA</span>
            </div>

            <h2>Shop By Style</h2>

          </div>

          <div className="hero-category-links">

            {heroCategories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  to={`/products?category=${encodeURIComponent(
                    category.filter
                  )}`}
                  key={category.title}
                  className={`hero-category-link ${
                    activeCategory === category.title ? "active" : ""
                  }`}
                  onMouseEnter={() =>
                    setActiveCategory(category.title)
                  }
                  onFocus={() =>
                    setActiveCategory(category.title)
                  }
                >

                  <span className="hero-category-icon">
                    <Icon size={19} strokeWidth={2} />
                  </span>

                  <span className="hero-category-name">
                    {category.title}
                  </span>

                  <ChevronRight
                    className="hero-category-arrow"
                    size={19}
                    strokeWidth={2.5}
                  />

                </Link>
              );
            })}

          </div>

        </aside>

        {/* RIGHT IMAGE SLIDER */}

        <div className="hero-slider">

          <div
            className="hero-slide"
            key={currentSlide}
            style={{
              backgroundImage: `url("${slide.image}")`,
              backgroundPosition: slide.position,
            }}
          >

            <div className="hero-slide-overlay" />

            <div className="hero-slide-content">

              <span className="hero-slide-eyebrow">
                {slide.eyebrow}
              </span>

              <h1>{slide.title}</h1>

              <p>{slide.description}</p>

              <div className="hero-slide-offer">
                {slide.offer}
              </div>

              <Link
                to="/products"
                className="hero-slide-button"
              >
                {slide.button}
                <ArrowRight size={21} />
              </Link>

            </div>

          </div>

          {/* SLIDER ARROWS */}

          <div className="hero-slider-arrows">

            <button
              type="button"
              onClick={previousSlide}
              aria-label="Previous slide"
            >
              <ChevronLeft size={27} />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <ChevronRight size={27} />
            </button>

          </div>

          {/* SLIDER DOTS */}

          <div className="hero-slider-dots">

            {heroSlides.map((item, index) => (
              <button
                type="button"
                key={index}
                className={currentSlide === index ? "active" : ""}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}

          </div>

          {/* SLIDE COUNTER */}

          <div className="hero-slide-counter">
            <span>
              {String(currentSlide + 1).padStart(2, "0")}
            </span>

            <span className="hero-counter-line" />

            <span>
              {String(heroSlides.length).padStart(2, "0")}
            </span>
          </div>

        </div>

      </section>

      {/* =====================================
          DEAL BANNER
      ====================================== */}

      <section className="home-deal-banner">

        <div>
          <p>SHOP MORE. SAVE MORE.</p>

          <h2>Your Wishlist Called!</h2>

          <span>
            Your favourite styles are waiting for you.
          </span>
        </div>

        <Link to="/products">
          DISCOVER DEALS <ArrowRight size={16} />
        </Link>

      </section>

      {/* =====================================
          CATEGORY SECTION
      ====================================== */}

      <section className="home-section" id="categories">

        <div className="section-heading">

          <div>
            <p className="section-eyebrow">
              MADE FOR YOUR STYLE
            </p>

            <h2>Shop by Category</h2>
          </div>

          <Link to="/products">
            VIEW ALL PRODUCTS <ArrowRight size={15} />
          </Link>

        </div>

        <div className="category-grid">

          {categories.map((category, index) => (
            <Link
              to={`/products?category=${encodeURIComponent(
                category.filter
              )}`}
              className="category-card"
              key={category.title}
              style={{
                animationDelay: `${(index % 4) * 0.08}s`,
              }}
            >

              <div className="category-image">

                <img
                  src={category.image}
                  alt={category.title}
                  loading="lazy"
                />

                <span className="category-discount">
                  {category.offer}
                </span>

              </div>

              <div className="category-info">

                <h3>{category.title}</h3>

                <span>
                  SHOP NOW <ArrowRight size={14} />
                </span>

              </div>

            </Link>
          ))}

        </div>

      </section>

      {/* =====================================
          MOVING PRODUCTS
      ====================================== */}

      <MovingProducts />

      {/* =====================================
          BRAND OFFERS
      ====================================== */}

      <section className="home-brand-section" id="brands">

        <div className="section-heading">

          <div>
            <p className="section-eyebrow">
              THE BRANDS YOU LOVE
            </p>

            <h2>Exclusive Brand Offers</h2>
          </div>

          <Link to="/products">
            EXPLORE ALL <ArrowRight size={15} />
          </Link>

        </div>

        <div className="brand-grid">

          {brands.map((brand) => (
            <Link
              to="/products"
              className="brand-card"
              key={brand.name}
            >

              <span>{brand.name}</span>

              <strong>{brand.offer}</strong>

              <small>{brand.description}</small>

            </Link>
          ))}

        </div>

      </section>

      {/* =====================================
          SHOPPING BANNER
      ====================================== */}

      <section className="home-app-banner">

        <div>
          <p>THE SHOPNEXA EXPERIENCE</p>

          <h2>
            Your Next Favourite Is Just a Click Away.
          </h2>

          <span>
            Explore the collection and find something you love.
          </span>
        </div>

        <Link to="/products">
          START SHOPPING <ArrowRight size={16} />
        </Link>

      </section>

      {/* =====================================
          CUSTOMER BENEFITS
      ====================================== */}

      <section className="home-trust-strip">

        <div>
          <span className="trust-icon">
            <Truck size={29} />
          </span>

          <div>
            <strong>FREE DELIVERY</strong>
            <p>On eligible orders</p>
          </div>
        </div>

        <div>
          <span className="trust-icon">
            <RotateCcw size={27} />
          </span>

          <div>
            <strong>EASY RETURNS</strong>
            <p>Simple return process</p>
          </div>
        </div>

        <div>
          <span className="trust-icon">
            <ShieldCheck size={28} />
          </span>

          <div>
            <strong>SECURE SHOPPING</strong>
            <p>Your details stay protected</p>
          </div>
        </div>

        <div>
          <span className="trust-icon">
            <Heart size={28} />
          </span>

          <div>
            <strong>MADE FOR YOU</strong>
            <p>Styles for every day</p>
          </div>
        </div>

      </section>

      {/* =====================================
          FLOATING OFFER
      ====================================== */}

      <Link
        to="/products"
        className="floating-offer"
        aria-label="Shop products with special offers"
      >
        <span>MEGA SALE</span>
        <strong>80% OFF</strong>
        <span>SHOP NOW</span>
      </Link>

    </main>
  );
}

export default Home;
