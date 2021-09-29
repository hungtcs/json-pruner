import unset from 'lodash.unset';
import jsonpath from 'jsonpath';

export function prune<T=any, R=any>(obj: T, path: string): R {
  obj = Object.assign({}, obj);
  if(typeof(path) !== 'string') {
    throw new Error('json path must be string');
  }
  if(path !== '') {
    const paths = jsonpath.paths(obj, path).map(path => path.slice(1));
    paths.forEach(path => unset(obj, path));
  }
  return obj as unknown as R;
}
