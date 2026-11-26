'use client';

export { SignaturePad } from './signature-pad';
export type {
  SignaturePadChange,
  SignaturePadClassNames,
  SignaturePadHandle,
  SignaturePadLabels,
  SignaturePadProps,
} from './signature-pad';
export {
  buildStrokePath,
  computeExportLayout,
  fitSignatureBox,
  getSignatureBounds,
  isSignatureEmpty,
  signatureToSvg,
  strokeToSvgPath,
} from './geometry';
export type {
  SignatureBox,
  SignatureExportLayout,
  SignatureExportOptions,
  SignatureGeometry,
  SignaturePathCommand,
  SignaturePoint,
  SignatureStroke,
  SignatureTransform,
} from './geometry';
