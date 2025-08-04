import React, { useEffect, useState } from 'react';
import {
  Header,
  HeroCarousel,
  FeaturedItems,
  CategorySection,
  HowItWorks,
  Footer
} from '../components/HomeLayout';

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [location, setLocation] = useState("");

 useEffect(() => {
  const url = location
    ? `/api/items/featured?location=${encodeURIComponent(location)}`
    : '/api/items/featured';

  fetch(url)
    .then(res => res.json())
    .then(data => setFeaturedItems(Array.isArray(data) ? data : []))
    .catch(err => console.error("Failed to fetch featured items", err));


    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to fetch categories", err));
  }, [location]);

  return (
    <>
      <Header location={location} setLocation={setLocation} />
      <HeroCarousel />
      <FeaturedItems items={featuredItems} location={location} />
      <CategorySection categories={categories} />
      <HowItWorks />
      <Footer />
    </>
  );
};

export default Home;


