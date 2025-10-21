module.exports = function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}
