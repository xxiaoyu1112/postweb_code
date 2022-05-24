const MathUtil = {};
MathUtil.argSort = (elements, func) => {
    const myMap = new Map();
    elements.forEach((value, index) => {
        myMap.set(index, value);
    });
    const arrayWithOrderedIndexes = Array.from(myMap.entries()).sort(func);
    myMap.clear();
    return arrayWithOrderedIndexes.map(elem => elem[0]);
}
export default MathUtil;