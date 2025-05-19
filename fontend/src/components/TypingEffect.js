import React, { useState, useEffect } from "react";

const TypingEffect = ({ text, speed = 20, onComplete }) => {
  const [displayedElements, setDisplayedElements] = useState([]);

  const parseText = (text) => {
    const parts = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
      }
      parts.push({ type: "bold", content: match[1] }); // bỏ dấu **
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ type: "text", content: text.slice(lastIndex) });
    }

    return parts;
  };

  useEffect(() => {
    const parsed = parseText(text);

    // Tách thành từng ký tự để hiện dần
    const flatChars = [];
    parsed.forEach((part) => {
      part.content.split("").forEach((char) => {
        flatChars.push({ char, type: part.type });
      });
    });

    let i = 0;
    const interval = setInterval(() => {
      if (i < flatChars.length) {
        setDisplayedElements((prev) => [...prev, flatChars[i]]);
        i++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  // Gộp các ký tự cùng type lại thành đoạn text hoặc đoạn bold
  const grouped = displayedElements.reduce((acc, item) => {
    if (!item) return acc;
    const last = acc[acc.length - 1];
    if (!last || last.type !== item.type) {
      acc.push({ type: item.type, content: item.char });
    } else {
      last.content += item.char;
    }
    return acc;
  }, []);

  return (
    <p>
      {grouped.map((item, idx) =>
        item.type === "bold" ? (
          <strong key={idx}>{item.content}</strong>
        ) : (
          <span key={idx}>{item.content}</span>
        )
      )}
    </p>
  );
};

export default TypingEffect;
