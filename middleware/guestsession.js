const cookieParser = require("cookie-parser");

const guestsession = (req, res, next) => {
  if (!req.cookies.guest_id) {
    const guestId = Math.random().toString(36).substring(2, 9);
    res.cookie("guest_id", guestId, { maxAge: 60 * 60 * 1000, httpOnly: false,secure: true,
      sameSite: "Lax", });
    req.guestId = guestId;
  } else {
    req.guestId = req.cookies.guest_id;
  }
  next();
};

module.exports = guestsession;