# 📌 E-commerce Health Store עידן דוד

✅ **פרויקט חנות אינטרנטית למכירת מוצרי בריאות**  
🔗 **פותח באמצעות: React (Frontend) + Node.js & Express (Backend) + MongoDB (Database)**  

---

## **📜 תוכן העניינים**
1. [תיאור הפרויקט](#-תיאור-הפרויקט)
2. [טכנולוגיות](#-טכנולוגיות)
3. [התקנה והפעלה](#-התקנה-והפעלה)
4. [מבנה הפרויקט](#-מבנה-הפרויקט)
5. [API Routes](#-api-routes)
6. [תכונות עיקריות](#-תכונות-עיקריות)
7. [חיבור למסד הנתונים (MongoDB)](#-חיבור-למסד-הנתונים-mongodb)
8. [פרטי התחברות למערכת (Tester)](#-פרטי-התחברות-למערכת-tester)

---

## **📌 תיאור הפרויקט**
הפרויקט הוא **חנות מקוונת למוצרי בריאות** שמאפשר למשתמשים:
- **לגלוש ולחפש מוצרים** לפי קטגוריות
- **לרכוש מוצרים** ולנהל עגלת קניות
- **להשאיר ביקורות** ולדרג מוצרים
- **להירשם ולהתחבר** לחשבון אישי
- **לנהל חנות** (למנהלים בלבד)

---

## **🛠️ טכנולוגיות**
🔹 **Frontend (צד לקוח)**
- React.js (עם React Router)
- Bootstrap 5
- CSS מותאם אישית
- emailJS (לשליחת מיילים מהאתר)
- **Regex ולידציות ידניות** - לווידוא תקינות נתונים כגון כתובות אימייל, מספרי טלפון וסיסמאות לפני שליחתן לשרת.



🔹 **Backend (צד שרת)**
- Node.js + Express.js
- MongoDB + Mongoose (ORM לניהול מסד נתונים)
- JSON Web Token (JWT) + bcrypt (אבטחה ואימות משתמשים)
- Multer (העלאת תמונות)
- Morgan (לרישום בקשות HTTP)
- **Joi** - לביצוע ולידציות בצד השרת על הנתונים הנשלחים, למשל בטפסי הרשמה והתחברות.
- **Logger (winston/morgan)** - לניהול לוגים בצורה נוחה ושימושית למעקב אחר בקשות ושגיאות.
- **CORS** - מתן גישה ל-API משירותים חיצוניים ודפדפנים על ידי הגדרת הרשאות גישה נכונות.

🔹 **Database (מסד נתונים)**
- **MongoDB Atlas** (שרת חיצוני)  
- **MongoDB Compass** (בדיקות מקומיות)

---

## **💾 התקנה והפעלה**
1. **שכפול (Clone) של הפרויקט:**
   ```bash
 git clone https://github.com/idanohs1231/full-stack-project.git
cd full-stack-project
   ```

2. **התקנת התלויות** (Frontend + Backend):
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. **הגדרת קובץ `.env` בשרת:**
   ```plaintext
   PORT=5050
   MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
   MONGO_ATLAS_URI=mongodb+srv://tester:Test1234@cluster0.71zfm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_jwt_secret
   ```

4. **הפעלת הפרויקט**  
   - **שרת:**  
     ```bash
     cd server
     npm start
     ```
   - **לקוח:**  
     ```bash
     cd client
     npm start
     ```



דריסת פורט 
netstat -ano | findstr :5050
taskkill /PID !!!!! /F

---

## **🔗 API Routes**
### 🛍️ **מוצרים (Products)**
- `GET /api/products` - קבלת רשימת כל המוצרים
- `GET /api/products/:id` - קבלת מוצר לפי ID
- `POST /api/products` - הוספת מוצר חדש (Admin)
- `PUT /api/products/:id` - עדכון מוצר קיים (Admin)
- `DELETE /api/products/:id` - מחיקת מוצר (Admin)

### 🛒 **הזמנות (Orders)**
- `POST /api/orders` - יצירת הזמנה חדשה
- `GET /api/orders/:id` - קבלת פרטי הזמנה

### 👤 **משתמשים (Users)**
- `POST /api/users/register` - יצירת משתמש חדש
- `POST /api/users/login` - התחברות משתמש
- `GET /api/users/profile` - קבלת פרטי המשתמש

---

## **✨ תכונות עיקריות**
✔ **ניהול חנות מקוונת** - הצגת מוצרים, עגלת קניות והזמנות  
✔ **אימות משתמשים עם JWT** - הרשמה, התחברות, תפקידי Admin  
✔ **ניהול מוצרים** - הוספה, עדכון ומחיקה למנהלים  
✔ **חיבור למסד נתונים MongoDB** - אפשרות לעבודה בשרת מקומי או ב-Atlas  
✔ **שליחת מיילים עם EmailJS** - טופס יצירת קשר  
✔ **תמיכה במצב כהה/בהיר** - שימוש ב-Bootstrap Theme  


---

## **🛠️ חיבור למסד הנתונים (MongoDB)**
הפרויקט **תומך בשתי אפשרויות חיבור למסד הנתונים**:
1. **MongoDB מקומי (MongoDB Compass)**
   - עובד על `mongodb://127.0.0.1:27017/ecommerce`
2. **MongoDB Atlas (ענן)**
   - כתובת `MONGO_ATLAS_URI` (בקובץ `.env`)

---

## **👤 פרטי התחברות למערכת (אדמין)**
> 🔑 **משתמש לבדיקה עבור הבוחן**
```
אימייל: idanohs1231@gmail.com
סיסמה: Idanohs1231@@   (ה@@ אחרי ה1231 שים לב אות ראשונה גדולה או שניתן לשנות לאדמין דרך מונגו במשתמש רגיל)
```
- **משתמש זה מוגדר כ-Admin** ויכול לנהל מוצרים והזמנות.

