/* GET */
exports.status_get = (req, res, next) => {
  res.status(200).send("OK");
}