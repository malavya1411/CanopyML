import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Crop, Check, RefreshCw } from 'lucide-react';

interface ImageGridCropperProps {
  imageFile: File;
  onCropConfirmed: (croppedFile: File) => void;
  onCancel: () => void;
}

export const ImageGridCropper: React.FC<ImageGridCropperProps> = ({
  imageFile,
  onCropConfirmed,
  onCancel,
}) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [origDimensions, setOrigDimensions] = useState({ width: 0, height: 0 });
  const [displayDimensions, setDisplayDimensions] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [cropSize, setCropSize] = useState<number>(128); // default to 128px for larger context
  const [selectedCell, setSelectedCell] = useState<{ col: number; row: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load image file into a data URL source
  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) setImgSrc(e.target.result as string);
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  // Reset selection when crop size changes
  useEffect(() => {
    setSelectedCell(null);
  }, [cropSize]);

  // Handle when image elements load to extract real dimensions
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const realW = img.naturalWidth;
    const realH = img.naturalHeight;
    setOrigDimensions({ width: realW, height: realH });
    setImageLoaded(true);

    // Initial scale calculations
    updateDisplayDimensions(img);
  };

  // Calculate actual rendered size inside container to establish mapping scale
  const updateDisplayDimensions = (img: HTMLImageElement) => {
    const rect = img.getBoundingClientRect();
    setDisplayDimensions({
      width: rect.width / zoom,
      height: rect.height / zoom,
    });
  };

  // Recalculate dimensions on window resize or zoom changes
  useEffect(() => {
    if (imgRef.current && imageLoaded) {
      updateDisplayDimensions(imgRef.current);
    }
  }, [zoom, imageLoaded]);

  // Dimension scaling calculation helper
  const scale = origDimensions.width > 0 ? (displayDimensions.width / origDimensions.width) : 1;
  const cellSize = cropSize * scale * zoom;

  const cols = Math.floor(origDimensions.width / cropSize);
  const rows = Math.floor(origDimensions.height / cropSize);

  const hasPartialWidth = origDimensions.width % cropSize !== 0;
  const hasPartialHeight = origDimensions.height % cropSize !== 0;

  // Render live preview of selected cell using HTML5 Canvas
  useEffect(() => {
    if (!selectedCell || !imgRef.current || !imageLoaded) {
      setPreviewUrl('');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = cropSize;
    canvas.height = cropSize;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const srcX = selectedCell.col * cropSize;
      const srcY = selectedCell.row * cropSize;

      // Draw the exact cropSize x cropSize slice from source image
      ctx.drawImage(imgRef.current, srcX, srcY, cropSize, cropSize, 0, 0, cropSize, cropSize);
      setPreviewUrl(canvas.toDataURL('image/png'));
    }
  }, [selectedCell, cropSize, imageLoaded]);

  // Capture user click/drag on the grid overlays
  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageLoaded) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const clickedCol = Math.floor(clickX / cellSize);
    const clickedRow = Math.floor(clickY / cellSize);

    // Block edge clicks that fall into invalid partial grid ranges
    if (clickedCol >= cols || clickedRow >= rows) {
      return;
    }

    setSelectedCell({ col: clickedCol, row: clickedRow });
  };

  const handleConfirm = () => {
    if (!selectedCell || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = cropSize;
    canvas.height = cropSize;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const srcX = selectedCell.col * cropSize;
      const srcY = selectedCell.row * cropSize;
      ctx.drawImage(imgRef.current, srcX, srcY, cropSize, cropSize, 0, 0, cropSize, cropSize);

      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], `crop_${cropSize}_${selectedCell.col}_${selectedCell.row}_${imageFile.name}`, {
            type: 'image/png',
          });
          onCropConfirmed(croppedFile);
        }
      }, 'image/png');
    }
  };

  return (
    <div className="surface" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: 700, color: '#eef2ec' }}>
            Interactive Image Cropper
          </h3>
          <p style={{ fontSize: '12px', color: '#687268' }}>
            Choose a patch resolution size, then click inside the grid to select a sample.
          </p>
        </div>
        
        {/* Dynamic crop size selection */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#687268', fontWeight: 600, letterSpacing: '0.05em' }}>SIZE:</span>
            {[64, 128, 256].map(sizeOption => (
              <button
                key={sizeOption}
                onClick={() => setCropSize(sizeOption)}
                className="btn btn-secondary btn-sm"
                style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  height: '28px',
                  borderColor: cropSize === sizeOption ? '#4ade80' : 'rgba(255,255,255,0.08)',
                  color: cropSize === sizeOption ? '#4ade80' : '#a8b4a0',
                  background: cropSize === sizeOption ? 'rgba(34,197,94,0.08)' : 'transparent',
                }}
              >
                {sizeOption}px
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))}
              className="btn btn-secondary btn-sm"
              aria-label="Zoom out"
              style={{ height: '28px' }}
            >
              <ZoomOut size={13} />
            </button>
            <button
              onClick={() => setZoom(prev => Math.min(3, prev + 0.25))}
              className="btn btn-secondary btn-sm"
              aria-label="Zoom in"
              style={{ height: '28px' }}
            >
              <ZoomIn size={13} />
            </button>
            <button onClick={onCancel} className="btn btn-secondary btn-sm" style={{ color: '#f87171', height: '28px' }}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(200px, 260px)', gap: '20px', alignItems: 'start' }} className="flex-col md:grid">
        {/* ── Main Cropper Container ── */}
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            maxHeight: '500px',
            overflow: 'auto',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: '#040706',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
          }}
        >
          {imgSrc ? (
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <img
                ref={imgRef}
                src={imgSrc}
                alt="Original uploaded satellite scene"
                onLoad={handleImageLoad}
                style={{
                  display: 'block',
                  maxWidth: '800px',
                  width: '100%',
                  height: 'auto',
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left',
                  imageRendering: zoom > 1 ? 'pixelated' : 'auto',
                  transition: 'transform 0.1s ease',
                }}
              />

              {imageLoaded && (
                <div
                  onClick={handleGridClick}
                  style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: `${displayDimensions.width * zoom}px`,
                    height: `${displayDimensions.height * zoom}px`,
                    cursor: 'crosshair',
                    zIndex: 10,
                  }}
                >
                  {/* Overlay SVG Grid */}
                  <svg
                    style={{
                      position: 'absolute',
                      top: 0, left: 0,
                      width: '100%', height: '100%',
                      pointerEvents: 'none',
                    }}
                  >
                    {/* Rows */}
                    {Array.from({ length: Math.ceil(origDimensions.height / cropSize) }).map((_, r) => (
                      <line
                        key={`r-${r}`}
                        x1="0"
                        y1={r * cellSize}
                        x2="100%"
                        y2={r * cellSize}
                        stroke="rgba(255, 255, 255, 0.15)"
                        strokeWidth="1"
                      />
                    ))}
                    {/* Columns */}
                    {Array.from({ length: Math.ceil(origDimensions.width / cropSize) }).map((_, c) => (
                      <line
                        key={`c-${c}`}
                        x1={c * cellSize}
                        y1="0"
                        x2={c * cellSize}
                        y2="100%"
                        stroke="rgba(255, 255, 255, 0.15)"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Edge disable regions */}
                    {hasPartialWidth && (
                      <rect
                        x={cols * cellSize}
                        y="0"
                        width="100%"
                        height="100%"
                        fill="rgba(8, 14, 11, 0.65)"
                      />
                    )}
                    {hasPartialHeight && (
                      <rect
                        x="0"
                        y={rows * cellSize}
                        width="100%"
                        height="100%"
                        fill="rgba(8, 14, 11, 0.65)"
                      />
                    )}

                    {/* Selected Box Indicator */}
                    {selectedCell && (
                      <rect
                        x={selectedCell.col * cellSize}
                        y={selectedCell.row * cellSize}
                        width={cellSize}
                        height={cellSize}
                        fill="rgba(34, 197, 94, 0.12)"
                        stroke="#4ade80"
                        strokeWidth="2"
                        style={{ filter: 'drop-shadow(0 0 4px rgba(74, 222, 128, 0.6))' }}
                      />
                    )}
                  </svg>
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '40px', color: '#687268', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <RefreshCw size={16} className="animate-spin" /> Preparing image...
            </div>
          )}
        </div>

        {/* ── RIGHT Side Preview and Controls ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Native Preview */}
          <div className="surface" style={{ padding: '16px', background: 'rgba(255,255,255,0.015)' }}>
            <p className="label-caps" style={{ marginBottom: '10px' }}>Native {cropSize}×{cropSize} Preview</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: 86, height: 86,
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  borderRadius: '6px',
                  background: '#000',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="patch crop preview"
                    style={{
                      width: 80, height: 80,
                      display: 'block',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <Crop size={24} color="#687268" />
                )}
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#a8b4a0', fontWeight: 600 }}>1:1 Pixels</p>
                <p style={{ fontSize: '10px', color: '#687268' }}>Exactly {cropSize}×{cropSize} pixels output</p>
              </div>
            </div>
          </div>

          {/* Coordinate Mapping Stats */}
          {selectedCell && (
            <div className="surface" style={{ padding: '16px', background: 'rgba(255,255,255,0.015)' }}>
              <p className="label-caps" style={{ marginBottom: '10px' }}>Coordinate Map</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#687268' }}>Col / Row:</span>
                  <span style={{ color: '#eef2ec', fontWeight: 600 }}>{selectedCell.col} / {selectedCell.row}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#687268' }}>Source X Range:</span>
                  <span style={{ color: '#eef2ec', fontWeight: 600 }}>{selectedCell.col * cropSize}px - {(selectedCell.col + 1) * cropSize}px</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#687268' }}>Source Y Range:</span>
                  <span style={{ color: '#eef2ec', fontWeight: 600 }}>{selectedCell.row * cropSize}px - {(selectedCell.row + 1) * cropSize}px</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <button
            onClick={handleConfirm}
            disabled={!selectedCell}
            className="btn btn-primary"
            style={{ width: '100%', height: '46px', fontSize: '14px' }}
          >
            <Check size={16} /> Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};
