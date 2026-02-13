import gsap from "gsap"

export const easings = {
  elastic: {
    out: (amplitude: number = 1, period: number = 0.6) => 
      `elastic.out(${amplitude}, ${period})`,
    inOut: (amplitude: number = 1, period: number = 0.6) => 
      `elastic.inOut(${amplitude}, ${period})`,
  },
  back: {
    out: (overshoot: number = 1.7) => `back.out(${overshoot})`,
    inOut: (overshoot: number = 1.7) => `back.inOut(${overshoot})`,
  },
  power: {
    out: "power2.out" as const,
    inOut: "power2.inOut" as const,
    out3: "power3.out" as const,
  },
  smooth: [0.16, 1, 0.3, 1] as unknown as gsap.Ease,
}

export const durations = {
  entrance: 0.8,
  transition: 0.4,
  micro: 0.2,
  breathing: 3,
  puppetPose: 0.5,
  tokenFlight: 0.6,
  confetti: 0.8,
}

export function createTokenFlight(
  token: gsap.TweenTarget,
  targetX: number,
  targetY: number,
  options?: {
    delay?: number
    onComplete?: () => void
  }
): gsap.core.Timeline {
  const tl = gsap.timeline({ delay: options?.delay })
  
  tl.to(token, {
    x: targetX,
    y: targetY,
    scale: 1.3,
    duration: durations.tokenFlight * 0.6,
    ease: easings.back.out(1.5),
  })
  .to(token, {
    scale: 1,
    duration: durations.tokenFlight * 0.4,
    ease: easings.elastic.out(0.8, 0.4),
  })
  
  if (options?.onComplete) {
    tl.eventCallback("onComplete", options.onComplete)
  }
  
  return tl
}

export function createPoseTransform(
  val: gsap.TweenTarget,
  tino: gsap.TweenTarget,
  pose: "holding-hands" | "peekaboo" | "high-five" | "hugging",
  container?: gsap.TweenTarget
): gsap.core.Timeline {
  const tl = gsap.timeline()
  
  const poseConfigs = {
    "holding-hands": {
      val: { x: 25, y: 0, rotation: 12, duration: durations.puppetPose },
      tino: { x: -25, y: 0, rotation: -12, duration: durations.puppetPose },
    },
    "peekaboo": {
      val: { x: -15, y: 0, rotation: -5, scale: 0.9, duration: durations.puppetPose },
      tino: { x: 5, y: 0, rotation: 8, duration: durations.puppetPose },
    },
    "high-five": {
      val: { x: 10, y: -25, rotation: -15, duration: durations.puppetPose * 0.5 },
      tino: { x: -10, y: -25, rotation: 15, duration: durations.puppetPose * 0.5 },
    },
    "hugging": {
      val: { x: 20, y: 0, rotation: 15, duration: durations.puppetPose },
      tino: { x: -20, y: 0, rotation: -15, duration: durations.puppetPose },
    },
  }
  
  const config = poseConfigs[pose]
  
  if (pose === "high-five") {
    tl.to([val, tino], {
      y: -30,
      duration: 0.15,
      ease: "power2.out",
    })
    .to([val, tino], {
      y: 0,
      duration: 0.1,
      ease: "power2.in",
    })
    
    if (container) {
      tl.to(container, {
        x: 4,
        duration: 0.05,
      }, "-=0.05")
      .to(container, { x: -4, duration: 0.05 })
      .to(container, { x: 2, duration: 0.03 })
      .to(container, { x: 0, duration: 0.02 })
    }
  } else {
    tl.to(val, {
      ...config.val,
      ease: easings.back.out(1.2),
    })
    .to(tino, {
      ...config.tino,
      ease: easings.back.out(1.2),
    }, "<")
  }
  
  return tl
}

export function createConfettiBurst(
  container: HTMLElement | null,
  count: number = 20,
  options?: {
    colors?: string[]
    delay?: number
  }
): gsap.core.Timeline {
  const tl = gsap.timeline({ delay: options?.delay })
  const colors = options?.colors || ["#E63946", "#FFB5BA", "#FFD700", "#4ECDC4"]
  
  if (!container) return tl
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div")
    particle.style.cssText = `
      position: absolute;
      width: ${4 + Math.random() * 8}px;
      height: ${4 + Math.random() * 8}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
      left: 50%;
      top: 50%;
      pointer-events: none;
    `
    
    container.appendChild(particle)
    
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
    const distance = 100 + Math.random() * 100
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance - 50
    
    tl.to(particle, {
      x,
      y,
      rotation: Math.random() * 720 - 360,
      opacity: 0,
      scale: 0,
      duration: durations.confetti + Math.random() * 0.4,
      ease: "power2.out",
      onComplete: () => particle.remove(),
    }, 0)
  }
  
  return tl
}

export function createHeartBurst(
  container: HTMLElement | null,
  count: number = 12
): gsap.core.Timeline {
  const tl = gsap.timeline()
  
  if (!container) return tl
  
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div")
    heart.innerHTML = `<svg viewBox="0 0 20 18" width="16" height="14">
      <path d="M 10 16 L 8.5 14.5 C 3 9.5 0 6.5 0 3.5 C 0 1.5 1.5 0 3.5 0 C 5.5 0 7 1 8 2.5 C 9 1 10.5 0 12.5 0 C 14.5 0 16 1.5 16 3.5 C 16 6.5 13 9.5 7.5 14.5 L 10 16 Z" fill="#E63946"/>
    </svg>`
    heart.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      opacity: 0;
    `
    
    container.appendChild(heart)
    
    const angle = (Math.PI * 2 * i) / count
    const distance = 80 + Math.random() * 60
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance - 30
    
    tl.to(heart, {
      x,
      y,
      opacity: 1,
      scale: 0.8 + Math.random() * 0.6,
      duration: 0.4,
      ease: easings.back.out(2),
    }, i * 0.02)
    .to(heart, {
      y: y + 50,
      opacity: 0,
      scale: 0.5,
      duration: 0.6,
      ease: "power2.in",
      onComplete: () => heart.remove(),
    }, "-=0.2")
  }
  
  return tl
}

export function createPeekingEntrance(
  element: gsap.TweenTarget,
  options?: {
    delay?: number
    onComplete?: () => void
  }
): gsap.core.Timeline {
  const tl = gsap.timeline({ delay: options?.delay })
  
  tl.fromTo(
    element,
    { y: 100, opacity: 0 },
    {
      y: -20,
      opacity: 1,
      duration: durations.entrance,
      ease: easings.back.out(1.7),
    }
  )
  .to(element, {
    y: 0,
    duration: durations.entrance * 0.3,
    ease: easings.power.out,
  })
  
  if (options?.onComplete) {
    tl.eventCallback("onComplete", options.onComplete)
  }
  
  return tl
}

export function createHeartAppear(
  element: gsap.TweenTarget,
  options?: {
    delay?: number
    onComplete?: () => void
  }
): gsap.core.Timeline {
  const tl = gsap.timeline({ delay: options?.delay })
  
  tl.fromTo(
    element,
    { scale: 0, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: durations.micro,
      ease: easings.elastic.out(1, 0.6),
    }
  )
  
  if (options?.onComplete) {
    tl.eventCallback("onComplete", options.onComplete)
  }
  
  return tl
}

export function createHighFive(
  val: gsap.TweenTarget,
  tino: gsap.TweenTarget,
  container?: gsap.TweenTarget
): gsap.core.Timeline {
  const tl = gsap.timeline()
  
  tl.to([val, tino], {
    y: -30,
    rotation: (i) => i === 0 ? -15 : 15,
    duration: 0.15,
    ease: "power2.out",
  })
  .to([val, tino], {
    y: 0,
    rotation: 0,
    duration: 0.1,
    ease: "power2.in",
  })
  
  if (container) {
    tl.to(container, {
      x: 3,
      duration: 0.05,
      ease: "power1.out",
    }, "-=0.05")
    .to(container, {
      x: -3,
      duration: 0.05,
    })
    .to(container, {
      x: 2,
      duration: 0.03,
    })
    .to(container, {
      x: 0,
      duration: 0.02,
    })
  }
  
  return tl
}

export function createSquashStretch(
  element: gsap.TweenTarget,
  intensity: number = 1
): gsap.core.Timeline {
  const tl = gsap.timeline()
  
  tl.to(element, {
    scaleX: 1.1 * intensity,
    scaleY: 0.85 * intensity,
    duration: 0.08,
    ease: "power2.out",
  })
  .to(element, {
    scaleX: 0.95,
    scaleY: 1.08,
    duration: 0.15,
    ease: easings.elastic.out(1, 0.5),
  })
  .to(element, {
    scaleX: 1,
    scaleY: 1,
    duration: 0.1,
    ease: "power2.out",
  })
  
  return tl
}

export function createTypingAnimation(
  val: gsap.TweenTarget,
  tino: gsap.TweenTarget
): gsap.core.Timeline {
  const tl = gsap.timeline({ repeat: -1 })
  
  tl.to(val, {
    y: -5,
    duration: 0.15,
    ease: "power1.out",
  })
  .to(val, {
    y: 0,
    duration: 0.15,
    ease: "power1.in",
  })
  .to(tino, {
    y: -5,
    duration: 0.15,
    ease: "power1.out",
  }, "-=0.1")
  .to(tino, {
    y: 0,
    duration: 0.15,
    ease: "power1.in",
  })
  
  return tl
}

export function createAccessorySnap(
  element: gsap.TweenTarget
): gsap.core.Timeline {
  const tl = gsap.timeline()
  
  tl.fromTo(
    element,
    { scale: 0, opacity: 0 },
    {
      scale: 1.2,
      opacity: 1,
      duration: 0.1,
      ease: "power2.out",
    }
  )
  .to(element, {
    scale: 1,
    duration: durations.micro,
    ease: easings.back.out(2),
  })
  
  return tl
}

export function createStepTransition(
  exiting: gsap.TweenTarget,
  entering: gsap.TweenTarget,
  direction: 1 | -1 = 1
): gsap.core.Timeline {
  const tl = gsap.timeline()
  
  const exitX = direction > 0 ? -100 : 100
  const enterX = direction > 0 ? 100 : -100
  
  tl.to(exiting, {
    x: exitX,
    opacity: 0,
    duration: durations.transition,
    ease: easings.power.inOut,
  })
  .fromTo(
    entering,
    { x: enterX, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: durations.transition,
      ease: easings.power.inOut,
    },
    "-=0.2"
  )
  
  return tl
}

export function createHeartMorph(
  heart: gsap.TweenTarget,
  card: gsap.TweenTarget
): gsap.core.Timeline {
  const tl = gsap.timeline()
  
  tl.to(heart, {
    scale: 0.8,
    duration: 0.2,
    ease: "power2.in",
  })
  .to(heart, {
    opacity: 0,
    scale: 0.5,
    duration: 0.1,
  })
  .fromTo(
    card,
    { scale: 0.5, opacity: 0, rotationY: -90 },
    {
      scale: 1,
      opacity: 1,
      rotationY: 0,
      duration: durations.transition,
      ease: easings.back.out(1.5),
    },
    "-=0.05"
  )
  
  return tl
}

export function createTextReveal(
  words: gsap.TweenTarget
): gsap.core.Timeline {
  const tl = gsap.timeline()
  
  tl.fromTo(
    words,
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.4,
      stagger: 0.05,
      ease: easings.power.out,
    }
  )
  
  return tl
}

export const springPresets = {
  bouncy: { stiffness: 400, damping: 15, mass: 1 },
  stiff: { stiffness: 600, damping: 20, mass: 0.8 },
  soft: { stiffness: 200, damping: 20, mass: 1.2 },
  snappy: { stiffness: 800, damping: 25, mass: 0.5 },
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}
