import React from "react";

const contents = [
  { id: 1, type: "text", title: "O que é mindfulness?", content: "Mindfulness é..." },
  { id: 2, type: "audio", title: "Áudio: Respiração guiada", url: "/audios/respiracao.mp3" },
  { id: 3, type: "video", title: "Vídeo: Técnicas de relaxamento", url: "https://youtube.com/..." }
];

export const ContentLibrary: React.FC = () => (
  <div>
    <h2>Biblioteca</h2>
    {contents.map(item => (
      <div key={item.id}>
        <h4>{item.title}</h4>
        {item.type === "text" && <p>{item.content}</p>}
        {item.type === "audio" && <audio controls src={item.url} />}
        {item.type === "video" && <a href={item.url} target="_blank" rel="noopener noreferrer">Assistir vídeo</a>}
      </div>
    ))}
  </div>
);