import React from "react";

const About = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center fw-bold mb-4">📌 אודות חנות מוצרי הבריאות</h1>

      <div className="row">
        {/* ✨ טקסט ותיאור */}
        <div className="col-md-6">
          <p className="lead">
            חנות מוצרי הבריאות שלנו נועדה לספק לך את **המוצרים האיכותיים ביותר** בתחום הבריאות,
            תוספי תזונה, וציוד כושר – הכל במקום אחד!
          </p>
          <p>
            אנו מאמינים כי הבריאות שלך היא **הנכס החשוב ביותר**, ולכן אנו מקפידים על **סטנדרטים גבוהים**,
            שירות אישי ומוצרים איכותיים בלבד.
          </p>
        </div>

        {/* 🎨 עיצוב עם Bootstrap */}
        <div className="col-md-6 text-center">
          <img
            src="https://cdn.pixabay.com/photo/2014/08/15/06/16/imprint-418594_1280.jpg"
            alt="About us"
            className="img-fluid rounded shadow"
          />
        </div>
      </div>

      {/* 📞 מידע נוסף */}
      <div className="text-center mt-5">
        <h3>📞 צור קשר</h3>
        <p>📧 דוא"ל: idancareplus.store@gmail.com</p>
        <p>📞 טלפון: 054-9411442</p>
        <p>🏢 כתובת: רחוב הבריאות 10, תל אביב</p>
      </div>
    </div>
  );
};

export default About;
