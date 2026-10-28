import { useEffect, useRef, useState } from "react";
import { imageUrl } from "../services/boards";

// Pide una URL temporal por cada imagen privada que aparece en la pizarra
export function useImageUrls(items) {
  const [urls, setUrls] = useState({});
  const asked = useRef(new Set());

  useEffect(() => {
    for (const { image_path: path } of items) {
      if (!path || asked.current.has(path)) continue;
      asked.current.add(path);
      imageUrl(path).then(({ data }) => data && setUrls((u) => ({ ...u, [path]: data })));
    }
  }, [items]);

  return urls;
}
