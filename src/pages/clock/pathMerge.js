/**
 * 合并相邻的路线
 */
import { flatten, last, tail, isEqual } from 'lodash';

function formatPath(path, dataPond) {
  if (!dataPond) {
    dataPond = tail(path);
    path = path[0];
  }
  if (!dataPond.length) return [path];

  const headPoint = path[0];
  const lastPoint = last(path);

  const index = dataPond.findIndex(paths => paths.find(point => isEqual(point, headPoint))
    || paths.find(point => isEqual(point, lastPoint)));

  if (index <= -1) return [path].concat(formatPath(dataPond));
  const target = dataPond[index];

  if (isEqual(lastPoint, target[0])) path = path.concat(tail(target));
  else if (isEqual(headPoint, last(target))) path = target.concat(tail(path));
  else if (isEqual(lastPoint, last(target))) path = path.concat(tail(target.reverse()));
  else if (isEqual(headPoint, target[0])) path = target.reverse().concat(tail(path));
  else {
    let index = target.findIndex(point => isEqual(point, headPoint));
    if (index <= -1) {
      index = target.findIndex(point => isEqual(point, lastPoint));
      path.reverse();
    }
    target.splice(index, 1, [...path, ...tail(path.reverse())]);
    path = flatten(target);
  }

  return formatPath(path, dataPond.filter((row, $index) => $index !== index));
}

export default function (params) {
  const result = formatPath(params);
  return formatPath(result);
}
