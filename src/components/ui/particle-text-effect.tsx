"use client"

import { useEffect, useRef } from "react"

interface Vector2D {
    x: number
    y: number
}

// Optimization: Pre-calculate aurora colors outside to reduce object creation
function getAuroraColor() {
    const gradientChoice = Math.random();
    if (gradientChoice < 0.33) return { r: 74, g: 222, b: 128 }; // Green
    if (gradientChoice < 0.66) return { r: 45, g: 212, b: 191 }; // Teal
    return { r: 99, g: 102, b: 241 }; // Indigo
}

class Particle {
    pos: Vector2D = { x: 0, y: 0 }
    vel: Vector2D = { x: 0, y: 0 }
    acc: Vector2D = { x: 0, y: 0 }
    target: Vector2D = { x: 0, y: 0 }

    closeEnoughTarget = 10
    baseSpeed = 12.0
    maxForce = 1.5
    particleSize = 5
    isKilled = false

    // Random characteristics to break uniformity
    speedVar = 0
    sizeVar = 0

    startColor = { r: 0, g: 0, b: 0 }
    targetColor = { r: 0, g: 0, b: 0 }
    colorWeight = 0
    colorBlendRate = 0.15

    constructor() {
        // Initialize with random variations
        this.speedVar = Math.random() * 8.0 - 4.0; // +/- 4.0 speed variation
        this.sizeVar = Math.random() * 1.5; // Slight size variation
    }

    move() {
        const dx = this.target.x - this.pos.x;
        const dy = this.target.y - this.pos.y;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq < 2) {
            this.pos.x = this.target.x;
            this.pos.y = this.target.y;
            this.vel.x = 0;
            this.vel.y = 0;
            return;
        }

        const distance = Math.sqrt(distanceSq);
        let proximityMult = 1;
        if (distance < this.closeEnoughTarget) {
            proximityMult = distance / this.closeEnoughTarget;
        }

        const effectiveSpeed = (this.baseSpeed + this.speedVar) * proximityMult;

        const towardsTargetX = (dx / distance) * effectiveSpeed;
        const towardsTargetY = (dy / distance) * effectiveSpeed;

        const steerX = towardsTargetX - this.vel.x;
        const steerY = towardsTargetY - this.vel.y;

        const steerMag = Math.sqrt(steerX * steerX + steerY * steerY);
        if (steerMag > this.maxForce) {
            this.acc.x = (steerX / steerMag) * this.maxForce;
            this.acc.y = (steerY / steerMag) * this.maxForce;
        } else {
            this.acc.x = steerX;
            this.acc.y = steerY;
        }

        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.vel.x *= 0.75;
        this.vel.y *= 0.75;
    }

    draw(ctx: CanvasRenderingContext2D, drawAsPoints: boolean) {
        if (this.colorWeight < 1.0) {
            this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0)
        }

        const currentColorR = Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight);
        const currentColorG = Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight);
        const currentColorB = Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight);

        ctx.fillStyle = `rgb(${currentColorR}, ${currentColorG}, ${currentColorB})`;
        if (drawAsPoints) {
            const size = 2 + (Math.random() > 0.8 ? 1 : 0);
            ctx.fillRect(this.pos.x | 0, this.pos.y | 0, size, size);
        } else {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, (this.particleSize / 2) + this.sizeVar, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    kill(width: number, height: number, generateRandomPos: (x: number, y: number, mag: number) => Vector2D) {
        if (!this.isKilled) {
            const randomPos = generateRandomPos(width / 2, height / 2, (width + height) / 2)
            this.target.x = randomPos.x
            this.target.y = randomPos.y

            this.startColor = {
                r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
                g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
                b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
            }
            this.targetColor = { r: 0, g: 0, b: 0 }
            this.colorWeight = 0
            this.isKilled = true
        }
    }
}

interface ParticleTextEffectProps {
    words?: string[]
}

// Order Changed: Full title first
const DEFAULT_WORDS = ["RedPro AI Academy", "RedPro", "AI Academy"]

export function ParticleTextEffect({ words = DEFAULT_WORDS }: ParticleTextEffectProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>()
    const particlesRef = useRef<Particle[]>([])
    const frameCountRef = useRef(0)
    const wordIndexRef = useRef(0)
    const initializedRef = useRef(false)

    const HOLD_TIME = 240;
    const TRANSITION_TIME = 60;
    const TOTAL_CYCLE = HOLD_TIME + TRANSITION_TIME;

    const pixelSteps = 8
    const drawAsPoints = true

    const generateRandomPos = (x: number, y: number, mag: number): Vector2D => {
        const angle = Math.random() * Math.PI * 2;
        const varyMag = mag * (0.8 + Math.random() * 0.4);
        return {
            x: x + Math.cos(angle) * varyMag,
            y: y + Math.sin(angle) * varyMag,
        }
    }

    const nextWord = (word: string, canvas: HTMLCanvasElement) => {
        const isRedProOnly = word === "RedPro";
        const isAcademyOnly = word === "AI Academy";
        const isFullTitle = word === "RedPro AI Academy";

        const offscreenCanvas = document.createElement("canvas")
        offscreenCanvas.width = canvas.width
        offscreenCanvas.height = canvas.height
        const offscreenCtx = offscreenCanvas.getContext("2d")!

        offscreenCtx.fillStyle = "white"

        let fontSize = 110;
        if (window.innerWidth < 768) fontSize = 60;

        offscreenCtx.font = `900 ${fontSize}px Inter, sans-serif`
        offscreenCtx.textAlign = "center"
        offscreenCtx.textBaseline = "middle"
        offscreenCtx.fillText(word, canvas.width / 2, canvas.height / 2)

        const textMetrics = offscreenCtx.measureText(word);
        const textWidth = textMetrics.width;
        const textStart = (canvas.width - textWidth) / 2;

        const imageData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height)
        const pixels = imageData.data

        const particles = particlesRef.current
        let particleIndex = 0

        const coordsIndexes: number[] = []
        for (let i = 0; i < pixels.length; i += pixelSteps * 4) {
            coordsIndexes.push(i)
        }

        for (let i = coordsIndexes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]];
        }

        // Precise metrics for color split
        const redMetrics = offscreenCtx.measureText("Red");
        const redWidth = redMetrics.width;

        const redProSpaceMetrics = offscreenCtx.measureText("RedPro ");
        const redProSpaceWidth = redProSpaceMetrics.width;

        const redProSpaceAIMetrics = offscreenCtx.measureText("RedPro AI");
        const redProSpaceAIWidth = redProSpaceAIMetrics.width;

        const aiMetrics = offscreenCtx.measureText("AI");
        const aiWidth = aiMetrics.width;

        for (const coordIndex of coordsIndexes) {
            const pixelIndex = coordIndex
            const alpha = pixels[pixelIndex + 3]

            if (alpha > 0) {
                const x = (pixelIndex / 4) % canvas.width
                const y = Math.floor(pixelIndex / 4 / canvas.width)

                let targetColor = { r: 255, g: 255, b: 255 }; // Default White

                const relativeX = x - textStart;

                if (isRedProOnly) {
                    if (relativeX < redWidth + 2) {
                        targetColor = { r: 229, g: 9, b: 20 } // Red
                    } else {
                        targetColor = { r: 255, g: 255, b: 255 } // White
                    }
                } else if (isAcademyOnly) {
                    if (relativeX < aiWidth + 2) {
                        targetColor = { r: 229, g: 9, b: 20 } // Red (AI is Red)
                    } else {
                        targetColor = { r: 255, g: 255, b: 255 } // White
                    }
                } else if (isFullTitle) {
                    // RedPro AI Academy
                    // Red -> Red
                    // Pro -> White
                    // AI -> Red
                    // Academy -> White

                    if (relativeX < redWidth + 2) {
                        targetColor = { r: 229, g: 9, b: 20 } // Red
                    } else if (relativeX < redProSpaceWidth) {
                        targetColor = { r: 255, g: 255, b: 255 } // Pro (White)
                    } else if (relativeX < redProSpaceAIWidth + 2) {
                        targetColor = { r: 229, g: 9, b: 20 } // AI (Red)
                    } else {
                        targetColor = { r: 255, g: 255, b: 255 } // Academy (White)
                    }
                }

                let particle: Particle

                if (particleIndex < particles.length) {
                    particle = particles[particleIndex]
                    particle.isKilled = false
                    particleIndex++
                } else {
                    particle = new Particle()
                    const startPos = generateRandomPos(canvas.width / 2, canvas.height / 2, canvas.width);
                    particle.pos.x = startPos.x;
                    particle.pos.y = startPos.y;
                    particles.push(particle)
                }

                particle.startColor = {
                    r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
                    g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
                    b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
                }

                particle.targetColor = targetColor;
                particle.colorWeight = 0;
                particle.target.x = x;
                particle.target.y = y;
            }
        }

        for (let i = particleIndex; i < particles.length; i++) {
            particles[i].kill(canvas.width, canvas.height, generateRandomPos)
        }
    }

    const animate = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d", { alpha: true })!
        const particles = particlesRef.current

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i]
            particle.move()
            particle.draw(ctx, drawAsPoints)

            if (particle.isKilled) {
                if (particle.pos.x < -100 || particle.pos.x > canvas.width + 100 ||
                    particle.pos.y < -100 || particle.pos.y > canvas.height + 100) {
                    particles.splice(i, 1)
                }
            }
        }

        frameCountRef.current++
        if (frameCountRef.current >= TOTAL_CYCLE) {
            frameCountRef.current = 0;
            wordIndexRef.current = (wordIndexRef.current + 1) % words.length
            nextWord(words[wordIndexRef.current], canvas)
        }

        animationRef.current = requestAnimationFrame(animate)
    }

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = 300;
                // CRITICAL: Call nextWord immediately to ensure content is there FRAME 1
                nextWord(words[wordIndexRef.current], canvas)
            }
        }

        window.addEventListener('resize', resizeCanvas);

        // Force direct call to ensure no delay
        resizeCanvas();
        animate();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
            window.removeEventListener('resize', resizeCanvas);
        }
    }, [])

    return (
        <div className="w-full h-[300px] flex items-center justify-center pointer-events-none">
            <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
    )
}
