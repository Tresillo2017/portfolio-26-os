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
    const [displayedPhotos, setDisplayedPhotos] = useState<PhotoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [loadedCount, setLoadedCount] = useState(0);
    const loadMoreRef = React.useRef<HTMLDivElement>(null);
    
    const BATCH_SIZE = 12; // Load 12 photos at a time

    // Function to load photos from photos.json file
    const loadPhotos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Load photo list from static JSON file
            const response = await fetch('/photography/photos.json');
            if (!response.ok) {
                throw new Error(`Failed to load photos: ${response.status}`);
            }
            
            const filenames: string[] = await response.json();
            const photoItems: PhotoItem[] = filenames.map(filename => ({
                filename,
                url: `https://portfolio-media.tomasps.com/photography/${filename}`,
                title: filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').replace(/^RUID/, 'Photo ')
            }));
            setPhotos(photoItems);
            setDisplayedPhotos(photoItems.slice(0, BATCH_SIZE));
            setLoadedCount(BATCH_SIZE);
            
        } catch (e: any) {
            setError(e.message || 'Failed to load photos');
        } finally {
            setLoading(false);
        }
    }, []);

    // Load more photos
    const loadMore = useCallback(() => {
        if (loadedCount >= photos.length) return;
        
        const nextBatch = photos.slice(loadedCount, loadedCount + BATCH_SIZE);
        setDisplayedPhotos(prev => [...prev, ...nextBatch]);
        setLoadedCount(prev => prev + BATCH_SIZE);
    }, [photos, loadedCount]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        if (!loadMoreRef.current || loading || loadedCount >= photos.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [loadMore, loading, loadedCount, photos.length]);

    useEffect(() => { loadPhotos(); }, [loadPhotos]);

    const openModal = (i: number) => {
        // Find the real index in the full photos array
        const photo = displayedPhotos[i];
        const realIndex = photos.findIndex(p => p.filename === photo.filename);
        setSelectedIndex(realIndex);
    };
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
            bottomLeftText={`${photos.length} photos`}
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            onWidthChange={setWidth}
            onHeightChange={setHeight}
        >
            <div style={styles.container}>
                <div style={styles.header}>
                    <h2 style={styles.headerTitle}>Photography Gallery</h2>
                    <div style={styles.loadingStatus}>
                        {!loading && `Showing ${displayedPhotos.length} of ${photos.length} photos`}
                    </div>
                </div>
                {loading && <div style={styles.statusBox}>Loading photos...</div>}
                {error && !loading && <div style={styles.errorBox}>⚠ {error}</div>}
                {!loading && !error && (
                    <div style={styles.grid}>
                        {photos.map((p, i) => {
                            const isLoaded = i < loadedCount;
                            const isTriggerPoint = i === loadedCount - 6; // Trigger 6 photos before the end
                            return (
                                <React.Fragment key={p.filename + i}>
                                    <div 
                                        style={isLoaded ? styles.card : styles.placeholderCard}
                                        onClick={isLoaded ? () => openModal(i) : undefined}
                                    >
                                        {isLoaded ? (
                                            <img 
                                                src={p.url} 
                                                alt={p.title || `Photo ${i+1}`} 
                                                style={styles.thumb}
                                                loading="lazy"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div style={styles.placeholder}>
                                                <div style={styles.placeholderIcon}>📷</div>
                                            </div>
                                        )}
                                    </div>
                                    {isTriggerPoint && loadedCount < photos.length && (
                                        <div ref={loadMoreRef} style={styles.loadMoreTrigger} />
                                    )}
                                </React.Fragment>
                            );
                        })}
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
    header: { marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { margin: 0, fontSize: 22, fontWeight: 'bold', color: colors.black },
    loadingStatus: { fontSize: 12, color: colors.darkGray },
    headerMeta: { fontSize: 12, color: colors.darkGray, display: 'flex', alignItems: 'center', gap: 8 },
    refreshButton: { marginLeft: 'auto', fontSize: 11, padding: '4px 8px' },
    hint: { fontSize: 11, marginTop: 4, color: colors.darkGray, fontStyle: 'italic' },
    statusBox: { padding: 24, textAlign: 'center', backgroundColor: colors.white, border: `2px inset ${colors.lightGray}`, margin: 4 },
    errorBox: { padding: 24, textAlign: 'center', backgroundColor: colors.white, border: `2px inset ${colors.lightGray}`, margin: 4, color: colors.red },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8, width: '100%' },
    card: { position: 'relative', backgroundColor: colors.white, border: `2px outset ${colors.lightGray}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    placeholderCard: { position: 'relative', backgroundColor: colors.lightGray, border: `2px inset ${colors.lightGray}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    thumb: { width: '100%', aspectRatio: '3/4', objectFit: 'cover', imageRendering: 'auto' },
    placeholder: { width: '100%', aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.lightGray },
    placeholderIcon: { fontSize: 48, opacity: 0.3 },
    loadMoreTrigger: { position: 'absolute', height: 1, width: 1, pointerEvents: 'none' },
    loadingIndicator: { fontSize: 12, color: colors.darkGray, fontStyle: 'italic' },
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
