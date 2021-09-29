import jsonpath from 'jsonpath';

export function prune(obj: any, path: string) {
  obj = Array.isArray(obj) ? obj.slice() : Object.assign({}, obj);
  if (typeof(path) !== 'string') {
    throw new Error('json path must be string');
  }
  if (path !== '') {
    const paths = jsonpath.paths(obj, path).map(path => path.slice(1));
    paths.forEach(path => {
      const expression = jsonpath.stringify(['$', ...path]);
      const parent = jsonpath.parent(obj, expression);
      const [key] = path.slice(-1);
      if (Array.isArray(parent) && typeof(key) === 'number') {
        parent.splice(key, 1);
      } else {
        delete parent[key];
      }
    });
  }
  return obj;
}

export function pick(obj: any, path: string): Array<any> {
  if (typeof(path) !== 'string' || path === "") {
    throw new Error('json path must be not empty string');
  }
  const nodes = jsonpath.nodes(obj, path);
  return nodes.map(node => node.value);
}
