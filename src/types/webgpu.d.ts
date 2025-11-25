interface Navigator {
  gpu?: GPU;
}

interface GPU {
  requestAdapter(options?: GPURequestAdapterOptions): Promise<GPUAdapter | null>;
}

interface GPURequestAdapterOptions {
  powerPreference?: 'low-power' | 'high-performance';
}

interface GPUAdapter {
  readonly features: GPUFeatureName[];
  readonly limits: GPUSupportedLimits;
  readonly isFallbackAdapter: boolean;
  requestDevice(descriptor?: GPUDeviceDescriptor): Promise<GPUDevice>;
}

interface GPUDevice {
  readonly features: GPUFeatureName[];
  readonly limits: GPUSupportedLimits;
  readonly queue: GPUQueue;
  destroy(): void;
  createBuffer(descriptor: GPUBufferDescriptor): GPUBuffer;
}

interface GPUBuffer {}
interface GPUQueue {}
interface GPUSupportedLimits {}
interface GPUBufferDescriptor {
  size: number;
  usage: number;
}
interface GPUDeviceDescriptor {}

type GPUFeatureName = string;
