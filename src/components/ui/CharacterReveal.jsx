import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const CharacterRevealText = ({ text, className, reduceMotion }) => {
  const characters = Array.from(text);
  const [visibleCount, setVisibleCount] = useState(() => reduceMotion ? characters.length : 0);
  const [isTyping, setIsTyping] = useState(() => !reduceMotion && characters.length > 0);

  useEffect(() => {
    if (reduceMotion || characters.length === 0) return;

    let shownCount = 0;
    let cursorFadeTimeout;
    const revealInterval = window.setInterval(() => {
      shownCount += 1;
      setVisibleCount(shownCount);

      if (shownCount >= characters.length) {
        window.clearInterval(revealInterval);
        cursorFadeTimeout = window.setTimeout(() => setIsTyping(false), 240);
      }
    }, 42);

    return () => {
      window.clearInterval(revealInterval);
      window.clearTimeout(cursorFadeTimeout);
    };
  }, [text, reduceMotion, characters.length]);

  const segments = text.match(/\s+|\S+/g) ?? [];

  return (
    <p className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {segments.map((segment, segmentIndex) => {
          const segmentCharacters = Array.from(segment);
          const segmentStart = segments
            .slice(0, segmentIndex)
            .reduce((offset, previousSegment) => offset + Array.from(previousSegment).length, 0);
          const visibleCharacters = Math.max(
            0,
            Math.min(segmentCharacters.length, visibleCount - segmentStart)
          );

          if (/^\s+$/.test(segment)) {
            return visibleCharacters > 0 ? segment : null;
          }

          return (
            <span key={segmentIndex} className="inline-block whitespace-nowrap">
              {segmentCharacters.slice(0, visibleCharacters).map((character, index) => (
                <motion.span
                  key={segmentStart + index}
                  initial={reduceMotion
                    ? { opacity: 1, y: 0, filter: "blur(0px)" }
                    : { opacity: 0, y: 2, filter: "blur(2px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.18, ease: "easeOut" }}
                  className="inline-block"
                >
                  {character}
                </motion.span>
              ))}
            </span>
          );
        })}
        <motion.span
          aria-hidden="true"
          initial={{ opacity: isTyping ? 1 : 0 }}
          animate={isTyping ? { opacity: [1, 0] } : { opacity: 0 }}
          transition={isTyping && !reduceMotion
            ? { duration: 0.72, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.22, ease: "easeOut" }}
          className="ml-1 inline-block h-[1.05em] w-[2px] rounded-full bg-[#B86A50] align-[-0.14em]"
        />
      </span>
    </p>
  );
};

const CharacterReveal = ({ text, className }) => {
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = prefersReducedMotion === true;

  return (
    <CharacterRevealText
      key={`${text}-${reduceMotion}`}
      text={text}
      className={className}
      reduceMotion={reduceMotion}
    />
  );
};

export { CharacterReveal };
