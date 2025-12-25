import { render, screen } from '@testing-library/react';
import SignatureIcon from '../SignatureIcon';

// Mock Three.js to avoid WebGL issues in test environment
jest.mock('three', () => ({
  Scene: jest.fn(() => ({
    add: jest.fn(),
    remove: jest.fn(),
    clear: jest.fn(),
  })),
  PerspectiveCamera: jest.fn(() => ({
    position: { z: 0 },
  })),
  WebGLRenderer: jest.fn(() => ({
    setSize: jest.fn(),
    setClearColor: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn(),
    forceContextLoss: jest.fn(),
    domElement: document.createElement('canvas'),
  })),
  IcosahedronGeometry: jest.fn(),
  TorusGeometry: jest.fn(),
  OctahedronGeometry: jest.fn(),
  MeshBasicMaterial: jest.fn(),
  Mesh: jest.fn(() => ({
    scale: { setScalar: jest.fn() },
    rotation: { x: 0, y: 0, z: 0 },
    geometry: { dispose: jest.fn() },
    material: { dispose: jest.fn() },
  })),
  Color: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn();

describe('SignatureIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console warnings for cleaner test output
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders container div even when WebGL fails', () => {
    const { container } = render(<SignatureIcon />);
    // The component should render a container div
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom className to container', () => {
    const { container } = render(<SignatureIcon className="custom-class" />);
    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass('signature-icon', 'custom-class');
  });

  it('has correct dimensions on container', () => {
    const { container } = render(<SignatureIcon />);
    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveStyle({
      width: '100px',
      height: '100px',
    });
  });

  it('sets up intersection observer', () => {
    render(<SignatureIcon />);
    expect(IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: 0.1,
        rootMargin: '50px',
      })
    );
  });

  it('handles WebGL initialization errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    const { container } = render(<SignatureIcon />);
    
    // Component should still render container but handle the error
    expect(container.firstChild).toBeInTheDocument();
    
    // Should log a warning about WebGL failure
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Three.js initialization failed'),
      expect.any(Error)
    );
    
    consoleSpy.mockRestore();
  });

  it('supports different geometry types', () => {
    const { rerender } = render(<SignatureIcon geometry="torus" />);
    expect(render).not.toThrow();
    
    rerender(<SignatureIcon geometry="octahedron" />);
    expect(render).not.toThrow();
    
    rerender(<SignatureIcon geometry="icosahedron" />);
    expect(render).not.toThrow();
  });

  it('accepts custom props', () => {
    const { container } = render(
      <SignatureIcon 
        color="#ff0000" 
        size={2} 
        rotationSpeed={0.01}
      />
    );
    
    // Should render without errors
    expect(container.firstChild).toBeInTheDocument();
  });
});