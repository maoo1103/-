import React from 'react';

// Fix for missing JSX Intrinsic Elements in the environment
declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: any;
      span: any;
      p: any;
      h1: any;
      h2: any;
      h3: any;
      a: any;
      button: any;
      img: any;
      input: any;
      textarea: any;
      svg: any;
      path: any;
      circle: any;
      rect: any;
      defs: any;
      linearGradient: any;
      stop: any;
      pattern: any;
      g: any;
      // Added missing SVG elements
      filter: any;
      feGaussianBlur: any;
      feComposite: any;
      line: any;
      text: any;

      // 3D elements (merging with other definitions if present)
      group: any;
      mesh: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      ringGeometry: any;
      pointLight: any;
    }
  }
  namespace React {
    namespace JSX {
        interface IntrinsicElements {
            div: any;
            span: any;
            p: any;
            h1: any;
            h2: any;
            h3: any;
            a: any;
            button: any;
            img: any;
            input: any;
            textarea: any;
            svg: any;
            path: any;
            circle: any;
            rect: any;
            defs: any;
            linearGradient: any;
            stop: any;
            pattern: any;
            g: any;
            // Added missing SVG elements
            filter: any;
            feGaussianBlur: any;
            feComposite: any;
            line: any;
            text: any;

            group: any;
            mesh: any;
            meshStandardMaterial: any;
            meshBasicMaterial: any;
            ringGeometry: any;
            pointLight: any;
        }
    }
  }
}

export enum AppState {
  HOME = 'HOME',
  CREATOR = 'CREATOR',
  BAKING = 'BAKING',
  FINAL = 'FINAL',
  CO_CREATE_LOBBY = 'CO_CREATE_LOBBY'
}

export enum ShapeType {
  ROUND = 'ROUND',
  SQUARE = 'SQUARE',
  HEART = 'HEART',
  CUSTOM = 'CUSTOM'
}

export interface Decoration {
  id: string;
  model: string;
  type: 'static' | 'dynamic';
  position: [number, number, number];
  rotation?: [number, number, number];
  scale: number;
  color: string;
}

export interface CakeConfig {
  imageUrl?: string; // The generated 2D image
  originalImage?: string; // The user uploaded image (for background)
  prompt: string;
  message?: string; // Written on card

  // 3D properties (optional for 2D flow)
  layers?: number;
  shape?: ShapeType;
  color?: string;
  decorations?: Decoration[];
  customPath?: [number, number][];
}

export interface CardConfig {
  message: string;
  theme: string;
  isOpen: boolean;
}