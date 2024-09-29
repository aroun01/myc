export default function Image({ src, ...rest }) {
  let imageUrl;

  if (typeof src === 'string') {
    // Обработка строковых URL-адресов
    imageUrl = src.startsWith('http://') || src.startsWith('https://')
      ? src
      : `http://tnttest.ru:4000${src.startsWith('/') ? '' : '/'}${src}`;
  } 
  else if (src && typeof src === 'object') {
    // Обработка объектов с полем url
    if ('url' in src) {
      imageUrl = src.url.startsWith('http://') || src.url.startsWith('https://')
        ? src.url
        : `/api/${src.url.startsWith('/') ? '' : '/uploads/'}${src.url}`;
    } else {
      console.error("Unrecognized object structure for 'src'", src);
      return null;
    }
  } 
  else {
    console.error("Unrecognized type for 'src'", src);
    return null;
  }

  return (
    <img {...rest} src={imageUrl} alt={''} />
  );
}
