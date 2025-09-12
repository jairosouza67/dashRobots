import React, { useState } from "react";

const challenges = [
  { id: 1, title: "Respire 5 vezes por dia", goal: 5, type: "breathing" },
  { id: 2, title: "Medite 3 dias seguidos", goal: 3, type: "meditation" }
];

export const ChallengeWidget: React.FC = () => {
  const [progress, setProgress] = useState<{ [id: number]: number }>({});

  const complete = (id: number) => setProgress(p => ({ ...p, [id]: (p[id] || 0) + 1 }));

  return (
    <div>
      <h3>Desafios</h3>
      {challenges.map(ch => (
        <div key={ch.id}>
          <span>{ch.title}</span>
          <progress value={progress[ch.id] || 0} max={ch.goal} />
          <button onClick={() => complete(ch.id)}>Marcar progresso</button>
        </div>
      ))}
    </div>
  );
};