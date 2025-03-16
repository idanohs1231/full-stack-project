const Footer = () => {
    return (
      <footer className="bg-secondary text-light text-center py-3 mt-4">
        <div className="container">
          <h5 className="fw-bold">🌿 חנות מוצרי הבריאות</h5>
          <p className="mb-3">המקום המוביל למוצרי בריאות, תוספי תזונה וציוד כושר</p>
  
          {/* 🔗 קישורים שימושיים */}
          <div className="d-flex justify-content-center mb-3">
            <a href="/about" className="text-white mx-3 text-decoration-none">📌 אודות</a>
            <a href="/contact" className="text-white mx-3 text-decoration-none">📩 צור קשר</a>
            <a href="/terms" className="text-white mx-3 text-decoration-none">📜 תנאי שימוש</a>
          </div>
  
          {/* 📱 רשתות חברתיות */}
          <div className="mb-3">
            <a href="https://facebook.com" className="text-white mx-2 fs-5"><i className="bi bi-facebook"></i></a>
            <a href="https://instagram.com" className="text-white mx-2 fs-5"><i className="bi bi-instagram"></i></a>
            <a href="https://twitter.com" className="text-white mx-2 fs-5"><i className="bi bi-twitter"></i></a>
            <a href="https://t.me" className="text-white mx-2 fs-5"><i className="bi bi-telegram"></i></a>
          </div>
  
          {/* 📞 יצירת קשר */}
          <p className="mb-1">📞 054-9411442 | 📧 idancareplus.store@gmail.com</p>
          
          {/* 👨‍💻 קרדיט */}
          <p className="mt-3 small">
            © 2025 כל הזכויות שמורות
          </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  