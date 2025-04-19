export const notFound = (req, res, next) => {
    res.status(404).json({ success: false, message: "Not Found" });
};

export const errorHandler = (err, req, res, next) => {
    res.status(500).json({ success: false, message: err.message });
}