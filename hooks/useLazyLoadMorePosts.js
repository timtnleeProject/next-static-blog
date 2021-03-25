import { useEffect } from "react";

const useLazyLoadMorePosts = ({
  ref,
  onResponse, // fn
  start,
  length,
  onDone,
}) => {
  useEffect(() => {
    const el = ref.current;

    if (el) {
      let total = start;
      let onViewPort = false;
      let processing = false;
      const append = () => {
        fetch(`/api/post?start=${total}&length=${length}`)
          .then((res) => res.json())
          .then((newPosts) => {
            total += newPosts.length;
            onResponse(newPosts);
            if (newPosts.length < length) {
              console.log("STOP LOAD MORE");
              observer.unobserve(el);
              onDone?.(true);
              return;
            }
            if (onViewPort) {
              append();
            } else {
              console.log("STOP");
              processing = false;
            }
          })
          .catch(() => {});
      };
      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        onViewPort = entry.isIntersecting;
        if (processing) return;
        if (entry.isIntersecting) {
          processing = true;
          append();
        }
      });
      observer.observe(el);
      return () => {
        observer.unobserve(el);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useLazyLoadMorePosts;
