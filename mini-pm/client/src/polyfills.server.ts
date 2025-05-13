const g: any = globalThis as any;

if (typeof g.window === 'undefined') {
  g.window = {};
}

if (typeof g.document === 'undefined') {
  g.document = {
    createElement:      () => ({ style: {} }),
    getElementsByTagName: () => [],
    body:               {},
  };
}

if (typeof g.navigator === 'undefined') {
  g.navigator = { userAgent: 'Node' };
}

if (typeof g.CSS === 'undefined') {
  g.CSS = null;
}

if (typeof g.DOMTokenList === 'undefined') {
  g.DOMTokenList = class DOMTokenList {};
}