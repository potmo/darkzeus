/**
 * @file FreespinBundle.d.ts
 *
 * Copyright (c) 2013 Williams Interactive, LLC. All Rights Reserved.
 */

declare module zeus
{
    export class FreespinBundle extends assetmanager.AbstractResourceBundle
    {
        ///<asset path="free_symbols/free_symbols.atlas"/>
        public getFreeSymbols(): assetmanager.ITextureAtlasAsset;

        ///<asset path="images/free_bg.jpg"/>
        public getFreeBg(): assetmanager.IImageAsset;

        ///<asset path="images/touchtostart.png"/>
        public getTouchToStart(): assetmanager.IImageAsset;

        ///<asset path="images/tally.png"/>
        public getTally(): assetmanager.IImageAsset;
    }
}
