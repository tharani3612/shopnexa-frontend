
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import "./MovingProducts.css";

/* =========================================
   TRENDING COLLECTIONS
========================================= */

const trendingCollections = [
  {
    title: "Urban Streetwear",
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=700&q=85",
    position: "center",
  },
  {
    title: "Summer Looks",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85",
    position: "center",
  },
  {
    title: "Everyday Fashion",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=85",
    position: "center",
  },
  {
    title: "Modern Street Style",
    image:
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=700&q=85",
    position: "center",
  },
  {
    title: "Fresh Outfit Ideas",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85",
    position: "center",
  },
  {
    title: "Minimal Fashion",
    image:
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=700&q=85",
    position: "center",
  },
];

/* =========================================
   MOVING PRODUCTS COMPONENT
========================================= */

export default function MovingProducts() {
  const trackRef = useRef(null);
  const firstGroupRef = useRef(null);

  const animationRef = useRef(null);
  const positionRef = useRef(0);
  const previousTimeRef = useRef(0);
  const groupWidthRef = useRef(0);

  const isPausedRef = useRef(false);

  const [imageErrors, setImageErrors] = useState([]);

  /* =====================================
     INFINITE AUTO SCROLL
  ====================================== */

  useEffect(() => {
    const track = trackRef.current;
    const firstGroup = firstGroupRef.current;

    if (!track || !firstGroup) return;

    const speed = 42;

    const updateWidth = () => {
      groupWidthRef.current = firstGroup.offsetWidth;

      if (groupWidthRef.current > 0) {
        positionRef.current %= groupWidthRef.current;

        track.style.transform =
          `translate3d(-${positionRef.current}px, 0, 0)`;
      }
    };

    const animate = (time) => {
      if (!previousTimeRef.current) {
        previousTimeRef.current = time;
      }

      const delta = Math.min(
        (time - previousTimeRef.current) / 1000,
        0.05
      );

      previousTimeRef.current = time;

      const pageIsVisible =
        document.visibilityState === "visible";

      if (
        !isPausedRef.current &&
        pageIsVisible &&
        groupWidthRef.current > 0
      ) {
        positionRef.current =
          (positionRef.current + speed * delta) %
          groupWidthRef.current;

        track.style.transform =
          `translate3d(-${positionRef.current}px, 0, 0)`;
      }

      animationRef.current =
        requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(updateWidth);

    resizeObserver.observe(firstGroup);

    updateWidth();

    animationRef.current =
      requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      resizeObserver.disconnect();
    };
  }, []);

  /* =====================================
     PAUSE AND RESUME
  ====================================== */

  const pauseScroll = () => {
    isPausedRef.current = true;
  };

  const resumeScroll = () => {
    isPausedRef.current = false;
    previousTimeRef.current = 0;
  };

  /* =====================================
     IMAGE FALLBACK
  ====================================== */

  const handleImageError = (index) => {
    setImageErrors((previous) => {
      if (previous.includes(index)) return previous;

      return [...previous, index];
    });
  };

  /* =====================================
     RENDER
  ====================================== */

  return (
    <section className="nexa-trending">

      {/* SECTION HEADING */}

      <div className="nexa-trending-heading">

        <span className="nexa-trending-eyebrow">
          CURATED FOR YOU
        </span>

        <h2>
          Trending <em>Looks</em>
        </h2>

        <p>
          Fresh fashion inspiration for your everyday style.
        </p>

        <div className="nexa-heading-decoration">
          <span />
          <span />
          <span />
        </div>

      </div>

      {/* INFINITE MARQUEE */}

      <div
        className="nexa-marquee"
        onMouseEnter={pauseScroll}
        onMouseLeave={resumeScroll}
        onFocusCapture={pauseScroll}
        onBlurCapture={resumeScroll}
      >

        <div
          className="nexa-marquee-track"
          ref={trackRef}
        >

          {/* FIRST GROUP */}

          <div
            className="nexa-marquee-group"
            ref={firstGroupRef}
          >

            {trendingCollections.map((item, index) => (
              <Link
                to="/products"
                className="nexa-look"
                key={item.title}
              >

                <div className="nexa-look-image">

                  {!imageErrors.includes(index) ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      loading={index < 3 ? "eager" : "lazy"}
                      draggable="false"
                      onError={() =>
                        handleImageError(index)
                      }
                    />
                  ) : (
                    <div className="nexa-image-fallback">
                      <span>ShopNexa</span>
                    </div>
                  )}

                </div>

                <div className="nexa-look-overlay">

                  <div className="nexa-look-text">
                    <span className="nexa-look-label">
                      EXPLORE COLLECTION
                    </span>

                    <h3>{item.title}</h3>
                  </div>

                  <span className="nexa-look-arrow">
                    <ArrowUpRight size={21} />
                  </span>

                </div>

              </Link>
            ))}

          </div>

          {/* DUPLICATE GROUP FOR SEAMLESS LOOP */}

          <div
            className="nexa-marquee-group"
            aria-hidden="true"
          >

            {trendingCollections.map((item) => (
              <Link
                to="/products"
                className="nexa-look"
                key={`duplicate-${item.title}`}
                tabIndex={-1}
              >

                <div className="nexa-look-image">

                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    draggable="false"
                  />

                </div>

                <div className="nexa-look-overlay">

                  <div className="nexa-look-text">
                    <span className="nexa-look-label">
                      EXPLORE COLLECTION
                    </span>

                    <h3>{item.title}</h3>
                  </div>

                  <span className="nexa-look-arrow">
                    <ArrowUpRight size={21} />
                  </span>

                </div>

              </Link>
            ))}

          </div>

        </div>

      </div>

      {/* BOTTOM DESCRIPTION */}

      <div className="nexa-trending-footer">
        <span className="nexa-trending-line" />

        <p>
          FIND YOUR STYLE. MAKE IT YOURS.
        </p>

        <span className="nexa-trending-line" />
      </div>

    </section>
  );
}
