import clouds from '../assets/pictures/wallpapers/clouds.png';
import forest from '../assets/pictures/wallpapers/forest.png';
import goldWeave from '../assets/pictures/wallpapers/gold-weave.png';
import houndstooth from '../assets/pictures/wallpapers/houndstooth.png';
import metalLinks from '../assets/pictures/wallpapers/metal-links.png';
import sandstone from '../assets/pictures/wallpapers/sandstone.png';
import bubbles from '../assets/pictures/wallpapers/bubbles.png';
import blackThatch from '../assets/pictures/wallpapers/black-thatch.png';
import blueRivets from '../assets/pictures/wallpapers/blue-rivets.png';
import circles from '../assets/pictures/wallpapers/circles.png';
import carvedStone from '../assets/pictures/wallpapers/carved-stone.png';
import pinstripe from '../assets/pictures/wallpapers/pinstripe.png';
import redBlocks from '../assets/pictures/wallpapers/red-blocks.png';

export interface WallpaperOption {
    name: string;
    url: string;
}

export interface ColorScheme {
    name: string;
    titleBarStart: string;
    titleBarEnd: string;
    titleBarText: string;
    buttonFace: string;
    buttonText: string;
    desktop: string;
}


export const WALLPAPERS: WallpaperOption[] = [
    { name: 'None', url: '' },
    { name: 'Clouds', url: clouds },
    { name: 'Forest', url: forest },
    { name: 'Gold Weave', url: goldWeave },
    { name: 'Houndstooth', url: houndstooth },
    { name: 'Metal Links', url: metalLinks },
    { name: 'Sandstone', url: sandstone },
    { name: 'Bubbles', url: bubbles },
    { name: 'Black Thatch', url: blackThatch },
    { name: 'Blue Rivets', url: blueRivets },
    { name: 'Circles', url: circles },
    { name: 'Carved Stone', url: carvedStone },
    { name: 'Pinstripe', url: pinstripe },
    { name: 'Red Blocks', url: redBlocks },
];

export const COLOR_SCHEMES: ColorScheme[] = [
    {
        name: 'Windows Standard',
        titleBarStart: '#000080',
        titleBarEnd: '#1084d0',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#008080',
    },
    {
        name: 'Desert',
        titleBarStart: '#808040',
        titleBarEnd: '#c0c040',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#808000',
    },
    {
        name: 'Rainy Day',
        titleBarStart: '#808080',
        titleBarEnd: '#a0a0a0',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#404040',
    },
    {
        name: 'Rose',
        titleBarStart: '#804040',
        titleBarEnd: '#d08080',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#804040',
    },
    {
        name: 'Teal',
        titleBarStart: '#007070',
        titleBarEnd: '#00a0a0',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#006060',
    },
    {
        name: 'Slate',
        titleBarStart: '#404060',
        titleBarEnd: '#6060a0',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#303050',
    },
    {
        name: 'Wheat',
        titleBarStart: '#a08040',
        titleBarEnd: '#d0b060',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#806020',
    },
    {
        name: 'Lilac',
        titleBarStart: '#806080',
        titleBarEnd: '#c090c0',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#604060',
    },
    {
        name: 'Storm',
        titleBarStart: '#204060',
        titleBarEnd: '#4080c0',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#102040',
    },
    {
        name: 'Plum',
        titleBarStart: '#400040',
        titleBarEnd: '#800080',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#200020',
    },
    {
        name: 'Spruce',
        titleBarStart: '#204020',
        titleBarEnd: '#408040',
        titleBarText: '#ffffff',
        buttonFace: '#c3c6ca',
        buttonText: '#000000',
        desktop: '#102010',
    },
];

export const DEFAULT_SETTINGS = {
    wallpaper: {
        name: 'Clouds',
        url: clouds,
        display: 'stretch' as const,
    },
    colorScheme: COLOR_SCHEMES[0],
};
