const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="container-content">
      <div className="footer">
        © {currentYear} BooxClash-An Interactive Educational Platform. All Rights Reserved.
      </div>
    </div>

  )
}

export default Footer