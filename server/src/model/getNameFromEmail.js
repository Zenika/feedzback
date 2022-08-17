export default function getNameFromEmail(email) {
  const parts = email.split('@');
  const username = parts[0];
  const delimetres = ['.', '-', '_'];
  let fname = '';
  let lname = '';
  delimetres.forEach(splittingLoop);

  /**
   * Extract the first and second name from a given email
   * @param {String} element
   * @return {String} fullname
   */
  // eslint-disable-next-line require-jsdoc
  function splittingLoop(element) {
    const partsName = username.replace(/\d+/g, '');
    const num = partsName.indexOf(element);
    if (num > -1) {
      fname = partsName.substring(0, num);
      lname = partsName.substring(num + 1, partsName.length);
      fname = fname.charAt(0).toUpperCase() + fname.slice(1);
      lname = lname.charAt(0).toUpperCase() + lname.slice(1);
    }
  }
  return fname + ' ' + lname;
}
