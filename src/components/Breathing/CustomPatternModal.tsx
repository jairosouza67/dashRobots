import React, { useState } from "react";

interface CustomPattern {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  rest: number;
}

export const CustomPatternModal: React.FC<{ onSave: (pattern: CustomPattern) => void; onClose: () => void; }> = ({ onSave, onClose }) => {
  const [pattern, setPattern] = useState<CustomPattern>({ name: "", inhale: 4, hold: 4, exhale: 4, rest: 4 });

  return (
    <div className="modal">
      <h2>Criar Padrão Personalizado</h2>
      <input placeholder="Nome" value={pattern.name} onChange={e => setPattern({ ...pattern, name: e.target.value })} />
      <label>Inspire (seg): <input type="number" value={pattern.inhale} min={1} onChange={e => setPattern({ ...pattern, inhale: +e.target.value })} /></label>
      <label>Segure (seg): <input type="number" value={pattern.hold} min={0} onChange={e => setPattern({ ...pattern, hold: +e.target.value })} /></label>
      <label>Expire (seg): <input type="number" value={pattern.exhale} min={1} onChange={e => setPattern({ ...pattern, exhale: +e.target.value })} /></label>
      <label>Descanse (seg): <input type="number" value={pattern.rest} min={0} onChange={e => setPattern({ ...pattern, rest: +e.target.value })} /></label>
      <button onClick={() => onSave(pattern)}>Salvar</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
};