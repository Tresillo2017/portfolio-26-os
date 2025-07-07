import React, { useState } from 'react';

export interface PhotographyProjectsProps {}

// Declare webpack's require.context function
declare function require(id: string): any;
declare namespace require {
    function context(directory: string, useSubdirectories: boolean, regExp: RegExp): {
        keys(): string[];
        <T>(id: string): T;
    };
}

// Function to dynamically import all photography images
const importAllImages = (): string[] => {
    const requireContext = require.context(
        '../../../assets/pictures/photography/',
        false,
        /\.(png|jpe?g|svg)$/
    );
    
    const images: string[] = [];
    requireContext.keys().forEach((item: string) => {
        const imageModule = requireContext(item) as any;
        images.push(imageModule.default || imageModule);
    });
    
    // Sort images by filename to ensure consistent order
    return images.sort();
};

// Get all photography images
const photographyImages = importAllImages();

interface PhotoModalProps {
    imageUrl: string;
    isOpen: boolean;
    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void;
    currentIndex: number;
    totalImages: number;
}

const PhotoModal: React.FC<PhotoModalProps> = (props: PhotoModalProps) => {
    const {
        imageUrl,
        isOpen,
        onClose,
        onPrevious,
        onNext,
        currentIndex,
        totalImages,
    } = props;
    
    if (!isOpen) return null;

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <h4>Photo {currentIndex + 1} of {totalImages}</h4>
                    <button className="site-button" onClick={onClose} style={styles.closeButton}>
                        ✕
                    </button>
                </div>
                <div style={styles.modalImageContainer}>
                    <button className="site-button" onClick={onPrevious} style={styles.navButton}>
                        ‹
                    </button>
                    <img src={imageUrl} alt={`Photography ${currentIndex + 1}`} style={styles.modalImage} />
                    <button className="site-button" onClick={onNext} style={styles.navButton}>
                        ›
                    </button>
                </div>
            </div>
        </div>
    );
};

const PhotographyProjects: React.FC<PhotographyProjectsProps> = () => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const openModal = (index: number) => {
        setSelectedImageIndex(index);
    };

    const closeModal = () => {
        setSelectedImageIndex(null);
    };

    const goToPrevious = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex(selectedImageIndex === 0 ? photographyImages.length - 1 : selectedImageIndex - 1);
        }
    };

    const goToNext = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex(selectedImageIndex === photographyImages.length - 1 ? 0 : selectedImageIndex + 1);
        }
    };

    return (
        <div className="site-page-content">
            <h1>Photography</h1>
            <h3>Ventures</h3>
            <br />
            <div className="text-block">
                <p>
                    Welcome to my photography gallery! Here you'll find a collection of my favorite shots 
                    captured during various adventures and moments. Each photo tells a story and represents 
                    a moment in time that caught my eye. Click on any image to view it in full size and 
                    navigate through the gallery.
                </p>
                <br />
                <p>
                    Photography allows me to explore the world through a different lens, capturing the beauty 
                    in everyday moments and extraordinary landscapes alike. I hope you enjoy browsing through 
                    these visual stories as much as I enjoyed creating them.
                </p>
            </div>
            
            <div style={styles.galleryContainer}>
                {photographyImages.map((image, index) => (
                    <div 
                        key={index} 
                        className="big-button-container" 
                        style={styles.photoCard}
                        onClick={() => openModal(index)}
                    >
                        <img 
                            src={image} 
                            alt={`Photography ${index + 1}`} 
                            style={styles.thumbnailImage}
                        />
                    </div>
                ))}
            </div>

            <PhotoModal
                imageUrl={selectedImageIndex !== null ? photographyImages[selectedImageIndex] : ''}
                isOpen={selectedImageIndex !== null}
                onClose={closeModal}
                onPrevious={goToPrevious}
                onNext={goToNext}
                currentIndex={selectedImageIndex || 0}
                totalImages={photographyImages.length}
            />
        </div>
    );
};

const styles: StyleSheetCSS = {
    galleryContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '16px',
        width: '100%',
        marginTop: '32px',
    },
    photoCard: {
        padding: '8px',
        cursor: 'pointer',
        overflow: 'hidden',
        aspectRatio: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        imageRendering: 'auto', // Override pixelated rendering for photos
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        cursor: 'pointer',
    },
    modalContent: {
        backgroundColor: 'var(--surface)',
        border: '2px solid var(--window-frame)',
        boxShadow: 'var(--border-raised-outer), var(--border-raised-inner)',
        maxWidth: '90vw',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'default',
    },
    modalHeader: {
        padding: '16px',
        borderBottom: '2px solid var(--window-frame)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'var(--surface)',
    },
    closeButton: {
        minWidth: '32px',
        height: '32px',
        padding: '4px',
    },
    modalImageContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'var(--surface)',
    },
    modalImage: {
        maxWidth: '80vw',
        maxHeight: '70vh',
        objectFit: 'contain',
        margin: '0 16px',
        imageRendering: 'auto', // Override pixelated rendering for photos
    },
    navButton: {
        minWidth: '48px',
        height: '48px',
        fontSize: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

export default PhotographyProjects;
