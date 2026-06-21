
export const isVendorOrAdmin = (req, res, next) => {
  console.log(req.user.role);
    if (req.user.role !== "vendor" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only vendors or admin are allowed to perform this action" });
    }
    next();
  };
  