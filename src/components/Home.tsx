import React from 'react';
import Navbar from './NavBar';
import MainContainer from './MainContainer';
import Footer from './Footer';
import './css/index.css';
const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <MainContainer />
      <Footer />
    </>
  );
};

export default Home;
