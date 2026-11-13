import { Injectable } from '@angular/core';

/**
 * Synthesizes iPhone-style Emergency SOS countdown pulses and dispatch/cancel tones via Web Audio API.
 */
@Injectable({ providedIn: 'root' })
export class SoundFeedbackService {
  private audioCtx?: AudioContext;
  private activeNodes: OscillatorNode[] = [];

  /** Plays an urgent two-pulse alert chirp on each countdown second. */
  playCountdownTick(secondsRemaining: number): void {
    const ctx = this.ensureContext();
    if (!ctx) {
      return;
    }

    const now = ctx.currentTime;
    const isFinalTick = secondsRemaining <= 1;
    const primaryFreq = isFinalTick ? 1174.66 : 987.77; // D6 on final second, B5 before
    const secondaryFreq = isFinalTick ? 1567.98 : 1318.51; // G6 on final second, E6 before

    this.scheduleTone(ctx, primaryFreq, now, 0.11, 0.34, 'triangle');
    this.scheduleTone(ctx, secondaryFreq, now + 0.12, 0.14, 0.3, 'sine');
  }

  /** Plays a three-note rising emergency siren chime when SOS dispatches. */
  playDispatchAlert(): void {
    const ctx = this.ensureContext();
    if (!ctx) {
      return;
    }

    const now = ctx.currentTime;
    this.scheduleTone(ctx, 987.77, now, 0.13, 0.36, 'sawtooth');
    this.scheduleTone(ctx, 1318.51, now + 0.15, 0.13, 0.36, 'sawtooth');
    this.scheduleTone(ctx, 1567.98, now + 0.3, 0.24, 0.38, 'triangle');
  }

  /** Plays a gentle descending two-note tone when the user cancels SOS. */
  playCancelTone(): void {
    const ctx = this.ensureContext();
    if (!ctx) {
      return;
    }

    const now = ctx.currentTime;
    this.scheduleTone(ctx, 523.25, now, 0.09, 0.2, 'sine');
    this.scheduleTone(ctx, 349.23, now + 0.1, 0.14, 0.18, 'sine');
  }

  /** Stops any currently playing or queued countdown oscillators immediately. */
  stopAll(): void {
    for (const osc of this.activeNodes) {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignore already-stopped oscillators.
      }
    }
    this.activeNodes = [];
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') {
      return null;
    }
    const AudioCtx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) {
      return null;
    }
    if (!this.audioCtx) {
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      void this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  private scheduleTone(
    ctx: AudioContext,
    frequency: number,
    startTime: number,
    durationSeconds: number,
    peakGain: number,
    type: OscillatorType,
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSeconds);

    osc.connect(gain);
    gain.connect(ctx.destination);

    this.activeNodes.push(osc);
    osc.onended = () => {
      this.activeNodes = this.activeNodes.filter((node) => node !== osc);
      osc.disconnect();
      gain.disconnect();
    };

    osc.start(startTime);
    osc.stop(startTime + durationSeconds + 0.01);
  }
}

