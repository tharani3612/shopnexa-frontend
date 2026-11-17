
import { Link } from "react-router-dom";
import "./CategoryCard.css";

function CategoryCard({
  title,
  image,
  category,
  description,
  itemCount,
}) {
  const categoryLink = `/products?category=${encodeURIComponent(
    category || title
  )}`;

  return (
    <Link to={categoryLink} className="category-card">
      <div className="category-card-image">
        <img
          src={image}
          alt={title}
          loading="lazy"
        />

        <span className="category-card-arrow" aria-hidden="true">
          ↗
        </span>
      </div>

      <div className="category-card-content">
        <div>
          <h3>{title}</h3>

          {description && (
            <p className="category-card-description">
              {description}
            </p>
          )}

          {itemCount !== undefined && (
            <span className="category-card-count">
              {itemCount} products
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default CategoryCard;
