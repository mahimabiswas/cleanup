import { useEffect, useMemo } from 'react';

// Dashed upload box with a preview of the chosen photo.
export default function PhotoInput({ id, label, file, onChange }) {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => url && URL.revokeObjectURL(url), [url]);

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="drop">
        {url ? <img className="ph" src={url} alt="Preview of your photo" /> : <p className="muted">Take a photo or choose one from your device.</p>}
        <input id={id} type="file" accept="image/*" onChange={onChange} />
      </div>
    </div>
  );
}
