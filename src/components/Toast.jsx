import { useEffect } from 'react';

export default function Toast({ message, visible, onDismiss }) {
  useEffect(() => {
    if (!visible || !message) return;
    const t = setTimeout(onDismiss, 2000);
    return () => clearTimeout(t);
  }, [visible, message, onDismiss]);

  if (!visible || !message) return null;

  return (
    <div className="kn-toast" role="status">
      {message}
    </div>
  );
}
