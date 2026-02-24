import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import './CardSwap.css';

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const CardSwap = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  onCardChange,
  skewAmount = 6,
  easing = 'elastic',
  children
}) => {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));

  const tlRef = useRef(null);
  const intervalRef = useRef();
  const container = useRef(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      // Update order immediately when promote starts so hover uses correct positions
      tl.call(() => {
        order.current = [...rest, front];
        onCardChange?.(rest[0]);
      }, undefined, 'promote');
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

    };
    // Delay first swap so cards are immediately interactable
    const initialDelay = setTimeout(() => {
      swap();
      intervalRef.current = window.setInterval(swap, delay);
    }, 1500);

    const cleanupInitial = () => clearTimeout(initialDelay);

    if (pauseOnHover) {
      const node = container.current;
      const pause = () => {
        // Kill the current animation and reset cards to their positions
        if (tlRef.current) {
          tlRef.current.kill();
          tlRef.current = null;
        }
        clearInterval(intervalRef.current);
        // Reset all cards to their correct positions
        order.current.forEach((cardIdx, stackPos) => {
          const el = refs[cardIdx]?.current;
          if (el) {
            const slot = makeSlot(stackPos, cardDistance, verticalDistance, refs.length);
            gsap.set(el, { x: slot.x, y: slot.y, z: slot.z, zIndex: slot.zIndex });
          }
        });
      };
      const resume = () => {
        // Start fresh swap cycle
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      return () => {
        cleanupInitial();
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        clearInterval(intervalRef.current);
      };
    }
    return () => {
      cleanupInitial();
      clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

  const hoveredCard = useRef(null);
  const hoverTweens = useRef({});

  const isSwapAnimationPlaying = () => {
    if (!tlRef.current) return false;
    // Check if active OR if paused mid-animation
    if (tlRef.current.isActive()) return true;
    // If paused and not at the end, cards are in mid-animation positions
    if (tlRef.current.paused() && tlRef.current.progress() < 1) return true;
    return false;
  };

  const getCardSlotY = (cardIndex) => {
    const positionInStack = order.current.indexOf(cardIndex);
    if (positionInStack === -1) return null;
    return makeSlot(positionInStack, cardDistance, verticalDistance, refs.length).y;
  };

  const handleMouseEnter = (i) => {
    // Don't allow hover during swap animation
    if (isSwapAnimationPlaying()) return;

    // If already hovering this card, do nothing
    if (hoveredCard.current === i) return;

    // Reset previous hovered card immediately
    if (hoveredCard.current !== null) {
      const prevIndex = hoveredCard.current;
      const prevEl = refs[prevIndex]?.current;
      if (prevEl) {
        // Kill any existing tween on this card
        if (hoverTweens.current[prevIndex]) {
          hoverTweens.current[prevIndex].kill();
        }
        const prevY = getCardSlotY(prevIndex);
        if (prevY !== null) {
          gsap.set(prevEl, { y: prevY });
        }
      }
    }

    hoveredCard.current = i;
    const el = refs[i].current;
    if (!el) return;

    const slotY = getCardSlotY(i);
    if (slotY === null) return;

    // Kill any existing tween on this card
    if (hoverTweens.current[i]) {
      hoverTweens.current[i].kill();
    }

    // Animate up
    hoverTweens.current[i] = gsap.to(el, {
      y: slotY - 15,
      duration: 0.15,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = (i) => {
    // Don't process during swap animation
    if (isSwapAnimationPlaying()) {
      hoveredCard.current = null;
      return;
    }

    // Only reset if this is the currently hovered card
    if (hoveredCard.current !== i) return;

    hoveredCard.current = null;
    const el = refs[i]?.current;
    if (!el) return;

    const slotY = getCardSlotY(i);
    if (slotY === null) return;

    // Kill any existing tween
    if (hoverTweens.current[i]) {
      hoverTweens.current[i].kill();
    }

    // Animate back
    hoverTweens.current[i] = gsap.to(el, {
      y: slotY,
      duration: 0.15,
      ease: 'power2.out'
    });
  };

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onMouseEnter: () => handleMouseEnter(i),
          onMouseLeave: () => handleMouseLeave(i),
          onClick: e => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          }
        })
      : child
  );

  return (
    <div ref={container} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  );
};

export default CardSwap;
