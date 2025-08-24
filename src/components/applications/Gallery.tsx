import React, { useCallback, useEffect, useState } from 'react';
import Window from '../os/Window';
import colors from '../../constants/colors';

export interface GalleryAppProps extends WindowAppProps {}

// Local photo item type
interface PhotoItem {
    filename: string;
    url: string;
    title: string;
}

const GalleryApp: React.FC<GalleryAppProps> = (props) => {
    const [width, setWidth] = useState(980);
    const [height, setHeight] = useState(680);
    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    // Function to load photos from public/photography folder
    const loadPhotos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Try to load from photos.json manifest first
            try {
                const manifestResponse = await fetch('/photography/photos.json');
                if (manifestResponse.ok) {
                    const filenames: string[] = await manifestResponse.json();
                    const photoItems: PhotoItem[] = filenames.map(filename => ({
                        filename,
                        url: `/photography/${filename}`,
                        title: filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').replace(/^RUID/, 'Photo ')
                    }));
                    setPhotos(photoItems);
                    return;
                }
            } catch (manifestError) {
                console.log('Could not load photos manifest, falling back to static list');
            }
            
        } catch (e: any) {
            setError(e.message || 'Failed to load photos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadPhotos(); }, [loadPhotos]);

    const openModal = (i: number) => setSelectedIndex(i);
    const closeModal = () => setSelectedIndex(null);
    const prev = useCallback(() => setSelectedIndex(i => (i === null ? null : (i - 1 + photos.length) % photos.length)), [photos.length]);
    const next = useCallback(() => setSelectedIndex(i => (i === null ? null : (i + 1) % photos.length)), [photos.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;
            
            switch (e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    prev();
                    break;
                case 'ArrowRight':
                    next();
                    break;
            }
        };

        if (selectedIndex !== null) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [selectedIndex, prev, next]);

    const selected = selectedIndex !== null ? photos[selectedIndex] : null;

    return (
        <Window
            top={60}
            left={60}
            width={width}
            height={height}
            windowTitle="Photo Gallery"
            windowBarIcon="gallery"
            bottomLeftText={`${photos.length} photos from local collection`}
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            onWidthChange={setWidth}
            onHeightChange={setHeight}
        >
            <div style={styles.container}>
                <div style={styles.header}>
                    <h2 style={styles.headerTitle}>Photography Gallery</h2>
                </div>
                {loading && <div style={styles.statusBox}>Loading photos...</div>}
                {error && !loading && <div style={styles.errorBox}>⚠ {error}</div>}
                {!loading && !error && (
                    <div style={styles.grid}>
                        {photos.map((p, i) => (
                            <div key={p.filename + i} style={styles.card} onClick={() => openModal(i)}>
                                <img 
                                    src={p.url} 
                                    alt={p.title || `Photo ${i+1}`} 
                                    style={styles.thumb}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}
                {selected && selectedIndex !== null && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modalContent}>
                            <div style={styles.modalHeader}>
                                <h4 style={{ margin: 0, fontSize: 14 }}>Photo {selectedIndex + 1}/{photos.length}</h4>
                                <button className="site-button" style={styles.closeButton} onClick={closeModal}>✕</button>
                            </div>
                            <div style={styles.modalBody}>
                                <button className="site-button" style={styles.navButton} onClick={prev}>‹</button>
                                <img src={selected.url} alt={selected.title} style={styles.fullImage} />
                                <button className="site-button" style={styles.navButton} onClick={next}>›</button>
                            </div>
                            <div style={styles.metaBar}>
                                <div style={styles.metaText}>{selected.title || 'Untitled'} • {selected.filename}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    container: { width: '100%', height: '100%', backgroundColor: colors.lightGray, overflow: 'auto', fontFamily: 'MSSerif, sans-serif', padding: 8, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' },
    header: { marginBottom: 8 },
    headerTitle: { margin: 0, fontSize: 22, fontWeight: 'bold', color: colors.black },
    headerMeta: { fontSize: 12, color: colors.darkGray, display: 'flex', alignItems: 'center', gap: 8 },
    refreshButton: { marginLeft: 'auto', fontSize: 11, padding: '4px 8px' },
    hint: { fontSize: 11, marginTop: 4, color: colors.darkGray, fontStyle: 'italic' },
    statusBox: { padding: 24, textAlign: 'center', backgroundColor: colors.white, border: `2px inset ${colors.lightGray}`, margin: 4 },
    errorBox: { padding: 24, textAlign: 'center', backgroundColor: colors.white, border: `2px inset ${colors.lightGray}`, margin: 4, color: colors.red },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8, width: '100%' },
    card: { position: 'relative', backgroundColor: colors.white, border: `2px outset ${colors.lightGray}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    thumb: { width: '100%', aspectRatio: '3/4', objectFit: 'cover', imageRendering: 'auto' },
    modalOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
    modalContent: { backgroundColor: 'var(--surface)', border: '2px solid var(--window-frame)', maxWidth: '92vw', maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--border-raised-outer), var(--border-raised-inner)' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '2px solid var(--window-frame)', backgroundColor: 'var(--surface)' },
    modalBody: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, gap: 12, backgroundColor: 'var(--surface)' },
    navButton: { minWidth: 48, height: 48, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    fullImage: { maxWidth: '60vw', maxHeight: '50vh', objectFit: 'contain', imageRendering: 'auto' },
    closeButton: { minWidth: 32, height: 32, padding: 4 },
    metaBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px', fontSize: 11, backgroundColor: colors.lightGray, borderTop: `2px inset ${colors.lightGray}` },
    metaText: { flex: 1, marginRight: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    link: { fontSize: 11, color: colors.darkBlue, textDecoration: 'none', fontWeight: 'bold' }
};

export default GalleryApp;
