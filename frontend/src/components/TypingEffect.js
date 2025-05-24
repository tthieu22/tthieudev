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
      parts.push({ type: "bold", content: match[1] });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ type: "text", content: text.slice(lastIndex) });
    }

    return parts;
  };

  useEffect(() => {
    let isCancelled = false;

    const parsed = parseText(text);
    const flatChars = [];
    parsed.forEach((part) => {
      Array.from(part.content).forEach((char) => {
        flatChars.push({ char, type: part.type });
      });
    });

    const runTyping = async () => {
      setDisplayedElements([]); // Reset trước khi bắt đầu

      for (let i = 0; i < flatChars.length; i++) {
        if (isCancelled) return;
        setDisplayedElements((prev) => [...prev, flatChars[i]]);
        await new Promise((resolve) => setTimeout(resolve, speed));
      }

      if (onComplete) onComplete();
    };

    runTyping();

    return () => {
      isCancelled = true;
    };
  }, [text, speed, onComplete]);

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
