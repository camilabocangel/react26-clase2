const nums = [1, 2, 3, 4, 5];

export const doubles = nums.map((num) => {
  return num * 2;
});

export const res = doubles.slice(3, 6);

const array = Array<number>(6);
array.fill(3);