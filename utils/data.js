/**
 * @param {function} getField - function to get field from each element
 * @param {boolean} desc - descending
 */
export const sortBy = (getField, desc) => {
  return (a, b) => {
    const valA = getField(a);
    const valB = getField(b);
    const sortIdx = desc ? 1 : -1;
    return valB > valA ? sortIdx : valB === valA ? 0 : -sortIdx;
  };
};
